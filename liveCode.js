let liveCode = {
  run: function () {
    // let towerOutOfEnergy = false;
    // for (let name in Game.creeps) {
    //   let creep = Game.creeps[name];
    //   if (creep.memory.role === "tank" && creep.memory.towerOutOfEnergy) {
    //     towerOutOfEnergy = true;
    //   }

    // }
    // console.log("towerOutOfEnergy",towerOutOfEnergy)
    // if (towerOutOfEnergy) onlyAttackersAttack();
    // else onlyAttackersFallBack();
    //Go home
    // Game.getObjectById("60611a691e8252c16f0ebe70").moveTo(Game.flags["Home"])
    //Give energy to tower
    // Game.getObjectById("606123f8bad8864efea2fbce").transfer(Game.getObjectById("605eaafd39c8c334fc9c256f"),RESOURCE_ENERGY)
    //Move to tower
    // Game.getObjectById("606123f8bad8864efea2fbce").moveTo(Game.getObjectById("605eaafd39c8c334fc9c256f"))
    // clear memory of dead creeps
    // for (var i in Memory.creeps) {
    //   if (!Game.creeps[i]) {
    //     delete Memory.creeps[i];
    //   }
    // }

    // LAUNCH AN ATTACK
    for (let name in Game.creeps) {
      let creep = Game.creeps[name];
      if (creep.memory.role == "attacker") {
        creep.memory.order = "attack";
      }
      if (creep.memory.role == "healer") {
        creep.memory.order = "follow";
      }
      if (creep.memory.role == "tank") {
        creep.memory.order = "attack";
      }
    }

    // FALL BACK

    //       for (let name in Game.creeps) {
    //   let creep = Game.creeps[name];
    //   if (creep.memory.role == "attacker") {
    //     creep.memory.order = "go_home";
    //   }
    //   if (creep.memory.role == "healer") {
    //     creep.memory.order = "go_home";
    //   }
    //   if (creep.memory.role == "tank") {
    //     creep.memory.order = "go_home";
    //   }
    // }

    // DRAIN
    // for (let name in Game.creeps) {
    //   let creep = Game.creeps[name];
    //   if (creep.memory.role == "attacker") {
    //     creep.memory.order = "go_home";
    //   }
    //   if (creep.memory.role == "healer") {
    //     creep.memory.order = "drain";
    //   }
    //   if (creep.memory.role == "tank") {
    //     creep.memory.order = "drain";
    //   }
    // }

    //Only attackers attack
    function onlyAttackersAttack() {
      console.log("Attackers Attack");
      for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role == "attacker") {
          creep.memory.order = "attack";
        }
      }
    }

    // Only attackers fall back
    function onlyAttackersFallBack() {
      console.log("Attackers FallBack");
      for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role == "attacker") {
          creep.memory.order = "go_home";
        }
      }
    }

    //Attackers new target
    for (let name in Game.creeps) {
      let creep = Game.creeps[name];
      if (creep.memory.role == "attacker") {
        console.log("bef creep.memory.targetId",creep.memory.targetId)
        creep.memory.targetId = "6064e4589a82e805b8efc6a6";
        console.log("aft creep.memory.targetId",creep.memory.targetId)
        console.log("-----------")
      }
    }

    //Tanks enter room
    //     for (let name in Game.creeps) {
    //       let creep = Game.creeps[name];
    //   if (creep.memory.role == "tank") {
    //     creep.memory.order = "stay";
    //   }
    // }

    // healers enter room
    //         for (let name in Game.creeps) {
    //           let creep = Game.creeps[name];
    //   if (creep.memory.role == "healer") {
    //     creep.memory.order = "stay";
    //   }
    // }
  },
};

module.exports = liveCode;
