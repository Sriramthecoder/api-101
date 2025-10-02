import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync } from 'fs';
import WebSocket, { WebSocketServer } from "ws";

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../../.env');

if (!existsSync(envPath)) {
  console.error('.env file missing');
  process.exit(1);
}

dotenv.config({ path: envPath });

// Assign the port
const PORT = process.env.WEBSOCKET_PORT || 3000;

// Create a variable and assign the websocket server
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    try {
      const req = JSON.parse(msg);

      if (req.action === "getUser") {
        // Example API: return user details
        const user = { id: req.data.id, name: "Alice", age: 25 };
        ws.send(JSON.stringify({ action: "getUserResponse", data: user }));
      }

      else if (req.action === "ping") {
        ws.send(JSON.stringify({ action: "pong" }));
      }

      else {
        ws.send(JSON.stringify({ error: "Unknown action" }));
      }
    } catch (e) {
      ws.send(JSON.stringify({ error: "Invalid JSON" }));
    }
  });

  ws.send(JSON.stringify({ message: "Connected to WebSocket API" }));
});

console.log(`WebSocket API running at ws://localhost:${PORT}`);
