let webSocket = new WebSocket("wss://online-rps.aidanroberts2.repl.co");

webSocket.onopen = (event) => {
  webSocket.send("connection opened")
}
webSocket.onmessage = (msg) => {
  console.log(msg.data);
}
webSocket.onerror = (err) => {
  console.log("ERR: " + err);
};

const choiceBtns = document.querySelectorAll("button");
console.log(choiceBtns)
choiceBtns.forEach((btn) => {
  btn.onclick = (evnt) => {webSocket.send(btn.id)}  
  console.log(btn);
});