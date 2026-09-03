import asyncio
import struct

from common.logger import connected, error, trying
from common.protocol import DATA, command


def pack_datagram(data):
    return struct.pack("!I", len(data)) + data


async def read_datagram(reader):
    header = await reader.readexactly(4)
    size = struct.unpack("!I", header)[0]
    if size > 65535:
        raise ValueError("UDP datagram is too large")
    return await reader.readexactly(size)


class LocalUdpProtocol(asyncio.DatagramProtocol):
    def __init__(self, queue):
        self.queue = queue

    def datagram_received(self, data, address):
        self.queue.put_nowait(data)


async def handle_connection(connection_id, config):
    data_writer = None
    local_transport = None
    try:
        trying(f"Connecting to local UDP service {config.local_host}:{config.local_port}")
        queue = asyncio.Queue()
        loop = asyncio.get_running_loop()
        local_transport, _ = await loop.create_datagram_endpoint(
            lambda: LocalUdpProtocol(queue),
            remote_addr=(config.local_host, config.local_port),
        )
        trying(f"Opening UDP data connection to {config.server_host}:{config.data_port}")
        data_reader, data_writer = await asyncio.open_connection(
            config.server_host, config.data_port
        )
        data_writer.write(command(DATA, connection_id))
        await data_writer.drain()
        connected(f"UDP tunnel established -> {config.local_host}:{config.local_port}")

        async def send_local_datagrams():
            while True:
                data = await queue.get()
                data_writer.write(pack_datagram(data))
                await data_writer.drain()

        async def receive_local_datagrams():
            while True:
                local_transport.sendto(await read_datagram(data_reader))

        await asyncio.gather(send_local_datagrams(), receive_local_datagrams())
    except Exception as exc:
        error(f"UDP connection failed: {exc}")
    finally:
        if local_transport is not None:
            local_transport.close()
        if data_writer is not None:
            data_writer.close()
            try:
                await data_writer.wait_closed()
            except Exception:
                pass