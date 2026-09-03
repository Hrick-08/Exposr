REGISTER = "REGISTER"
REGISTERED = "REGISTERED"
CONNECT = "CONNECT"
DATA = "DATA"
TCP = "TCP"
UDP = "UDP"


def command(name, value):
    return f"{name} {value}\n".encode()