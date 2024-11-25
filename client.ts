export async function connectToServer(
  host: string = "localhost",
  port: number = 8000
) {
  let socket: WebSocket | null = null;

  function initializeConnection() {
    socket = new WebSocket(`ws://${host}:${port}`);
    console.log(
      "Type '/username <name>' to set your username (max 8 characters)."
    );

    socket.addEventListener("open", () => {
      console.log("Connected to server");
    });

    socket.addEventListener("message", (event) => {
      console.log(event.data);
    });

    socket.addEventListener("close", () => {
      console.log("Disconnected from server. Type 'reconnect' to retry.");
      socket = null;
    });

    socket.addEventListener("error", (err) => {
      console.error("WebSocket error:", err);
    });
  }

  async function handleInput(input: string) {
    if (input === "exit") {
      console.log("Disconnecting...");
      socket?.close();
      socket = null;
      return false;
    }

    if (input === "reconnect") {
      if (socket) {
        console.log("Already connected. No need to reconnect.");
      } else {
        await initializeConnection();
      }
      return true;
    }

    if (!socket) {
      console.log(
        "You are not connected. Type 'reconnect' to connect to the server."
      );
      return true;
    }
    try {
      socket.send(input);
    } catch (err) {
      console.error("Error sending message:", err);
    }
    return true;
  }

  await initializeConnection();

  const decoder = new TextDecoder();
  for await (const chunk of Deno.stdin.readable) {
    const input = decoder.decode(chunk).trim();
    const shouldContinue = await handleInput(input);
    if (!shouldContinue) break;
  }
}
