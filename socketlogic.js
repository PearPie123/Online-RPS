const gameLogic = require("./gamelogic")
//called to handle each new socket connection
exports.handleConnection = (io, socket,uuid) => {
  console.log("new connection")
  
  let connectedSocketsAmount = io.of("/").sockets.size;
  io.emit("players online", connectedSocketsAmount);

  socket.on("play", (playerData) => {
    socket.customData = {};
    matchmake(io, socket, uuid, playerData);
    socket.on("return to menu", () =>{
      socket.leave(socket.customData.gameRoom);
    });
  });

  socket.on("disconnect",() => {
    connectedSocketsAmount = io.of("/").sockets.size;
    io.emit("players online", connectedSocketsAmount);
  });

}

function matchmake(io, socket, uuid, playerData) {
  socket.join("matchmaking");
  socket.customData.playerObj = new Player(socket, playerData);
  const connectedSocketsMap = io.of("/").sockets; //map of [id: socketObj] pairs
  const connectedSocketArray = [...connectedSocketsMap].map(([id, socket]) => {return socket}); //converted to array of socket objects
  const queuedSocketArray = connectedSocketArray.filter((socket) => {return socket.rooms.has("matchmaking")});//filters out all sockets not in the lobby/queue for matchmaking
  const socketPairs = splitArray(queuedSocketArray, 2).filter((pair) => {return pair.length == 2});//split array into pairs and removed the ones with less than 2 sockets
  if(socketPairs.length <=0) {
    return;
  }
  for(const socketPair of socketPairs) {//sends each pair to a randomly generated room and disconnects them from the lobby
    const roomId = uuid.v4();
    let playerPair = [];
    socketPair.forEach((socket) => {
      playerPair.push(socket.customData.playerObj);
      socket.customData.gameRoom = roomId;
      socket.join(roomId);
      socket.leave("matchmaking");
      const gameData = {
        oponentUsername: socketPair[Math.abs(socketPair.indexOf(socket)-1)].customData.playerObj.clientData.username
      }
      console.log(gameData.oponentUsername)
      io.to(socket.id).emit("joined game", gameData);
    });
    handleGame(playerPair, io); 
  }
}

function handleGame (playerPair, io) {
  function outcomeHandler(player1, player2) { //takes outcomes and emits personalized outcome (win/loss/tie) to each player
    if(player1.choice != undefined && player2.choice != undefined) {
      const outcome = gameLogic.getOutcome(player1.choice, player2.choice);
      const personalOutcomes = gameLogic.getPersonalOutcomes(player1, player2, outcome);
      io.to(player1.socket.id).emit("outcome", JSON.stringify(personalOutcomes.player1));
      io.to(player2.socket.id).emit("outcome", JSON.stringify(personalOutcomes.player2));
    }
  }
  const player1 = playerPair[0];
  const player2 = playerPair[1];
  player1.socket.once("player choice",(choice) => {
    player1.setChoice(choice);
    outcomeHandler(player1, player2);
  });
  player2.socket.once("player choice",(choice) => {
    player2.setChoice(choice);
    outcomeHandler(player1, player2);
  });
}

function splitArray(array, size) {
  let newArr = [];
  array.reduce((lastVal,currentVal,index,arr) => {
    if ((index % size) === 0) {
      newArr.push(arr.slice(index,index+size));
    }
  },[]);
  return newArr;
}

class Player {
  constructor(socket, clientData) {
    this.socket = socket;
    this.clientData = JSON.parse(clientData);
  }
  setChoice = (choice) => {
    this.choice = choice;
  }
}

