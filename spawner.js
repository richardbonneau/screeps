var { builderTemplate, longRangeBuilderTemplate } = require("builder");
var { upgraderTemplate } = require("upgrader");
var { harvesterTemplate } = require("harvester");
var { repairerTemplate } = require("repairer");

let spawner = {
  run: function (spawn) {
    let constructionSites = spawn.room.find(FIND_CONSTRUCTION_SITES);
    let allStructures = spawn.room.find(FIND_STRUCTURES);
    let structuresToRepair = allStructures.filter((s) => s.hits < s.hitsMax);

    let buildersInRoom = 0;
    let upgradersInRoom = 0;
    let harvestersInRoom = 0;
    let repairerInRoom = 0;

    for (name in Game.creeps) {
      let creep = Game.creeps[name];
      if (creep.memory.role == "harvester") {
        harvestersInRoom++;
      } else if (creep.memory.role == "builder") buildersInRoom++;
      else if (creep.memory.role == "upgrader") upgradersInRoom++;
      else if (creep.memory.role == "repairer") repairerInRoom++;
    }

    if (harvestersInRoom < 1) produceCreep(harvesterTemplate());
    if (buildersInRoom < 1 && constructionSites.length > 0) produceCreep(builderTemplate());
    if (repairerInRoom < 1 && structuresToRepair.length > 0) produceCreep(repairerTemplate());
    if (upgradersInRoom < 3) produceCreep(upgraderTemplate());

    function produceCreep(template) {
      spawn.spawnCreep(template.parts, template.name, template.memory);
    }
  },
};

module.exports = spawner;
