var { harvester } = require("harvester");
var { upgrader } = require("upgrader");
var { builder } = require("builder");
var { repairer } = require("repairer");
var spawner = require("spawner");
var tower = require("tower");

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
    if (creep.memory.role == "harvester") harvester.run(creep);
    else if (creep.memory.role == "upgrader") upgrader.run(creep);
    else if (creep.memory.role == "builder") builder.run(creep);
    else if (creep.memory.role == "repairer") repairer.run(creep);
  }

};
