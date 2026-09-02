import json
from pathlib import Path


CONFIG_PATH = Path.home() / ".exposr" / "config.json"


def load_config():
    if not CONFIG_PATH.exists():
        return {"server_host": ""}
    try:
        with CONFIG_PATH.open("r", encoding="utf-8") as config_file:
            config = json.load(config_file)
    except (OSError, json.JSONDecodeError):
        return {"server_host": ""}
    return {"server_host": str(config.get("server_host", "")).strip()}


def set_server(server_host):
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with CONFIG_PATH.open("w", encoding="utf-8") as config_file:
        json.dump({"server_host": server_host.strip()}, config_file, indent=2)
        config_file.write("\n")


def get_server_host():
    return load_config()["server_host"]