/** @type {HTMLCanvasElement} */
let canvas;
/** @type {PiApprox} */
let piApprox;
/** @type {UserManage} */
let userManage;

let projectDataBackUp = Object.entries(ProjectData);
let userClicked = false;
let autoAdd = false;

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();

    textSize(36);

    piApprox = new PiApprox();
    userManage = new UserManage("Click me!");

    // for (let i = 0; i < 50000; i++) {
    //     piApprox.addPoint();
    // }
}

function draw() {
    background(90);

    piApprox.draw();

    if (!userClicked) {
        userManage.animateText();
    }

    if (userManage.reachedMax) {
        userClicked = true;
        autoAdd = true;
    }

    if (autoAdd) {
        piApprox.addPoints(500);
    }


    if (mouseIsPressed) {
        if (
            mouseX < 0
            || mouseX > ProjectData.CanvasWidth
            || mouseY < 0
            || mouseY > ProjectData.CanvasWidth
        )
            return;

        if (mouseButton === LEFT) {

            piApprox.addPoints(5);
            userClicked = true;
            userManage.reachedMax = false;
        }

    }
}

function mousePressed() {
    if (mouseButton === RIGHT) {
        userClicked = true;
        autoAdd = !autoAdd;
        userManage.reachedMax = false;
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

function keyPressed() {
    if (keyCode == 32) {
        userClicked = true;
        piApprox.addPoints(20);
    }
}