import json
from pathlib import Path


CONFIG_PATH = Path.home() / ".exposr" / "config.json"


def init_token(agent_token):
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    config = {}
    if CONFIG_PATH.exists():
        try:
            with CONFIG_PATH.open("r", encoding="utf-8") as config_file:
                loaded_config = json.load(config_file)
                if isinstance(loaded_config, dict):
                    config = loaded_config
        except (OSError, json.JSONDecodeError):
            pass

    config["agent_token"] = agent_token.strip()
    with CONFIG_PATH.open("w", encoding="utf-8") as config_file:
        json.dump(config, config_file, indent=2)
        config_file.write("\n")


def get_agent_token():
    if not CONFIG_PATH.exists():
        return ""
    try:
        with CONFIG_PATH.open("r", encoding="utf-8") as config_file:
            config = json.load(config_file)
    except (OSError, json.JSONDecodeError):
        return ""
    return str(config.get("agent_token", "")).strip()