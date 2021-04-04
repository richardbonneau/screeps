var { workerTemplate } = require("worker");
var { attackerTemplate } = require("attacker");
var { colonizerTemplate } = require("colonizer");
var { tankTemplate } = require("tank");
var { healerTemplate } = require("healer");

let spawner = {
  run: function (spawn) {
    let enemyController = Game.getObjectById("5bbcac6d9099fc012e6356ea");
    let warFlag = Game.flags["WarFlag"];
    let workersInRoom = 0;
    let attackersTotal = 0;
    let colonizersTotal = 0;
    let tanksTotal = 0;
    let healersTotal = 0;

    let creepsInRoom = spawn.room.find(FIND_MY_CREEPS)
    creepsInRoom.forEach(creep=> {

      if (creep.memory.role == "worker") {
        workersInRoom++;
      }
      if (creep.memory.role == "attacker") {
        attackersTotal++;
      }
      if (creep.memory.role == "colonizer") {
        colonizersTotal++;
      }
      if (creep.memory.role == "tank") {
        tanksTotal++;
      }
      if (creep.memory.role == "healer") {
        healersTotal++;
      }
    })

    // let creepsInRoom = room.find(FIND_MY_CREEPS)
    let energyAvailable = spawn.room.find(FIND_MY_STRUCTURES).reduce((accumulator, struct) => {
      if (struct.structureType === "extension") return accumulator + struct.store[RESOURCE_ENERGY];
      else if (struct.structureType === "spawn") return accumulator + struct.store[RESOURCE_ENERGY];
      else return accumulator;
    }, 0);
    console.log("energyAvailable", energyAvailable);
    // creepsInRoom.forEach(creep=>{
    //   if (creep.memory.role == "worker") {
    //     workersInRoom++;
    //   }
    //   if (creep.memory.role == "attacker") {
    //     attackersTotal++;
    //   }
    //   if (creep.memory.role == "colonizer") {
    //     colonizersTotal++;
    //   }
    //   if (creep.memory.role == "tank") {
    //     tanksTotal++;
    //   }
    //   if (creep.memory.role == "healer") {
    //     healersTotal++;
    //   }
    // })

    // let hostileCreeps = enemyController.room.find(FIND_HOSTILE_CREEPS);
    // hostileCreeps.forEach((cr) => {
    // console.log(Game.time - spawn.memory.lastAttackerTime);
    console.log(
      "colonizersTotal",
      colonizersTotal
    );

    // });
    if (workersInRoom < spawn.memory.amountWorkers) {
      produceCreep(workerTemplate());
    }
    // else if (tanksTotal < 2) {
    //   produceCreep(tankTemplate());
    // }
    // else if (healersTotal < 2) {
    //   produceCreep(healerTemplate());
    // }
    // else if (attackersTotal < 1) {
    //   produceCreep(attackerTemplate());
    // }
    // else if (colonizersTotal < 1) {
    //   spawn.memory.lastColonizerTime = Game.time;
    //   let produce = produceCreep(colonizerTemplate());
    //   console.log("produce", produce);
    // }
    //
    function produceCreep(template) {
      let parts = [];
      if (!template.qualityFirst) parts = template.parts;
      else {
        let costPerPartsCycle = template.parts.reduce((accumulator, currentPart) => {
          console.log(accumulator, currentPart, template.parts);
          switch (currentPart) {
            case "move":
              return accumulator + 50;
            case "work":
              return accumulator + 100;
            case "carry":
              return accumulator + 50;
            case "attack":
              return accumulator + 80;
            case "ranged_attck":
              return accumulator + 150;
            case "heal":
              return accumulator + 250;
            case "tough":
              return accumulator + 10;
            case "claim":
              return accumulator + 800;
          }
        }, 0);

        let numberOfCycles = Math.floor(energyAvailable / costPerPartsCycle);

        for (let i = 0; i < numberOfCycles; i++) {
          parts = [...parts, ...template.parts];
        }
        console.log("parts", parts);
      }
      console.log("parts", parts);
      return spawn.spawnCreep(parts, template.name, template.memory);
    }
  },
};

module.exports = spawner;
