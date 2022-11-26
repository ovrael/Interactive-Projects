/** @type {HTMLCanvasElement} */
let canvas;
let fractalTree = new LSystemFractalTree();
let projectDataBackUp = Object.entries(ProjectData);

/** @type {systemL} */
let sysL;

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();
    angleMode(DEGREES)

    sysL = new systemL();

    sysL.addSigns('F+-[]');

    sysL.addRule('F', 'FF+[+F-F-F-F]-[-F+F+F+F]');
    sysL.generateSentence(0, 'F');


    stroke(255, 100);
    strokeWeight(2);
}

function draw() {

    fractalTree.draw(sysL.sentence);
}

function windowResized() {
    centerCanvas();
}

function mousePressed() {
    sysL.nextGeneration();
    ProjectData.CurrentBranchLength *= 0.55;
    // fractalTree.draw(sysL.sentence);
}

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    canvas.position(x, y);
}

function resetCanvas() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    centerCanvas();
    fractalTree = new fractalTree();
}