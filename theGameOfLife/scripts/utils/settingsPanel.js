function forceCanvasResize() {
    mainCanvas.width--;
    mainCanvas.height--;
}

function sliderChange(slider) {

    document.getElementById(slider.dataset.variable + 'Text').innerHTML = Number(slider.value);
    switch (slider.dataset.variable) {

        case 'fieldsWidth':
            ProjectData.FieldsWidth = Number(slider.value);

            if (board !== undefined) {
                board.updateWidth();
                forceCanvasResize();
            }
            break;

        case 'fieldsHeight':
            ProjectData.FieldsHeight = Number(slider.value);

            if (board !== undefined) {
                board.updateHeight();
                forceCanvasResize();
            }

            break;

        case 'fieldSize':

            if (board !== undefined) {
                board.updateFieldSize(Number(slider.value));
                forceCanvasResize();
            }

            break;

        case 'aliveChance':
            ProjectData.AliveChance = Number(slider.value);
            break;

        case 'generateBlockadesChance':
            ProjectData.GenerateBlockadesChance = Number(slider.value);
            break;

        case 'fps':
            ProjectData.Fps = Number(slider.value);
            break;

        default:
            console.log('Cant find ProjectData.' + slider.dataset.variable);
            break;
    }

    saveSettings();
}

function colorChange(input) {
    switch (input.dataset.variable) {
        case 'emptyColor':
            ProjectData.EmptyColor = input.value;
            break;

        case 'aliveColor':
            ProjectData.AliveColor = input.value;
            break;

        case 'blockadeColor':
            ProjectData.BlockadeColor = input.value;
            break;

        default:
            console.warn('Cant find color for: ' + input.dataset.variable);
            break;
    }

    saveSettings();
}

function changeMouseControls() {
    ProjectData.ComfortableControls = !ProjectData.ComfortableControls;
}