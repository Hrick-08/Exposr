import asyncio
import argparse
import random


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


parser = argparse.ArgumentParser(
    description="OpenPort TCP tunneling agent"
)

parser.add_argument(
    "--server-host",
    default="20.198.81.254",
    help="OpenPort server address"
)

parser.add_argument(
    "--control-port",
    type=int,
    default=9000,
    help="OpenPort control port"
)

parser.add_argument(
    "--data-port",
    type=int,
    default=9001,
    help="OpenPort data port"
)

parser.add_argument(
    "--local-host",
    default="127.0.0.1",
    help="Local host to forward to"
)

parser.add_argument(
    "--local-port",
    type=int,
    required=True,
    help="Local port to forward to"
)

parser.add_argument(
    "--public-port",
    type=int,
    default=25565,
    help="Preferred public port (default: 25565)"
)

args = parser.parse_args()


SERVER_HOST = args.server_host
CONTROL_PORT = args.control_port
DATA_PORT = args.data_port

LOCAL_HOST = args.local_host
LOCAL_PORT = args.local_port

DEFAULT_PUBLIC_PORT = args.public_port
RANDOM_PORT_START = 20000
RANDOM_PORT_END = 30000


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


async def handle_connection(connection_id):

    connected(
        f"New connection ({connection_id[:8]})"
    )

    try:

        trying(
            f"Connecting to local service "
            f"{LOCAL_HOST}:{LOCAL_PORT}"
        )

        local_reader, local_writer = (
            await asyncio.open_connection(
                LOCAL_HOST,
                LOCAL_PORT
            )
        )

        trying(
            f"Opening data connection to "
            f"{SERVER_HOST}:{DATA_PORT}"
        )

        data_reader, data_writer = (
            await asyncio.open_connection(
                SERVER_HOST,
                DATA_PORT
            )
        )

        data_writer.write(
            f"DATA {connection_id}\n".encode()
        )

        await data_writer.drain()

        connected(
            f"Tunnel established -> "
            f"{LOCAL_HOST}:{LOCAL_PORT}"
        )

        await asyncio.gather(
            pipe(data_reader, local_writer),
            pipe(local_reader, data_writer),
        )

    except Exception as e:

        error(
            f"Connection failed: {e}"
        )


async def register_port(reader, writer, port):

    trying(
        f"Trying to register public port {port}"
    )

    writer.write(
        f"REGISTER {port}\n".encode()
    )

    await writer.drain()

    response = await reader.readline()

    if not response:

        error(
            "Server disconnected while registering"
        )

        return False

    response_text = response.decode().strip()

    if response.startswith(b"REGISTERED"):

        connected(
            f"Public tunnel active: "
            f"{SERVER_HOST}:{port}"
        )

        connected(
            f"Forwarding to: "
            f"{LOCAL_HOST}:{LOCAL_PORT}"
        )

        return True

    error(
        f"Port {port} unavailable"
    )

    return False


async def connect_to_server():

    while True:

        try:

            trying(
                f"Connecting to OpenPort "
                f"{SERVER_HOST}:{CONTROL_PORT}"
            )

            reader, writer = (
                await asyncio.open_connection(
                    SERVER_HOST,
                    CONTROL_PORT
                )
            )

            connected(
                "Connected to OpenPort control server"
            )

            # First attempt: 25565
            registered = await register_port(
                reader,
                writer,
                DEFAULT_PUBLIC_PORT
            )

            public_port = DEFAULT_PUBLIC_PORT

            # If 25565 is unavailable,
            # keep trying random ports until one works
            attempts = 0

            while not registered:

                attempts += 1

                if attempts > 100:

                    error(
                        "Could not find an available "
                        "public port after 100 attempts"
                    )

                    writer.close()

                    await writer.wait_closed()

                    raise Exception(
                        "No public ports available"
                    )

                public_port = random.randint(
                    RANDOM_PORT_START,
                    RANDOM_PORT_END
                )

                trying(
                    f"Port {DEFAULT_PUBLIC_PORT} unavailable. "
                    f"Trying random port {public_port}"
                )

                registered = await register_port(
                    reader,
                    writer,
                    public_port
                )

            # Wait for incoming connections
            while True:

                command = await reader.readline()

                if not command:

                    error(
                        "Server disconnected"
                    )

                    break

                parts = (
                    command
                    .decode()
                    .strip()
                    .split()
                )

                if (
                    len(parts) == 2
                    and parts[0] == "CONNECT"
                ):

                    connection_id = parts[1]

                    trying(
                        f"Setting up connection "
                        f"{connection_id[:8]}"
                    )

                    asyncio.create_task(
                        handle_connection(
                            connection_id
                        )
                    )

        except Exception as e:

            error(
                f"Control connection error: {e}"
            )

        trying(
            "Retrying connection in 5 seconds"
        )

        await asyncio.sleep(5)


asyncio.run(connect_to_server())