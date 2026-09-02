import asyncio

SERVER_HOST = "20.198.81.254"

CONTROL_PORT = 9000
DATA_PORT = 9001

LOCAL_HOST = "127.0.0.1"
LOCAL_PORT = 25565


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


async def handle_connection(connection_id):
    print(f"New connection: {connection_id}")

    try:
        # Connect to the user's local application
        local_reader, local_writer = await asyncio.open_connection(
            LOCAL_HOST,
            LOCAL_PORT
        )

        print(
            f"Connected to local service "
            f"{LOCAL_HOST}:{LOCAL_PORT}"
        )

        # Create a dedicated data connection to Azure
        data_reader, data_writer = await asyncio.open_connection(
            SERVER_HOST,
            DATA_PORT
        )

        # Identify which public connection this belongs to
        data_writer.write(
            f"DATA {connection_id}\n".encode()
        )

        await data_writer.drain()

        print(f"Tunnel ready: {connection_id}")

        await asyncio.gather(
            pipe(data_reader, local_writer),
            pipe(local_reader, data_writer),
        )

    except Exception as e:
        print(
            f"Connection {connection_id} failed: {e}"
        )


async def connect_to_server():
    while True:
        try:
            print(
                f"Connecting to OpenPort "
                f"{SERVER_HOST}:{CONTROL_PORT}"
            )

            reader, writer = await asyncio.open_connection(
                SERVER_HOST,
                CONTROL_PORT
            )

            print("Connected to OpenPort")

            while True:
                command = await reader.readline()

                if not command:
                    print("Server disconnected")
                    break

                parts = command.decode().strip().split()

                if len(parts) == 2 and parts[0] == "CONNECT":
                    connection_id = parts[1]

                    # Handle every incoming connection independently
                    asyncio.create_task(
                        handle_connection(connection_id)
                    )

        except Exception as e:
            print(f"Control connection error: {e}")

        print("Retrying in 5 seconds...")
        await asyncio.sleep(5)


asyncio.run(connect_to_server())