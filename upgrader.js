let upgrader = {
  run: function (creep) {
    if (creep.store.getUsedCapacity() == 0 && creep.memory.isUpgrading) {
      creep.memory.isUpgrading = false;
      creep.say("Gather");
    } else if (!creep.memory.isUpgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.isUpgrading = true;
      creep.say("Upgrade");
    }

    if (creep.memory.isUpgrading) goGiveEnergyToController();
    else goHarvestEnergy();

    function goHarvestEnergy() {
      let closestSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      let harvest = creep.harvest(closestSource)
      console.log("upgrader harvest",harvest)
      if (harvest == ERR_NOT_IN_RANGE) creep.moveTo(closestSource);
    }

    function goGiveEnergyToController() {
      let roomController = creep.room.controller;
      let upgrade = creep.upgradeController(roomController)
      console.log("upgrader upgrade",upgrade)
      if (upgrade == ERR_NOT_IN_RANGE) {
        creep.moveTo(roomController);
      }
    }
  },
};

function upgraderTemplate() {
  return {
    parts: [WORK, WORK,WORK,CARRY, CARRY, CARRY, MOVE],
    name: "Upgrader" + Game.time,
    memory: { memory: { role: "upgrader", isUpgrading: false, isLongDistance: true } },
  };
}

module.exports = { upgrader, upgraderTemplate };
