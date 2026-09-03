import asyncio

from common.logger import connected, error, trying
from server.ports import tunnels


async def register_tunnel(agent, public_port, client_handler):
    if public_port in tunnels:
        error(f"Port {public_port} is already in use")
        return False
    trying(f"Registering UDP tunnel on public port {public_port}")
    protocol = lambda: client_handler(agent, public_port)
    try:
        loop = asyncio.get_running_loop()
        transport, _ = await loop.create_datagram_endpoint(
            protocol, local_addr=("0.0.0.0", public_port)
        )
        tunnels[public_port] = {"server": transport, "agent": agent}
        agent.tunnels.add(public_port)
        connected(f"UDP tunnel active on public port {public_port}")
        return True
    except Exception as exc:
        error(f"Could not register UDP port {public_port}: {exc}")
        return False