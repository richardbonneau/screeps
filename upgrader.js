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
      let closestSource = creep.pos.findClosestByRange(FIND_SOURCES);

      let harvest = creep.harvest(closestSource);

      if (harvest == ERR_NOT_IN_RANGE)
        creep.moveTo(closestSource, {
          visualizePathStyle: {
            fill: "transparent",
            stroke: "#fff",
            lineStyle: "dashed",
            strokeWidth: 0.15,
            opacity: 0.1,
          },
        });
    }

    function goGiveEnergyToController() {
      let roomController = creep.room.controller;
      let upgrade = creep.upgradeController(roomController);

      if (upgrade == ERR_NOT_IN_RANGE) {
        creep.moveTo(roomController, {
          visualizePathStyle: {
            fill: "transparent",
            stroke: "#fff",
            lineStyle: "dashed",
            strokeWidth: 0.15,
            opacity: 0.1,
          },
        });
      }
    }
  },
};

function upgraderTemplate() {
  return {
    parts: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
    name: "Upgrader" + Game.time,
    memory: { memory: { role: "upgrader", isUpgrading: false, isLongDistance: true } },
  };
}

module.exports = { upgrader, upgraderTemplate };
