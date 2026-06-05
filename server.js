//build in module
import http from "node:http";
//tp read HTML
import fs from "node:fs/promises";
import path from "path";
import { WebSocketServer } from "ws";

const PORT = process.env.PORT ?? 9000;

//create http server
const httpServer = http.createServer(async function (req, res) {
  const indexFile = await fs.readFile(path.resolve("./index.html"), "utf-8");
  res.setHeader("Content-Type", "text/html");
  return res.end(indexFile); //read html file and send to frontend
});

const webServer = new WebSocketServer({ server: httpServer }); //webSocket server

//frontend send upgrade request, it will handle
webServer.on("connection", (websocket) => {
  console.log(`WebSocket Connection connected!`);
  //print when FT sends some message
  websocket.on("message", (data) => {
    console.log(`WebSocket Message Recieved `, data.toString());
    // websocket.send('hello from the server') //response to the client

    //chatApp
    // websocket.send(data.toString()); // resond to connection, this response to only the connection one client
    webServer.clients.forEach((client) => {
      client.send(data.toString()); //this broadcast messages  to all clients connected
    });
  });
});

//httpserver listen
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
