var spawner = require("spawner");
var tower = require("tower");
var liveCode = require("liveCode");
const { worker } = require("worker");

module.exports.loop = function () {
  // Buildings
  for (let name in Game.rooms) {
    let room = Game.rooms[name];

    let allStructures = room.find(FIND_STRUCTURES);
    let allTowers = allStructures.filter((s) => s.structureType === "tower");
    allTowers.forEach((t) => {
      tower.run(t);
    });

    let allSpawns = allStructures.filter((s) => s.structureType === "spawn");
    allSpawns.forEach((s) => {
      spawner.run(s);
    });
  }

  //Creeps
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    if (creep.memory.role == "worker") worker.run(creep)
  }
  
  
  liveCode.run()

};
