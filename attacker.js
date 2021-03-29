let attacker = {
    // Use the tower instead of this when it's available
    run: function (creep) {
        
        switch(creep.memory.order){
            case "GO_HOME":
                console.log("going home")
            case "ATTACK"
        }

    }
  
  
  };
  
  function attackerTemplate() {
    return {
      parts: [WORK, WORK, CARRY, MOVE],
      name: "Repairer" + Game.time,
      memory: { memory: { role: "attacker", order:"", targetId: "" } },
    };
  }
  
  module.exports = { attacker, attackerTemplate };
  