function sliderChange(slider) {

    document.getElementById(slider.dataset.variable + 'Text').innerHTML = Number(slider.value);
    switch (slider.dataset.variable) {

        case 'canvasWidth':
            ProjectData.CanvasWidth = Number(slider.value);
            break;

        case 'canvasHeight':
            ProjectData.CanvasHeight = Number(slider.value);
            break;

        case 'symmetries':
            ProjectData.Symmetries = Number(slider.value);
            ProjectData.Angle = 360 / ProjectData.Symmetries;
            break;

        case 'brushSize':
            ProjectData.BrushSize = Number(slider.value);
            break;

        default:
            console.log('Cant find ProjectData.' + slider.dataset.variable);
            break;
    }

    saveSettings();
}

function colorChange(/** @type {HTMLInputElement} */ input) {
    switch (input.dataset.variable) {
        case 'backgroundColor':
            ProjectData.BackgroundColor = input.value;
            break;

        case 'brushColor':
            ProjectData.BrushColor = input.value;
            break;

        default:
            console.warn('Cant find color for: ' + input.dataset.variable);
            break;
    }

    saveSettings();
}

function resetCanvas() {
    background(ProjectData.BackgroundColor);
}

function savePicture() {
    var canvas = document.querySelector("canvas");

    var imageObject = new Image();
    imageObject.src = canvas.toDataURL("image/png");


    var imageElement = document.getElementById("photoDownloader");
    imageElement.src = imageObject.src;


    // Saving it locally automatically
    let link = document.createElement("a");
    link.setAttribute('download', "download");
    link.href = imageElement.src;
    link.click();
}