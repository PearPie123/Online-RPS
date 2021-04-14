const socket = io();
const playButton = document.getElementById("play");
const nameInput = document.getElementById("name");
const menuContainer = document.getElementById("menuContainer");
const gameContainer = document.getElementById("gameContainer");
const choiceBtns = document.getElementsByClassName("moveChoice");
const playersOnlineStatus = document.getElementById("playersOnline");
const playerStatus = document.getElementById("playerStatus");
const oponentStatus = document.getElementById("oponentStatus");
const gameOutcome = document.getElementById("gameOutcome");

function switchContainers(menuContainer, gameContainer) {
  menuContainer.classList.add("mainContainerHidden");
  menuContainer.classList.remove("mainContainerVisible")
  gameContainer.classList.remove("mainContainerHidden");
  gameContainer.classList.add("mainContainerVisible");
}
socket.on("test",msg => console.log(msg));

for(let btn of choiceBtns) {
  btn.onclick = () => {
    socket.emit("player choice",btn.id);
    playerStatus.textContent = `Choice: ${btn.textContent}`;
  }
}

playButton.onclick = () => {
  const playerData = {
    username: nameInput.value,
  }
  switchContainers(menuContainer, gameContainer);
  socket.emit("play", JSON.stringify(playerData));

}
socket.on("joined game",(gameData) => {
  
});

socket.on("outcome", (outcome) => {
  gameOutcome.textContent = "Outcome of game: " + outcome;
});

socket.on("players online", (numPlayers) => {
  playersOnlineStatus.textContent = `Players online: ${numPlayers}`;
});