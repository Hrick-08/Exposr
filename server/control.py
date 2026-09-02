import uuid

from common.logger import connected, error
from common.protocol import REGISTER
from server.ports import Agent, agents, register_tunnel, unregister_agent
from server.tunnel import handle_public_client


async def handle_agent(reader, writer):
    agent_id = str(uuid.uuid4())
    agent = Agent(writer)
    agents[agent_id] = agent
    connected(f"Agent connected ({agent_id[:8]})")
    try:
        while True:
            command = await reader.readline()
            if not command:
                break
            parts = command.decode().strip().split()
            if not parts:
                continue
            if parts[0] == REGISTER and len(parts) == 2:
                try:
                    public_port = int(parts[1])
                    success = await register_tunnel(
                        agent, public_port, handle_public_client
                    )
                    if success:
                        writer.write(f"REGISTERED {public_port}\n".encode())
                    else:
                        writer.write(
                            f"ERROR Port {public_port} is unavailable\n".encode()
                        )
                    await writer.drain()
                except ValueError:
                    error("Agent attempted to register an invalid port")
                    writer.write(b"ERROR Invalid port\n")
                    await writer.drain()
    except Exception as exc:
        error(f"Agent error: {exc}")
    finally:
        error(f"Agent disconnected ({agent_id[:8]})")
        await unregister_agent(agent)
        agents.pop(agent_id, None)
        writer.close()
        try:
            await writer.wait_closed()
        except Exception:
            pass