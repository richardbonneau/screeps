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
      let closestSource = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
      let harvest = creep.harvest(closestSource)

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

      if (transfer == ERR_NOT_IN_RANGE) {
        creep.moveTo(allDestinations[0]);
      }
    }
  },
};

function harvesterTemplate() {
  return {
    parts: [WORK, WORK,WORK, CARRY, CARRY, MOVE],
    name: "Harvester" + Game.time,
    memory: { memory: { role: "harvester", isHarvesting: false } },
  };
}
function emergencyHarvesterTemplate() {
  return {
    parts: [WORK, CARRY, MOVE],
    name: "EmergencyHarvester" + Game.time,
    memory: { memory: { role: "harvester", isHarvesting: false } },
  };
}

module.exports = { harvester, harvesterTemplate,emergencyHarvesterTemplate };
