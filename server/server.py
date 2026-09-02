import asyncio
import uuid

CONTROL_PORT = 9000
DATA_PORT = 9001

agents = {}
tunnels = {}
pending_connections = {}

# ANSI colors
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BLUE = "\033[94m"
RESET = "\033[0m"


def connected(message):
    print(f"{GREEN}[CONNECTED]{RESET} {message}")


def trying(message):
    print(f"{YELLOW}[TRYING]{RESET} {message}")


def error(message):
    print(f"{RED}[ERROR]{RESET} {message}")


def info(message):
    print(f"{BLUE}[INFO]{RESET} {message}")


class Agent:
    def __init__(self, writer):
        self.writer = writer
        self.tunnels = set()


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


async def handle_public_client(
    client_reader,
    client_writer,
    public_port,
    agent
):
    client_addr = client_writer.get_extra_info("peername")

    connected(
        f"New public connection from {client_addr} "
        f"on port {public_port}"
    )

    if agent.writer.is_closing():
        error(
            f"Agent unavailable for port {public_port}"
        )

        client_writer.close()
        await client_writer.wait_closed()
        return

    connection_id = str(uuid.uuid4())

    future = asyncio.get_running_loop().create_future()

    pending_connections[connection_id] = future

    trying(
        f"Setting up tunnel {connection_id[:8]} "
        f"for public port {public_port}"
    )

    try:
        agent.writer.write(
            f"CONNECT {connection_id}\n".encode()
        )

        await agent.writer.drain()

        data_reader, data_writer = await asyncio.wait_for(
            future,
            timeout=10
        )

        connected(
            f"Tunnel established {connection_id[:8]} "
            f"on port {public_port}"
        )

        await asyncio.gather(
            pipe(client_reader, data_writer),
            pipe(data_reader, client_writer),
        )

    except asyncio.TimeoutError:
        error(
            f"Agent timed out while establishing "
            f"tunnel {connection_id[:8]}"
        )

    except Exception as e:
        error(
            f"Public connection error: {e}"
        )

    finally:
        pending_connections.pop(connection_id, None)

        try:
            client_writer.close()
            await client_writer.wait_closed()
        except Exception:
            pass


async def register_tunnel(agent, public_port):

    if public_port in tunnels:
        error(
            f"Port {public_port} is already in use"
        )
        return False

    trying(
        f"Registering tunnel on public port {public_port}"
    )

    try:
        server = await asyncio.start_server(
            lambda reader, writer: handle_public_client(
                reader,
                writer,
                public_port,
                agent
            ),
            "0.0.0.0",
            public_port
        )

        tunnels[public_port] = {
            "server": server,
            "agent": agent
        }

        agent.tunnels.add(public_port)

        connected(
            f"Tunnel active on public port {public_port}"
        )

        return True

    except Exception as e:

        error(
            f"Could not register port "
            f"{public_port}: {e}"
        )

        return False


async def unregister_agent(agent):

    for port in list(agent.tunnels):

        tunnel = tunnels.pop(port, None)

        if tunnel:

            error(
                f"Tunnel on port {port} removed"
            )

            tunnel["server"].close()

            try:
                await tunnel["server"].wait_closed()
            except Exception:
                pass


async def handle_agent(reader, writer):

    agent_id = str(uuid.uuid4())

    agent = Agent(writer)

    agents[agent_id] = agent

    connected(
        f"Agent connected ({agent_id[:8]})"
    )

    try:

        while True:

            command = await reader.readline()

            if not command:
                break

            parts = command.decode().strip().split()

            if not parts:
                continue

            # REGISTER <PORT>
            if (
                parts[0] == "REGISTER"
                and len(parts) == 2
            ):

                try:

                    public_port = int(parts[1])

                    success = await register_tunnel(
                        agent,
                        public_port
                    )

                    if success:

                        writer.write(
                            f"REGISTERED {public_port}\n".encode()
                        )

                    else:

                        writer.write(
                            f"ERROR Port {public_port} "
                            f"is unavailable\n".encode()
                        )

                    await writer.drain()

                except ValueError:

                    error(
                        "Agent attempted to register an invalid port"
                    )

                    writer.write(
                        b"ERROR Invalid port\n"
                    )

                    await writer.drain()

    except Exception as e:

        error(
            f"Agent error: {e}"
        )

    finally:

        error(
            f"Agent disconnected ({agent_id[:8]})"
        )

        await unregister_agent(agent)

        agents.pop(agent_id, None)

        try:
            writer.close()
            await writer.wait_closed()
        except Exception:
            pass


async def handle_data(reader, writer):

    try:

        header = await reader.readline()

        if not header:

            writer.close()
            await writer.wait_closed()
            return

        parts = header.decode().strip().split()

        if (
            len(parts) != 2
            or parts[0] != "DATA"
        ):

            error(
                "Invalid data connection"
            )

            writer.close()
            await writer.wait_closed()
            return

        connection_id = parts[1]

        future = pending_connections.get(
            connection_id
        )

        if future is None:

            error(
                f"Unknown connection {connection_id[:8]}"
            )

            writer.close()
            await writer.wait_closed()
            return

        if not future.done():

            future.set_result(
                (reader, writer)
            )

    except Exception as e:

        error(
            f"Data connection error: {e}"
        )


async def main():

    control_server = await asyncio.start_server(
        handle_agent,
        "0.0.0.0",
        CONTROL_PORT
    )

    data_server = await asyncio.start_server(
        handle_data,
        "0.0.0.0",
        DATA_PORT
    )

    connected(
        f"Control server listening on port {CONTROL_PORT}"
    )

    connected(
        f"Data server listening on port {DATA_PORT}"
    )

    async with control_server, data_server:

        await asyncio.gather(
            control_server.serve_forever(),
            data_server.serve_forever(),
        )


if __name__ == "__main__":
    asyncio.run(main())