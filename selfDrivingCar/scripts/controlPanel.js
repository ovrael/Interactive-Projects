init()

function checkboxChange(checkbox) {
    switch (checkbox.dataset.variable) {
        case 'randomStartingLane':
            ProjectData.RandomStartingLane = Boolean(checkbox.checked);
            break;

        case 'randomTrafficColor':
            ProjectData.RandomTrafficColor = Boolean(checkbox.checked);
            traffic.randomColors = ProjectData.RandomTrafficColor;

            if (ProjectData.RandomTrafficColor) {
                traffic.cars.forEach((car) => {
                    car.color = randColor();
                    car.updateMask();
                });
            } else {
                traffic.cars.forEach((car) => {
                    car.color = ProjectData.TrafficCarColor;
                    car.updateMask();
                });
            }

            break;

        default:
            console.warn('Cant find checkbox variable for: ' + checkbox.dataset.variable);
            break;
    }
}

function sliderChange(slider) {

    document.getElementById(slider.dataset.variable + 'Text').innerHTML = Number(slider.value);
    let newMax = 0;

    switch (slider.dataset.variable) {
        case 'populationSize':
            const parentsSlider = document.getElementById('parentsCountSlider');
            newMax = Math.round(Number(slider.value) / 2);

            this.sliderChange(parentsSlider);
            parentsSlider.max = newMax;

            const eliteSlider = document.getElementById('eliteUnitsSlider');
            newMax = Math.round(Number(slider.value) / 4);

            this.sliderChange(eliteSlider);
            eliteSlider.max = newMax;

            ProjectData.PopulationSize = Number(slider.value);
            break;

        case 'parentsCount':
            ProjectData.ParentsCount = Number(slider.value);
            break;

        case 'eliteUnits':
            ProjectData.EliteUnits = Number(slider.value);
            break;

        case 'mutationChance':
            ProjectData.MutationChance = Number(slider.value);
            geneticAlgorithm.mutation.chance = ProjectData.MutationChance;
            break;

        case 'mutationAmount':
            ProjectData.MutationAmount = Number(slider.value);
            geneticAlgorithm.mutation.amount = ProjectData.MutationAmount;
            break;

        case 'roadLanes':
            ProjectData.RoadLanes = Number(slider.value);
            road = new Road(trafficCanvas.width / 2, trafficCanvas.width, ProjectData.RoadLanes);
            traffic.laneCenters = road.laneCenters;

            carWidth = (trafficCanvas.width / ProjectData.RoadLanes) - 16;
            carHeight = carWidth * carHeightRatio;

            traffic.cars.forEach((car) => {
                car.width = carWidth;
                car.height = carHeight;
            });

            geneticAlgorithm.population.forEach((car) => {
                car.width = carWidth;
                car.height = carHeight;
            });

            const trafficCarsCountSlider = document.getElementById('trafficCarsCountSlider');

            newMax = ProjectData.RoadLanes * 3;
            if (trafficCarsCountSlider.value > newMax) {
                trafficCarsCountSlider.value = newMax;
            }
            trafficCarsCountSlider.max = newMax;

            sliderChange(trafficCarsCountSlider);

            setStartingLaneSelect();
            break;

        case 'roadWidth':
            ProjectData.RoadWidth = Number(slider.value);
            trafficCanvas.width = ProjectData.RoadWidth;

            const roadLanesSlider = document.getElementById('roadLanesSlider');
            newMax = Math.floor(ProjectData.RoadWidth / 45);
            if (roadLanesSlider.value > newMax) {
                ProjectData.RoadLanes = newMax;
            }
            roadLanesSlider.max = newMax;

            let newMin = Math.ceil(ProjectData.RoadWidth / 90);
            if (roadLanesSlider.value < newMin) {
                ProjectData.RoadLanes = newMin;
            }
            roadLanesSlider.min = newMin;

            carWidth = (trafficCanvas.width / ProjectData.RoadLanes) - 16;
            carHeight = carWidth * carHeightRatio;

            road = new Road(trafficCanvas.width / 2, trafficCanvas.width, ProjectData.RoadLanes);

            traffic.cars.forEach((car) => {
                car.width = carWidth;
                car.height = carHeight;
            });

            geneticAlgorithm.population.forEach((car) => {
                car.width = carWidth;
                car.height = carHeight;
            });

            sliderChange(roadLanesSlider);
            break;

        case 'sensorRaysCount':
            ProjectData.SensorRaysCount = Number(slider.value);
            break;

        case 'sensorRaysLength':
            ProjectData.SensorRaysLength = Number(slider.value);
            geneticAlgorithm.population.forEach((car) => {
                car.sensor.rayLength = ProjectData.SensorRaysLength;
            });
            break;

        case 'sensorRaysSpread':
            ProjectData.SensorRaysSpread = (Number(slider.value) / 360) * 2 * Math.PI;
            geneticAlgorithm.population.forEach((car) => {
                car.sensor.raySpread = ProjectData.SensorRaysSpread;
            });
            break;

        case 'trafficCarsCount':
            ProjectData.TrafficCarsCount = Number(slider.value);
            break;

        case 'trafficAcceleration':
            ProjectData.TrafficAcceleration = (Number(slider.value));
            traffic.cars.forEach((car) => {
                car.acceleration = ProjectData.TrafficAcceleration;
            });
            break;
        case 'trafficMaxSpeed':
            ProjectData.TrafficMaxSpeed = Number(slider.value);
            traffic.cars.forEach((car) => {
                car.maxSpeed = ProjectData.TrafficMaxSpeed;
            });
            break;
        case 'aiAcceleration':
            ProjectData.AIAcceleration = Number(slider.value);
            geneticAlgorithm.population.forEach((car) => {
                car.acceleration = ProjectData.AIAcceleration;
            });
            break;
        case 'aiMaxSpeed':
            ProjectData.AIMaxSpeed = Number(slider.value);
            geneticAlgorithm.population.forEach((car) => {
                car.maxSpeed = ProjectData.AIMaxSpeed;
            });
            break;

        case 'carFriction':
            ProjectData.CarFriction = Number(slider.value);

            traffic.cars.forEach((car) => {
                car.friction = ProjectData.CarFriction;
            });

            geneticAlgorithm.population.forEach((car) => {
                car.friction = ProjectData.CarFriction;
            });
            break;

        case 'steeringStrength':
            ProjectData.SteeringStrength = Number(slider.value);
            geneticAlgorithm.population.forEach((car) => {
                car.angleChange = ProjectData.SteeringStrength;
            });
            break;

        default:
            console.warn("Cant find variable called: " + slider.dataset.variable);
            break;
    }
}

