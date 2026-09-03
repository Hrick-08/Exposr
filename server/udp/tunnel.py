import asyncio
import struct
import uuid

from common.logger import connected, error, trying
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
        self.sessions = {}

    def connection_made(self, transport):
        self.transport = transport

    def datagram_received(self, data, address):
        asyncio.create_task(self.forward_datagram(data, address))

    async def forward_datagram(self, data, address):
        connection_id = str(uuid.uuid4())
        future = asyncio.get_running_loop().create_future()
        pending_connections[connection_id] = future
        trying(f"Setting up UDP tunnel {connection_id[:8]}")
        try:
            self.agent.writer.write(command(CONNECT, connection_id))
            await self.agent.writer.drain()
            reader, writer = await asyncio.wait_for(future, timeout=10)
            self.sessions[connection_id] = address
            writer.write(pack_datagram(data))
            await writer.drain()
            asyncio.create_task(self.read_responses(connection_id, reader, writer))
        except Exception as exc:
            error(f"UDP tunnel setup failed: {exc}")
            pending_connections.pop(connection_id, None)

    async def read_responses(self, connection_id, reader, writer):
        try:
            while True:
                data = await read_datagram(reader)
                address = self.sessions.get(connection_id)
                if address and self.transport:
                    self.transport.sendto(data, address)
        except Exception:
            pass
        finally:
            self.sessions.pop(connection_id, None)
            pending_connections.pop(connection_id, None)
            writer.close()
            try:
                await writer.wait_closed()
            except Exception:
                pass


def handle_public_client(agent, public_port):
    return UdpTunnelProtocol(agent, public_port)