/** @type {HTMLCanvasElement} */
const mainCanvas = document.getElementById('mainCanvas');

// let board = new Board(0, 0, mainCanvas);
let board = undefined;

const canvasScale = ProjectData.FullWindowCanvas ? 1 : 0.85;
mainCanvas.width = window.innerWidth * canvasScale;
mainCanvas.height = window.innerHeight * canvasScale;
// mainCanvas.width = ProjectData.FieldsWidth * ProjectData.FieldSize;
// mainCanvas.height = ProjectData.FieldsHeight * ProjectData.FieldSize;
loadSettings();

board = new Board(
    ProjectData.FieldsWidth,
    ProjectData.FieldsHeight,
    mainCanvas,
);

translateCanvas();

function translateCanvas() {
    const transX = -(ProjectData.FieldSize * ProjectData.FieldsWidth - mainCanvas.width) * 0.5;
    const transY = -(ProjectData.FieldSize * ProjectData.FieldsHeight - mainCanvas.height) * 0.5;

    mainCanvas.getContext('2d').translate(transX, transY);
    board.controls.canvasXOffset = 0;
    board.controls.canvasYOffset = 0;
}

function updateMainCanvasSize() {

    if (ProjectData.FullWindowCanvas) {
        if (mainCanvas.width != window.innerWidth) {
            mainCanvas.width = window.innerWidth;
            translateCanvas();
        }
        if (mainCanvas.height != window.innerHeight) {
            mainCanvas.height = window.innerHeight;
            translateCanvas();
        }
    } else {
        if (mainCanvas.width != Math.floor(window.innerWidth * canvasScale)) {
            mainCanvas.width = Math.floor(window.innerWidth * canvasScale);
            translateCanvas();
        }
        if (mainCanvas.height != Math.floor(window.innerHeight * canvasScale)) {
            mainCanvas.height = Math.floor(window.innerHeight * canvasScale);
            translateCanvas();
        }
    }
}

animate();
function animate() {

    if (!ProjectData.Pause) {
        board.checkLife();
        updateMainCanvasSize();
    }

    board.update();
    board.draw();

    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / ProjectData.Fps);
}