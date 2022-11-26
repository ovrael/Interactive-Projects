function resetCanvas() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    centerCanvas();
    terrain = new Terrain();
}

function resetSettings() {
    ProjectData = Object.fromEntries(projectDataBackUp);
    terrain = new Terrain();

    setControlsValues();
    resetCanvas();
}


function sliderChange(slider) {

    document.getElementById(slider.dataset.variable + 'Text').innerHTML = Number(slider.value);

    switch (slider.dataset.variable) {

        case 'canvasWidth':
            ProjectData.CanvasWidth = Number(slider.value);
            resetCanvas();

            break;

        case 'canvasHeight':
            ProjectData.CanvasHeight = Number(slider.value);
            resetCanvas();

            break;

        case 'redFill':
            ProjectData.RedFill = Number(slider.value);

            break;

        case 'greenFill':
            ProjectData.GreenFill = Number(slider.value);

            break;

        case 'blueFill':
            ProjectData.BlueFill = Number(slider.value);

            break;

        case 'maxHeight':
            ProjectData.MaxHeight = Number(slider.value);

            break;

        case 'terrainScale':
            ProjectData.TerrainScale = Number(slider.value);
            terrain = new Terrain();

            break;

        case 'terrainColumnsOffset':
            ProjectData.TerrainColumnsOffset = Number(slider.value);
            terrain = new Terrain();

            break;

        case 'terrainRowsOffset':
            ProjectData.TerrainRowsOffset = Number(slider.value);
            terrain = new Terrain();

            break;

        case 'flyingSpeed':
            ProjectData.FlyingSpeed = Number(slider.value);

            break;

        case 'cameraHeight':
            ProjectData.CameraHeight = Number(slider.value);

            break;

        case 'cameraAngle':
            ProjectData.CameraAngle = Number(slider.value);

            break;

        case 'xNoiseOffset':
            ProjectData.XNoiseOffset = Number(slider.value);

            break;

        case 'yNoiseOffset':
            ProjectData.YNoiseOffset = Number(slider.value);

            break;

        default:

            console.log('Cant find ProjectData.' + slider.dataset.variable);

            break;

    }
    saveSettings(ProjectData.SettingsName);
}

function colorChange(/** @type {HTMLInputElement} */ input) {

    switch (input.dataset.variable) {

        case 'backgroundColor':
            ProjectData.BackgroundColor = input.value;

            break;

        case 'terrainLineColor':
            ProjectData.TerrainLineColor = input.value;

            break;

        default:

            console.warn('Cant find color for: ' + input.dataset.variable);

            break;

    }
    saveSettings(ProjectData.SettingsName);
}

function selectChange(select) {

    switch (select.id) {

        case 'mainColorSelect':
            ProjectData.MainColor = select.value;

            break;

        case 'noiseFunctionSelect':
            ProjectData.NoiseFunction = select.value;
            terrain.updateNoiseFunction();

            break;

        default:

            console.warn('Cant find selectChange for: ' + select.id);

            break;

    }
    saveSettings(ProjectData.SettingsName);
}

function checkboxChange(checkbox) {

    switch (checkbox.dataset.variable) {

        case 'drawTerrainLines':
            ProjectData.DrawTerrainLines = Boolean(checkbox.checked);

            break;

        case 'fillTerrain':
            ProjectData.FillTerrain = Boolean(checkbox.checked);

            break;

        default:

            console.warn('Cant find checkbox variable for: ' + checkbox.dataset.variable);

            break;

    }
    saveSettings(ProjectData.SettingsName);
}

