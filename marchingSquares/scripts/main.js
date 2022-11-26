/** @type {HTMLCanvasElement} */
let canvas;
let marchingSquares;
let projectDataBackUp = Object.entries(ProjectData);

// document.addEventListener('DOMContentLoaded', function () {
//     loadSettings(ProjectData.SettingsName);

//     if (ProjectData.Worley0Function == null)
//         ProjectData.Worley0Function = Mathematics.subtract;
//     if (ProjectData.Worley1Function == null)
//         ProjectData.Worley1Function = Mathematics.subtract;
// }, false);

function setup() {

    loadSettings(ProjectData.SettingsName);

    if (ProjectData.Worley0Function == null)
        ProjectData.Worley0Function = Mathematics.subtract;
    if (ProjectData.Worley1Function == null)
        ProjectData.Worley1Function = Mathematics.subtract;

    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();

    marchingSquares = new MarchingSquares();
}

function draw() {
    background(ProjectData.BackgroundColor);

    marchingSquares.update();
    marchingSquares.show();
}

function windowResized() {
    centerCanvas();
}

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    canvas.position(x, y);
}