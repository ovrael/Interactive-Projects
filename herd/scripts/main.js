p5.disableFriendlyErrors = true; // disables FES
let projectDataBackUp = Object.entries(ProjectData);

/** @type {HTMLCanvasElement} */
let canvas;

/** @type {Herd} */
let herd = {};
let canPressKey = true;
let clicked = false;
let usedSlider = false;

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    angleMode(DEGREES);
    centerCanvas();
    frameRate(60);

    herd = new Herd(ProjectData.HerdSize);
    loadSettings("HerdProject");
    resetCanvas();
}

function draw() {

    if (keyIsDown(32) && canPressKey) {
        ProjectData.Pause = !ProjectData.Pause;
        canPressKey = false;
        setTimeout(() => { canPressKey = true }, 200);
    }

    if (ProjectData.Pause) return;

    background(ProjectData.BackgroundColor);

    herd.update();
    herd.show();

    if (ProjectData.ShowDebug) {
        showDebugData();
    }

    if (mouseIsPressed && !clicked && !usedSlider) {
        herd.createUnitsAt(mouseX, mouseY);
        clicked = true;
        setTimeout(() => { clicked = false }, 200);
    }
}

function showDebugData() {
    push();
    fill(250, 250, 0);
    textSize(20);
    strokeWeight(0);

    text('FPS: ' + parseInt(frameRate()), width - 100, 25);
    text('Units: ' + herd.units.length, 25, height - 25);
    pop();
}


function windowResized() {
    centerCanvas();
}

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    canvas.position(x, y);
}