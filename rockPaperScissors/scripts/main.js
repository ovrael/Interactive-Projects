/** @type {HTMLCanvasElement} */
let canvas;
let projectDataBackUp = Object.entries(ProjectData);
/** @type {Game} */
let game;

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();

    game = new Game(width, height, ProjectData.PlayersCount);
}

function draw() {
    background(90);

    game.update();
    game.draw();
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