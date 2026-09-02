import asyncio

from client.cli import parse_arguments
from client.connection import AgentConfig, connect_to_server
from common.logger import info


def main():
    args = parse_arguments()
    config = AgentConfig(
        server_host=args.server_host,
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
        info("OpenPort stopped")


if __name__ == "__main__":
    main()