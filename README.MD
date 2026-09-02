```text
 _____                             
| ____|_  ___ __   ___  ___ _ __    
|  _| \ \/ / '_ \ / _ \/ __| '__|   
| |___ >  <| |_) | (_) \__ \ |      
|_____/_/\_\ .__/ \___/|___/_|      
           |_|                      
```

# Exposr

Exposr is a reverse TCP tunneling project that exposes services running on a user's local machine to the public internet through a remote relay server.

The project is built with Python and uses a public server as the relay. The agent maintains a persistent control connection and creates a dedicated data connection for every incoming public connection.

## Current Version

**Exposr v0.4 - Experimental / Proof of Concept**

### Current capabilities

- Reverse TCP tunneling
- Localhost service exposure
- Dynamic public port registration
- Default preferred public port: `25565`
- Automatic fallback to a random available port
- Random fallback range: `20000-30000`
- Port availability checking through server registration
- Persistent agent connection
- Automatic agent reconnection
- Multiple simultaneous public connections
- Dedicated data tunnel per connection
- UUID-based connection identification
- Async networking using Python `asyncio`
- Colored logs for connected, trying, error, and info events
- Command-line interface

Simple tunnel syntax:

```bash
exposr expose 3000
```

Optional public port:

```bash
exposr expose 3000 to 21342
```

---

# How It Works

Suppose an application is running locally:

```text
127.0.0.1:3000
```

Start Exposr:

```bash
exposr expose 3000
```

The agent creates an outbound connection to the Exposr relay server.

By default, it attempts to register public port `25565`. If that port is already owned by another tunnel, Exposr selects a random port between `20000-30000`. Each random port is sent to the server for registration; a port is not assumed to be available merely because it was randomly selected.

```text
Your PC
127.0.0.1:3000
        |
        v
 Exposr Agent
        |
        | Persistent control connection
        v
+--------------------------+
|     Exposr Server        |
|                          |
| Control Port: 9000       |
| Data Port:    9001       |
|                          |
| Public Ports:            |
| 25565                    |
| 20000-30000              |
+-------------+------------+
              |
              v
       Internet Users
```

Example forwarding path:

```text
Internet User
      |
      v
SERVER_IP:25565
      |
      v
Exposr Server
      |
      v
Exposr Agent
      |
      v
127.0.0.1:3000
      |
      v
Your Application
```

The application continues running on the user's computer. The relay server only forwards traffic.

---

# Project Structure

```text
Exposr/
|
+-- client/
|   +-- __init__.py
|   +-- cli.py
|   +-- config.py
|   +-- connection.py
|   +-- tunnel.py
|   +-- main.py
|
+-- common/
|   +-- __init__.py
|   +-- logger.py
|   +-- protocol.py
|
+-- server/
|   +-- __init__.py
|   +-- control.py
|   +-- data.py
|   +-- tunnel.py
|   +-- ports.py
|   +-- main.py
|
+-- setup.py
+-- README.MD
```

The old monolithic `client/agent.py` and `server/server.py` files are no longer active implementations. Shared logging and protocol messages live in `common/`; client and server responsibilities are separated into their respective packages.

---

# CLI Installation

Exposr can be installed as a command-line tool.

Clone the repository and navigate into the project:

```bash
git clone YOUR_REPOSITORY_URL
cd Exposr
```

Install Exposr:

```bash
python -m pip install .
```

For development, use an editable installation:

```bash
python -m pip install -e .
```

The console command is provided by the `client.main:main` entry point as `exposr`. The editable installation means source changes are immediately used without reinstalling the package.

## Configure the Relay Server

The server address is blank when Exposr is first installed. Before using
`expose`, save the public IP address or hostname of the relay VM:

```bash
exposr config set-server YOUR_SERVER_IP
```

For example:

```bash
exposr config set-server 12.345.67.890
```

This generates a random agent token and saves it in:

```text
~/.exposr/agent_token.txt
```

