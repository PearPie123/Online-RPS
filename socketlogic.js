//called to handle each new socket connection
exports.handleConnection = (io, socket,uuid) => {

  console.log("connection! yay")
  socket.join("lobby");
  io.to("lobby").emit("test","You are in the lobby");

  const connectedSockets = io.of("/").sockets;
  const gameRooms = [];

  for(const [id,socket] of connectedSockets) {
    socket.leave("lobby");//socket is undefined
    socket.join("game");
    const newRoom = uuid.v4();
    gameRooms.push(newRoom);
    socket.join(newRoom);
  }
  for(const room of gameRooms) {
    io.to(room).emit("test","you are in room: "+room);
  }

 
  
}