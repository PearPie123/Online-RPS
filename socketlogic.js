//called to handle each new socket connection
exports.handleConnection = (io, socket,uuid) => {

  console.log("connection! yay")
  socket.join("lobby");
  io.to("lobby").emit("test","You are in the lobby");

  const queuedSockets = io.of("/").in("lobby").sockets;
  console.log();
  if (queuedSockets.size >= 2) {
    let socketPairs = [];
    for ([id,socket] of queuedSockets) {
     if (socketPairs.some(elem => elem.length === 1)) {
       let newRoom = uuid.v4();
       
     }
    }    
  }
//  let testArr = [1,2,3,4,5,6];
// let paired = [];

// testArr.reduce((lastVal,currentVal,index,arr) => {
//   if ((index % 2) === 0) {
//     paired.push(arr.slice(index,index+2));
//   }
// },[]);
// console.log(paired)
 
}