Copy the contents of that file into the server's
`~/.exposr/config.json`:

```json
{
  "server_host": "",
  "agent_token": "PASTE_TOKEN_HERE"
}
```

The token is sent with every control registration request. The server closes
connections whose token does not match its configured token before accepting
the agent or opening a public tunnel.

On the relay server, initialize the token by pasting the generated value:

```bash
exposr server init-token PASTE_TOKEN_HERE
```

This writes the token to the server's `~/.exposr/config.json` while preserving
other configuration values.

The value is saved in:

```text
~/.exposr/config.json
```

If you run `exposr expose 3000` before configuring the server, Exposr
stops and displays:

```text
[ERROR] Server IP is not configured. Run: exposr config set-server <server-ip>
```

The `--server-host` option can be used to override the saved address for one
run:

```bash
exposr expose 3000 --server-host YOUR_SERVER_IP
```

---

# Windows PATH Setup

Depending on the Python installation, the Exposr executable may be installed in a Python `Scripts` directory that is not automatically added to `PATH`.

If this happens:

```text
'exposr' is not recognized as an internal or external command
```

Find the Python user base directory:

```cmd
python -m site --user-base
```

Then add the `Scripts` directory inside that location to the Windows `PATH`. To check where `exposr.exe` exists, run:

```cmd
where exposr
```

After adding the correct directory to `PATH`, close existing terminals and open a new terminal. Verify with `where exposr`, then run:

```cmd
exposr expose 3000
```

---

# Using the CLI

## Basic Usage

Expose a local service running on port `3000`:

```bash
exposr expose 3000
```

Exposr attempts to expose it on `SERVER_IP:25565`. If `25565` is unavailable, a random port between `20000` and `30000` is selected and checked with the server.

Optional connection settings can be supplied with:

```text
--server-host
--control-port
--data-port
--local-host
```

The saved server address is used when `--server-host` is omitted. The control
port defaults to `9000`, the data port defaults to `9001`, and the local host
defaults to `127.0.0.1`.

## Specify a Public Port

You can explicitly request a public port:

```bash
exposr expose 3000 to 21342
```

This forwards:

```text
127.0.0.1:3000  ->  SERVER_IP:21342
```

The general syntax is:

```text
exposr expose <local-port>
exposr expose <local-port> to <public-port>
```

Examples:

```bash
exposr expose 3000
exposr expose 8080
exposr expose 5000 to 25000
exposr expose 25565 to 25565
```

When a public port is explicitly specified, Exposr requests that exact port and does not silently replace it with a random port.

---

# Port Assignment

When no public port is specified, Exposr attempts `25565` first:

```text
25565
  |
  v
available?
  |
  +-- yes -> register tunnel
  |
  +-- no
        |
        v
random port from 20000-30000
        |
        v
available?
  |
  +-- yes -> register tunnel
  |
  +-- no -> try another random port
```

The agent retries up to the existing maximum of 100 registration attempts. The server tracks ownership and releases public ports when an agent disconnects.

---

# Ports

| Port | Purpose |
|---|---|
| `9000` | Persistent agent control channel |
| `9001` | Dedicated data tunnel connections |
| `25565` | Default preferred public port |
| `20000-30000` | Dynamic fallback public port range |

The relay host or Azure firewall must allow inbound TCP traffic for all of these ports and ranges.

## Port 9000 - Control Channel

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

## Port 9001 - Data Channel

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

---

# Requirements

## Server

- Python 3.10+
- Linux server, VPS, Azure VM, or another machine with a reachable public IP
- Open inbound TCP ports `9000`, `9001`, `25565`, and `20000-30000`

## Client

- Python 3.10+
- Internet connection
- A local TCP service running on the desired port

---

# Server Setup

From the project directory on the relay machine, install the package:

```bash
python3 -m pip install .
```

Start the relay server:

```bash
python3 -m server.main
```

Expected startup messages identify the control listener on `9000` and the data listener on `9001`.

---

