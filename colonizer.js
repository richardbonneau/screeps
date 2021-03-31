let colonizer = {
  // Use the tower instead of this when it's available
  run: function (creep) {
    console.log("creep.memory.order", creep.memory.order);

    // Move to flag room
    let flagDest = Game.flags["WarFlag"];
    console.log("flagDest", flagDest);

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
      return;
    }

    // if creep is in same room has flag:
    let allStructures = creep.room.find(FIND_STRUCTURES);
    let controller = allStructures.filter((struct) => struct.structureType === "controller")[0];

    switch (creep.memory.order) {
      case "colonize":
        console.log("going home");
      case "reserve":
        reserve(controller);
      case "attack":
        attackController(controller);
    }

    function reserve(target) {
      let reserveController = creep.reserveController(target);
      if (reserveController === ERR_NOT_IN_RANGE) {
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

    function claim(target) {
      let claimController = creep.claim(target);
      if (claimController === ERR_NOT_IN_RANGE) {
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

    function attackController(target) {
      let attackController = creep.attackController(target);
      console.log("attackController", attackController);
      if (attackController === ERR_NOT_IN_RANGE) {
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

function colonizerTemplate() {
  return {
    parts: [CLAIM, CLAIM, MOVE, MOVE],
    name: "Colonizer" + Game.time,
    memory: { memory: { role: "colonizer", order: "reserve", targetId: "" } },
  };
}

module.exports = { colonizer, colonizerTemplate };
