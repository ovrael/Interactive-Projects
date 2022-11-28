/** @type {HTMLCanvasElement} */
let canvas;
let PROJECT_VARIABLE = {};
let projectDataBackUp = Object.entries(ProjectData);
let angle = 0;
let angleChange = 0.01;

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();
}

// Handling website project 3

function draw() {
    background(90);

    rotate(angle)
    triangle(0, 0, ProjectData.CanvasWidth, ProjectData.CanvasHeight / 2, ProjectData.CanvasWidth / 2, ProjectData.CanvasHeight);

    angle += angleChange;
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