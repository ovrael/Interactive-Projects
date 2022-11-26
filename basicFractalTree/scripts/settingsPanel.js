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

        case 'fruitSize':
            ProjectData.FruitSize = Number(slider.value);
            fractalTree = new FractalTree();

            break;

        case 'growthAngle':
            ProjectData.GrowthAngle = Number(slider.value);

            fractalTree = new FractalTree();

            break;

        case 'growthChange':
            ProjectData.GrowthChange = Number(slider.value);
            fractalTree = new FractalTree();

            break;

        case 'startBranchLength':
            ProjectData.StartBranchLength = Number(slider.value);
            fractalTree = new FractalTree();

            break;

        case 'trunkLength':
            ProjectData.TrunkLength = Number(slider.value);
            fractalTree = new FractalTree();

            break;

        case 'windPowerX':
            ProjectData.WindPowerX = Number(slider.value);

            if (ProjectData.WindDirection == 'right') {
                wind.setForceValues(0, ProjectData.WindPowerX, -ProjectData.WindPowerY, ProjectData.WindPowerY);
            } else if (ProjectData.WindDirection == 'left') {
                wind.setForceValues(-ProjectData.WindPowerX, 0, -ProjectData.WindPowerY, ProjectData.WindPowerY);
            }

            break;

        case 'windPowerY':
            ProjectData.WindPowerY = Number(slider.value);
            if (ProjectData.WindDirection == 'right') {
                wind.setForceValues(0, ProjectData.WindPowerX, -ProjectData.WindPowerY, ProjectData.WindPowerY);
            } else if (ProjectData.WindDirection == 'left') {
                wind.setForceValues(-ProjectData.WindPowerX, 0, -ProjectData.WindPowerY, ProjectData.WindPowerY);
            }

            break;

        case 'windNoiseChangeX':
            ProjectData.WindNoiseChangeX = Number(slider.value);
            wind.setNoiseValues(ProjectData.WindNoiseChangeX, ProjectData.WindNoiseChangeY);

            break;

        case 'windNoiseChangeY':
            ProjectData.WindNoiseChangeY = Number(slider.value);
            wind.setNoiseValues(ProjectData.WindNoiseChangeX, ProjectData.WindNoiseChangeY);
            break;

        case 'jitterPowerX':
            ProjectData.JitterPowerX = Number(slider.value);

            break;

        case 'jitterPowerY':
            ProjectData.JitterPowerY = Number(slider.value);

            break;

        case 'maxAnimateLevel':
            ProjectData.MaxAnimateLevel = Number(slider.value);

            break;

        case 'growthRateInMs':
            ProjectData.GrowthRateInMs = Number(slider.value);

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

        case 'treeColor':
            ProjectData.TreeColor = input.value;

            break;

        case 'fruitColor':
            ProjectData.FruitColor = input.value;
            fractalTree = new FractalTree();

            break;

        default:

            console.warn('Cant find color for: ' + input.dataset.variable);

            break;

    }
    saveSettings(ProjectData.SettingsName);
}

function checkboxChange(checkbox) {

    switch (checkbox.dataset.variable) {

        case 'realColors':
            ProjectData.RealColors = Boolean(checkbox.checked);

            break;

        case 'showFruit':
            ProjectData.ShowFruit = Boolean(checkbox.checked);

            break;

        case 'applyWind':
            ProjectData.ApplyWind = Boolean(checkbox.checked);
            // fractalTree.clearVelocity();

            break;

        case 'applyJitter':
            ProjectData.ApplyJitter = Boolean(checkbox.checked);

            break;

        case 'animate':
            ProjectData.Animate = Boolean(checkbox.checked);
            fractalTree = new FractalTree();

            break;

        case 'recreateTree':
            ProjectData.RecreateTree = Boolean(checkbox.checked);

            break;

        case 'newRandom':
            ProjectData.NewRandom = Boolean(checkbox.checked);

            break;

        default:

            console.warn('Cant find checkbox variable for: ' + checkbox.dataset.variable);

            break;

    }
    saveSettings(ProjectData.SettingsName);
}

function selectChange(select) {

    switch (select.id) {

        case 'windDirectionSelect':
            ProjectData.WindDirection = select.value;

            if (ProjectData.WindDirection == 'right') {
                wind.setForceValues(0, ProjectData.WindPowerX, -ProjectData.WindPowerY, ProjectData.WindPowerY);
            } else if (ProjectData.WindDirection == 'left') {
                wind.setForceValues(-ProjectData.WindPowerX, 0, -ProjectData.WindPowerY, ProjectData.WindPowerY);
            }

            break;

        default:

            console.warn('Cant find selectChange for: ' + select.id);

            break;

    }
    saveSettings(ProjectData.SettingsName);
}

function resetSettings() {
    ProjectData = Object.fromEntries(projectDataBackUp);
    fractalTree = new FractalTree();

    setControlsValues();
    resetCanvas();
}