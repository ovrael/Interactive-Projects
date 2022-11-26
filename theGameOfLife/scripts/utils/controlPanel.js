function resetBoard() {
    board.reset();
}

function clearBoard() {
    board.clear();
}

function pauseBoard() {
    changePause();
}

function changePause() {
    ProjectData.Pause = !ProjectData.Pause;

    if (ProjectData.Pause) {
        ProjectData.Fps += 60;
        document.getElementById('pauseButton').innerHTML = 'Play <i class="bi bi-play-fill"></i>';
        document.getElementById('statusPanel').innerHTML = '<i class="bi bi-pause-fill"></i>';
    } else {
        ProjectData.Fps -= 60;
        document.getElementById('pauseButton').innerHTML = 'Pause <i class="bi bi-pause-fill"></i>';
        document.getElementById('statusPanel').innerHTML = '<i class="bi bi-play-fill"></i>';
    }

    document.getElementById('pauseButton').blur();
}