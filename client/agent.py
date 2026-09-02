import asyncio
import argparse
import random


# =========================
# ANSI COLORS
# =========================

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


# =========================
# CLI ARGUMENTS
# =========================

parser = argparse.ArgumentParser(
    prog="openport",
    description="OpenPort TCP tunneling agent"
)

subparsers = parser.add_subparsers(
    dest="command",
    required=True
)


# -------------------------
# EXPOSE COMMAND
# -------------------------

expose_parser = subparsers.add_parser(
    "expose",
    help="Expose a local port to the internet"
)

expose_parser.add_argument(
    "local_port",
    type=int,
    help="Local port to expose"
)

expose_parser.add_argument(
    "to",
    nargs="?",
    default=None,
    help="Use 'to <public-port>' to specify a public port"
)

expose_parser.add_argument(
    "public_port",
    nargs="?",
    type=int,
    default=None,
    help="Public port"
)


# -------------------------
# OPTIONAL CONFIGURATION
# -------------------------

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


args = parser.parse_args()


# =========================
# VALIDATE CLI SYNTAX
# =========================

if args.command == "expose":

    if args.to is not None and args.to != "to":
        parser.error(
            "Expected syntax: openport expose <local-port> to <public-port>"
        )

    if args.to == "to" and args.public_port is None:
        parser.error(
            "Please specify a public port after 'to'"
        )


# =========================
# CONFIGURATION
# =========================

SERVER_HOST = args.server_host
CONTROL_PORT = args.control_port
DATA_PORT = args.data_port

LOCAL_HOST = args.local_host
LOCAL_PORT = args.local_port


# Default public port
DEFAULT_PUBLIC_PORT = (
    args.public_port
    if args.public_port is not None
    else 25565
)


# True when user explicitly did:
# openport expose 3000 to 23343

EXPLICIT_PUBLIC_PORT = args.public_port is not None


# Random fallback range

RANDOM_PORT_START = 20000
RANDOM_PORT_END = 30000


# =========================
# DATA PIPE
# =========================

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


# =========================
# HANDLE PUBLIC CONNECTION
# =========================

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

            pipe(
                data_reader,
                local_writer
            ),

            pipe(
                local_reader,
                data_writer
            )

        )

    except Exception as e:

        error(
            f"Connection failed: {e}"
        )


# =========================
# REGISTER PORT
# =========================

async def register_port(
    reader,
    writer,
    port
):

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


# =========================
# CONNECT TO SERVER
# =========================

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


            # =========================
            # TRY REQUESTED / DEFAULT PORT
            # =========================

            public_port = DEFAULT_PUBLIC_PORT

            registered = await register_port(
                reader,
                writer,
                public_port
            )


            # =========================
            # USER EXPLICITLY REQUESTED
            # A PORT
            # =========================

            if (
                not registered
                and EXPLICIT_PUBLIC_PORT
            ):

                error(
                    f"Requested public port "
                    f"{public_port} is unavailable"
                )

                writer.close()

                await writer.wait_closed()

                raise Exception(
                    f"Port {public_port} "
                    f"is unavailable"
                )


            # =========================
            # DEFAULT PORT FAILED
            # TRY RANDOM PORTS
            # =========================

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
                    f"Trying random public port "
                    f"{public_port}"
                )


                registered = await register_port(
                    reader,
                    writer,
                    public_port
                )


            # =========================
            # WAIT FOR CONNECTIONS
            # =========================

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


# =========================
# ENTRY POINT
# =========================

def main():
    try:
        asyncio.run(
            connect_to_server()
        )
    except KeyboardInterrupt:
        print()
        info("OpenPort stopped")


if __name__ == "__main__":

    main()