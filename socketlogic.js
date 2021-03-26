const gameLogic = require("./gamelogic")
//called to handle each new socket connection
exports.handleConnection = (io, socket,uuid) => {
  console.log("new connection")
  socket.on("play",() => {
    matchmake(io,socket,uuid);
  });

}

function matchmake(io,socket,uuid) {
  socket.join("lobby");
  io.to(socket.id).emit("test","You have entered matchmaking.");
  const connectedSocketsMap = io.of("/").sockets; //map of [id: socketObj] pairs
  const connectedSocketArray = [...connectedSocketsMap].map(([id, socket]) => {return socket}); //converted to array of socket objects
  const queuedSocketArray = connectedSocketArray.filter((socket) => {return socket.rooms.has("lobby")});//filters out all sockets not in the lobby/queue for matchmaking
  console.log(queuedSocketArray.length);
  const socketPairs = splitArray(queuedSocketArray, 2).filter((pair) => {return pair.length == 2});//split array into pairs and removed the ones with less than 2 sockets
  for(const socketPair of socketPairs) {//sends each pair to a randomly generated room and disconnects them from the lobby
    const roomId = uuid.v4();
    socketPair.forEach((socket) => {
      socket.join(roomId);
      socket.leave("lobby");

    });
    handleGame(socketPair, io); 
    io.to(roomId).emit("joined game", roomId);
  }
}

function handleGame (socketPair, io) {
  function outcomeWrapper(socket1, socket2, socket1Choice, socket2Choice) {
    if(socket1Choice != undefined && socket2Choice != undefined) {
      const outcome = gameLogic.getOutcome(socket1Choice,socket2Choice);
      const personalOutcomes = gameLogic.getPersonalOutcome(socket1, socket2, outcome);
      io.to(socket1.id).emit("outcome",personalOutcomes.socket1);
      io.to(socket2.id).emit("outcome",personalOutcomes.socket2);
    }
  }
  const socket1 = socketPair[0];
  const socket2 = socketPair[1];
  let socket1Choice;
  let socket2Choice;
  socket1.once("player choice",(choice) => {
    socket1Choice = choice;
    outcomeWrapper(socket1, socket2, socket1Choice, socket2Choice);
  });
  socket2.once("player choice",(choice) => {
    socket2Choice = choice
    outcomeWrapper(socket1, socket2, socket1Choice, socket2Choice);
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

