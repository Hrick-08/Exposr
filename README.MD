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

OpenPort is a reverse TCP tunneling project that exposes services running on a user's local machine to the public internet through a remote relay server.

The current version is built with Python and uses an Azure VM as the public relay.

## Current Version

**OpenPort v0.3 — Experimental / Proof of Concept**

### Current capabilities

- Reverse TCP tunneling
- Localhost service exposure
- Dynamic public port registration
- Default public port: `25565`
- Automatic fallback to a random available port
- Random fallback range: `20000–30000`
- Port availability checking before assignment
- Persistent agent connection
- Automatic agent reconnection
- Multiple simultaneous public connections
- Dedicated data tunnel per connection
- UUID-based connection identification
- Async networking using Python `asyncio`
- Clear colored logs for connected, trying, and error events

---

# How It Works

Suppose an application is running locally:

```text
127.0.0.1:3000
```

Start the OpenPort agent:

```bash
python agent.py --local-port 3000
```

The agent creates an outbound connection to the OpenPort relay server.

It first attempts to register public port `25565`.

If `25565` is already owned by another tunnel, the agent selects a random port between `20000` and `30000`, checks whether it is available, and keeps trying until it finds a free port.

```text
Your PC
127.0.0.1:3000
        │
        ▼
 OpenPort Agent
        │
        │ Persistent control connection
        ▼
┌──────────────────────────┐
│     OpenPort Server      │
│                          │
│ Control Port: 9000       │
│ Data Port:    9001       │
│                          │
│ Public Ports:            │
│ 25565                    │
│ 20000–30000              │
└─────────────┬────────────┘
              │
              ▼
       Internet Users
```

Example forwarding path:

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
127.0.0.1:3000
      │
      ▼
Your Application
```

The application continues running on the user's computer. The Azure VM only acts as a public relay.

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

---

# Ports

| Port | Purpose |
|---|---|
| `9000` | Persistent agent control channel |
| `9001` | Dedicated data tunnel connections |
| `25565` | Default public port |
| `20000–30000` | Dynamic fallback public port range |

## Port 9000 — Control Channel

The agent maintains a persistent connection to:

```text
SERVER_IP:9000
```

The agent registers a public port:

```text
REGISTER 25565
```

When an internet user connects to the public port, the server sends the agent:

```text
CONNECT <connection-id>
```

Example:

```text
CONNECT 8bab2f9a-b0e2-4db2-8fed-9a8dda8e3aed
```

## Port 9001 — Data Channel

For each incoming public connection:

1. The server generates a UUID.
2. The server tells the correct agent to handle it.
3. The agent connects to the local application.
4. The agent opens a new connection to port `9001`.
5. The agent identifies that connection with:

```text
DATA <connection-id>
```

6. The server matches the data connection with the waiting public client.
7. Traffic is forwarded in both directions.

Each public client receives a separate data connection.

## Public Ports

The agent tries `25565` first:

```text
25565
  ↓
available?
  ├── yes → use 25565
  │
  └── no
        ↓
random port from 20000–30000
        ↓
available?
  ├── no → try another random port
  │
  └── yes → register tunnel
```

Example:

```text
Agent A
Local: 3000
Public: 25565

Agent B
Local: 8080
Public: 28061

Agent C
Local: 5000
Public: 29040
```

---

# Requirements

## Server

- Python 3.10+
- Linux server or VPS
- Public IPv4 address
- Open inbound TCP ports

Tested with:

```text
Ubuntu 24.04
Python 3.12
Microsoft Azure Virtual Machine
```

## Client

- Python 3.10+
- Internet connection
- A local TCP service running on the desired port

---

# Server Setup

## 1. Connect to the server

```bash
ssh azureuser@YOUR_SERVER_IP
```

Example:

```bash
ssh azureuser@20.198.81.254
```

If an SSH alias is configured:

```bash
ssh openport
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

Create `server.py` and paste the current OpenPort server implementation.

## 4. Run the server

```bash
python3 server.py
```

Expected startup output:

```text
Control server listening on 9000
Data server listening on 9001
```

---

# Client Setup

The agent runs on the computer hosting the application.

Example:

```text
OpenPort/
└── client/
    └── agent.py
```

Configure the OpenPort server address in `agent.py`:

```python
SERVER_HOST = "20.198.81.254"
CONTROL_PORT = 9000
DATA_PORT = 9001
LOCAL_HOST = "127.0.0.1"
```

---

# Running the Agent

The local port is required.

If an application is running on:

```text
127.0.0.1:3000
```

run:

```bash
python agent.py --local-port 3000
```

The agent first attempts:

```text
25565
```

If unavailable, it automatically searches for a free random port between:

```text
20000–30000
```

For example:

```text
[connected] Connected to OpenPort server
[trying] Attempting to register port 25565
[connected] Public tunnel active on port 25565
```

If `25565` is already occupied:

```text
[trying] Attempting to register port 25565
[trying] Port 25565 unavailable
[trying] Trying random port 28061
[connected] Public tunnel active on port 28061
```

The local application would then be accessible at:

```text
20.198.81.254:28061
```

---

# Example: FastAPI

Suppose FastAPI runs locally on:

```text
127.0.0.1:3000
```

Start FastAPI:

```bash
uvicorn main:app --host 127.0.0.1 --port 3000
```

Start OpenPort:

```bash
python agent.py --local-port 3000
```

If OpenPort assigns `25565`, visiting:

```text
http://20.198.81.254:25565
```

forwards traffic to:

```text
http://127.0.0.1:3000
```

