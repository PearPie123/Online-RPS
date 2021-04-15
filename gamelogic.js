
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

exports.getPersonalOutcomes = (player1, player2, outcome) => {
  const player1Result = ((outcome === 1)
                             ? "win"
                             : (outcome == 2)
                             ? "loss"
                             : "tie");
  const player2Result = ((outcome === 2)
                             ? "win"
                             : (outcome == 1)
                             ? "loss"
                             : "tie");
  const outcomes = {
    player1: {
      outcome: player1Result,
      oponentChoice: player2.choice
    },
    player2: {
      outcome: player2Result,
      oponentChoice: player1.choice
    }
  }                       
  return outcomes;  
}
