const socket = io();
socket.on("test",msg => console.log(msg));
const playButton = document.getElementById("play");
const statusDiv = document.getElementById("status");
const choiceBtns = document.getElementsByClassName("moveChoice");
const playersOnlineStatus = document.getElementById("playersOnline");
for(let btn of choiceBtns) {
  btn.onclick = () => {socket.emit("player choice",btn.id);}
}
playButton.onclick = () => {
  socket.emit("play");
  statusDiv.textContent = "joining game...";
}
socket.on("joined game",(room) => {
  statusDiv.textContent = `Joined game ${room}, enter choice now`;
});

socket.on("outcome", (outcome) => {
  statusDiv.textContent = "Outcome of game: " + outcome;
});

socket.on("players online", (numPlayers) => {
  playersOnlineStatus.textContent = `Players online: ${numPlayers}`;
});