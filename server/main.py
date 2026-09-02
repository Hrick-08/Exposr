import asyncio

from common.logger import connected, error, info
from server.control import handle_agent
from server.config import get_agent_token
from server.data import handle_data

CONTROL_PORT = 9000
DATA_PORT = 9001


async def main():
    if not get_agent_token():
        error("Server token is not configured. Run: exposr server init-token <token>")
        return

    control_server = await asyncio.start_server(handle_agent, "0.0.0.0", CONTROL_PORT)
    data_server = await asyncio.start_server(handle_data, "0.0.0.0", DATA_PORT)
    connected(f"Control server listening on port {CONTROL_PORT}")
    connected(f"Data server listening on port {DATA_PORT}")
    async with control_server, data_server:
        await asyncio.gather(
            control_server.serve_forever(),
            data_server.serve_forever(),
        )


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print()
        info("Exposr stopped")