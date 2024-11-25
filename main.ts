import { startServer } from "./server.ts";
import { connectToServer } from "./client.ts";

if (import.meta.main) {
  const [command, action] = Deno.args;

  if (command === "broadcast-server") {
    switch (action) {
      case "start": {
        const port = Number(Deno.args[2]) || 8000;
        startServer(port);
        break;
      }
      case "connect": {
        const host = Deno.args[2] || "127.0.0.1";
        const port = Number(Deno.args[3]) || 8000;
        connectToServer(host, port);
        break;
      }
      default: {
        console.error("Invalid action. Use 'start' or 'connect'.");
      }
    }
  } else {
    console.error("Invalid command. Use 'broadcast-server'.");
  }
}
