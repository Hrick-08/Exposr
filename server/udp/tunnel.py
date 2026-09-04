import asyncio
import struct
import uuid

from common.logger import error, trying
from common.protocol import CONNECT, command
from server.ports import pending_connections


def pack_datagram(data):
    return struct.pack("!I", len(data)) + data


async def read_datagram(reader):
    header = await reader.readexactly(4)
    size = struct.unpack("!I", header)[0]

    if size > 65535:
        raise ValueError("UDP datagram is too large")

    return await reader.readexactly(size)


class UdpTunnelProtocol(asyncio.DatagramProtocol):
    def __init__(self, agent, public_port):
        self.agent = agent
        self.public_port = public_port
        self.transport = None

        # public UDP address -> session
        self.sessions = {}

    def connection_made(self, transport):
        self.transport = transport

    def datagram_received(self, data, address):
        session = self.sessions.get(address)

        # First packet from this public UDP client
        if session is None:
            queue = asyncio.Queue()

            task = asyncio.create_task(
                self.handle_session(address, queue)
            )

            session = {
                "queue": queue,
                "task": task,
            }

            self.sessions[address] = session

        # Put every packet from this client into
        # the same tunnel queue
        session["queue"].put_nowait(data)

    async def handle_session(self, address, queue):
        connection_id = str(uuid.uuid4())
        future = asyncio.get_running_loop().create_future()

        pending_connections[connection_id] = future

        trying(
            f"Setting up UDP tunnel "
            f"{connection_id[:8]} for {address[0]}:{address[1]}"
        )

        writer = None

        try:
            # Tell the Exposr client to create ONE
            # TCP data connection for this UDP client.
            self.agent.writer.write(
                command(CONNECT, connection_id)
            )

            await self.agent.writer.drain()

            reader, writer = await asyncio.wait_for(
                future,
                timeout=10
            )

            async def send_datagrams():
                while True:
                    data = await queue.get()

                    writer.write(
                        pack_datagram(data)
                    )

                    await writer.drain()

            async def receive_datagrams():
                while True:
                    data = await read_datagram(reader)

                    if self.transport:
                        self.transport.sendto(
                            data,
                            address
                        )

            await asyncio.gather(
                send_datagrams(),
                receive_datagrams()
            )

        except Exception as exc:
            error(
                f"UDP tunnel failed for "
                f"{address[0]}:{address[1]}: {exc}"
            )

        finally:
            pending_connections.pop(
                connection_id,
                None
            )

            session = self.sessions.get(address)

            if (
                session is not None
                and session["task"]
                == asyncio.current_task()
            ):
                self.sessions.pop(address, None)

            if writer is not None:
                writer.close()

                try:
                    await writer.wait_closed()
                except Exception:
                    pass


def handle_public_client(agent, public_port):
    return UdpTunnelProtocol(
        agent,
        public_port
    )