import json
import secrets
from pathlib import Path


CONFIG_PATH = Path.home() / ".exposr" / "config.json"
TOKEN_PATH = CONFIG_PATH.parent / "agent_token.txt"


def load_config():
    if not CONFIG_PATH.exists():
        return {"server_host": "", "agent_token": ""}
    try:
        with CONFIG_PATH.open("r", encoding="utf-8") as config_file:
            config = json.load(config_file)
    except (OSError, json.JSONDecodeError):
        return {"server_host": "", "agent_token": ""}
    return {
        "server_host": str(config.get("server_host", "")).strip(),
        "agent_token": str(config.get("agent_token", "")).strip(),
    }


def set_server(server_host):
    agent_token = secrets.token_urlsafe(32)
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with CONFIG_PATH.open("w", encoding="utf-8") as config_file:
        json.dump(
            {"server_host": server_host.strip(), "agent_token": agent_token},
            config_file,
            indent=2,
        )
        config_file.write("\n")
    TOKEN_PATH.write_text(f"{agent_token}\n", encoding="utf-8")
    return agent_token


def get_server_host():
    return load_config()["server_host"]


def get_agent_token():
    return load_config()["agent_token"]