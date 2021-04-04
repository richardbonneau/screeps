let healer = {
  // Use the tower instead of this when it's available
  run: function (creep) {
    // console.log("creep.memory.order", creep.memory.order);
    switch (creep.memory.order) {
      case "go_home":
        // console.log("case go home");
        goHome();
        break;
      case "follow":
        // console.log("case attack");
        follow();
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
      // console.log("war");

      let alliedCreeps = creep.room.find(FIND_MY_CREEPS);
      let hurtCreeps = alliedCreeps.filter((cr) => cr.hits < cr.hitsMax);
      let hurtCreepsInRange = hurtCreeps.filter(cr=>cr.pos.inRangeTo(creep.pos,4))

      if (hurtCreepsInRange.length > 0) {
        let heal = creep.heal(hurtCreepsInRange[0]);
        if (heal === ERR_NOT_IN_RANGE) {
          creep.moveTo(hurtCreepsInRange[0], {
            maxRooms: 1,
            visualizePathStyle: {
              fill: "transparent",
              stroke: "#fff",
              lineStyle: "dashed",
              strokeWidth: 0.15,
              opacity: 0.1,
            },
          });
        }
      } else {

        let moveToFlag = creep.moveTo(healFlag, {
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

    function follow() {
      let warFlag = Game.flags["WarFlag"];
      if (warFlag.room !== creep.room) {
        // console.log("moving to flag");
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
      let alliedCreeps = creep.room.find(FIND_MY_CREEPS);
      let hurtCreeps = alliedCreeps.filter((cr) => cr.hits < cr.hitsMax);

      if (hurtCreeps.length > 0) {
        let heal = creep.heal(hurtCreeps[0]);
        if (heal === ERR_NOT_IN_RANGE) {
          creep.moveTo(hurtCreeps[0], {
            visualizePathStyle: {
              fill: "transparent",
              stroke: "#fff",
              lineStyle: "dashed",
              strokeWidth: 0.15,
              opacity: 0.1,
            },
          });
        }
      } else {
        
        let moveToAllied = creep.moveTo(alliedCreeps[0], {
          
          visualizePathStyle: {
            fill: "transparent",
            stroke: "#fff",
            lineStyle: "dashed",
            strokeWidth: 0.15,
            opacity: 0.1,
          },
        });
        console.log("move to allied creeps",moveToAllied)
      }
    }

    function war() {
      // Move to flag room
      let warFlag = Game.flags["WarFlag"];
      // console.log("war");

      if (warFlag.room !== creep.room) {
        // console.log("moving to flag");
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

    function stay() {
      let warFlag = Game.flags["WarFlag"];
      //   console.log("go home");
      let alliedCreeps = creep.room.find(FIND_MY_CREEPS);
      if (warFlag.room === creep.room) {
        let hurtCreeps = alliedCreeps.filter((cr) => cr.hits < cr.hitsMax);

        if (hurtCreeps.length > 0) {
          let heal = creep.heal(hurtCreeps[0]);
          if (heal === ERR_NOT_IN_RANGE) {
            creep.moveTo(hurtCreeps[0], {
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
        return;
      }
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

    function goHome() {
      let healFlag = Game.flags["HealFlag"];
      //   console.log("go home");
      let alliedCreeps = creep.room.find(FIND_MY_CREEPS);
        console.log("healFlag.room",healFlag.room,"creep.room",creep.room);
      if (healFlag.room === creep.room) {
        let hurtCreeps = alliedCreeps.filter((cr) => cr.hits < cr.hitsMax);

        if (hurtCreeps.length > 0) {
          let heal = creep.heal(hurtCreeps[0]);
          if (heal === ERR_NOT_IN_RANGE) {
            creep.moveTo(hurtCreeps[0], {
              maxRooms: 1,
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
        return;
      }

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

    function attack(target) {
      let attack = creep.attack(target);
      // console.log("attack", attack);
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

function healerTemplate() {
  return {
    parts: [HEAL, HEAL, MOVE, HEAL, HEAL, MOVE, HEAL, HEAL, MOVE],
    name: "wololo" + Game.time,
    memory: { memory: { role: "healer", order: "drain" } },
  };
}

module.exports = { healer, healerTemplate };
