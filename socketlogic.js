//called to handle each new socket connection
exports.handleConnection = (io, socket,uuid) => {

  console.log("connection! yay")
  socket.join("lobby");
  io.to("lobby").emit("test","You are in the lobby");

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
      io.to(roomId).emit("test", `You are in room ${roomId} with these ppl in it ${socketPair}`);
    }); 
  }
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

