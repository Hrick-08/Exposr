import asyncio

from client.cli import parse_arguments
from client.config import get_agent_token, get_server_host, set_server
from client.connection import AgentConfig, connect_to_server
from common.logger import error, info


def main():
    args = parse_arguments()
    if args.command == "server":
        from server.config import get_agent_token as get_server_agent_token
        from server.config import init_token

        if args.server_command == "init-token":
            if not args.agent_token.strip():
                error("Agent token cannot be empty")
                return
            init_token(args.agent_token)
            info("Agent token saved to ~/.exposr/config.json")
        elif args.server_command == "start":
            if not get_server_agent_token():
                error("Server token is not configured. Run: exposr server init-token <token>")
                return
            from server.main import main as start_server

            try:
                asyncio.run(start_server())
            except KeyboardInterrupt:
                print()
                info("Exposr server stopped")
        return
    if args.command == "config":
        if args.config_command == "set-server":
            set_server(args.server_host)
            info(f"Server address saved: {args.server_host}")
            info("Agent token generated and saved to ~/.exposr/agent_token.txt")
        return

    server_host = args.server_host or get_server_host()
    agent_token = get_agent_token()
    if not server_host:
        error(
            "Server IP is not configured. "
            "Run: exposr config set-server <server-ip>"
        )
        return
    if not agent_token:
        error(
            "Agent token is not configured. "
            "Run: exposr config set-server <server-ip>"
        )
        return

    config = AgentConfig(
        server_host=server_host,
        agent_token=agent_token,
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