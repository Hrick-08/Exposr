import secrets
import uuid

from common.logger import connected, error
from common.protocol import REGISTER, UDP
from server.config import get_agent_token
from server.ports import Agent, agents, unregister_agent
from server.tcp.ports import register_tunnel as register_tcp_tunnel
from server.tcp.tunnel import handle_public_client
from server.udp.ports import register_tunnel as register_udp_tunnel
from server.udp.tunnel import handle_public_client as handle_udp_client


async def handle_agent(reader, writer):
    expected_token = get_agent_token()
    first_command = await reader.readline()
    first_parts = first_command.decode().strip().split()
    valid_shape = (
        bool(first_command)
        and len(first_parts) in (3, 4)
        and first_parts[0] == REGISTER
        and (len(first_parts) == 3 or first_parts[3] == UDP)
    )
    valid_token = (
        valid_shape
        and bool(expected_token)
        and secrets.compare_digest(first_parts[2], expected_token)
    )
    if not valid_shape:
        error(f"Rejected agent with invalid registration: {first_command!r}")
        writer.close()
        try:
            await writer.wait_closed()
        except Exception:
            pass
        return
    if not valid_token:
        error("Rejected agent with an invalid token")
        writer.close()
        try:
            await writer.wait_closed()
        except Exception:
            pass
        return

    agent_id = str(uuid.uuid4())
    agent = Agent(writer)
    agents[agent_id] = agent
    connected(f"Agent connected ({agent_id[:8]})")
    try:
        command = first_command
        while True:
            if not command:
                break
            parts = command.decode().strip().split()
            if not parts:
                command = await reader.readline()
                continue
            if parts[0] == REGISTER and len(parts) in (3, 4):
                if (
                    not expected_token
                    or not secrets.compare_digest(parts[2], expected_token)
                ):
                    error(f"Rejected agent ({agent_id[:8]}) with an invalid token")
                    break
                try:
                    public_port = int(parts[1])
                    is_udp = len(parts) == 4 and parts[3] == UDP
                    if len(parts) == 4 and not is_udp:
                        raise ValueError("invalid transport")
                    register = register_udp_tunnel if is_udp else register_tcp_tunnel
                    handler = handle_udp_client if is_udp else handle_public_client
                    success = await register(agent, public_port, handler)
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
            command = await reader.readline()
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