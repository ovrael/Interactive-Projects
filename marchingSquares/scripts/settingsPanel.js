function getVariable(value, name) {
    switch (value) {
        case -1:
            return '(-' + name + ')';

        case 0:
            return '0 * ' + name;

        case 1:
            return name;

        default:
            return name;
    }
}

function changeEquationText() {
    let eqTextElement = document.getElementById('equationText');
    let eqText = '(';

    eqText += getVariable(ProjectData.Worley0Sign, 'a');
    eqText += ' ' + ProjectData.WorleyOperator0 + ' ';
    eqText += getVariable(ProjectData.Worley1Sign, 'b');
    eqText += ') ' + ProjectData.WorleyOperator1 + ' ';
    eqText += getVariable(ProjectData.Worley2Sign, 'c');

    eqTextElement.innerHTML = eqText;
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

        case 'squareSize':
            ProjectData.SquareSize = Number(slider.value);
            marchingSquares = new MarchingSquares();
            break;

        case 'xNoiseOffset':
            ProjectData.XNoiseOffset = Number(slider.value);

            break;

        case 'yNoiseOffset':
            ProjectData.YNoiseOffset = Number(slider.value);

            break;

        case 'zNoiseChange':
            ProjectData.ZNoiseChange = Number(slider.value);

            break;

        case 'fractalOctaves':
            ProjectData.FractalOctaves = Number(slider.value);

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

        case 'lineColor':
            ProjectData.LineColor = input.value;

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
            marchingSquares.updateNoiseFunction();
            break;

        case 'worley0Select':
            ProjectData.Worley0 = select.value;
            switch (ProjectData.Worley0) {

                case 'none':
                    if (ProjectData.Worley1Sign == 0 && ProjectData.Worley2Sign == 0) {
                        ProjectData.Worley0Sign = 1;
                        ProjectData.Worley0 = '+';
                        select.value = ProjectData.Worley0;
                    } else {
                        ProjectData.Worley0Sign = 0;
                    }
                    break;

                case '-':
                    ProjectData.Worley0Sign = -1;
                    break;

                case '+':
                    ProjectData.Worley0Sign = 1;
                    break;

                default:
                    break;
            }
            changeEquationText();
            marchingSquares.resetAutoMapData();
            break;

        case 'worleyOperator0Select':

            ProjectData.WorleyOperator0 = select.value;
            switch (ProjectData.WorleyOperator0) {

                case '-':
                    ProjectData.Worley0Function = Mathematics.subtract;
                    break;

                case '+':
                    ProjectData.Worley0Function = Mathematics.add;
                    break;

                case '*':
                    ProjectData.Worley0Function = Mathematics.multiply;
                    break;

                default:
                    console.warn("Can't find Worley0Function  for: " + ProjectData.WorleyOperator0 + ' operator');
                    break;
            }
            changeEquationText();
            marchingSquares.resetAutoMapData();
            break;

        case 'worley1Select':
            ProjectData.Worley1 = select.value;
            switch (ProjectData.Worley1) {

                case 'none':
                    if (ProjectData.Worley0Sign == 0 && ProjectData.Worley2Sign == 0) {
                        ProjectData.Worley1Sign = 1;
                        ProjectData.Worley1 = '+';
                        select.value = ProjectData.Worley1;
                    } else {
                        ProjectData.Worley1Sign = 0;
                    }
                    break;

                case '-':
                    ProjectData.Worley1Sign = -1;
                    break;

                case '+':
                    ProjectData.Worley1Sign = 1;
                    break;

                default:
                    break;
            }
            changeEquationText();
            marchingSquares.resetAutoMapData();
            break;

        case 'worleyOperator1Select':
            ProjectData.WorleyOperator1 = select.value;
            switch (ProjectData.WorleyOperator1) {

                case '-':
                    ProjectData.Worley1Function = Mathematics.subtract;
                    break;

                case '+':
                    ProjectData.Worley1Function = Mathematics.add;
                    break;

                case '*':
                    ProjectData.Worley1Function = Mathematics.multiply;
                    break;

                default:
                    console.warn("Can't find Worley1Function  for: " + ProjectData.WorleyOperator1 + ' operator');
                    break;
            }

            changeEquationText();
            marchingSquares.resetAutoMapData();
            break;

        case 'worley2Select':
            ProjectData.Worley2 = select.value;
            switch (ProjectData.Worley2) {

                case 'none':
                    if (ProjectData.Worley1Sign == 0 && ProjectData.Worley0Sign == 0) {
                        ProjectData.Worley2Sign = 1;
                        ProjectData.Worley2 = '+';
                        select.value = ProjectData.Worley2;
                    } else {
                        ProjectData.Worley2Sign = 0;
                    }
                    break;

                case '-':
                    ProjectData.Worley2Sign = -1;
                    break;

                case '+':
                    ProjectData.Worley2Sign = 1;
                    break;

                default:
                    break;
            }
            changeEquationText();
            marchingSquares.resetAutoMapData();
            break;

        default:

            console.warn('Cant find selectChange for: ' + select.id);

            break;

    }
    saveSettings(ProjectData.SettingsName);
}

function checkboxChange(checkbox) {

    switch (checkbox.dataset.variable) {

        case 'drawLines':
            ProjectData.DrawLines = Boolean(checkbox.checked);

            break;

        case 'drawFields':
            ProjectData.DrawFields = Boolean(checkbox.checked);

            break;

        case 'smoothSquares':
            ProjectData.SmoothSquares = Boolean(checkbox.checked);

            break;

        case 'hardBoundaries':
            ProjectData.HardBoundaries = Boolean(checkbox.checked);

            break;

        case 'isFractalNoise':
            ProjectData.IsFractalNoise = Boolean(checkbox.checked);
            marchingSquares.updateNoiseFunction();
            break;

        default:

            console.warn('Cant find checkbox variable for: ' + checkbox.dataset.variable);

            break;

    }
    saveSettings(ProjectData.SettingsName);
}

function resetCanvas() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    centerCanvas();
    marchingSquares = new MarchingSquares();
}

function resetSettings() {
    ProjectData = Object.fromEntries(projectDataBackUp);
    marchingSquares = new MarchingSquares();

    setControlsValues();
    resetCanvas();
}
