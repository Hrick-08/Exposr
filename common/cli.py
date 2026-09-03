import argparse


def parse_arguments(argv=None):
    parser = argparse.ArgumentParser(
        prog="exposr",
        description="Exposr TCP and UDP tunneling agent",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    def add_tunnel_arguments(tunnel_parser):
        tunnel_parser.add_argument("local_port", type=int)
        tunnel_parser.add_argument(
            "public_port",
            nargs="?",
            type=int,
            default=None,
        )

        # Accept configuration flags both before and after the subcommand.
        tunnel_parser.add_argument("--server-host", dest="server_host", default=argparse.SUPPRESS)
        tunnel_parser.add_argument("--control-port", dest="control_port", type=int, default=argparse.SUPPRESS)
        tunnel_parser.add_argument("--data-port", dest="data_port", type=int, default=argparse.SUPPRESS)
        tunnel_parser.add_argument("--local-host", dest="local_host", default=argparse.SUPPRESS)

    tcp_parser = subparsers.add_parser(
        "tcp", help="Expose a local TCP port to the internet"
    )
    add_tunnel_arguments(tcp_parser)

    udp_parser = subparsers.add_parser(
        "udp", help="Expose a local UDP port to the internet"
    )
    add_tunnel_arguments(udp_parser)


    config_parser = subparsers.add_parser("config", help="Manage Exposr configuration")
    config_subparsers = config_parser.add_subparsers(dest="config_command", required=True)
    set_server_parser = config_subparsers.add_parser(
        "set-server", help="Set the Exposr relay server address"
    )
    set_server_parser.add_argument("server_host")

    server_parser = subparsers.add_parser("server", help="Manage the Exposr relay server")
    server_subparsers = server_parser.add_subparsers(
        dest="server_command", required=True
    )
    init_token_parser = server_subparsers.add_parser(
        "init-token", help="Set the relay server agent token"
    )
    init_token_parser.add_argument("agent_token")
    server_subparsers.add_parser("start", help="Start the Exposr relay server")

    parser.add_argument("--server-host", default=None)
    parser.add_argument("--control-port", type=int, default=9000)
    parser.add_argument("--data-port", type=int, default=9001)
    parser.add_argument("--local-host", default="127.0.0.1")

    args = parser.parse_args(argv)
    return args