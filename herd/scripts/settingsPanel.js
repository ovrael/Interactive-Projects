// let canvasNeedsReset = false;

function sliderChange(slider) {
    usedSlider = true;
    setTimeout(() => {
        usedSlider = false;
    }, 800);
    document.getElementById(slider.dataset.variable + 'Text').innerHTML = Number(slider.value);

    switch (slider.dataset.variable) {

        case 'canvasWidth':
            ProjectData.CanvasWidth = Number(slider.value);

            break;

        case 'canvasHeight':
            ProjectData.CanvasHeight = Number(slider.value);

            break;

        case 'quadtreeCapacity':
            ProjectData.QuadtreeCapacity = Number(slider.value);

            break;

        case 'quadtreeMaxDepth':
            ProjectData.QuadtreeMaxDepth = Number(slider.value);

            break;

        case 'accuracy':
            ProjectData.Accuracy = Number(slider.value);

            break;

        case 'herdSize':
            ProjectData.HerdSize = Number(slider.value);
            herd.changeHerdSize();

            break;

        case 'clickCreateCount':
            ProjectData.ClickCreateCount = Number(slider.value);

            break;

        case 'unitSize':
            ProjectData.UnitSize = Number(slider.value);

            if (!ProjectData.UnitRandomSize)
                herd.restoreUnitsSize();

            break;

        case 'unitMinSpeed':
            ProjectData.UnitMinSpeed = Number(slider.value);

            break;

        case 'unitMaxSpeed':
            ProjectData.UnitMaxSpeed = Number(slider.value);

            break;

        case 'alignSearchDistance':
            ProjectData.AlignSearchDistance = Number(slider.value);

            break;

        case 'cohesionSearchDistance':
            ProjectData.CohesionSearchDistance = Number(slider.value);

            break;

        case 'separationSearchDistance':
            ProjectData.SeparationSearchDistance = Number(slider.value);

            break;

        case 'unitMaxForce':
            ProjectData.UnitMaxForce = Number(slider.value);

            break;

        case 'unitAlignForce':
            ProjectData.UnitAlignForce = Number(slider.value);

            break;

        case 'unitCohesionForce':
            ProjectData.UnitCohesionForce = Number(slider.value);

            break;

        case 'unitSeparationForce':
            ProjectData.UnitSeparationForce = Number(slider.value);

            break;

        default:

            console.log('Cant find ProjectData.' + slider.dataset.variable);

            break;

    }

    if (loadedSettings)
        saveSettings("HerdProject");
}

function colorChange(/** @type {HTMLInputElement} */ input) {

    switch (input.dataset.variable) {

        case 'backgroundColor':
            ProjectData.BackgroundColor = input.value;

            break;

        case 'unitColor':
            ProjectData.UnitColor = input.value;
            if (!ProjectData.UnitRandomColor)
                herd.restoreUnitsColor();
            break;

        default:

            console.warn('Cant find color for: ' + input.dataset.variable);

            break;

    }
    saveSettings("HerdProject");
}

function selectChange(select) {
    switch (select.id) {

        case 'unitTypeSelect':
            ProjectData.UnitType = select.value;
            if (ProjectData.UnitType == 'point') {
                document.getElementById('unitFillCheckbox').disabled = true;
            } else {
                document.getElementById('unitFillCheckbox').disabled = false;
            }
            break;

        default:

            console.warn('Cant find selectChange for: ' + select.id);

            break;

    }
    saveSettings("HerdProject");
}

function checkboxChange(checkbox) {

    switch (checkbox.dataset.variable) {

        case 'quadtreeAutomateData':
            ProjectData.QuadtreeAutomateData = Boolean(checkbox.checked);

            break;

        case 'unitRandomSize':
            ProjectData.UnitRandomSize = Boolean(checkbox.checked);
            ProjectData.UnitRandomSize ? herd.randomUnitsSize() : herd.restoreUnitsSize();

            break;

        case 'unitRandomColor':
            ProjectData.UnitRandomColor = Boolean(checkbox.checked);
            ProjectData.UnitRandomColor ? herd.randomUnitsColor() : herd.restoreUnitsColor();

            break;

        case 'drawTail':
            ProjectData.DrawTail = Boolean(checkbox.checked);

            break;

        case 'unitFill':
            ProjectData.UnitFill = Boolean(checkbox.checked);

            break;

        case 'colorBasedOnSpeed':
            ProjectData.ColorBasedOnSpeed = Boolean(checkbox.checked);

            break;

        case 'hardBoundary':
            ProjectData.HardBoundary = Boolean(checkbox.checked);

            break;

        case 'useMass':
            ProjectData.UseMass = Boolean(checkbox.checked);

            break;

        case 'unitRandomMove':
            ProjectData.UnitRandomMove = Boolean(checkbox.checked);

            break;

        case 'showDebug':
            ProjectData.ShowDebug = Boolean(checkbox.checked);

            break;

        case 'showDebugAlign':
            ProjectData.ShowDebugAlign = Boolean(checkbox.checked);

            break;

        case 'showDebugCohesion':
            ProjectData.ShowDebugCohesion = Boolean(checkbox.checked);

            break;

        case 'showDebugSeparation':
            ProjectData.ShowDebugSeparation = Boolean(checkbox.checked);

            break;

        default:

            console.warn('Cant find checkbox variable for: ' + checkbox.dataset.variable);

            break;

    }
    saveSettings("HerdProject");
}

function resetCanvas() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    centerCanvas();
}

function resetSettings() {
    ProjectData = Object.fromEntries(projectDataBackUp);

    if (ProjectData.UnitRandomSize)
        herd.randomUnitsSize();
    else
        herd.restoreUnitsSize();

    if (ProjectData.UnitRandomColor)
        herd.randomUnitsColor();
    else
        herd.restoreUnitsColor();

    setControlsValues();
    resetCanvas();
}
