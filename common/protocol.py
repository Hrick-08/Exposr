REGISTER = "REGISTER"
REGISTERED = "REGISTERED"
CONNECT = "CONNECT"
DATA = "DATA"


def command(name, value):
    return f"{name} {value}\n".encode()