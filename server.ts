const clients = new Set<WebSocket>();

const handler = (ws: WebSocket): void => {
  clients.add(ws);
  ws.onmessage = (e) => {
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log(`Sending message to client: ${e.data}`);
        client.send(e.data);
      }
    }
  };
  ws.onclose = () => clients.delete(ws);
};

Deno.serve({ port: 8789 }, (req) => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  handler(socket);
  return response;
});
