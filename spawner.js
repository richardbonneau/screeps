var { workerTemplate } = require("worker");


let spawner = {
  run: function (spawn) {
    let workersInRoom = 0;

    for (let name in Game.creeps) {
      let creep = Game.creeps[name];
      if (creep.memory.role == "worker") {
        workersInRoom++;
      } 
    }

    if (workersInRoom < 3) {
      produceCreep(workerTemplate())
    }

    function produceCreep(template) {
      return spawn.spawnCreep(template.parts, template.name, template.memory);
    }
  },
};

module.exports = spawner;
