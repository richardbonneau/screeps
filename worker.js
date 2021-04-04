let worker = {
  run: function (creep) {
    let allStructures = creep.room.find(FIND_STRUCTURES);
    let droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);

    if (creep.store.getUsedCapacity() == 0 && !creep.memory.isHarvesting) {
      creep.memory.isHarvesting = true;
      creep.say("Gather");
    } else if (creep.store.getFreeCapacity() == 0 && creep.memory.isHarvesting) {
      creep.memory.isHarvesting = false;
      creep.say("Transfer");
    }
    if(creep.memory.colonizer){
      let flagDest = Game.flags["WarFlag"];
      // console.log("flagDest", flagDest);
  
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
        console.log("moveToFlag",moveToFlag)
        return;
      }
    }
    if (creep.memory.isHarvesting) goHarvestEnergy();
    else {
      if (goGiveEnergyToSpawn() == null) {
        if (goGiveEnergyToTowers() == null) {
          if (goConstructBuildings() == null) {
            if (goRepairBuildings() == null) {
              goGiveEnergyToController();
            }
          }
        }
      }
    }

    function isBusy(task) {
      if (creep.memory.currentTask === task || creep.memory.currentTask === "") return false;
      else return true;
    }

    function takeAnotherTask() {
      creep.memory.currentTask = "";
      return null;
    }

    function goHarvestEnergy() {
      creep.memory.currentTask = "";
      let closestSource = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);

      let harvest = creep.harvest(closestSource);

      if (harvest == ERR_NOT_ENOUGH_RESOURCES && creep.store.getUsedCapacity() > 0) {
        creep.memory.isHarvesting = false;
      } else if (harvest == ERR_NOT_IN_RANGE || harvest == ERR_NOT_ENOUGH_RESOURCES)
        creep.moveTo(closestSource, {
          visualizePathStyle: {
            fill: "transparent",
            stroke: "#fff",
            lineStyle: "dashed",
            strokeWidth: 0.15,
            opacity: 0.1,
          },
        });
    }

    function goGiveEnergyToSpawn() {
      if (isBusy("spawn")) return null;
      creep.memory.currentTask = "spawn";
      let spawn = allStructures.filter((structure) => structure.structureType === "spawn")
      let allExtensions = allStructures.filter(
        (structure) => structure.structureType === "extension"
      );
      // let allDestinations = [spawn, ...allExtensions];
      let allDestinations = allExtensions
      allDestinations = allDestinations.filter(
        (dest) => {

          return dest.store.getFreeCapacity(RESOURCE_ENERGY) !== 0
        }
      );

      let transfer = creep.transfer(allDestinations[0], RESOURCE_ENERGY);

      if (transfer == ERR_NOT_IN_RANGE) {
        creep.moveTo(allDestinations[0], {
          visualizePathStyle: {
            fill: "transparent",
            stroke: "#fff",
            lineStyle: "dashed",
            strokeWidth: 0.15,
            opacity: 0.1,
          },
        });
      } else if (transfer == ERR_INVALID_TARGET || transfer == ERR_FULL) {
        return takeAnotherTask();
      }
    }

    function goGiveEnergyToTowers() {
      if (isBusy("tower")) return null;
      let allTowers = allStructures.filter((s) => s.structureType === "tower");

      let towersInNeedOfEnergy = allTowers.filter((t) => {
        let towerEnergyNeeds = t.store.getCapacity(RESOURCE_ENERGY) - t.store[RESOURCE_ENERGY];
        // console.log("towerEnergyNeeds", towerEnergyNeeds);
        return towerEnergyNeeds > 600;
      });

      // console.log(creep.id,"towersInNeedOfEnergy.length === 0 ",towersInNeedOfEnergy.length === 0 , "creep.memory.currentTask !== tower",creep.memory.currentTask !== "tower",towersInNeedOfEnergy.length === 0)
      if (towersInNeedOfEnergy.length === 0 && creep.memory.currentTask !== "tower") {
        return takeAnotherTask();
      }

      creep.memory.currentTask = "tower";

      let transfer = creep.transfer(towersInNeedOfEnergy[0], RESOURCE_ENERGY);
      if (transfer == ERR_NOT_IN_RANGE) {
        creep.moveTo(towersInNeedOfEnergy[0], {
          visualizePathStyle: {
            fill: "transparent",
            stroke: "#fff",
            lineStyle: "dashed",
            strokeWidth: 0.15,
            opacity: 0.1,
          },
        });
      } else if (transfer == ERR_INVALID_TARGET || transfer == ERR_FULL) {
        return takeAnotherTask();
      }
    }

    function goConstructBuildings() {
      if (isBusy("build")) return null;
      creep.memory.currentTask = "build";
      let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length > 0) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
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
        return takeAnotherTask();
      }
    }

    function goRepairBuildings() {
      if (isBusy("repair")) return null;
      creep.memory.currentTask = "repair";
      let structures = creep.room.find(FIND_MY_STRUCTURES);
      let roomHasTower = false;
      let structuresToRepair = structures.filter((s) => {
        if (s.structureType === "tower") roomHasTower = true;
        if(roomHasTower) return
        if (s.structureType === "constructedWall" || s.structureType === "rampart") {
          return s.hits < 50000;
        } else return s.hits < s.hitsMax;
      });
      
      if (roomHasTower) return takeAnotherTask();
      else if (structuresToRepair.length > 0) {
        if (creep.repair(structuresToRepair[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(structuresToRepair[0], {
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
        return takeAnotherTask();
      }
    }

    function goGiveEnergyToController() {
   
      if (isBusy("upgrade")) return null;
      console.log("goGiveEnergyToController",)
      creep.memory.currentTask = "upgrade";
      let roomController = creep.room.controller;
      let upgrade = creep.upgradeController(roomController);

      if (upgrade == ERR_NOT_IN_RANGE) {
        creep.moveTo(roomController, {
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

function workerTemplate() {
  return {
    qualityFirst: true,
    parts: [WORK, CARRY, MOVE],
    name: "Worker" + Game.time,
    memory: { memory: { role: "worker", isHarvesting: false, currentTask: "" } },
  };
}

module.exports = { worker, workerTemplate };
