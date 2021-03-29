let tower = {
  run: function (tower) {
    let allStructures = tower.room.find(FIND_STRUCTURES);
    let structuresToRepair = allStructures.filter((s) => {
      if (s.structureType === "constructedWall" || s.structureType === "rampart") {
        return s.hits < 10000;
      } else return s.hits < s.hitsMax;
    });

    if (structuresToRepair.length) {
      let repair = tower.repair(structuresToRepair[0]);
    }

    // Defend Room

    let hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
      var username = hostiles[0].owner.username;
      Game.notify(`User ${username} spotted in room ${roomName}`);
      tower.attack(hostiles[0])
    }
  },
};

module.exports = tower;
