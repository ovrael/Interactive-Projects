/** @type {HTMLCanvasElement} */
let canvas;
let diffusion;
let projectDataBackUp = Object.entries(ProjectData);

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();

    background(90);
    colorMode(HSL);
    strokeWeight(1);
    diffusion = new DiffusionLimitedAggregationPixels();
}

function draw() {
    diffusion.update();
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