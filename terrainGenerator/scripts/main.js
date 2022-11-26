/** @type {HTMLCanvasElement} */
let canvas;
let terrain;

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight, WEBGL);
    frameRate(60);
    centerCanvas();
    angleMode(DEGREES);

    terrain = new Terrain();
}

function draw() {
    background(ProjectData.BackgroundColor);
    terrain.update();
    terrain.show();
}

function windowResized() {
    centerCanvas();
}

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    canvas.position(x, y);
}