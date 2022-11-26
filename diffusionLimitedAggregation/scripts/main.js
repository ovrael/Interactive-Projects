/** @type {HTMLCanvasElement} */
let canvas;
let diffusion;
let projectDataBackUp = Object.entries(ProjectData);

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();

    diffusion = new DiffusionLimitedAggregation();
    colorMode(HSL);
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        diffusion.movingParticles.splice(diffusion.movingParticles.length - 1, 1);
    }
}

function draw() {

    if (ProjectData.LooseFruit)
        console.warn('NOT IMPLEMENTED');
    // background(90);
    background(0, 0, 0);

    diffusion.update();
    diffusion.draw();

    if (ProjectData.ShowDebug)
        showDebugData();
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

function showDebugData() {
    push();
    fill(60, 100, 100);
    textSize(20);
    strokeWeight(0);

    text('FPS: ' + parseInt(frameRate()), width - 100, 25);
    text('Moving: ' + diffusion.movingParticles.length, 25, height - 50);
    text('Static: ' + diffusion.staticParticles.length, 25, height - 25);
    pop();
}