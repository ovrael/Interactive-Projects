const boardCanvas = document.getElementById("boardCanvas");
boardCanvas.width = ProjectData.BoardFieldsWidth * ProjectData.BoardFieldSize;
boardCanvas.height = ProjectData.BoardFieldsHeight * ProjectData.BoardFieldSize;

// document.getElementById("scoreDiv").style.top = (window.innerHeight - ProjectData.BoardFieldsHeight * ProjectData.BoardFieldSize) / 2 - 90 + 'px';

const boardCtx = boardCanvas.getContext("2d");
var board = new Board(
    ProjectData.BoardFieldsWidth,
    ProjectData.BoardFieldsHeight,
    ProjectData.BoardFieldSize,
    ProjectData.MaxFood
);

Game.loadRanking();
const fireworks = new Fireworks();

let updatingGame = false;

animate();
function animate() {

    if (!ProjectData.Pause && !ProjectData.GameOver) {
        if (!updatingGame) {
            updatingGame = true;
            board.update();
            board.draw(boardCtx);
            setTimeout(() => {
                updatingGame = false;
            }, 1000 / ProjectData.Speed);
        }
    }

    if (fireworks.shooting) {
        fireworks.update();
        fireworks.draw();
    }

    requestAnimationFrame(animate);
}