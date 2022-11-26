/** @type {HTMLCanvasElement} */
let canvas;
/** @type {Genetics} */
let genetics;
/** @type {Obstacles} */
let obstacles;

let projectDataBackUp = Object.entries(ProjectData);

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();

    genetics = new Genetics();
    obstacles = new Obstacles();

    obstacles.setStart(150, ProjectData.CanvasHeight / 2 - 25);
    obstacles.setEnd(ProjectData.CanvasWidth - 150, ProjectData.CanvasHeight / 2 + 25);
    obstacles.create();

    preventRightClickOnCanvas();
}

function draw() {
    background(ProjectData.BackgroundColor);

    genetics.update();

    obstacles.show();

    genetics.showDebugs();

    if (!mouseIsPressed)
        return;
    switch (mouseButton) {
        case LEFT:
            obstacles.setEnd(mouseX, mouseY);
            obstacles.showCurrentDrawing();
            break;

        case RIGHT:
            obstacles.delete(mouseX, mouseY);
            break;

        case CENTER:
            changeTarget();
            break;

        default:
            break;
    }
}

function mousePressed() {
    obstacles.setStart(mouseX, mouseY);
}

function mouseReleased() {
    obstacles.setEnd(mouseX, mouseY);

    if (mouseButton === LEFT)
        obstacles.create();
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
    genetics = new Genetics();
}

function changeTarget() {
    let distance = Mathematics.distance(mouseX, mouseY, genetics.target.x, genetics.target.y);
    if (distance < ProjectData.TargetRange)
        return;

    genetics.setTarget(mouseX, mouseY);
}