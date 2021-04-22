const socket = io();
const playButton = document.getElementById("play");
const nameInput = document.getElementById("name");
const menuContainer = document.getElementById("menuContainer");
const matchmakingContainer = document.getElementById("matchmakingContainer");
const gameContainer = document.getElementById("gameContainer");
const choiceBtns = document.getElementsByClassName("moveChoice");
const oponentChoiceBtns = document.getElementsByClassName("oponentChoice");
const gameOutcome = document.getElementById("gameOutcome");
const returnToMenuBtn = document.getElementById("returnToMenu");
const userUsername = document.getElementById("userUsername");
const oponentUsername = document.getElementById("oponentUsername");

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
  switchContainers(menuContainer, matchmakingContainer);
  userUsername.textContent = playerData.username;
  socket.emit("play", JSON.stringify(playerData));

}
socket.on("joined game",(gameData) => {
  switchContainers(matchmakingContainer, gameContainer)
  oponentUsername.textContent = gameData.oponentUsername;
});

socket.on("outcome", (outcomeData) => {
  const outcomeObj = JSON.parse(outcomeData);
  document.getElementById("oponent" + outcomeObj.oponentChoice).classList.add("chosenChoice");
  gameOutcome.textContent = `Outcome of game: ${outcomeObj.outcome}`;
});

socket.on("players online", (numPlayers) => {
  const elemsToUpdate = document.getElementsByClassName("playersOnline");
  for(const elem of elemsToUpdate) {
    elem.textContent = numPlayers;
  }
});
returnToMenuBtn.onclick = () => {
  socket.emit("return to menu");
  switchContainers(gameContainer, menuContainer);
  gameOutcome.textContent = "";
  userUsername.textContent = "";
  oponentUsername.textContent = "";
  for(const btn of choiceBtns) {
    btn.disabled = false;
    btn.classList.remove("chosenChoice");
  }
  for(const btn of oponentChoiceBtns) {
    btn.classList.remove("chosenChoice");
  }
};