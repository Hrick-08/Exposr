import asyncio
import uuid

from common.logger import connected, error, trying
from common.protocol import CONNECT, command
from server.ports import pending_connections


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


async def handle_public_client(client_reader, client_writer, public_port, agent):
    client_addr = client_writer.get_extra_info("peername")
    connected(f"New public connection from {client_addr} on port {public_port}")
    if agent.writer.is_closing():
        error(f"Agent unavailable for port {public_port}")
        client_writer.close()
        await client_writer.wait_closed()
        return
    connection_id = str(uuid.uuid4())
    future = asyncio.get_running_loop().create_future()
    pending_connections[connection_id] = future
    trying(f"Setting up tunnel {connection_id[:8]} for public port {public_port}")
    try:
        agent.writer.write(command(CONNECT, connection_id))
        await agent.writer.drain()
        data_reader, data_writer = await asyncio.wait_for(future, timeout=10)
        connected(f"Tunnel established {connection_id[:8]} on port {public_port}")
        await asyncio.gather(
            pipe(client_reader, data_writer),
            pipe(data_reader, client_writer),
        )
    except asyncio.TimeoutError:
        error(f"Agent timed out while establishing tunnel {connection_id[:8]}")
    except Exception as exc:
        error(f"Public connection error: {exc}")
    finally:
        pending_connections.pop(connection_id, None)
        try:
            client_writer.close()
            await client_writer.wait_closed()
        except Exception:
            pass