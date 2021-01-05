const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const ws = require("express-ws");
const port = 8080;
ws(app);
app.use(express.static(path.join(__dirname,"client")));

app.get("/",(req,res) => {
  res.sendFile(path.join(__dirname,"client/index.html"));
});  

app.ws("/",(ws,req) => {
  ws.send("connection made from server")
  ws.on("message",(msg) => { 
    console.log(msg);
  });
});

app.listen(port,() => {
  console.log("server started!");
});