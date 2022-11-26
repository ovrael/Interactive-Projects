let loadedSettings = false;

function saveSettings() {
    if (loadedSettings) {
        localStorage.removeItem('gameOfLifeSettings');
        let jsonSettings = JSON.stringify(Object.entries(ProjectData));
        localStorage.setItem('gameOfLifeSettings', jsonSettings);
    }
}

function loadSettings() {

    if (localStorage.getItem("gameOfLifeSettings") == null) {
        loadedSettings = true;
        return;
    }

    let jsonSettings = localStorage.getItem('gameOfLifeSettings');
    let loadJson = JSON.parse(jsonSettings);
    ProjectData = Object.fromEntries(loadJson);

    setControlsValues();
    loadedSettings = true;
}

function setControlsValues() {
    let entries = Object.entries(ProjectData);

    for (let i = 0; i < entries.length; i++) {

        const name = entries[i][0];
        const value = entries[i][1];

        let controlNode = document.getElementById(toLowerFirstLetter(name) + 'Slider');
        let type = 'slider';

        if (!controlNode) {
            controlNode = document.getElementById(toLowerFirstLetter(name) + 'Select');
            type = 'select';
        }
        if (!controlNode) {
            controlNode = document.getElementById(toLowerFirstLetter(name) + 'Input');
            type = 'input';
        }
        if (!controlNode) {
            controlNode = document.getElementById(toLowerFirstLetter(name) + 'Checkbox');
            type = 'checkbox';
        }

        if (!controlNode) {
            console.warn("NO CONTROL NODE FOR: " + name);
            continue;
        }

        switch (type) {
            case 'slider':
                controlNode.value = Number(value);
                sliderChange(controlNode);
                break;

            case 'select':
                controlNode.value = value;
                selectChange(controlNode);
                break;

            case 'input':
                controlNode.value = value;
                colorChange(controlNode);
                break;

            case 'checkbox':
                controlNode.checked = value;
                break;
        }
    }
}

function saveUserBoard() {
    let jsonBoard = JSON.stringify(board.fields);
    localStorage.setItem('userBoard', jsonBoard);
    document.getElementById('saveUserBoardButton').blur();
}

function loadBoard(name) {
    if (localStorage.getItem(name) == null) {
        return;
    }

    document.getElementById('loadBoardButton').blur();
    let jsonBoard = localStorage.getItem(name);
    let loadedBoard = JSON.parse(jsonBoard);
    board.loadBoard(loadedBoard);
    updateSliders();
    forceCanvasResize();
    updateMainCanvasSize();
}

function updateSliders() {
    document.getElementById('fieldsWidthSlider').value = ProjectData.FieldsWidth;
    sliderChange(document.getElementById('fieldsWidthSlider'));

    document.getElementById('fieldsHeightSlider').value = ProjectData.FieldsHeight;
    sliderChange(document.getElementById('fieldsHeightSlider'));
}