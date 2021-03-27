var { harvester } = require("harvester");
var { upgrader } = require("upgrader");
var { builder } = require("builder");
var { repairer } = require("repairer");
var spawner = require("spawner");
var tower = require("tower");

module.exports.loop = function () {
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    if (creep.memory.role == "harvester") harvester.run(creep);
    else if (creep.memory.role == "upgrader") upgrader.run(creep);
    else if (creep.memory.role == "builder") builder.run(creep);
    else if (creep.memory.role == "repairer") repairer.run(creep);
  }

  var spawn = Game.spawns["Spawn1"];
  spawner.run(spawn);

  
  let room;
  for(let name in Game.rooms){
    room = Game.rooms[name]
  }
  let allStructures = room.find(FIND_STRUCTURES);
  let theTower = allStructures.filter(s=>s.structureType === "tower")[0]
  tower.run(theTower);

};
