class GeneticAlgorithm {

    static #startX;
    static startY;
    static sensorRayCount;

    constructor(gaSelection, crossover, mutation) {
        this.populationSize = Number(ProjectData.PopulationSize);
        this.eliteUnits = Number(ProjectData.EliteUnits);
        GeneticAlgorithm.sensorRayCount = ProjectData.SensorRaysCount;

        this.selection = gaSelection;
        this.crossover = crossover;
        this.mutation = mutation;

        GeneticAlgorithm.#startX = ProjectData.RandomStartingLane ? road.getLaneCenter(Mathematics.randIntMax(ProjectData.RoadLanes)) : road.getLaneCenter(ProjectData.StartingRoadLane);
        GeneticAlgorithm.startY = 100;

        this.population = this.#generatePopulation();
        this.generation = 0;
    }

    static generateAiCar() {
        return Car.carConstructor(
            GeneticAlgorithm.#startX,
            GeneticAlgorithm.startY,
            carWidth,
            carHeight,
            ProjectData.AIAcceleration,
            ControlType.AI,
            GeneticAlgorithm.sensorRayCount
        )
    }

    #generatePopulation() {
        const population = new Array(this.populationSize);
        for (let i = 0; i < population.length; i++) {
            population[i] = GeneticAlgorithm.generateAiCar();
        }

        return population;
    }

    createNewGeneration() {
        const parents = this.selection.run(this.population, this.parentsCount);
        const elites = this.#takeElites();

        this.population = this.crossover.run(parents, this.populationSize, this.eliteUnits);
        this.population = this.mutation.run(this.population);

        if (elites) {

            for (let i = 0; i < elites.length; i++) {

                let elite = GeneticAlgorithm.generateAiCar();
                elite.neuralNetwork = elites[i].neuralNetwork;
                elite.isElite = true;
                elite.color = ProjectData.EliteAICarColor;

                this.population[this.populationSize - this.eliteUnits + i] = elite;
            }
        }

        if (ProjectData.RandomStartingLane)
            GeneticAlgorithm.#startX = road.getLaneCenter(Mathematics.randIntMax(ProjectData.RoadLanes));

        this.generation++;
    }


    #takeElites() {
        const sortedPopulation = this.population.sort(function (a, b) {
            if (a.fitnessValue < b.fitnessValue) {
                return 1;
            } else if (a.fitnessValue > b.fitnessValue) {
                return -1;
            } else {
                return 0;
            }
        });

        return sortedPopulation.slice(0, this.eliteUnits);
    }

    findBestUndamagedCar() {
        const carsDistances = this.population.map(c => c.traveledDistance);
        const maxDistance = Math.max(...carsDistances);
        for (let i = 0; i < carsDistances.length; i++) {
            const maxDistanceAvailable = Math.max(...carsDistances);

            const bestCar = this.population.find(c => c.traveledDistance == maxDistanceAvailable && c.damaged == false);
            if (bestCar) {
                return bestCar;
            }

            const index = carsDistances.indexOf(maxDistanceAvailable);
            carsDistances.splice(index, 1);
        }

        return this.population.find(c => c.traveledDistance == maxDistance);
    }

    getUndamagedCarsCount() {
        let sum = 0;
        for (let i = 0; i < this.population.length; i++) {
            if (this.population[i].damaged == false) {
                sum += 1;
            }
        }
        return sum;
    }

    printFitnessValues() {

        let fitnessValues = this.population.map(p => p.fitnessValue);
        fitnessValues = fitnessValues.sort(function (a, b) { return b - a; });

        console.log(fitnessValues);
    }
}