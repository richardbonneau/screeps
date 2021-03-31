var { workerTemplate } = require("worker");
var { attackerTemplate } = require("attacker");
var { colonizerTemplate } = require("colonizer");

let spawner = {
  run: function (spawn) {
    let enemyControllerUpgradeBlocked = Game.getObjectById("5bbcac6d9099fc012e6356ea")
      .upgradeBlocked;
    let workersInRoom = 0;
    let attackersTotal = 0;
    let colonizersTotal = 0;

    for (let name in Game.creeps) {
      let creep = Game.creeps[name];
      if (creep.memory.role == "worker") {
        workersInRoom++;
      }
      if (creep.memory.role == "attacker") {
        attackersTotal++;
      }
      if (creep.memory.role == "colonizer") {
        colonizersTotal++;
      }
    }
    console.log("enemyControllerUpgradeBlocked", enemyControllerUpgradeBlocked);
    if (workersInRoom < 3) {
      produceCreep(workerTemplate());
    } else if (attackersTotal < 1) {
      produceCreep(attackerTemplate());
    } else if (colonizersTotal < 1 && enemyControllerUpgradeBlocked < 200) {
      produceCreep(colonizerTemplate());
    }
    //
    function produceCreep(template) {
      return spawn.spawnCreep(template.parts, template.name, template.memory);
    }
  },
};

module.exports = spawner;
