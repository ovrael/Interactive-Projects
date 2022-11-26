function openMoveUI() {
    document.getElementById('pauseTextDiv').style.left = "30%";

    document.getElementById('scoreDiv').style.top = "30px";
    document.getElementById('scoreDiv').style.left = "30%";

    document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Escape' }));
}

function closeMoveUI() {
    document.getElementById('pauseTextDiv').style.left = "50%";

    if (ProjectData.BoardFieldsWidth <= 15) {
        document.getElementById('scoreDiv').style.top = "20%";
        document.getElementById('scoreDiv').style.left = "20%";
    }
    else {
        document.getElementById('scoreDiv').style.top = "30px";
        document.getElementById('scoreDiv').style.left = "50%";
    }
}

function resetGame() {
    board = new Board(
        ProjectData.BoardFieldsWidth,
        ProjectData.BoardFieldsHeight,
        ProjectData.BoardFieldSize,
        ProjectData.MaxFood
    );

    fireworks.stop();

    ProjectData.GameOver = false;
    $('#scoreDiv').toggleClass('smallScore bigScore');
    document.getElementById('scoreTextDiv').hidden = false;
    document.getElementById('gameOverDiv').hidden = true;
    document.getElementById('resetGameButton').hidden = true;
    document.getElementById('newRecordDiv').hidden = true;
}

function resetRanking(button) {
    if (button.dataset.security == "reset") {
        button.innerHTML = "Are you sure? 💀";
        button.dataset.security = "accept";
        button.disabled = true;
        setTimeout(() => {
            button.disabled = false;
        }, 1500);

    } else {
        Game.resetRanking();
        button.innerHTML = 'Reset ranking <i class="bi bi-trash"></i>';
        button.dataset.security = "reset";

        let resetAlert = document.getElementById("successResetRankingAlert");
        resetAlert.hidden = false;
        resetAlert.classList.remove("alertHide");

        setTimeout(() => {
            resetAlert.classList.add("alertHide");
        }, 2000);
    }
}

function changePlayerName(newPlayerName) {
    const invalidName = document.getElementById('invalidPlayerName');
    if (newPlayerName.length < 3) {
        invalidName.hidden = false;
        invalidName.innerHTML = "Player name is too short! Must be at least 3 characters."
        return;
    }
    invalidName.hidden = true;

    ProjectData.PlayerName = newPlayerName;
}

function sliderChange(slider) {

    document.getElementById(slider.dataset.variable + 'Text').innerHTML = Number(slider.value);
    switch (slider.dataset.variable) {

        case 'boardFieldsWidth':
            ProjectData.BoardFieldsWidth = Number(slider.value);
            board.updateWidth();

            slider.value = ProjectData.BoardFieldsWidth;
            document.getElementById(slider.dataset.variable + 'Text').innerHTML = Number(slider.value);
            boardCanvas.width = ProjectData.BoardFieldsWidth * ProjectData.BoardFieldSize;

            break;

        case 'boardFieldsHeight':
            ProjectData.BoardFieldsHeight = Number(slider.value);
            board.updateHeight();

            slider.value = ProjectData.BoardFieldsHeight;
            document.getElementById(slider.dataset.variable + 'Text').innerHTML = Number(slider.value);
            boardCanvas.height = ProjectData.BoardFieldsHeight * ProjectData.BoardFieldSize;

            break;

        case 'boardFieldSize':
            ProjectData.BoardFieldSize = Number(slider.value);
            board.updateFieldSize();

            boardCanvas.width = ProjectData.BoardFieldsWidth * ProjectData.BoardFieldSize;
            boardCanvas.height = ProjectData.BoardFieldsHeight * ProjectData.BoardFieldSize;
            break;

        case 'maxFood':
            ProjectData.MaxFood = Number(slider.value);
            board.updateMaxFood();
            break;

        case 'speed':
            ProjectData.Speed = Number(slider.value);
            break;

        default:
            console.log('Cant find ProjectData.' + slider.dataset.variable);
            break;
    }
}

function colorChange(input) {
    switch (input.dataset.variable) {
        case 'boardColor':
            ProjectData.BoardColor = input.value;
            break;

        case 'snakeColor':
            ProjectData.SnakeColor = input.value;
            ProjectData.SnakeHeadColor = shadeColor(ProjectData.SnakeColor, 60);
            ProjectData.SnakeTailColor = shadeColor(ProjectData.SnakeColor, -20);
            break;

        case 'foodColor':
            ProjectData.FoodColor = input.value;
            break;

        default:
            console.warn('Cant find color for: ' + input.dataset.variable);
            break;
    }
}