/** @type {HTMLCanvasElement} */
let canvas;

/** @type {NeuralNetwork} */
let model;
let projectDataBackUp = Object.entries(ProjectData);
let nnDrawer;
let datapoints;
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
let trainingTextShowed;
const xOffset = ProjectData.CanvasWidth / 2 - 100;
const yOffset = ProjectData.CanvasHeight / 2 - 100;
let networkWasTrained;

function preload() {
    readTextFile('./digits_4kEach_zeroCounter.bin');
    const preparedData = DataManage.prepareDigitImages(rawData, 100, 2);
    datapoints = preparedData[0];
    images = preparedData[1];

    console.log(datapoints)
    console.log("Loaded data!");
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

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();

    const inputLenght = datapoints.X[0].length;
    // model = new NeuralNetwork(CostFunction.crossEntropy(), 0.000005);
    model = new NeuralNetwork(LossFunctions.MultiClassification.CategoricalCrossEntropy, 0.000005);
    model.addLayer(Layer.Input(inputLenght));
    model.addLayer(Layer.Dropout(0.35));
    model.addLayer(Layer.Dense(512, ActivationFunction.sigmoid()));
    model.addLayer(Layer.Dropout(0.2));
    model.addLayer(Layer.Dense(10, ActivationFunction.softmax()));
    epoch = 0;
    training = false;

    userDigit = createGraphics(200, 200);
    userDigit.pixelDensity(1);
    userDigit.background(0);

    userIsDrawing = false;
    emptyImage = true;
    userPrediction = null;
    trainingTextShowed = false;
    networkWasTrained = false;

    textSize(22);
    strokeWeight(5);
}

function draw() {
    background(71, 71, 71);
    showImage();

    image(userDigit, xOffset, yOffset);
    if (mouseIsPressed) {
        drawDigit();
    }
    else {
        userIsDrawing = false;
    }

    if (networkWasTrained) {
        writeTrainingText(epoch);
    }

    if (training && !userIsDrawing) {
        epoch++;

        if (trainingTextShowed) {
            console.warn("Training started!");
            model.trainAdam(datapoints.X, datapoints.Y, 256, 0.7, 1, 0.001);
        }

        networkWasTrained = true;
    }

    if (!userIsDrawing)
        guessUserDigit();

    if (userPrediction != null) {
        writeNetworkOutputs();
    }
}

function writeTrainingText(epoch) {
    fill(250, 160, 50);
    text("Training", ProjectData.CanvasWidth / 2 - 80, 60);
    text("Epoch: " + epoch, ProjectData.CanvasWidth / 2 - 80, 90);
    let acc = model.learningStatistics["Test %"];
    if (acc == undefined)
        acc = 0.00;

    text("Accuracy: " + toPercent(Number(acc)), ProjectData.CanvasWidth / 2 - 80, 120);
    trainingTextShowed = true;
}

function writeNetworkOutputs() {
    fill(30, 140, 180);
    text("Prediction", ProjectData.CanvasWidth - 160, 40);

    const sortedIndices = sortedPredictionIndices();

    for (let i = 0; i < sortedIndices.length; i++) {
        const element = userPrediction[sortedIndices[i]];
        if (i == 0)
            fill(60, 180, 40);
        else
            fill(210 + 4 * i, 140 - 14 * i, 30 - 3 * i);
        text(`${sortedIndices[i]} = ${toPercent(element)}`, ProjectData.CanvasWidth - 160, 80 + 40 * i);
    }
}

function toPercent(value) {
    value *= 100;
    value = value.toFixed(2).toString();

    valueParts = value.split(".");

    if (valueParts[0].length == 1)
        valueParts[0] = "0" + valueParts[0][0];

    return valueParts[0] + "." + valueParts[1][0] + valueParts[1][1] + "%";
}

function sortedPredictionIndices() {
    return Array.from(Array(userPrediction.length).keys())
        .sort((a, b) => userPrediction[a] > userPrediction[b] ? -1 : (userPrediction[b] > userPrediction[a]) | 0)
}

function drawDigit() {

    if (
        mouseX < ProjectData.CanvasWidth / 2 - 100
        || mouseX > ProjectData.CanvasWidth / 2 + 100
        || mouseY < ProjectData.CanvasHeight / 2 - 100
        || mouseY > ProjectData.CanvasHeight / 2 + 100
    )
        return;

    userIsDrawing = true;
    emptyImage = false;
    userDigit.stroke(255);
    userDigit.strokeWeight(16);
    userDigit.line(mouseX - xOffset, mouseY - yOffset, pmouseX - xOffset, pmouseY - yOffset);
    guessUserDigit();
}

function keyPressed() {
    if (keyCode === 32) {
        training = !training;
    }
    else if (keyCode === ESCAPE) {
        userIsDrawing = false;
        emptyImage = true;
        userPrediction = null;
        trainingTextShowed = false;
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
    userPrediction = model.predict(inputs);
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
}

function showImage() {
    const imageIndex = Math.floor(Math.random() * images.length);
    const imageData = images[imageIndex];

    const testImage = createImage(28, 28);
    testImage.loadPixels();
    for (let i = 0; i < imageData.length; i++) {
        let bright = imageData[i];
        let index = i * 4;
        testImage.pixels[index + 0] = Math.floor(bright * 255);
        testImage.pixels[index + 1] = Math.floor(bright * 255);
        testImage.pixels[index + 2] = Math.floor(bright * 255);
        testImage.pixels[index + 3] = 255;
    }
    testImage.updatePixels();
    image(testImage, 0, 0, 200, 200);
}