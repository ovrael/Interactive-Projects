function sliderChange(slider) {
    usedSlider = true;
    document.getElementById(slider.dataset.variable + 'Text').innerHTML = Number(slider.value);

    switch (slider.dataset.variable) {

        case 'headWidth':
            ProjectData.HeadWidth = Number(slider.value);

            break;

        case 'headHeight':
            ProjectData.HeadHeight = Number(slider.value);

            break;

        case 'headLength':
            ProjectData.HeadLength = Number(slider.value);

            break;

        case 'beakWidth':
            ProjectData.BeakWidth = Number(slider.value);

            break;

        case 'beakHeight':
            ProjectData.BeakHeight = Number(slider.value);

            break;

        case 'beakLength':
            ProjectData.BeakLength = Number(slider.value);

            break;

        case 'bodyWidth':
            ProjectData.BodyWidth = Number(slider.value);

            break;

        case 'bodyHeight':
            ProjectData.BodyHeight = Number(slider.value);

            break;

        case 'bodyLength':
            ProjectData.BodyLength = Number(slider.value);

            break;

        case 'wingWidth':
            ProjectData.WingWidth = Number(slider.value);

            break;

        case 'wingHeight':
            ProjectData.WingHeight = Number(slider.value);

            break;

        case 'wingLength':
            ProjectData.WingLength = Number(slider.value);

            break;

        case 'tailWidth':
            ProjectData.TailWidth = Number(slider.value);

            break;

        case 'tailHeight':
            ProjectData.TailHeight = Number(slider.value);

            break;

        case 'tailLength':
            ProjectData.TailLength = Number(slider.value);

            break;

        case 'tailAngle':
            ProjectData.TailAngle = -(Number(slider.value) / 180) * Math.PI;

            break;

        case 'legHeight':
            ProjectData.LegHeight = Number(slider.value);

            break;

        case 'legSpacing':
            ProjectData.LegSpacing = Number(slider.value);

            break;

        case 'legFingerLength':
            ProjectData.LegFingerLength = Number(slider.value);

            break;

        case 'legFingerAngle':
            ProjectData.LegFingerAngle = (Number(slider.value) / 180) * Math.PI;

            break;

        default:

            console.log('Cant find ProjectData.' + slider.dataset.variable);

            break;

    }
    saveSettings(ProjectData.SettingsName);
}

function colorChange(/** @type {HTMLInputElement} */ input) {

    switch (input.dataset.variable) {

        case 'beakColor':
            ProjectData.BeakColor = input.value;

            break;

        case 'bodyColor':
            ProjectData.BodyColor = input.value;

            break;

        case 'legColor':
            ProjectData.LegColor = input.value;

            break;

        case 'legFingerColor':
            ProjectData.LegFingerColor = input.value;

            break;

        default:

            console.warn('Cant find color for: ' + input.dataset.variable);

            break;

    }
    saveSettings(ProjectData.SettingsName);
}