# Example: FastAPI

Suppose FastAPI runs locally on `127.0.0.1:3000`:

```bash
uvicorn main:app --host 127.0.0.1 --port 3000
```

Start Exposr:

```bash
exposr expose 3000
```

If Exposr assigns `25565`, visiting `http://SERVER_IP:25565` forwards traffic to `http://127.0.0.1:3000`. Swagger documentation is available through `http://SERVER_IP:25565/docs` when that public port is assigned.

---

# Multiple Agents

The server supports multiple agents. Each agent can own a different public port, while the server tracks the owner of each tunnel:

```text
Agent A: 127.0.0.1:3000  ->  SERVER_IP:25565
Agent B: 127.0.0.1:8080  ->  SERVER_IP:28061
Agent C: 127.0.0.1:5000  ->  SERVER_IP:29040
```

# Multiple Simultaneous Connections

Multiple users can connect to the same public port simultaneously. Every connection receives a unique UUID and a dedicated data connection:

```text
Client A --+
           |
Client B --+----> Exposr Server
           |             |
Client C --+             +-- Tunnel A --> Local Service
                         +-- Tunnel B --> Local Service
                         +-- Tunnel C --> Local Service
```

---

# Logging

Exposr uses colored status logs.

## Green - `[CONNECTED]`

Used for successful connections and active tunnels.

## Yellow - `[TRYING]`

Used while connecting, registering ports, and creating tunnels.

## Red - `[ERROR]`

Used for failures, timeouts, disconnections, and cleanup.

## Blue - `[INFO]`

Used for informational messages such as clean shutdown.

---

# Azure / Firewall Configuration

The relay server firewall or cloud security rules must allow inbound TCP traffic for:

| Port / Range | Protocol | Purpose |
|---|---|---|
| `22` | TCP | SSH, if required for administration |
| `9000` | TCP | Exposr control channel |
| `9001` | TCP | Exposr data channel |
| `20000-30000` | TCP | Dynamic public tunnel range |

The `20000-30000` range is required because Exposr dynamically listens on ports within that range. Without allowing these ports through the cloud firewall or Network Security Group, Exposr may register a tunnel internally while external users cannot reach it.

---

# Current Architecture

```text
                    +---------------------+
                    |    Internet User    |
                    +----------+----------+
                               |
                               v
                 SERVER_IP:PUBLIC_PORT
                               |
                               v
                    +---------------------+
                    |   Exposr Server     |
                    |                     |
                    | Control -> 9000     |
                    | Data    -> 9001     |
                    |                     |
                    | Public Ports        |
                    | 25565               |
                    | 20000-30000         |
                    +----------+----------+
                               |
                               | Persistent outbound
                               | control connection
                               v
                    +---------------------+
                    |   Exposr Agent      |
                    +----------+----------+
                               |
                               v
                    +---------------------+
                    |    Local Service    |
                    | 127.0.0.1:LOCAL_PORT|
                    +---------------------+
```

---

---

# Benchmarks

Exposr v0.4 was benchmarked against a direct (non-tunneled) baseline to measure protocol overhead.

## Test Environment

**Relay server:**
- Azure Standard_B1s (1 vCPU, 1 GiB RAM, burstable)
- Region: Central India
- OS: Ubuntu 24.04

**Client:** Windows, local network connection to Azure

**Method:** 100 sequential HTTP GET requests per run, measured with an async
benchmark harness (`aiohttp`). Direct requests hit the local service on
`127.0.0.1`; tunneled requests hit the same service through the public
Exposr port.

## Results

| Metric | Direct | Tunneled | Overhead |
|---|---|---|---|
| Mean latency | 80.80 ms | 547.77 ms | +466.97 ms |
| Median latency | 78.59 ms | 541.00 ms | +462.41 ms |
| p95 latency | 110.20 ms | 587.42 ms | +477.22 ms |
| p99 latency | 124.50 ms | 623.29 ms | +498.79 ms |
| Throughput | 12.4 req/s | 1.8 req/s | -85.5% |

