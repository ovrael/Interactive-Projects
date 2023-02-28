/** @type {HTMLCanvasElement} */
let canvas;

/** @type {NeuralNetwork} */
let model;
let projectDataBackUp = Object.entries(ProjectData);
let nnDrawer;
let data;
let images;
let rawData;
let trainImage;
let imageElement;
let epoch;
let train;
let userDigit;
let userIsDrawing;
let emptyImage;
let userPrediction;

function preload() {
    // readTextFile('./digits10k.bin');
    // prepareDigitImages(rawData);

    readTextFile('./digits_4kEach_zeroCounter.bin');
    prepareDigitImagesWithZeroCounter(rawData, 4);

    console.log(data);
}

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                rawData = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
}

// function prepareDigitImages(rawData) {
//     data = { X: [], Y: [] };
//     images = [];

//     const inputsCount = 1;

//     const rows = rawData.split("\n");
//     for (let i = 0; i < rows.length / inputsCount; i++) {
//         let pixels = rows[i * inputsCount].split(" ");
//         data.Y.push(pixels[0]);
//         data.X.push(pixels.slice(1, 785).map(p => p / 255));
//         images.push(pixels.slice(1, 785).map(p => p / 255));
//     }
// }

function prepareDigitImagesWithZeroCounter(rawData, noiseSamples) {

    data = { X: [], Y: [] };
    images = [];

    const allRows = 40000;
    const digitCount = 1000; // all clear rows + noiseSamples* noise rows
    const inputsCount = allRows / digitCount;

    const rows = rawData.split("\n");
    for (let i = 0; i < rows.length / inputsCount; i++) {
        let pixels = rows[i * inputsCount].split(" ");

        let dataRow = [];
        for (let j = 1; j < pixels.length - 1; j++) {
            if (pixels[j].includes("x")) {
                let zeroCounts = pixels[j].split("x")[0];
                for (let k = 0; k < Number(zeroCounts); k++) {
                    dataRow.push(0);
                }
            }
            else {
                dataRow.push(pixels[j] / 255);
            }
        }

        data.Y.push(pixels[0]);
        data.X.push(dataRow);
        images.push(dataRow);

        for (let j = 0; j < noiseSamples; j++) {
            const noiseRow = DataManage.noiseSingleRow(dataRow);
            data.Y.push(pixels[0]);
            data.X.push(noiseRow);
            images.push(noiseRow);
        }
    }
}

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();

    const inputLenght = data.X[0].length;
    model = new NeuralNetwork(LossFunctions.MultiClassification.SimpleSubtraction, 0.000005);
    model.addLayer(inputLenght, ActivationFunctions.Tanh);
    model.addLayer(256, ActivationFunctions.Sigmoid);
    model.addLayer(10, ActivationFunctions.SoftMax);
    epoch = 0;
    training = false;

    userDigit = createGraphics(200, 200);
    userDigit.pixelDensity(1);
    userDigit.background(0);

    userIsDrawing = false;
    emptyImage = true;
    userPrediction = { index: -1, activation: 0 };

    // nnDrawer = new NeuralNetworkDrawer(model, 100);
    // nnDrawer.drawOutput(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
}

function draw() {
    background(71, 71, 71);
    showImage();

    const xOffset = ProjectData.CanvasWidth / 2 - 100;
    const yOffset = ProjectData.CanvasHeight / 2 - 100;

    image(userDigit, xOffset, yOffset);
    if (mouseIsPressed) {
        userIsDrawing = true;
        emptyImage = false;
        userDigit.stroke(255);
        userDigit.strokeWeight(6);
        userDigit.line(mouseX - xOffset, mouseY - yOffset, pmouseX - xOffset, pmouseY - yOffset);
    }
    else {
        userIsDrawing = false;
    }

    if (training && !userIsDrawing) {
        fill(250, 160, 50);
        text("Training", ProjectData.CanvasWidth / 2 - 70, 140);
        epoch++;
        console.warn("TRAINING");
        model.trainAdam(data.X, data.Y, 128, 0.7, 1);
    }

    if (!userIsDrawing)
        guessUserDigit();

    // model.trainAdam(data.X, data.Y, 128, 0.7, 160);
    strokeWeight(5);
    fill(250, 50, 50);
    textSize(40);
    text("Epoch: " + epoch, ProjectData.CanvasWidth - 200, ProjectData.CanvasHeight - 20);

    fill(30, 170, 50);
    text("Prediction: " + userPrediction.index, 20, ProjectData.CanvasHeight - 60);
    text("Chance: " + userPrediction.activation.toFixed(2), 20, ProjectData.CanvasHeight - 20);
}

function keyPressed() {
    if (keyCode === 32) {
        training = !training;
        console.warn("Change training to: " + training);
    }
    else if (keyCode === ESCAPE) {
        userIsDrawing = false;
        emptyImage = true;
        userDigit.background(0);
    }
    else if (key === 'r') {
        model.resetWeights();
        console.warn("Model weights has been reset");
    }
}

function guessUserDigit() {
    let img = userDigit.get();
    if (emptyImage) {
        return;
    }

    let inputs = [];
    img.resize(28, 28);
    img.loadPixels();
    for (let i = 0; i < 784; i++) {
        inputs[i] = img.pixels[i * 4] / 255;
    }
    userPrediction = model.predictSingleWithActivation(inputs);
}

function windowResized() {
    centerCanvas();
}

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    canvas.position(x, y);
}

function resetCanvas() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    centerCanvas();
    // neuralNetwork = new neuralNetwork();
}

function showImage() {
    const imageIndex = Math.floor(Math.random() * images.length);
    const imageData = images[imageIndex];

    const testImage = createImage(28, 28);
    testImage.loadPixels();
    for (let i = 0; i < imageData.length; i++) {
        let bright = imageData[i];
        let index = i * 4;
        testImage.pixels[index + 0] = bright * 255;
        testImage.pixels[index + 1] = bright * 255;
        testImage.pixels[index + 2] = bright * 255;
        testImage.pixels[index + 3] = 255;
    }
    testImage.updatePixels();
    image(testImage, 0, 0, 200, 200);
}