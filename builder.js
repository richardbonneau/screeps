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
          creep.moveTo(targets[0], {
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
    } else {
      let source;
      if (!creep.memory.isLongRange) {
        source = creep.pos.findClosestByRange(FIND_SOURCES);
      } else {
        let allSources = creep.room.find(FIND_SOURCES);
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
        creep.moveTo(source, {
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

function builderTemplate() {
  return {
    parts: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    name: "Builder" + Game.time,
    memory: { memory: { role: "builder", isBuilding: false, isLongRange: false } },
  };
}

module.exports = { builder, builderTemplate };
