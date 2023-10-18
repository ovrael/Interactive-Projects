/** @type {HTMLCanvasElement} */
let canvas;
/** @type {LightningGenerator} */
let lightningGenerator;
let projectDataBackUp = Object.entries(ProjectData);

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();

    lightningGenerator = new LightningGenerator();
}

function mouseClicked() {
    lightningGenerator.recreate();
}

function draw() {
    background(90);
    lightningGenerator.draw();
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
    lightningGenerator = new LightningGenerator();
}