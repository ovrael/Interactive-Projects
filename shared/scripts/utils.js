function randColor() {
    const min = 90;
    const red = Mathematics.randIntMinMax(min, 256);
    const green = Mathematics.randIntMinMax(min, 256);
    const blue = Mathematics.randIntMinMax(min, 256);

    return 'rgb(' + red + ',' + green + ',' + blue + ')';
}

function randVividColor_HSL() {
    return 'hsl(' + 360 * Math.random() + ',100%,50%)';
}

function addValue(variableName) {
    let parameter = document.getElementById(variableName + 'Text');
    let slider = document.getElementById(variableName + 'Slider');
    let value = Number(parameter.innerHTML);
    if (value < slider.max)
        value += Number(slider.step);

    slider.value = value;
    parameter.innerHTML = roundValue(value);
    sliderChange(slider);
}

function subtractValue(variableName) {
    let parameter = document.getElementById(variableName + 'Text');
    let slider = document.getElementById(variableName + 'Slider');
    let value = Number(parameter.innerHTML);
    if (value > slider.min)
        value -= Number(slider.step);

    slider.value = value;
    parameter.innerHTML = roundValue(value);

    sliderChange(slider);
}


let mouseIsDown = false;

function mouseDown(variable, type) {
    mouseIsDown = true;

    function mouseHold(variable, type) {

        setTimeout(function () {
            if (mouseIsDown) {
                if (type == '+') {
                    addValue(variable);
                } else if (type == '-') {
                    subtractValue(variable);
                }
                else {
                    console.log('Cant recognize type: ' + type);
                }
                mouseHold(variable, type);
            }
        }, 75);
    }

    setTimeout(function () {
        if (mouseIsDown)
            mouseHold(variable, type);
    }, 300);
}

function mouseUp() {
    mouseIsDown = false;
}


/**
 * It splits the string at every capital letter and joins the resulting array with a space.
 * @param methodName - The name of the method to be renamed.
 * @returns The method name is being split into an array of strings, and then joined back together with
 * a space in between each string.
 */
function rename(methodName) {
    return methodName.split(/(?=[A-Z])/).join(" ");
}

function roundValue(value, minimumFractionDigits, maximumFractionDigits) {
    const formattedValue = value.toLocaleString('en', {
        useGrouping: false,
        minimumFractionDigits,
        maximumFractionDigits
    })
    return Number(formattedValue)
}

function shadeColor(color, percent) {

    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}

function firstLetterToLower(str) {
    return str[0].toLowerCase() + str.slice(1);
}

function toLowerFirstLetter(str) {
    return str[0].toLowerCase() + str[1].toLowerCase() + str.slice(2);
}

function toUpperFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function addZerosAtBeggining(number, digitsCount = 2) {
    return String(number).padStart(digitsCount, '0');
}

function preventRightClickOnCanvas() {
    let canvasElement = document.getElementsByTagName('canvas')[0];
    canvasElement.addEventListener('contextmenu', (ev) => {
        ev.preventDefault(); // this will prevent browser default behavior 
    });
}