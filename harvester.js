let harvester = {
  run: function (creep) {
    if (creep.store.getUsedCapacity() == 0 && creep.memory.isTransfering) {
      creep.memory.isTransfering = false;
      creep.say("Gather");
    } else if (creep.store.getFreeCapacity() == 0 && !creep.memory.isTransfering) {
      creep.memory.isTransfering = true;
      creep.say("Transfer");
    }

    if (creep.memory.isTransfering) goGiveEnergyToSpawn();
    else goHarvestEnergy();

    function goHarvestEnergy() {
      let closestSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      let harvest = creep.harvest(closestSource)
      console.log("harvester harvest",harvest)
      if (harvest == ERR_NOT_IN_RANGE) creep.moveTo(closestSource);
    }

    function goGiveEnergyToSpawn() {
      let allStructures = creep.room.find(FIND_STRUCTURES);

      let spawn1 = Game.spawns["Spawn1"];
      let allExtensions = allStructures.filter(
        (structure) => structure.structureType === "extension"
      );
      let allDestinations = [spawn1, ...allExtensions];
      allDestinations = allDestinations.filter(
        (dest) => dest.store.getFreeCapacity(RESOURCE_ENERGY) !== 0
      );

      let transfer = creep.transfer(allDestinations[0], RESOURCE_ENERGY);
        console.log("harvester transfer",transfer)
      if (transfer == ERR_NOT_IN_RANGE) {
        creep.moveTo(allDestinations[0]);
      }
    }
  },
};

function harvesterTemplate() {
  return {
    parts: [WORK, WORK, CARRY, CARRY, MOVE],
    name: "Harvester" + Game.time,
    memory: { memory: { role: "harvester", isHarvesting: false } },
  };
}

module.exports = { harvester, harvesterTemplate };
