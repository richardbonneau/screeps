let tank = {
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
      case "drain":
        // console.log("case attack");
        drain();
        break;
      case "stay":
        // console.log("case attack");
        stay();
        break;
      default:
        // console.log("nothing");
        break;
    }

    function drain() {
      // Move to flag room
      let warFlag = Game.flags["WarFlag"];
      let healFlag = Game.flags["HealFlag"];

      if (!creep.memory.reachedHealFlag) {
        if (creep.pos.inRangeTo(healFlag.pos, 3)) creep.memory.reachedHealFlag = true;
        let moveToFlag = creep.moveTo(healFlag, {
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

      // If creep just entered the room

      if(Game.getObjectById("6064c3cbdbd1e6a8f23f96d0")){
      console.log("towerOutOfEnergy",Game.getObjectById("6064c3cbdbd1e6a8f23f96d0").store[RESOURCE_ENERGY] <10)
      creep.memory.towerOutOfEnergy = Game.getObjectById("6064c3cbdbd1e6a8f23f96d0").store[RESOURCE_ENERGY] <10
      }
      if (creep.hits < 500) {
        
        creep.memory.needsHeals = true;
      } else if (creep.memory.needsHeals && creep.hits === creep.hitsMax) {
        creep.memory.needsHeals = false;
      }
      let otherTanks = creep.room
        .find(FIND_MY_CREEPS)
        .filter((cr) => cr.name.includes("CharDassaut"));
      let otherTanksWholeGame = [];
      for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.name.includes("CharDassaut")) otherTanksWholeGame.push(creep);
      }

      if (
        creep.memory.needsHeals ||
        (healFlag.room === creep.room && otherTanks.length < 2 && otherTanksWholeGame.length > 1)
      ) {
        let moveToFlag = creep.moveTo(healFlag, {
          visualizePathStyle: {
            fill: "transparent",
            stroke: "#fff",
            lineStyle: "dashed",
            strokeWidth: 0.15,
            opacity: 0.1,
          },
        });
      } else {
        let moveToFlag = creep.moveTo(warFlag, {
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

    function goHome() {
      let healFlag = Game.flags["HealFlag"];
      //   console.log("go home");

      let moveToFlag = creep.moveTo(healFlag, {
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

    function stay() {
      let warFlag = Game.flags["WarFlag"];
      
      //   console.log("go home");

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

    function war() {
      // Move to flag room
      let healFlag = Game.flags["HealFlag"];
      let warFlag = Game.flags["WarFlag"];
      //   console.log("war");

      if (warFlag.room !== creep.room) {
        // console.log("moving to flag");
        let moveToFlag = creep.moveTo(healFlag, {
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

      if (hostileTowers.length > 0) {
        attack(hostileTowers[0]);
      } else if (hostileSpawns.length > 0) {
        attack(hostileSpawns[0]);
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
      //   console.log("attack", attack);
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

function tankTemplate() {
  return {
    parts: [
      ATTACK,
      TOUGH,
      TOUGH,
      TOUGH,
      TOUGH,
      TOUGH,
      TOUGH,
      TOUGH,
      TOUGH,
      TOUGH,
      TOUGH,
      TOUGH,
      TOUGH,
      TOUGH,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
    ],
    name: "CharDassaut" + Game.time,
    memory: {
      memory: {
        role: "tank",
        order: "drain",
        stayAmount: 10,
        entryTime: 0,
        inWarRoom: false,
        needsHeals: false,
        reachedHealFlag: false,
        towerOutOfEnergy:false
      },
    },
  };
}

module.exports = { tank, tankTemplate };