Swagger docs would be available through:

```text
http://20.198.81.254:25565/docs
```

if the tunnel is assigned port `25565`.

---

# Multiple Agents

The current server supports multiple agents.

```text
Agent A
Local service: 3000
        │
        ▼
Public port: 25565

Agent B
Local service: 8080
        │
        ▼
Public port: 28061

Agent C
Local service: 5000
        │
        ▼
Public port: 29040
```

The server tracks which agent owns each public tunnel and forwards incoming connections to the appropriate agent.

---

# Multiple Simultaneous Connections

Multiple users can connect to the same public port simultaneously.

```text
Client A ──┐
           │
Client B ──┼────► OpenPort Server
           │
Client C ──┘
                    │
                    ├── Tunnel A ──► Local Service
                    ├── Tunnel B ──► Local Service
                    └── Tunnel C ──► Local Service
```

Each public connection gets:

```text
Unique UUID
+
Dedicated data connection
```

This keeps application traffic separate from control messages.

---

# Logging

The current version uses clearer colored status logs.

## Green — `[connected]`

Used for successful events:

```text
[connected] Agent connected
[connected] Tunnel registered
[connected] Tunnel established
```

## Yellow — `[trying]`

Used while setting up or waiting for a connection:

```text
[trying] Registering tunnel
[trying] Waiting for agent
[trying] Attempting data connection
```

## Red — `[error]`

Used for failures, timeouts, disconnections, and cleanup:

```text
[error] Agent disconnected
[error] Tunnel on port 28061 removed
[error] Agent timed out
[error] Connection failed
```

---

# Azure Configuration

The Azure VM Network Security Group must allow inbound TCP traffic for:

| Port / Range | Protocol | Purpose |
|---|---|---|
| `22` | TCP | SSH |
| `9000` | TCP | OpenPort control channel |
| `9001` | TCP | OpenPort data channel |
| `25565` | TCP | Default public tunnel |
| `20000–30000` | TCP | Dynamic public tunnel range |

The `20000–30000` range is required because the server dynamically listens on ports within that range.

Without allowing this range through the Azure Network Security Group, OpenPort may register a tunnel successfully but external users will not be able to connect to it.

---

# Current Architecture

```text
                    ┌─────────────────────┐
                    │    Internet User    │
                    └──────────┬──────────┘
                               │
                               ▼
                 SERVER_IP:PUBLIC_PORT
                               │
                               ▼
                    ┌─────────────────────┐
                    │   OpenPort Server   │
                    │                     │
                    │ Control → 9000      │
                    │ Data    → 9001      │
                    │                     │
                    │ Public Ports        │
                    │ 25565               │
                    │ 20000–30000         │
                    └──────────┬──────────┘
                               │
                               │ Persistent outbound
                               │ connection
                               ▼
                    ┌─────────────────────┐
                    │   OpenPort Agent    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Local Service    │
                    │                     │
                    │127.0.0.1:LOCAL_PORT │
                    └─────────────────────┘
```

---

# Current Limitations

OpenPort is currently an experimental proof of concept.

Known limitations:

- TCP only
- No UDP forwarding yet
- No authentication
- No encryption
- No TLS
- No agent tokens
- No domain or subdomain routing
- No persistent tunnel configuration
- No user accounts
- No dashboard
- No rate limiting
- No abuse protection
- No packaged executable
- The Azure public port range must still be explicitly allowed
- Random port allocation only checks OpenPort tunnel availability and does not bypass firewall rules

---

# Security Warning

The current version is not production-ready.

Ports:

```text
9000
9001
```

currently do not use authentication or encryption.

A production version should add:

- Agent authentication tokens
- TLS encryption
- Secure registration
- Tunnel ownership
- User identities
- Port authorization
- Rate limiting
- Connection limits
- Firewall restrictions
- Abuse prevention

---

# Planned Features

## Phase 1 — Core Improvements

- Optional `--public-port` override
- Better tunnel registration protocol
- Server-assigned ports
- Agent heartbeat
- Automatic stale-agent detection
- Cleaner shutdown handling
- Persistent server process using `systemd`

## Phase 2 — Security

- Agent authentication tokens
- TLS encryption
- Secure registration
- Tunnel ownership
- User accounts

## Phase 3 — UDP

Planned support for:

- Minecraft Bedrock
- Game servers
- Voice servers
- Real-time applications

UDP will require a different forwarding architecture from the current TCP stream-based implementation.

## Phase 4 — Domain Support

Eventually, OpenPort could support:

```text
hrick.in
```

or:

```text
myproject.hrick.in
```

For HTTP services:

```text
myapp.hrick.in
        ↓
OpenPort
        ↓
127.0.0.1:3000
```

## Phase 5 — CLI

Eventually:

```bash
openport expose 3000
```

Example output:

```text
[connected] OpenPort tunnel active

Public address:

20.198.81.254:25565

Forwarding to:

127.0.0.1:3000
```

## Phase 6 — Packaged Agent

The agent could eventually be packaged as:

```text
openport.exe
```

allowing users to run:

```bash
openport expose 3000
```

without manually installing Python.

---

# Development Status

```text
OpenPort v0.3
Experimental / Proof of Concept
```

Currently tested with:

```text
FastAPI
127.0.0.1:3000
        ↓
OpenPort Agent
        ↓
Azure VM
        ↓
Public IP + Dynamic Port
        ↓
Internet
```

The current version demonstrates the core functionality of OpenPort: exposing a local TCP service through a publicly accessible relay server with automatic fallback public port allocation.
