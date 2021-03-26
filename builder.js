let builder = {
  run: function (creep) {
    let listPriorities = ["605e2b25697f84e1b36f5eee", "605e2b225ead6e3a64b94018"];

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
      // listPriorities = listPriorities.filter(site=>Game.getById(site).)
      // if(listPriorities.length > 0){
      //   targets = listPriorities
      // }
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }
    } else {
      let source;
      if (!creep.memory.isLongRange) {
        source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
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

function builderTemplate() {
  return {
    parts: [WORK, WORK, WORK, CARRY, CARRY, MOVE],
    name: "Builder" + Game.time,
    memory: { memory: { role: "builder", isBuilding: false, isLongRange: false } },
  };
}

module.exports = { builder, builderTemplate };