let updatingColor = false;
let updateColorTimeout = null;

function colorChange(input) {
    switch (input.dataset.variable) {
        case 'trafficCarColor':
            ProjectData.TrafficCarColor = input.value;

            traffic.cars.forEach((car) => {
                car.color = ProjectData.TrafficCarColor;

                if (!updatingColor) {
                    car.updateMask();
                }
            });

            break;

        case 'aiCarColor':
            ProjectData.AICarColor = input.value;
            geneticAlgorithm.population.forEach((car) => {
                if (car.isElite)
                    car.color = ProjectData.EliteAICarColor;
                else
                    car.color = ProjectData.AICarColor;

                if (!updatingColor) {
                    car.updateMask();
                }
            });

            break;

        case 'eliteAiCarColor':
            ProjectData.EliteAICarColor = input.value;
            geneticAlgorithm.population.forEach((car) => {
                if (car.isElite)
                    car.color = ProjectData.EliteAICarColor;
                else
                    car.color = ProjectData.AICarColor;

                if (!updatingColor) {
                    car.updateMask();
                }
            });
            break;

        default:
            console.warn('Cant find color for: ' + input.dataset.variable);
            break;
    }

    updatingColor = true;
    if (updateColorTimeout == null) {
        updateColorTimeout = setTimeout(() => {
            updatingColor = false;
            updateColorTimeout = null;
        }, 500);
    }
}

function selectChange(select) {
    switch (select.id) {
        case 'selectionMethodSelect':
            ProjectData.SelectionMethod = select.value;
            geneticAlgorithm.selection.setMethod(ProjectData.SelectionMethod);
            break;

        case 'crossoverMethodSelect':
            ProjectData.CrossoverMethod = select.value;
            geneticAlgorithm.crossover.setMethod(ProjectData.CrossoverMethod);
            break;

        case 'mutationMethodSelect':
            ProjectData.MutationMethod = select.value;
            geneticAlgorithm.mutation.setMethod(ProjectData.MutationMethod);
            break;

        case 'startingRoadLaneSelect':
            ProjectData.StartingRoadLane = select.value;
            break;

        default:
            console.warn('Cant find selectChange for: ' + select.id);
            break;
    }
}

function initSelections() {
    initGAMethodsSelect(SelectionMethod, 'selectionMethod');
    initGAMethodsSelect(CrossoverMethod, 'crossoverMethod');
    initGAMethodsSelect(MutationMethod, 'mutationMethod');
    setStartingLaneSelect();
}

function initGAMethodsSelect(object, selectId) {
    let select = document.getElementById(selectId + 'Select');
    const methods = Object.entries(object);

    select.innerHTML += '<option selected value="' + methods[0][1] + '">' + rename(methods[0][0]) + '</option>';
    for (let i = 1; i < methods.length; i++) {
        select.innerHTML += '<option value="' + methods[i][1] + '">' + rename(methods[i][0]) + '</option>';
    }
}

function setStartingLaneSelect() {
    let startingLaneSelect = document.getElementById('startingRoadLaneSelect');

    startingLaneSelect.innerHTML = '';

    if (ProjectData.StartingRoadLane >= ProjectData.RoadLanes)
        ProjectData.StartingRoadLane = ProjectData.RoadLanes - 1;

    for (let i = 0; i < ProjectData.RoadLanes; i++) {
        if (i == ProjectData.StartingRoadLane) {
            startingLaneSelect.innerHTML += '<option selected value="' + i + '">' + (i + 1) + '</option>';
        } else {
            startingLaneSelect.innerHTML += '<option value="' + i + '">' + (i + 1) + '</option>';
        }
    }
}

function init() {

    const textDivs = document.getElementsByClassName('paremeterValue');

    for (let i = 0; i < textDivs.length; i++) {
        textDivs[i].innerHTML = document.getElementById(textDivs[i].dataset.variable + 'Slider').value;
    }

    initSelections();
}