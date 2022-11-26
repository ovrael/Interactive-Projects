/** @type {HTMLCanvasElement} */
let canvas;
let canvasPixels;

function setup() {
    loadSettings();

    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    canvas.addClass('mainCanvas');

    centerCanvas();

    angleMode(DEGREES);
    background(ProjectData.BackgroundColor);
    frameRate(60);
}

function draw() {
    translate(width / 2, height / 2);

    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {

        let mx = mouseX - width / 2;
        let my = mouseY - height / 2;
        let pmx = pmouseX - width / 2;
        let pmy = pmouseY - height / 2;

        if (mouseIsPressed) {
            for (let i = 0; i < ProjectData.Symmetries; i++) {

                rotate(ProjectData.Angle);
                strokeWeight(ProjectData.BrushSize);
                stroke(ProjectData.BrushColor);

                line(mx, my, pmx, pmy);


                if (ProjectData.ExtraSymmetry) {
                    push();
                    scale(1, -1);
                    line(mx, my, pmx, pmy);
                    pop();
                }
            }
        }
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

// function saveCanvasToLocalStorage() {
//     if (!canvasPixels) {
//         canvasPixels = new Array(ProjectData.CanvasWidth);
//         for (let i = 0; i < canvasPixels.length; i++) {
//             canvasPixels[i] = new Array(ProjectData.CanvasHeight);
//         }
//     }

//     for (let i = 0; i < canvasPixels.length; i++) {
//         for (let j = 0; j < canvasPixels[i].length; j++) {
//             canvasPixels[i][j] = get(i, j);
//         }
//     }

//     storeItem('kaleidoscopeCanvas', canvasPixels);
//     console.log(canvasPixels);
// };

// function loadCanvasFromLocalStorage() {

//     canvasPixels = getItem('kaleidoscopeCanvas');

//     if (canvasPixels != null) {

//         if (canvasPixels.length != ProjectData.CanvasWidth || canvasPixels[0].length != ProjectData.CanvasHeight) {
//             return;
//         }

//         for (let i = 0; i < canvasPixels.length; i++) {
//             for (let j = 0; j < canvasPixels[i].length; j++) {
//                 set(i, j, canvasPixels[i][j]);
//             }
//         }
//     } else {
//         canvasPixels = new Array(ProjectData.CanvasWidth);
//         for (let i = 0; i < canvasPixels.length; i++) {
//             canvasPixels[i] = new Array(ProjectData.CanvasHeight);
//         }
//     }
// }

// Full Screen Function
function screenFull() {
    let fs = fullscreen();
    fullscreen(!fs);
}
