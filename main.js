var spawner = require("spawner");
var tower = require("tower");
var liveCode = require("liveCode");
const { worker } = require("worker");
const { attacker } = require("attacker");
const { colonizer } = require("colonizer");
const { tank } = require("tank");
const { healer } = require("healer");

module.exports.loop = function () {
  let mainSource = Game.getObjectById("5bbcac5d9099fc012e635567");

  // Buildings
  for (let name in Game.rooms) {
    let room = Game.rooms[name];


    if (!room.controller.owner || room.controller.owner.username !== "RichyWow") continue;

    let allStructures = room.find(FIND_MY_STRUCTURES);
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
    if (creep.memory.role == "worker") worker.run(creep);
    else if (creep.memory.role == "attacker") attacker.run(creep);
    else if (creep.memory.role == "colonizer") colonizer.run(creep);
    else if (creep.memory.role == "tank") tank.run(creep);
    else if (creep.memory.role == "healer") healer.run(creep);
  }

  liveCode.run();
};
