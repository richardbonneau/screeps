let repairer = {
  run: function (creep) {
    if (creep.memory.isRepairing && creep.store.getUsedCapacity() == 0) {
      creep.memory.isRepairing = false;
      creep.say("Harvest");
    }
    if (!creep.memory.isRepairing && creep.store.getFreeCapacity() == 0) {
      creep.memory.isRepairing = true;
      creep.say("Repair");
    }

    if (creep.memory.isRepairing) {
      let allStructures = creep.room.find(FIND_STRUCTURES);
      let structuresToRepair = allStructures.filter((s) => {
        return s.hits < s.hitsMax && s.structureType !== "constructedWall";
      });

      if (structuresToRepair.length) {
        if (creep.repair(structuresToRepair[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(structuresToRepair[0]);
        }
      }
      else{
        // Move out of the way
        creep.moveTo(Game.flags["Flag1"]);
      }
    } else {
      let source;
      if (!creep.memory.isLongRange) {
        source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      } else {
        let allSources = creep.room.find(FIND_SOURCES_ACTIVE);
        let furthestDistance = 0;

        allSources.forEach((s) => {
          let distanceToSource = creep.pos.getRangeTo(s);
          if (distanceToSource > furthestDistance) {
            furthestDistance = distanceToSource;
            source = s;
          }
        });
      }

      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  },
};

function repairerTemplate() {
  return {
    parts: [WORK, WORK, CARRY, MOVE],
    name: "Repairer" + Game.time,
    memory: { memory: { role: "repairer", isRepairing: false } },
  };
}

module.exports = { repairer, repairerTemplate };
