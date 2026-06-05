//build in module
import http from "node:http";
//to read HTML
import fs from "node:fs/promises";
import path from "path";
import { WebSocketServer } from "ws";
import { redisPublish, redisSubsribe } from "./connection.js";
import { channel } from "node:diagnostics_channel";

const PORT = process.env.PORT ?? 9000;
const REDIS_CHANNEL = ws - messages;

//create http server
const httpServer = http.createServer(async function (req, res) {
  const indexFile = await fs.readFile(path.resolve("./index.html"), "utf-8");
  res.setHeader("Content-Type", "text/html");
  return res.end(indexFile); //read html file and send to frontend
});

const webServer = new WebSocketServer({ server: httpServer }); //webSocket server(stateFull)

//subscribe
redisSubsribe.subscribe(REDIS_CHANNEL);
redisSubsribe.on("message", (channel, message) => {
  if (channel === REDIS_CHANNEL) {
    //broadcast  message to connected clients
    webServer.clients.forEach((client) => {
      client.send(message.toString());
    });
  }
});

//frontend send upgrade request, it will handle
webServer.on("connection", (websocket) => {
  console.log(`WebSocket Connection connected!`);
  //print when FT sends some message

  //only to conncted clients
  websocket.on("message", async (data) => {
    console.log(`WebSocket Message Recieved `, data.toString());
    // websocket.send('hello from the server') //response to the client

    //chatApp
    // websocket.send(data.toString()); // resond to connection, this response to only the connection one client
    // webServer.clients.forEach((client) => {
    //   client.send(data.toString()); //this broadcast messages  to all clients connected
    // });

    //rely message to redis server(broker)
    console.log(`Relaying Messages to broker...`);
    //to publish a message it needs a channel: ws-messages
    await redisPublish.publish("REDIS_CHANNEL ", data.toString());
  });
});

//httpserver listen
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
