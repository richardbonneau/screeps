let tower = {
    run: function (tower) {
        let allStructures = tower.room.find(FIND_STRUCTURES);
        let structuresToRepair = allStructures.filter((s) => {
          if(s.structureType === "constructedWall" || s.structureType === "rampart"){
            return s.hits < 5000
          }
          else return s.hits < s.hitsMax;
        });
        
        if (structuresToRepair.length) {
          let repair = tower.repair(structuresToRepair[0])
  
        }
    },
  };
  

  
  module.exports = tower ;
  