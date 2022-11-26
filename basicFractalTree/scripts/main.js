/** @type {HTMLCanvasElement} */
let canvas;
let projectDataBackUp = Object.entries(ProjectData);

/** @type {FractalTree} */
let fractalTree;
/** @type {Force} */
let wind;

let isRecreating = false;

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();

    angleMode(DEGREES);

    wind = new Force(
        0,
        ProjectData.WindPowerX,
        -ProjectData.WindPowerY,
        ProjectData.WindPowerY,
        '',
        ProjectData.WindNoiseChangeX,
        ProjectData.WindNoiseChangeY);
    fractalTree = new FractalTree();

    loadSettings(ProjectData.SettingsName);
}

function draw() {
    background(ProjectData.BackgroundColor);

    // wind.update();
    if (ProjectData.ApplyWind) fractalTree.applyForce(wind);

    fractalTree.update();
    fractalTree.show();

    if (ProjectData.Animate && ProjectData.RecreateTree) {

        if (fractalTree.getMaxLevel() == ProjectData.MaxAnimateLevel && !isRecreating) {
            isRecreating = true;
            setTimeout(() => {
                isRecreating = false;
                fractalTree = new FractalTree();
            }, 2000)
        }
    }
}

// RESET TREE
// function mousePressed() {
//     ProjectData.CurrentLevel = ProjectData.MinLevel + 2;
//     fractalTree = new FractalTree();
// }

function keyPressed() {
    if (ProjectData.Animate)
        return;

    if (keyCode === UP_ARROW || keyCode === 'W'.codePointAt()) {
        fractalTree.grow();
    } else if (keyCode === DOWN_ARROW || keyCode === 'S'.codePointAt()) {
        fractalTree.shrink();
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
    fractalTree = new FractalTree();
}