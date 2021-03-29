let worker = {
    run: function (creep) {
        let allStructures = creep.room.find(FIND_STRUCTURES);

        if (creep.store.getUsedCapacity() == 0 && !creep.memory.isHarvesting) {
            creep.memory.isHarvesting = true;
            creep.say("Gather");
        } else if (creep.store.getFreeCapacity() == 0 && creep.memory.isHarvesting) {
            creep.memory.isHarvesting = false;
            creep.say("Transfer");
        }

        if (creep.memory.isHarvesting) goHarvestEnergy();
        else {
            if (goGiveEnergyToSpawn() == null) {
                if (goGiveEnergyToTower() == null) {
                    if (goConstructBuildings() == null) {
                        goGiveEnergyToController();
                    }
                }
            }
        }

        function isBusy(task){
            if(creep.memory.currentTask === task || creep.memory.currentTask === "") return false
            else return true
        }

        function goHarvestEnergy() {
            creep.memory.currentTask = "";
            let closestSource = creep.pos.findClosestByRange(FIND_SOURCES);
            let harvest = creep.harvest(closestSource);

            if (harvest == ERR_NOT_IN_RANGE)
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
            if(isBusy("spawn")) return null
            creep.memory.currentTask = "spawn";
            let spawn1 = Game.spawns["Spawn1"];
            let allExtensions = allStructures.filter(
                (structure) => structure.structureType === "extension"
            );
            let allDestinations = [spawn1, ...allExtensions];
            allDestinations = allDestinations.filter(
                (dest) => dest.store.getFreeCapacity(RESOURCE_ENERGY) !== 0
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
                creep.memory.currentTask = ""
                return null;
            }
        }

        function goGiveEnergyToTower() {
            if(isBusy("tower")) return null
            creep.memory.currentTask = "tower";
            let allTowers = allStructures.filter((s) => s.structureType === "tower");
            let transfer = creep.transfer(allTowers[0], RESOURCE_ENERGY);
            if (transfer == ERR_NOT_IN_RANGE) {
                creep.moveTo(allTowers[0], {
                    visualizePathStyle: {
                        fill: "transparent",
                        stroke: "#fff",
                        lineStyle: "dashed",
                        strokeWidth: 0.15,
                        opacity: 0.1,
                    },
                });
            } else if (transfer == ERR_INVALID_TARGET || transfer == ERR_FULL) {
                creep.memory.currentTask = ""
                return null;
            }
        }

        function goConstructBuildings() {
            if(isBusy("build")) return null
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
                creep.memory.currentTask = ""
                return null;
            }
        }

        function goGiveEnergyToController() {
            if(isBusy("upgrade")) return null
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
        parts: [
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            WORK,
            CARRY,
            CARRY,
            CARRY,
            CARRY,
            CARRY,
            CARRY,
            MOVE,
            MOVE,
            MOVE,
            MOVE,
        ],
        name: "Worker" + Game.time,
        memory: { memory: { role: "worker", isHarvesting: false, currentTask: "" } },
    };
}

module.exports = { worker, workerTemplate };
