
exports.getOutcome = (choice1, choice2) => {
  return (choice1 === choice2)
    ? "tie"
    : (choice1 === "r" && choice2 === "s")
    ? "first"
    : (choice1 === "r" && choice2 ==="p")
    ? "second"
    : (choice1 === "p" && choice2 ==="r")
    ? "first"
    : (choice1 === "p" && choice2 ==="s")
    ? "second"
    : (choice1 === "s" && choice2 ==="p")
    ? "first"
    : "second"
};