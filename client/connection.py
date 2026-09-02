import asyncio
import random
from dataclasses import dataclass

from common.logger import connected, error, trying
from common.protocol import CONNECT, REGISTER, REGISTERED, command
from client.tunnel import handle_connection

RANDOM_PORT_START = 20000
RANDOM_PORT_END = 30000
MAX_PORT_ATTEMPTS = 100


@dataclass(frozen=True)
class AgentConfig:
    server_host: str
    agent_token: str
    control_port: int
    data_port: int
    local_host: str
    local_port: int
    preferred_public_port: int
    explicit_public_port: bool


async def register_port(reader, writer, port, config):
    trying(f"Trying to register public port {port}")
    writer.write(command(REGISTER, f"{port} {config.agent_token}"))
    await writer.drain()
    response = await reader.readline()
    if not response:
        error("Server disconnected while registering")
        return False
    if response.startswith(REGISTERED.encode()):
        connected(f"Public tunnel active: {config.server_host}:{port}")
        connected(f"Forwarding to: {config.local_host}:{config.local_port}")
        return True
    error(f"Port {port} unavailable")
    return False


async def connect_to_server(config):
    while True:
        writer = None
        try:
            trying(f"Connecting to Exposr {config.server_host}:{config.control_port}")
            reader, writer = await asyncio.open_connection(
                config.server_host, config.control_port
            )
            connected("Connected to Exposr control server")
            public_port = config.preferred_public_port
            registered = await register_port(reader, writer, public_port, config)
            if not registered and config.explicit_public_port:
                error(f"Requested public port {public_port} is unavailable")
                raise RuntimeError(f"Port {public_port} is unavailable")
            attempts = 0
            while not registered:
                attempts += 1
                if attempts > MAX_PORT_ATTEMPTS:
                    error("Could not find an available public port after 100 attempts")
                    raise RuntimeError("No public ports available")
                public_port = random.randint(RANDOM_PORT_START, RANDOM_PORT_END)
                trying(f"Trying random public port {public_port}")
                registered = await register_port(reader, writer, public_port, config)
            while True:
                command_line = await reader.readline()
                if not command_line:
                    error("Server disconnected")
                    break
                parts = command_line.decode().strip().split()
                if len(parts) == 2 and parts[0] == CONNECT:
                    trying(f"Setting up connection {parts[1][:8]}")
                    asyncio.create_task(handle_connection(parts[1], config))
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            error(f"Control connection error: {exc}")
        finally:
            if writer is not None:
                writer.close()
                try:
                    await writer.wait_closed()
                except Exception:
                    pass
        trying("Retrying connection in 5 seconds")
        await asyncio.sleep(5)