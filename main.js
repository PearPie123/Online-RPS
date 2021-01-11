const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const ws = require("express-ws");
const port = 8080;
const logic = require("./logic");
ws(app);

let choices = [];

app.use(express.static(path.join(__dirname,"client")));

app.get("/",(req,res) => {
  res.sendFile(path.join(__dirname,"client/index.html"));
});  

app.ws("/",(ws,req) => {
  ws.send("connection made from server")
  ws.on("message",(msg) => { 
    console.log(msg);
    if(msg==="r"||msg==="s"||msg==="p") {
      choices.push(msg);
      console.log(choices);
      console.log(logic.getOutcome(choices[0],choices[1]))
    }
  });
});

app.listen(port,() => {
  console.log(logic.getOutcome("s","r"));
  console.log("server started!");
});