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

        case 'populationSize':
            ProjectData.PopulationSize = Number(slider.value);
            var oldTarget = genetics.target.copy();
            genetics = new Genetics();
            genetics.setTarget(oldTarget.x, oldTarget.y);

            break;

        case 'eliteUnits':
            ProjectData.EliteUnits = Number(slider.value);
            var oldTarget = genetics.target.copy();
            genetics = new Genetics();
            genetics.setTarget(oldTarget.x, oldTarget.y);
            break;

        case 'mutationChance':
            ProjectData.MutationChance = Number(slider.value);
            var oldTarget = genetics.target.copy();
            genetics = new Genetics();
            genetics.setTarget(oldTarget.x, oldTarget.y);
            break;

        case 'bestGenesStrength':
            ProjectData.BestGenesStrength = Number(slider.value);
            break;

        case 'lifespan':
            ProjectData.Lifespan = Number(slider.value);
            var oldTarget = genetics.target.copy();
            genetics = new Genetics();
            genetics.setTarget(oldTarget.x, oldTarget.y);
            break;

        case 'maxForce':
            ProjectData.MaxForce = Number(slider.value);

            break;

        case 'maxVelocity':
            ProjectData.MaxVelocity = Number(slider.value);

            break;

        case 'distanceFactor':
            ProjectData.DistanceFactor = Number(slider.value);

            break;

        case 'speedFactor':
            ProjectData.SpeedFactor = Number(slider.value);

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

        case 'rocketColor':
            ProjectData.RocketColor = input.value;

            break;

        case 'eliteRocketColor':
            ProjectData.EliteRocketColor = input.value;

            break;

        case 'obstacleColor':
            ProjectData.ObstacleColor = input.value;

            break;

        case 'targetColor':
            ProjectData.TargetColor = input.value;

            break;

        default:

            console.warn('Cant find color for: ' + input.dataset.variable);

            break;

    }
    saveSettings(ProjectData.SettingsName);
}

function checkboxChange(checkbox) {

    switch (checkbox.dataset.variable) {

        case 'showDebug':
            ProjectData.ShowDebug = Boolean(checkbox.checked);

            break;

        case 'showPopulationDebug':
            ProjectData.ShowPopulationDebug = Boolean(checkbox.checked);

            break;

        case 'showRocketDebug':
            ProjectData.ShowRocketDebug = Boolean(checkbox.checked);

            break;

        case 'showBestDebug':
            ProjectData.ShowBestDebug = Boolean(checkbox.checked);

            break;

        default:

            console.warn('Cant find checkbox variable for: ' + checkbox.dataset.variable);

            break;

    }
    saveSettings(ProjectData.SettingsName);
}



