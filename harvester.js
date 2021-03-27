let harvester = {
  run: function (creep) {
    let allStructures = creep.room.find(FIND_STRUCTURES);
    
    if (creep.store.getUsedCapacity() == 0 && creep.memory.isTransfering) {
      creep.memory.isTransfering = false;
      creep.say("Gather");
    } else if (creep.store.getFreeCapacity() == 0 && !creep.memory.isTransfering) {
      creep.memory.isTransfering = true;
      creep.say("Transfer");
    }

    if (creep.memory.isTransfering) goGiveEnergyToSpawn();
    // if (creep.memory.isTransfering) goGiveEnergyToTower()
    else goHarvestEnergy();

    function goHarvestEnergy() {
      let closestSource = creep.pos.findClosestByRange(FIND_SOURCES);
      let harvest = creep.harvest(closestSource)

      if (harvest == ERR_NOT_IN_RANGE) creep.moveTo(closestSource);
    }

    function goGiveEnergyToSpawn() {
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
        
      } else if (transfer == ERR_INVALID_TARGET || transfer == ERR_FULL ){
        goGiveEnergyToTower()
      }
    }

    function goGiveEnergyToTower(){
      let allTowers = allStructures.filter(s=>s.structureType === "tower")
      let transfer = creep.transfer(allTowers[0], RESOURCE_ENERGY);
      console.log("transfer to tower",transfer)
      if (transfer == ERR_NOT_IN_RANGE) {
        creep.moveTo(allTowers[0]);
      }
    }
  },
};

function harvesterTemplate() {
  return {
    parts: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
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
