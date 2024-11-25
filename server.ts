const clients = new Map<WebSocket, string>();
const activeUsernames = new Set<string>();

function generateRandomString(length: number = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function colorize(message: string, color: string): string {
  const colors: Record<string, string> = {
    green: "\x1b[32m",
    red: "\x1b[31m",
    reset: "\x1b[0m",
  };
  return `${colors[color] || ""}${message}${colors.reset}`;
}

function addTime(message: string): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes} | ${message}`;
}

function formatMessage(username: string, message: string): string {
  return addTime(`${colorize(username, "green")}: ${message}`);
}

export function startServer(port: number = 8080) {
  console.log(`Server starting on ws://localhost:${port}`);

  const controller = new AbortController();
  const { signal } = controller;

  function handleShutdown() {
    console.log("\nShutting down server...");
    controller.abort();
    for (const [client] of clients) {
      client.close();
    }
    console.log("Server shutdown complete.");
    Deno.exit(0);
  }

  Deno.addSignalListener("SIGINT", handleShutdown);
  Deno.addSignalListener("SIGTERM", handleShutdown);

  try {
    Deno.serve({ port, signal }, (req) => {
      if (req.headers.get("upgrade") !== "websocket") {
        return new Response("This server only handles WebSocket requests.", {
          status: 400,
        });
      }

      const { socket, response } = Deno.upgradeWebSocket(req);

      socket.addEventListener("open", () => {
        console.log("A client connected!");
        clients.set(socket, generateRandomString());
        activeUsernames.add(clients.get(socket)!);
      });

      socket.addEventListener("message", (event) => {
        const message = event.data;

        if (message.startsWith("/username ")) {
          const newUsername = message.slice(10).trim();
          if (newUsername.length > 8) {
            socket.send(
              colorize("Username must be 8 characters or fewer.", "red")
            );
          }
          if (newUsername.length < 1) {
            socket.send(
              colorize("Username must be at least 1 character.", "red")
            );
          }
          if (activeUsernames.has(newUsername)) {
            socket.send(colorize("Username is already taken.", "red"));
          } else {
            activeUsernames.delete(clients.get(socket)!);
            clients.set(socket, newUsername);
            activeUsernames.add(newUsername);
            socket.send(`Username set to: ${newUsername}`);
          }
        } else {
          broadcast(message, socket);
        }
      });

      socket.addEventListener("close", () => {
        activeUsernames.delete(clients.get(socket)!);
        clients.delete(socket);
        console.log("A client disconnected.");
      });

      socket.addEventListener("error", (err) => {
        console.error("WebSocket error:", err);
        const username = clients.get(socket);
        if (username) activeUsernames.delete(username);
        clients.delete(socket);
      });

      return response;
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        console.log("Server aborted.");
      } else {
        console.error("Unexpected error:", err.message);
      }
    } else {
      console.error("Unexpected error:", err);
    }
  }
}

function broadcast(message: string, sender: WebSocket) {
  const senderUsername = clients.get(sender) || "Unknown";
  for (const [client] of clients) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(formatMessage(senderUsername, message));
    }
  }
}
