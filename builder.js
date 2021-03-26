let builder = {
  run: function (creep) {
    if (creep.memory.isBuilding && creep.store.getUsedCapacity() == 0) {
      creep.memory.isBuilding = false;
      creep.say("Harvest");
    }
    if (!creep.memory.isBuilding && creep.store.getFreeCapacity() == 0) {
      creep.memory.isBuilding = true;
      creep.say("Build");
    }

    if (creep.memory.isBuilding) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { maxOps: 9000 });
        }
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
        creep.moveTo(source, { maxOps: 9000 });
      }
    }
  },
};

function builderTemplate() {
  return {
    parts: [WORK, WORK, CARRY, MOVE],
    name: "Builder" + Game.time,
    memory: { memory: { role: "builder", isBuilding: false, isLongRange: false } },
  };
}
function longRangeBuilderTemplate() {
  return {
    parts: [WORK, CARRY, MOVE, MOVE, MOVE],
    name: "BuilderLongRange" + Game.time,
    memory: { memory: { role: "builder", isBuilding: false, isLongRange: true } },
  };
}

module.exports = { builder, builderTemplate, longRangeBuilderTemplate };
