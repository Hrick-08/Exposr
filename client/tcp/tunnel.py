import asyncio

from common.logger import connected, error, trying
from common.protocol import command, DATA


async def pipe(reader, writer):
    try:
        while True:
            data = await reader.read(65536)
            if not data:
                break
            writer.write(data)
            await writer.drain()
    except Exception:
        pass
    finally:
        try:
            writer.close()
            await writer.wait_closed()
        except Exception:
            pass


async def handle_connection(connection_id, config):
    connected(f"New connection ({connection_id[:8]})")
    try:
        trying(f"Connecting to local service {config.local_host}:{config.local_port}")
        local_reader, local_writer = await asyncio.open_connection(
            config.local_host, config.local_port
        )
        trying(f"Opening data connection to {config.server_host}:{config.data_port}")
        data_reader, data_writer = await asyncio.open_connection(
            config.server_host, config.data_port
        )
        data_writer.write(command(DATA, connection_id))
        await data_writer.drain()
        connected(f"Tunnel established -> {config.local_host}:{config.local_port}")
        await asyncio.gather(
            pipe(data_reader, local_writer),
            pipe(local_reader, data_writer),
        )
    except Exception as exc:
        error(f"Connection failed: {exc}")