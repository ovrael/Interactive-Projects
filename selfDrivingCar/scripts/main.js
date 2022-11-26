// Canvas
const trafficCanvas = document.getElementById("trafficCanvas");
trafficCanvas.width = ProjectData.RoadWidth;
const trafficCtx = trafficCanvas.getContext("2d");

// Variables
const carHeightRatio = 2;
let carWidth = (trafficCanvas.width / ProjectData.RoadLanes) - 16;
let carHeight = carWidth * carHeightRatio;

// Traffic
let road = new Road(trafficCanvas.width / 2, trafficCanvas.width, ProjectData.RoadLanes);

// GENETIC ALGORITHM
let selection = new GASelection(ProjectData.SelectionMethod, ProjectData.ParentsCount);
let crossover = new Crossover(ProjectData.CrossoverMethod);
let mutation = new Mutation(ProjectData.MutationMethod, ProjectData.MutationChance, ProjectData.MutationAmount);

let geneticAlgorithm = new GeneticAlgorithm(
    selection,
    crossover,
    mutation
);

let traffic = new Traffic(ProjectData.TrafficCarsCount, road.laneCenters);

animate();
function animate() {
    // Canvas 100% screen height
    trafficCanvas.height = window.innerHeight;

    // Find best car
    const bestCar = geneticAlgorithm.findBestUndamagedCar();
    traffic.check(bestCar);
    fillInfoDivs(bestCar);

    // Update cars
    for (var i = 0; i < traffic.cars.length; i++) {
        traffic.cars[i].update(road.borders);
    }


    for (let i = 0; i < geneticAlgorithm.population.length; i++) {
        geneticAlgorithm.population[i].update(road.borders, traffic.cars, road.laneCenters, bestCar);
    }


    // Move road
    trafficCtx.save();
    trafficCtx.translate(0, -bestCar.y + trafficCanvas.height * 0.7);

    road.draw(trafficCtx);

    // Draw cars
    for (var i = 0; i < traffic.cars.length; i++) {
        traffic.cars[i].draw(trafficCtx);
    }

    trafficCtx.globalAlpha = 0.2;
    for (let i = 0; i < geneticAlgorithm.population.length; i++) {
        geneticAlgorithm.population[i].draw(trafficCtx);
    }
    trafficCtx.globalAlpha = 1;
    bestCar.draw(trafficCtx, drawSensors = true);


    trafficCtx.restore();

    if (geneticAlgorithm.getUndamagedCarsCount() == 0) {
        // window.location.reload(true);
        generateNewGeneration();
    }

    requestAnimationFrame(animate);
}