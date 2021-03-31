let attacker = {
  // Use the tower instead of this when it's available
  run: function (creep) {
    // console.log("creep.memory.order", creep.memory.order);
    switch (creep.memory.order) {
      case "go_home":
        goHome();
      case "attack":
        war();
    }

    function goHome() {
      let flagDest = Game.flags["WarFlag"];
      // console.log("flagDest.room.id !== creep.room.id", flagDest.room !== creep.room);

      let moveToFlag = creep.moveTo(flagDest, {
        visualizePathStyle: {
          fill: "transparent",
          stroke: "#fff",
          lineStyle: "dashed",
          strokeWidth: 0.15,
          opacity: 0.1,
        },
      });
    }

    function war() {
      // Move to flag room
      let flagDest = Game.flags["WarFlag"];
      // console.log("flagDest.room.id !== creep.room.id", flagDest.room !== creep.room);

      if (flagDest.room !== creep.room) {
        let moveToFlag = creep.moveTo(flagDest, {
          visualizePathStyle: {
            fill: "transparent",
            stroke: "#fff",
            lineStyle: "dashed",
            strokeWidth: 0.15,
            opacity: 0.1,
          },
        });
      }

      // if creep is in same room has flag:
      let hostileStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
      let hostileTowers = hostileStructures.filter((struct) => struct.structureType === "tower");
      let hostileSpawns = hostileStructures.filter((struct) => struct.structureType === "spawn");
      let hostileExtensions = hostileStructures.filter(
        (struct) => struct.structureType === "extension"
      );
      let hostileControllers = hostileStructures.filter(
        (struct) => struct.structureType === "controller"
      );
      let hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);

      if (hostileSpawns.length > 0) {
        attack(hostileSpawns[0]);
      } else if (hostileTowers.length > 0) {
        attack(hostileTowers[0]);
      } else if (hostileCreeps.length > 0) {
        attack(hostileCreeps[0]);
      } else if (hostileExtensions.length > 0) {
        attack(hostileExtensions[0]);
      } else {
        goHome();
      }
    }

    function attack(target) {
      let attack = creep.attack(target);
      console.log("attack", attack);
      if (attack === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
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

function attackerTemplate() {
  return {
    parts: [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE],
    name: "Scout" + Game.time,
    memory: { memory: { role: "attacker", order: "attack", targetId: "" } },
  };
}

module.exports = { attacker, attackerTemplate };
