```text
   ____                   ____            _
  / __ \                 |  _ \          | |
 | |  | |_ __   ___ _ __ | |_) |__  _ __ | |_
 | |  | | '_ \ / _ \ '_ \|  ___/ _ \| '__| __|
 | |__| | |_) |  __/ | | | |  | (_) | |  | |_
  \____/| .__/ \___|_| |_|_|   \___/|_|   \__|
        | |
        |_|
```

# OpenPort

OpenPort is a simple reverse tunneling project that exposes a service running on your local machine to the public internet through a remote server.

The current version uses Python and an Azure VM as the public relay server.

## How It Works

Normally, a service running on your computer is only accessible locally:

```text
localhost:25565
```

OpenPort creates a persistent outbound connection from your computer to a public server.

When someone connects to the public server, OpenPort creates a dedicated tunnel back to your local service.

```text
                    ┌──────────────────────┐
                    │      Your PC         │
                    │                      │
                    │  localhost:25565     │
                    │         ▲            │
                    │         │            │
                    │    OpenPort Agent    │
                    └─────────┬────────────┘
                              │
                    Dedicated data tunnels
                              │
                              ▼
                    ┌──────────────────────┐
                    │     Azure VM         │
                    │                      │
                    │ Control Port: 9000   │
                    │ Data Port:    9001   │
                    │ Public Port:  25565  │
                    └─────────┬────────────┘
                              │
                              ▼
                         Internet Users
```

For example:

```text
Internet User
      │
      ▼
20.198.81.254:25565
      │
      ▼
OpenPort Server
      │
      ▼
OpenPort Agent
      │
      ▼
127.0.0.1:25565
      │
      ▼
Your Application
```

This allows an application running only on your computer to be accessed through the public IP address of the server.

---

# Features

Current features:

- Reverse TCP tunneling
- Localhost service exposure
- Persistent agent connection
- Automatic agent reconnection
- Multiple simultaneous public connections
- Dedicated data tunnel per connection
- UUID-based connection identification
- Async networking using Python `asyncio`

---

# Project Structure

```text
OpenPort/
│
├── client/
│   └── agent.py
│
├── server/
│   └── server.py
│
└── README.md
```

## Server

The server runs on a public machine or VPS.

It handles three ports:

| Port | Purpose |
|---|---|
| `9000` | Agent control connection |
| `9001` | Agent data connections |
| `25565` | Public exposed service |

## Agent

The agent runs on the user's computer.

It:

1. Connects to the OpenPort server.
2. Waits for incoming connection requests.
3. Connects to the local service.
4. Creates a dedicated data tunnel.
5. Forwards traffic between the public client and the local service.

---

# Requirements

## Server

- Python 3.10+
- A public server or VPS
- Public IPv4 address
- Open inbound TCP ports

## Client

- Python 3.10+
- Internet connection
- A local service running on the configured port

---

# Server Setup

The server can run on any Linux VPS.

This project was tested on:

```text
Ubuntu 24.04
Python 3.12
Azure Virtual Machine
```

## 1. Connect to the server

```bash
ssh azureuser@YOUR_SERVER_IP
```

## 2. Install Python

```bash
sudo apt update
sudo apt install -y python3 python3-pip
```

Verify:

```bash
python3 --version
```

## 3. Create the project directory

```bash
mkdir -p ~/openport
cd ~/openport
```

## 4. Add the server

Create:

```text
server.py
```

Paste the current OpenPort server implementation into this file.

## 5. Run the server

```bash
python3 server.py
```

You should see:

```text
Control server: 9000
Data server: 9001
Public server: 25565
```

---

# Client Setup

The agent runs on the computer hosting the application.

## 1. Clone or copy the project

The current structure is:

```text
OpenPort/
└── client/
    └── agent.py
```

Navigate to the client directory:

```powershell
cd OpenPort\client
```

## 2. Configure the agent

Open `agent.py`.

Configure the public server:

```python
SERVER_HOST = "YOUR_SERVER_IP"
```

Example:

```python
SERVER_HOST = "20.198.81.254"
```

Configure the ports:

```python
CONTROL_PORT = 9000
DATA_PORT = 9001

LOCAL_HOST = "127.0.0.1"
LOCAL_PORT = 25565
```

