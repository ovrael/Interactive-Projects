function fillInfoDivs(bestCar) {
    document.getElementById('bestCarInfo').innerHTML = "Fitness value: " + Math.floor(bestCar.fitnessValue) +
        '<br> Traveled distance: ' + Math.floor(bestCar.traveledDistance) +
        '<br> Speed: ' + Math.floor(bestCar.speed);

    document.getElementById('geneticsInfo').innerHTML = 'Cars alive: ' + Math.floor(geneticAlgorithm.getUndamagedCarsCount()) +
        '<br> Seconds: ' + Timer.timeInSeconds +
        '<br> Generation: ' + Math.floor(geneticAlgorithm.generation);
}

function generateNewGeneration() {
    geneticAlgorithm.createNewGeneration();
    traffic = new Traffic(ProjectData.TrafficCarsCount, road.laneCenters);
}

function resetPopulation() {

    // GENETIC ALGORITHM
    selection = new GASelection(ProjectData.SelectionMethod, ProjectData.ParentsCount);
    crossover = new Crossover(ProjectData.CrossoverMethod);
    mutation = new Mutation(ProjectData.MutationMethod, ProjectData.MutationChance, ProjectData.MutationAmount);

    geneticAlgorithm = new GeneticAlgorithm(
        selection,
        crossover,
        mutation
    );

    traffic = new Traffic(ProjectData.TrafficCarsCount, road.laneCenters);
    Timer.reset();
}