const socket = io();
const playButton = document.getElementById("play");
const nameInput = document.getElementById("name");
const menuContainer = document.getElementById("menuContainer");
const gameContainer = document.getElementById("gameContainer");
const choiceBtns = document.getElementsByClassName("moveChoice");
const playersOnlineStatus = document.getElementById("playersOnline");
const playerStatus = document.getElementById("playerStatus");
const oponentStatus = document.getElementById("oponentStatus");

socket.on("test",msg => console.log(msg));
for(let btn of choiceBtns) {
  btn.onclick = () => {
    socket.emit("player choice",btn.id);
    playerStatus.textContent = `Choice: ${btn.textContent}`;
  }
}
playButton.onclick = () => {
  socket.emit("play");
  menuContainer.classList.remove("mainContainerVisible");
  menuContainer.classList.add("mainContainerHidden");
  gameContainer.classList.remove("mainContainerHidden");
  gameContainer.classList.add("mainContainerVisible");
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