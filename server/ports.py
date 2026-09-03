from common.logger import error

agents = {}
tunnels = {}
pending_connections = {}


class Agent:
    def __init__(self, writer):
        self.writer = writer
        self.tunnels = set()


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