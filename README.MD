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

The current version is built with Python and uses a public server as the relay.

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
- Colored logs for connected, trying, and error events
- Command-line interface
- Simple tunnel syntax:

```bash
openport expose 3000
```

- Optional public port:

```bash
openport expose 3000 to 21342
```

---

# How It Works

Suppose an application is running locally:

```text
127.0.0.1:3000
```

Start OpenPort:

```bash
openport expose 3000
```

The agent creates an outbound connection to the OpenPort relay server.

By default, it attempts to register public port:

```text
25565
```

If `25565` is already owned by another tunnel, OpenPort selects a random port between:

```text
20000–30000
```

It checks whether the selected port is available and continues trying until it successfully registers a free port.

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
SERVER_IP:25565
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

The application continues running on the user's computer. The relay server only forwards traffic.

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
├── setup.py
│
└── README.md
```

---

# CLI Installation

OpenPort can be installed as a command-line tool.

After installation, the agent can be started from anywhere using:

```bash
openport expose <local-port>
```

## Install from Source

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Navigate into the project:

```bash
cd OpenPort
```

Install OpenPort:

```bash
python -m pip install .
```

For development, use an editable installation:

```bash
python -m pip install -e .
```

The editable installation means changes made to the source code are immediately used without reinstalling the package.

---

# Windows PATH Setup

Depending on the Python installation, the OpenPort executable may be installed in a Python `Scripts` directory that is not automatically added to `PATH`.

If this happens:

```text
'openport' is not recognized as an internal or external command
```

Find the Python user base directory:

```cmd
python -m site --user-base
```

Then add the `Scripts` directory inside that location to your Windows `PATH`.

For Microsoft Store Python installations, the location may look similar to:

```text
C:\Users\YOUR_USERNAME\AppData\Local\Packages\
PythonSoftwareFoundation.Python.3.12_...\LocalCache\
local-packages\Python312\Scripts
```

For other Python installations, it may instead look like:

```text
C:\Users\YOUR_USERNAME\AppData\Roaming\Python\Python312\Scripts
```

The exact location depends on how Python was installed.

To check where `openport.exe` exists, run:

```cmd
where openport
```

If it is not found, search the Python Scripts directory manually.

After adding the correct directory to `PATH`, close all existing terminals and open a new terminal.

Verify:

```cmd
where openport
```

Expected output:

```text
C:\...\Scripts\openport.exe
```

Then:

```cmd
openport expose 3000
```

---

# Installing for Development

While developing OpenPort, use:

```cmd
python -m pip install -e .
```

This creates an editable installation.

Your workflow becomes:

```text
Edit agent.py
      ↓
Run OpenPort
      ↓
Changes are immediately used
```

For example:

```cmd
openport expose 3000
```

You do not need to reinstall OpenPort after every code change.

If the console command itself changes or stops working, reinstall:

```cmd
python -m pip install -e .
```

---

# Using the CLI

## Basic Usage

Expose a local service running on port `3000`:

```bash
openport expose 3000
```

OpenPort will attempt to expose it on:

```text
SERVER_IP:25565
```

If `25565` is unavailable, a random free port between `20000` and `30000` will be assigned.

Example:

```text
[TRYING] Connecting to OpenPort SERVER_IP:9000
[CONNECTED] Connected to OpenPort control server
[TRYING] Trying to register public port 25565
[CONNECTED] Public tunnel active: SERVER_IP:25565
[CONNECTED] Forwarding to: 127.0.0.1:3000
```

---

## Specify a Public Port

You can explicitly request a public port:

```bash
openport expose 3000 to 21342
```

This forwards:

```text
Local:

127.0.0.1:3000
```

to:

```text
Public:

SERVER_IP:21342
```

Example:

```text
[TRYING] Connecting to OpenPort SERVER_IP:9000
[CONNECTED] Connected to OpenPort control server
[TRYING] Trying to register public port 21342
[CONNECTED] Public tunnel active: SERVER_IP:21342
[CONNECTED] Forwarding to: 127.0.0.1:3000
```

The syntax is:

```text
openport expose <local-port>
```

or:

```text
openport expose <local-port> to <public-port>
```

Examples:

```bash
openport expose 3000

openport expose 8080

openport expose 5000 to 25000

openport expose 25565 to 25565
```

---

# Port Assignment

When no public port is specified:

```bash
openport expose 3000
```

OpenPort attempts:

```text
25565
```

If unavailable:

```text
25565
  │
  ▼
