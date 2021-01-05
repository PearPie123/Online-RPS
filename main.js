const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const port = 8080;

app.get("/",(req,res) => {
  res.sendFile(path.join(__dirname,"client/index.html"));
});  
app.listen(port,() => {
  console.log("server started!");
});