const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
  console.log("Connected to API");

  // Call "getUser" API
  ws.send(JSON.stringify({ action: "getUser", data: { id: 123 } }));

  // Call "ping" API
  ws.send(JSON.stringify({ action: "ping" }));
});

ws.on("message", (msg) => {
  console.log("Response:", msg.toString());
});
