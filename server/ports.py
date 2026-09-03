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
                wait_closed = tunnel["server"].wait_closed
                result = wait_closed()
                if hasattr(result, "__await__"):
                    await result
            except Exception:
                pass