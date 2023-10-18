document.addEventListener('contextmenu', event => event.preventDefault());

/** @type {HTMLCanvasElement} */
let canvas;
let projectDataBackUp = Object.entries(ProjectData);

let fontMontserrat;
let counter;
let counterChange = 0;
let usedSlider = false;

const offsetY = 120;

function preload() {
    fontMontserrat = loadFont('assets/Montserrat.otf');
}

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight, WEBGL);

    frameRate(60);

    textSize(26);
    textAlign(CENTER, CENTER);
    textFont(fontMontserrat);

    Duck.random();
    counter = 0;

    centerCanvas();
}

function draw() {

    background(90);
    camera(0, -80, 400, 0, 0, 0, 0, 1, 0);
    translate(0, offsetY, 0);
    // drawLight();

    ObjectRotation.update();
    ObjectRotation.applyRotation();

    if (counter >= 60) {
        Duck.random();
        counter = 0;
    }


    Duck.draw();

    drawPlatform();
    counter += counterChange;
}

function drawText() {
    push();
    translate(0, -offsetY - 50, 0);
    strokeWeight(10);
    stroke(255, 0, 0);
    text('Current angle: ', -50, 0);
    text(`${round(ObjectRotation.getAngleSmoothed(), 2)}`, textWidth('Current angle: ') - 50, 0);
    pop();
}

function mouseWheel(event) {

    if (!usedSlider)
        return ObjectRotation.mouseWheel(event);
}

function mouseDragged(event) {

    if (event.buttons >= 1) {
        if (!usedSlider) {
            cursor('grab');
            ObjectRotation.mousePressed();
            ObjectRotation.mouseDrag(event);
        }
    }
}

function mousePressed(event) {

    if (event.button === 0) {
        if (!usedSlider) {
            cursor('grab');
        }
    }

    if (event.button === 1) {
        if (!usedSlider) {
            Duck.random();
        }
    }

    if (event.button === 2) {
        if (!usedSlider) {
            cursor('grab');
        }
    }
}

function mouseReleased() {
    cursor(ARROW);
    usedSlider = false;
}

function mouseOnCanvas() {
    return mouseX >= 0 && mouseX <= ProjectData.CanvasWidth && mouseY >= 0 && mouseY <= ProjectData.CanvasHeight;
}

function drawLight() {
    // pointLight(144, 0, 144, 0, -100, 50);
    // ambientLight(185); // white light

    // spotLight(0, 0, 255, 0, -200, 20, 0, 0, 0);
}


function drawPlatform() {

    const radius = 100;
    const height = 10;
    const detailX = 24;

    push();

    translate(0, -height / 2, 0);

    fill(30);
    noStroke();

    cylinder(radius, height, detailX);

    fill(60);

    translate(0, -height / 2, 0);
    cylinder(radius, 0.1, detailX);

    fill(40);
    cylinder(radius / 2, 0.2, detailX);

    strokeWeight(2);
    stroke(45);

    const radiusMultiplier = 0.7;
    line(0, 0, radius * radiusMultiplier, 0, 0, radius);
    line(0, 0, -radius, 0, 0, -radius * radiusMultiplier);
    line(-radius, 0, 0, -radius * radiusMultiplier, 0, 0);
    line(radius * radiusMultiplier, 0, 0, radius, 0, 0);

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

function resetCanvas() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    centerCanvas();
}