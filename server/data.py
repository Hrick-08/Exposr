from common.logger import error
from common.protocol import DATA
from server.ports import pending_connections


async def handle_data(reader, writer):
    try:
        header = await reader.readline()
        if not header:
            writer.close()
            await writer.wait_closed()
            return
        parts = header.decode().strip().split()
        if len(parts) != 2 or parts[0] != DATA:
            error("Invalid data connection")
            writer.close()
            await writer.wait_closed()
            return
        connection_id = parts[1]
        future = pending_connections.get(connection_id)
        if future is None:
            error(f"Unknown connection {connection_id[:8]}")
            writer.close()
            await writer.wait_closed()
            return
        if not future.done():
            future.set_result((reader, writer))
    except Exception as exc:
        error(f"Data connection error: {exc}")