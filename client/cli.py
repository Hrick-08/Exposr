import argparse


def parse_arguments(argv=None):
    parser = argparse.ArgumentParser(
        prog="exposr",
        description="Exposr TCP tunneling agent",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)
    expose_parser = subparsers.add_parser(
        "expose", help="Expose a local port to the internet"
    )
    expose_parser.add_argument("local_port", type=int)
    expose_parser.add_argument("to", nargs="?", default=None)
    expose_parser.add_argument("public_port", nargs="?", type=int, default=None)

    # Accept configuration flags both before and after the subcommand.
    expose_parser.add_argument("--server-host", dest="server_host", default=argparse.SUPPRESS)
    expose_parser.add_argument("--control-port", dest="control_port", type=int, default=argparse.SUPPRESS)
    expose_parser.add_argument("--data-port", dest="data_port", type=int, default=argparse.SUPPRESS)
    expose_parser.add_argument("--local-host", dest="local_host", default=argparse.SUPPRESS)

    config_parser = subparsers.add_parser("config", help="Manage Exposr configuration")
    config_subparsers = config_parser.add_subparsers(dest="config_command", required=True)
    set_server_parser = config_subparsers.add_parser(
        "set-server", help="Set the Exposr relay server address"
    )
    set_server_parser.add_argument("server_host")

    parser.add_argument("--server-host", default=None)
    parser.add_argument("--control-port", type=int, default=9000)
    parser.add_argument("--data-port", type=int, default=9001)
    parser.add_argument("--local-host", default="127.0.0.1")

    args = parser.parse_args(argv)
    if args.command == "expose":
        if args.to is not None and args.to != "to":
            parser.error("Expected syntax: exposr expose <local-port> to <public-port>")
        if args.to == "to" and args.public_port is None:
            parser.error("Please specify a public port after 'to'")
    return args