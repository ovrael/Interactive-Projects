/** @type {HTMLCanvasElement} */
let canvas;
let PROJECT_VARIABLE;
let projectDataBackUp = Object.entries(ProjectData);

let storagePoints = [];
let warehouses = [];
let cars = [];

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();
    randomSeed(ProjectData.RandomSeed);
    rectMode(CENTER);

    initPoints();
}

function draw() {
    background(90);
    drawPoints();
    for (let i = 0; i < cars.length; i++) {
        cars[i].drawRoute();
    }
}

function windowResized() {
    centerCanvas();
}

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    canvas.position(x, y);
}

function resetCanvas() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    centerCanvas();
    PROJECT_VARIABLE = new PROJECT_VARIABLE();
}

function initPoints() {
    for (let i = 0; i < ProjectData.PointsCount; i++) {
        storagePoints.push(
            new StoragePoint(
                random(0, ProjectData.CanvasWidth - 1),
                random(0, ProjectData.CanvasHeight - 1),
                ProjectData.VehiclesCount
            )
        )
    }

    for (let i = 0; i < ProjectData.WarehouseCount; i++) {
        const randStoragePoint = random(storagePoints);
        randStoragePoint.type = "warehouse";
        warehouses.push(randStoragePoint);
    }

    const randWarehouse = random(warehouses);
    for (let i = 0; i < ProjectData.VehiclesCount; i++) {
        cars.push(
            new Car(
                randWarehouse.x,
                randWarehouse.y,
                i
            )
        );
    }
}

function drawPoints() {
    push();
    for (let i = 0; i < storagePoints.length; i++) {
        storagePoints[i].draw();
    }
    pop();

    for (let i = 0; i < cars.length; i++) {
        cars[i].draw();
    }
}

function findRoute() {
    for (let i = 0; i < cars.length; i++) {
        console.warn("Finding route for car with id: " + cars[i].id);
        cars[i].generateRoute(storagePoints, warehouses);
    }
}

function keyPressed() {

    if (keyCode === 32) {
        findRoute();
    }
    else if (keyCode === ESCAPE) {

    }
}