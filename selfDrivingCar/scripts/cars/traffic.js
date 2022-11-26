class Traffic {
    constructor(carsCount, laneCenters) {
        this.carsCount = carsCount;
        this.laneCenters = laneCenters;
        this.offset = 190;

        // this.#maxCarsOnLane = 3;

        this.laneData = {};
        for (let i = 0; i < laneCenters.length; i++) {
            this.laneData[laneCenters[i]] = 0;
        }

        this.randomColors = ProjectData.RandomTrafficColor;

        this.cars = this.#generateTraffic();
    }

    #generateTraffic() {

        let trafficCars = new Array(this.carsCount);
        let resetCount = 0;

        for (let i = 0; i < trafficCars.length; i++) {

            let randomLane = this.laneCenters[Mathematics.randIntMax(this.laneCenters.length)];
            while (this.laneData[randomLane] >= 3) {
                randomLane = this.laneCenters[Mathematics.randIntMax(this.laneCenters.length)];
                if (resetCount > 1000)
                    break;
                resetCount++;
            }
            this.laneData[randomLane] += 1;

            trafficCars[i] = Car.carConstructor(
                randomLane,
                GeneticAlgorithm.startY - this.offset,
                carWidth,
                carHeight,
                ProjectData.TrafficAcceleration,
                ControlType.Traffic
            );

            if (this.randomColors) {
                trafficCars[i].color = randColor();
            }
            this.offset += Mathematics.randIntMinMax(1.8 * carHeight, 2 * carHeight);
        }

        return trafficCars;
    }

    getLastCar() {
        const carsDistances = this.cars.map(c => c.y);
        const maxDistance = Math.max(...carsDistances);
        return this.cars.find(c => c.y == maxDistance);
    }

    check(bestCar) {

        if (this.carsCount > this.cars.length)
            this.cars = this.#generateTraffic();

        for (var i = 0; i < this.cars.length; i++) {

            if (this.cars[i].y - window.innerHeight / 2 > bestCar.y) {

                this.laneData[this.cars[i].x] -= 1;
                let resetCount = 0;
                let randomLane = this.laneCenters[Mathematics.randIntMax(this.laneCenters.length)];
                while (this.laneData[randomLane] >= 3) {
                    randomLane = this.laneCenters[Mathematics.randIntMax(this.laneCenters.length)];
                    if (resetCount > 1000)
                        break;
                    resetCount++;
                }
                this.laneData[randomLane] += 1;

                this.cars[i] = Car.carConstructor(
                    randomLane,
                    bestCar.y - window.innerHeight,
                    carWidth,
                    carHeight,
                    0.2,
                    ControlType.Traffic,
                    0
                );

                if (this.randomColors) {
                    this.cars[i].color = randColor();
                }

                this.cars[i].update();
            }
        }

        for (var i = 0; i < geneticAlgorithm.population.length; i++) {

            if (geneticAlgorithm.population[i].y - window.innerHeight > bestCar.y) {
                geneticAlgorithm.population[i].damaged = true;
            }
        }
    }
}