Raw TCP connect time to the relay server (`curl -w "%{time_connect}"`)
measured **113 ms**, isolating pure network RTT from protocol-level cost.

## Overhead Breakdown

```text
Total tunneled latency:        547.77 ms
Network RTT (TCP connect):    -113.00 ms
--------------------------------------
Exposr protocol overhead:     ~435 ms
```

The majority of tunneled latency is not raw network distance but overhead
introduced by Exposr's connection lifecycle:

- A fresh TCP handshake for the **data channel** (port `9001`) on every
  request, since each public connection gets a dedicated data tunnel
  rather than a reused/pooled connection
- A control-channel round trip (`CONNECT <uuid>` → agent dial-back with
  `DATA <uuid>`) that must complete before any payload is forwarded
- No connection keep-alive or pooling on the tunnel path, so this cost
  repeats on every single request instead of being amortized

## Known Confounds

- The relay server runs on the cheapest available Azure tier
  (Standard_B1s), which is CPU-credit throttled under sustained load.
  Some of the measured overhead is plausibly hardware-imposed rather than
  protocol-imposed.
- Direct-baseline latency (80 ms on `127.0.0.1`) is higher than a typical
  loopback benchmark, likely due to the local test server used
  (`python -m http.server` is single-threaded/blocking). A faster local
  server would tighten the baseline and slightly increase the reported
  overhead percentage.

## Reproducing

```bash
pip install aiohttp
python exposr_benchmark.py \
  --direct-url http://127.0.0.1:3000/ \
  --tunnel-url http://YOUR_SERVER_IP:25565/ \
  --requests 100
```

Concurrency sweep:

```bash
python exposr_benchmark.py \
  --direct-url http://127.0.0.1:3000/ \
  --tunnel-url http://YOUR_SERVER_IP:25565/ \
  --concurrency 1 10 50 100 \
  --requests 200
```

This overhead is the primary target for the connection-reuse and
persistent-tunnel work listed under **Planned Features**.

# Current Limitations

Exposr is currently an experimental proof of concept.

Known limitations:

- TCP only
- No UDP forwarding
- No encryption or TLS
- Data connections are not separately authenticated
- No domain or subdomain routing
- No persistent tunnel configuration
- No user accounts or dashboard
- No rate limiting or abuse protection
- Public port ranges must be explicitly allowed by the server firewall
- Random port allocation does not bypass firewall or cloud security rules

---

# Security Warning

The current version is not production-ready. The control port uses the
configured agent token, but the data port does not use separate
authentication or encryption. Do not expose the control and data ports
publicly in a production deployment without appropriate security controls.

---

# Planned Features

Possible future improvements include:

- Server-assigned ports
- Agent heartbeat and stale-agent detection
- Improved tunnel registration
- Persistent server operation using `systemd`
- Agent authentication tokens
- TLS encryption
- Domain support
- UDP support
- CLI status and tunnel management commands

These are not part of the current protocol or implementation.

---

# Development Status

```text
Exposr v0.4
Experimental / Proof of Concept
```

The current version demonstrates the core functionality of Exposr: exposing a local TCP service through a publicly accessible relay server with dynamic port registration, automatic fallback allocation, dedicated per-connection data tunnels, and a command-line interface.

---

# CLI Quick Reference

```bash
# Install Exposr
python -m pip install .

# Development installation
python -m pip install -e .

# Configure the relay server once
exposr config set-server YOUR_SERVER_IP

# Expose a local service using the default public port
exposr expose 3000

# Expose a local service using a specific public port
exposr expose 3000 to 21342

# Expose another local service
exposr expose 8080

# Expose a Minecraft Java server on its default local port
exposr expose 25565
```

The general syntax is:

```text
exposr expose <local-port> to <public-port>
```

If `<public-port>` is omitted, Exposr tries `25565` first and then falls back to a random available port between `20000` and `30000`.
