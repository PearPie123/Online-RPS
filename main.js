const path = require("path");
const express = require("express");
const uuid = require("uuid");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const gameLogic = require("./gamelogic");
const socketLogic = require("./socketlogic");
const port = 8080;




app.use(express.static(path.join(__dirname,"client")));

app.get("/",(req,res) => {
  res.sendFile(path.join(__dirname,"client/index.html"));
});  

const handleConnectionWrapper = (socket) => {
  socketLogic.handleConnection(io,socket,uuid);
}

io.on("connection",handleConnectionWrapper);

http.listen(port,() => {
  console.log(`server started on port ${port}.`);
});