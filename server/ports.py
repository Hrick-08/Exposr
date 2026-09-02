import asyncio

from common.logger import connected, error, trying

agents = {}
tunnels = {}
pending_connections = {}


class Agent:
    def __init__(self, writer):
        self.writer = writer
        self.tunnels = set()


async def register_tunnel(agent, public_port, client_handler):
    if public_port in tunnels:
        error(f"Port {public_port} is already in use")
        return False
    trying(f"Registering tunnel on public port {public_port}")
    try:
        public_server = await asyncio.start_server(
            lambda reader, writer: client_handler(reader, writer, public_port, agent),
            "0.0.0.0",
            public_port,
        )
        tunnels[public_port] = {"server": public_server, "agent": agent}
        agent.tunnels.add(public_port)
        connected(f"Tunnel active on public port {public_port}")
        return True
    except Exception as exc:
        error(f"Could not register port {public_port}: {exc}")
        return False


async def unregister_agent(agent):
    for port in list(agent.tunnels):
        tunnel = tunnels.pop(port, None)
        if tunnel:
            error(f"Tunnel on port {port} removed")
            tunnel["server"].close()
            try:
                await tunnel["server"].wait_closed()
            except Exception:
                pass