let attacker = {
  // Use the tower instead of this when it's available
  run: function (creep) {
    // console.log("creep.memory.order", creep.memory.order);
    switch (creep.memory.order) {
      case "go_home":
        // console.log("case go home");
        goHome();
        break;
      case "attack":
        // console.log("case attack");
        war();
        break;
      default:
        // console.log("nothing");
        break;
    }

    function goHome() {
      let attackerFlag = Game.flags["AttackerFlag"];
      let healFlag = Game.flags["HealFlag"];
      if (creep.room === healFlag.room && creep.hits < creep.hitsMax) {
        let moveToFlag = creep.moveTo(healFlag, {
          maxRooms: 1,
          visualizePathStyle: {
            fill: "transparent",
            stroke: "#fff",
            lineStyle: "dashed",
            strokeWidth: 0.15,
            opacity: 0.1,
          },
        });
        return;
      }

      if (creep.room === healFlag.room) {
        let moveToFlag = creep.moveTo(attackerFlag, {
          visualizePathStyle: {
            maxRooms: 1,
            fill: "transparent",
            stroke: "#fff",
            lineStyle: "dashed",
            strokeWidth: 0.15,
            opacity: 0.1,
          },
        });
        return;
      }

      let moveToFlag = creep.moveTo(attackerFlag, {
        visualizePathStyle: {
          fill: "transparent",
          stroke: "#fff",
          lineStyle: "dashed",
          strokeWidth: 0.15,
          opacity: 0.1,
        },
      });
      return;
    }

    function war() {
      console.log("war");
      // Move to flag room
      let flagDest = Game.flags["GateFlag"];

      if (flagDest.room !== creep.room) {
        // console.log("moving to flag");
        let moveToFlag = creep.moveTo(flagDest, {
          visualizePathStyle: {
            fill: "transparent",
            stroke: "#fff",
            lineStyle: "dashed",
            strokeWidth: 0.15,
            opacity: 0.1,
          },
        });
        return;
      }

      // if creep is in same room has flag:
      let hostileConstructionSites = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
      let hostileStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
      let hostileTowers = hostileStructures.filter((struct) => struct.structureType === "tower");
      let hostileSpawns = hostileStructures.filter((struct) => struct.structureType === "spawn");
      let hostileExtensions = hostileStructures.filter(
        (struct) => struct.structureType === "extension"
      );
      let hostileRamparts = hostileStructures.filter(
        (struct) => struct.structureType === "rampart"
      );
      let hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
      let closeHostileCreeps = hostileCreeps.filter((cr) => cr.pos.inRangeTo(creep.pos, 1));

      let personalTarget = Game.getObjectById(creep.memory.targetId);
      console.log("personalTarget",personalTarget,creep.memory.targetId)
      if (closeHostileCreeps.length > 0) {
        attack(closeHostileCreeps[0]);
      } else if (personalTarget) {
        attack(personalTarget);
      } else if (hostileTowers.length > 0) {
        attack(hostileTowers[0]);
      } else if (hostileSpawns.length > 0) {
        attack(hostileSpawns[0]);
      }
      // else if (hostileConstructionSites.length > 0) {
      //   attack(hostileConstructionSites[0]);
      // }
      // else if (hostileCreeps.length > 0) {
      //   attack(hostileCreeps[0]);
      // }
      else if (hostileExtensions.length > 0) {
        attack(hostileExtensions[0]);
      } else if (hostileRamparts.length > 0) {
        attack(hostileRamparts[0]);
      } else {
        wait();
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

    function wait(){
      let warFlag = Game.flags["WarFlag"];
        let moveToFlag = creep.moveTo(warFlag, {
          visualizePathStyle: {
            fill: "transparent",
            stroke: "#fff",
            lineStyle: "dashed",
            strokeWidth: 0.15,
            opacity: 0.1,
          },
        });
        return;
      
    }
  },
};

function attackerTemplate() {
  return {
    parts: [
      ATTACK,
      // ATTACK,
      MOVE,
      ATTACK,
      // ATTACK,
      MOVE,
      ATTACK,
      // ATTACK,
      MOVE,
      ATTACK,
      // ATTACK,
      MOVE,
      ATTACK,
      // ATTACK,
      MOVE,
      ATTACK,
      // ATTACK,
      MOVE,
      ATTACK,
      // ATTACK,
      MOVE,
      ATTACK,
      // ATTACK,
      MOVE,
    ],
    name: "Scout" + Game.time,
    memory: {
      memory: { role: "attacker", order: "go_home", targetId: "6064e133573415f54cc24cc5" },
    },
  };
}

module.exports = { attacker, attackerTemplate };
