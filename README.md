# broadcast-server

## Goal

Learn how to work with WebSockets and implement real-time communication between clients and servers. This project simulates a simple broadcast server where clients can connect, send messages, and interact with other connected clients in real time.

## Features

- Real-time message broadcasting between clients.
- Customizable usernames (up to 8 characters).
- Graceful shutdown of the server using `SIGINT` or `SIGTERM`.
- Client reconnection functionality.

## Usage

### Prerequisites

- [Deno](https://deno.land/) (latest version installed)

### Commands

#### Start the Server

To start the broadcast server:

```bash
deno task server
```

The server will start on `ws://localhost:8080` by default.

#### Connect as a Client

To connect a client to the server:

```bash
deno task client
```

Once connected, you can:

- Send messages that will be broadcasted to all connected clients.
- Change your username using `/username <name>`.

#### Disconnect a Client

Type `exit` in the client terminal to disconnect.

#### Reconnect a Client

Type `reconnect` to reconnect after a disconnection.

### Configuration

#### Server

- The server listens on port `8080` by default. This can be changed by passing a port number when starting

```bash
deno task server 9000
```

#### Client

- The client connects to `127.0.0.1:8080` by default. This can be changed by passing a host and port when starting

```bash
deno task client 127.0.0.1 9000
```

## Example Usage

1. **Start the Server**:

   ```bash
   deno task sever
   ```

2. **Connect Clients**:

   ```bash
   deno task server
   ```

3. **Interact**:

   - Send messages: Simply type and hit Enter.
   - Change username: `/username <name>`.
   - Exit: `exit`.

4. **Observe**:

   - Clients receive real-time broadcasts with colored, timestamped messages.
   - Username conflicts or invalid inputs are handled gracefully.

5. **Shutdown**:
   - Use `Ctrl+C` in the server terminal for a graceful shutdown.

https://roadmap.sh/projects/broadcast-server
