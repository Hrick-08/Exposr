import asyncio

from client.cli import parse_arguments
from client.config import get_server_host, set_server
from client.connection import AgentConfig, connect_to_server
from common.logger import error, info


def main():
    args = parse_arguments()
    if args.command == "config":
        if args.config_command == "set-server":
            set_server(args.server_host)
            info(f"Server address saved: {args.server_host}")
        return

    server_host = args.server_host or get_server_host()
    if not server_host:
        error(
            "Server IP is not configured. "
            "Run: exposr config set-server <server-ip>"
        )
        return

    config = AgentConfig(
        server_host=server_host,
        control_port=args.control_port,
        data_port=args.data_port,
        local_host=args.local_host,
        local_port=args.local_port,
        preferred_public_port=args.public_port or 25565,
        explicit_public_port=args.public_port is not None,
    )
    try:
        asyncio.run(connect_to_server(config))
    except KeyboardInterrupt:
        print()
        info("Exposr stopped")


if __name__ == "__main__":
    main()