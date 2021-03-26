
exports.getOutcome = (choice1, choice2) => { //1 if choice1 wins, 2 if choice 2 wins, 0 if tie 
  return (choice1 === choice2)
    ? 0
    : (choice1 === "r" && choice2 === "s")
    ? 1
    : (choice1 === "r" && choice2 ==="p")
    ? 2
    : (choice1 === "p" && choice2 ==="r")
    ? 1
    : (choice1 === "p" && choice2 ==="s")
    ? 2
    : (choice1 === "s" && choice2 ==="p")
    ? 1
    : 2
};

exports.getPersonalOutcome = (socket1, socket2, outcome) => {
  const socket1Result = ((outcome === 1)
                             ? "win"
                             : (outcome == 2)
                             ? "loss"
                             : "tie");
  const socket2Result = ((outcome === 2)
                             ? "win"
                             : (outcome == 1)
                             ? "loss"
                             : "tie");
  const outcomes = {
    socket1: socket1Result,
    socket2: socket2Result
  }                       
  return outcomes;  
}

exports.outcomeWrapper = (socket1, socket2, socket1Choice, socket2Choice) => {
  if(socket1Choice != undefined && socket2Choice != undefined) {
    const outcome = gameLogic.getOutcome(socket1Choice,socket2Choice);
    const personalOutcomes = gameLogic.getPersonalOutcome(socket1, socket2, outcome);
    io.to(socket1.id).emit("test",personalOutcome.socket1);
    io.to(socket2.id).emit("test",personalOutcome.socket2);
  }
}