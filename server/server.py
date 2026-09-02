import asyncio
import uuid

CONTROL_PORT = 9000
DATA_PORT = 9001
PUBLIC_PORT = 25565

agent_writer = None
pending_connections = {}


async def handle_agent(reader, writer):
    global agent_writer

    print("Agent connected")

    # Only this connection is used for control messages.
    agent_writer = writer

    try:
        await reader.read()

    except Exception as e:
        print(f"Agent error: {e}")

    finally:
        if agent_writer is writer:
            agent_writer = None

        print("Agent disconnected")

        try:
            writer.close()
            await writer.wait_closed()
        except Exception:
            pass


async def handle_data(reader, writer):
    try:
        # Agent sends:
        # DATA <connection-id>\n
        header = await reader.readline()

        if not header:
            writer.close()
            return

        parts = header.decode().strip().split()

        if len(parts) != 2 or parts[0] != "DATA":
            print("Invalid data connection")
            writer.close()
            return

        connection_id = parts[1]

        future = pending_connections.get(connection_id)

        if future is None:
            print(f"Unknown connection: {connection_id}")
            writer.close()
            return

        if not future.done():
            future.set_result((reader, writer))

    except Exception as e:
        print(f"Data connection error: {e}")

        try:
            writer.close()
        except Exception:
            pass


async def pipe(reader, writer):
    try:
        while True:
            data = await reader.read(65536)

            if not data:
                break

            writer.write(data)
            await writer.drain()

    except Exception:
        pass

    finally:
        try:
            writer.close()
            await writer.wait_closed()
        except Exception:
            pass


async def handle_public_client(client_reader, client_writer):
    client_addr = client_writer.get_extra_info("peername")

    print(f"Public client connected: {client_addr}")

    if agent_writer is None or agent_writer.is_closing():
        print("No agent connected")

        client_writer.close()
        await client_writer.wait_closed()
        return

    connection_id = str(uuid.uuid4())

    future = asyncio.get_running_loop().create_future()

    pending_connections[connection_id] = future

    try:
        # Ask the agent to create a dedicated tunnel
        message = f"CONNECT {connection_id}\n"

        agent_writer.write(message.encode())
        await agent_writer.drain()

        print(f"Waiting for agent: {connection_id}")

        # Wait up to 10 seconds for the agent
        data_reader, data_writer = await asyncio.wait_for(
            future,
            timeout=10
        )

        print(f"Tunnel established: {connection_id}")

        await asyncio.gather(
            pipe(client_reader, data_writer),
            pipe(data_reader, client_writer),
        )

    except asyncio.TimeoutError:
        print(f"Agent timed out: {connection_id}")

    except Exception as e:
        print(f"Public connection error: {e}")

    finally:
        pending_connections.pop(connection_id, None)

        try:
            client_writer.close()
            await client_writer.wait_closed()
        except Exception:
            pass


async def main():
    control_server = await asyncio.start_server(
        handle_agent,
        "0.0.0.0",
        CONTROL_PORT
    )

    data_server = await asyncio.start_server(
        handle_data,
        "0.0.0.0",
        DATA_PORT
    )

    public_server = await asyncio.start_server(
        handle_public_client,
        "0.0.0.0",
        PUBLIC_PORT
    )

    print(f"Control server: {CONTROL_PORT}")
    print(f"Data server: {DATA_PORT}")
    print(f"Public server: {PUBLIC_PORT}")

    async with control_server, data_server, public_server:
        await asyncio.gather(
            control_server.serve_forever(),
            data_server.serve_forever(),
            public_server.serve_forever(),
        )


if __name__ == "__main__":
    asyncio.run(main())