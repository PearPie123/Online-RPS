const socket = io();
const playButton = document.getElementById("play");
const nameInput = document.getElementById("name");
const menuContainer = document.getElementById("menuContainer");
const gameContainer = document.getElementById("gameContainer");
const choiceBtns = document.getElementsByClassName("moveChoice");
const playersOnlineStatus = document.getElementById("playersOnline");
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
    Array.from(choiceBtns).forEach(btn => {
      btn.disabled = true;  
    });
    btn.classList.add("chosenChoice");
  }
}

playButton.onclick = () => {
  const playerData = {
    username: nameInput.value,
  }
  switchContainers(menuContainer, gameContainer);
  document.getElementById("userUsername").textContent = playerData.username;
  socket.emit("play", JSON.stringify(playerData));

}
socket.on("joined game",(gameData) => {
  const oponentUsername = document.getElementById("oponentUsername");
  oponentUsername.textContent = gameData.oponentUsername;
});

socket.on("outcome", (outcomeData) => {
  const outcomeObj = JSON.parse(outcomeData);
  document.getElementById("oponent"+outcomeObj.oponentChoice).classList.add("chosenChoice");
  gameOutcome.textContent = `Outcome of game: ${outcomeObj.outcome}`;
});

socket.on("players online", (numPlayers) => {
  playersOnlineStatus.textContent = `Players online: ${numPlayers}`;
});