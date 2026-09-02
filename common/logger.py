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