`LOCAL_PORT` must match the port where your application is running.

For example:

```text
FastAPI
127.0.0.1:25565
```

---

# Running the Agent

Start the agent:

```powershell
python agent.py
```

Expected output:

```text
Connecting to OpenPort 20.198.81.254:9000
Connected to OpenPort
```

The agent will automatically attempt to reconnect if the control connection is lost.

---

# Exposing a Local Application

Suppose you have an application running on:

```text
127.0.0.1:25565
```

Start OpenPort:

```text
Azure Server
    ↓
python3 server.py
```

Then start the agent:

```text
Your Computer
    ↓
python agent.py
```

Your local application should now be accessible through:

```text
http://YOUR_SERVER_IP:25565
```

For example:

```text
http://20.198.81.254:25565
```

If you are running FastAPI, you can test:

```text
http://20.198.81.254:25565/docs
```

---

# Azure Configuration

The Azure VM requires inbound TCP rules for the following ports:

| Port | Protocol | Purpose |
|---|---|---|
| `22` | TCP | SSH |
| `9000` | TCP | Agent control connection |
| `9001` | TCP | Agent data connections |
| `25565` | TCP | Public exposed application |

For development, these ports can be temporarily opened to the internet.

## Important

Ports `9000` and `9001` currently have no authentication.

Do not use this version in production.

Anyone who can connect to these ports could potentially interact with the OpenPort server.

Authentication and secure agent identification are planned for future versions.

---

# Architecture

OpenPort uses three separate TCP services.

## Control Channel

The agent maintains a persistent connection to:

```text
SERVER_IP:9000
```

The server sends commands such as:

```text
CONNECT <connection-id>
```

Example:

```text
CONNECT ef024f68-5068-4deb-a362-89a2fb5042d5
```

## Data Channel

When a public user connects, the server generates a UUID.

The agent:

1. Connects to the local application.
2. Opens a new connection to the server on port `9001`.
3. Identifies the connection using:

```text
DATA <connection-id>
```

The server then matches this data connection with the waiting public client.

## Public Port

The public server listens on:

```text
SERVER_IP:25565
```

Traffic is forwarded through a dedicated tunnel to:

```text
127.0.0.1:25565
```

---

# Multiple Connections

The current version supports multiple simultaneous TCP connections.

For example:

```text
Client A ─┐
Client B ─┼──► OpenPort Server
Client C ─┘
                 │
                 ├── Tunnel A ──► Local Service
                 ├── Tunnel B ──► Local Service
                 └── Tunnel C ──► Local Service
```

Each public connection receives its own UUID and dedicated data tunnel.

This avoids mixing application traffic with control messages.

---

# Current Limitations

OpenPort is currently an experimental proof of concept.

Known limitations include:

- TCP only
- No UDP support
- Ports are currently hardcoded
- No authentication
- No encryption
- No TLS
- No domain management
- No user accounts
- No tunnel management dashboard
- No automatic port allocation
- No packaged executable
- No persistent system service setup

---

# Planned Features

Future versions may include:

## Configurable Ports

Instead of editing Python files:

```bash
openport expose 25565
```

Or:

```bash
python agent.py --local-port 25565 --public-port 25565
```

## Domain Support

Eventually:

```text
hrick.in:25565
```

Could forward to:

```text
localhost:25565
```

## Authentication

Agents will authenticate with the server using tokens or keys.

Example:

```text
openport connect --token YOUR_TOKEN
```

## UDP Support

This is required for games and services that use UDP.

Potential use cases:

- Game servers
- Voice servers
- Real-time applications

## Standalone Agent

The Python agent could eventually be packaged into an executable:

```text
openport.exe
```

Allowing users to run:

```bash
openport expose 25565
```

without installing Python.

---

# Development Status

Current version:

```text
OpenPort v0.2
```

Status:

```text
Experimental / Proof of Concept
```

Successfully tested with:

```text
FastAPI
127.0.0.1:25565
        ↓
OpenPort Agent
        ↓
Azure VM
        ↓
Public Internet
```

The current version demonstrates the core functionality of OpenPort: exposing a localhost TCP service through a publicly accessible relay server.