available?
  │
  ├── yes → register tunnel
  │
  └── no
        │
        ▼
random port from 20000–30000
        │
        ▼
available?
  │
  ├── yes → register tunnel
  │
  └── no → try another random port
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

When a public port is explicitly specified:

```bash
openport expose 3000 to 21342
```

OpenPort requests that exact port.

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

Public tunnels are created dynamically.

Examples:

```text
SERVER_IP:25565
SERVER_IP:21342
SERVER_IP:28061
SERVER_IP:29040
```

Each port belongs to a specific connected agent.

---

# Requirements

## Server

- Python 3.10+
- Linux server, VPS, or any machine with a reachable public IP address
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
ssh USERNAME@YOUR_SERVER_IP
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

Create:

```text
server.py
```

Paste the OpenPort server implementation.

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
openport expose 3000
```

If OpenPort assigns `25565`, visiting:

```text
http://SERVER_IP:25565
```

forwards traffic to:

```text
http://127.0.0.1:3000
```

Swagger documentation would be available through:

```text
http://SERVER_IP:25565/docs
```

if the tunnel is assigned port `25565`.

You can also explicitly choose a port:

```bash
openport expose 3000 to 21342
```

Then access:

```text
http://SERVER_IP:21342
```

---

# Multiple Agents

The server supports multiple agents.

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

Each public connection receives:

```text
Unique UUID
+
Dedicated data connection
```

This keeps application traffic separate from control messages.

---

# Logging

OpenPort uses colored status logs.

## Green — `[CONNECTED]`

Used for successful events:

```text
[CONNECTED] Connected to OpenPort control server
[CONNECTED] Public tunnel active
[CONNECTED] Tunnel established
```

## Yellow — `[TRYING]`

Used while setting up connections:

```text
[TRYING] Connecting to OpenPort
[TRYING] Trying to register public port
[TRYING] Setting up connection
[TRYING] Opening data connection
```

## Red — `[ERROR]`

Used for failures, timeouts, disconnections, and cleanup:

```text
[ERROR] Agent disconnected
[ERROR] Tunnel on port 28061 removed
[ERROR] Agent timed out
[ERROR] Connection failed
```

---

# Azure / Firewall Configuration

The relay server firewall or cloud security rules must allow inbound TCP traffic for:

| Port / Range | Protocol | Purpose |
|---|---|---|
| `22` | TCP | SSH |
| `9000` | TCP | OpenPort control channel |
| `9001` | TCP | OpenPort data channel |
| `20000–30000` | TCP | Dynamic public tunnel range |

The `20000–30000` range is required because OpenPort dynamically listens on ports within this range.

Without allowing these ports through the cloud firewall or Network Security Group, OpenPort may successfully register a tunnel internally while external users cannot reach it.

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
                               │ control connection
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
- No packaged standalone executable
- Public port ranges must be explicitly allowed by the server firewall
- Random port allocation does not bypass firewall or cloud security rules

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

Do not expose the control and data ports publicly in a production deployment without authentication and encryption.

---

# Planned Features

## Phase 1 — Core Improvements

- Server-assigned ports
- Agent heartbeat
- Automatic stale-agent detection
- Better tunnel registration protocol
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

Eventually:

```text
myapp.example.com
        ↓
OpenPort
        ↓
127.0.0.1:3000
```

## Phase 5 — CLI Improvements

Future CLI functionality could include:

```bash
openport expose 3000

openport expose 3000 to 25000

openport status

openport tunnels

openport stop
```

## Phase 6 — Packaged Agent

Eventually, OpenPort could be distributed as a standalone executable:

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
Public Relay Server
        ↓
Public IP + Dynamic Port
        ↓
Internet
```

The current version demonstrates the core functionality of OpenPort: exposing a local TCP service through a publicly accessible relay server with dynamic port registration, automatic fallback allocation, and a command-line interface.

---

# CLI Quick Reference

```bash
# Install OpenPort
python -m pip install .

# Development installation
python -m pip install -e .

# Expose a local service using the default public port
openport expose 3000

# Expose a local service using a specific public port
openport expose 3000 to 21342

# Expose another local service
openport expose 8080

# Expose a Minecraft Java server on its default port
openport expose 25565
```

The general syntax is:

```text
openport expose <local-port> to <public-port>
```

If `<public-port>` is omitted, OpenPort tries `25565` first and then automatically falls back to a random available port between `20000` and `30000`.