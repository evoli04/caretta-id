const fs = require("fs");
const path = require("path");

class TurtleService {
  constructor() {
    this.dataPath = path.join(__dirname, "../data/turtles.json");
  }

  getAllTurtles() {
    const rawData = fs.readFileSync(this.dataPath, "utf-8");
    return JSON.parse(rawData);
  }

  findTurtleById(id) {
    const turtles = this.getAllTurtles();
    return turtles.find((turtle) => turtle.id === id);
  }
}

module.exports = new TurtleService();