/** @type {HTMLCanvasElement} */
let canvas;

/** @type {NeuralNetwork} */
let neuralNetwork;
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
let drawIteration = 0;
let dataFramerate = 5;
let wrongFramerate = 30;
let canControl = true;
let badImageIndex = -1;
let badResultImageData = undefined;

let dataImageIndex = 0;
let dataImageData = undefined;

function preload() {
    readTextFile('./digits_4kEach_zeroCounter.bin');
    const preparedData = DataManage.prepareDigitImages(rawData, 2, 2, true);
    datapoints = preparedData[0];
    images = preparedData[1];

    console.log("Loaded data!");
    console.log(datapoints)
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

    neuralNetwork = createModel();
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

    showDataImage();
    showWrongImage();


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
            neuralNetwork.trainAdam(datapoints.X, datapoints.Y, 128, 0.7, 1, 0.0001);
        }

        networkWasTrained = true;
    }

    if (!userIsDrawing)
        guessUserDigit();

    if (userPrediction != null) {
        writeNetworkOutputs();
    }

    if (keyIsPressed && canControl) {
        controlImages();
        canControl = false;
        setTimeout(() => canControl = true, 100);
    }

    drawIteration++;
}

function createModel() {
    const inputLenght = datapoints.X[0].length;
    // model = new NeuralNetwork(CostFunction.crossEntropy(), 0.000005);
    const neuralNetwork = new NeuralNetwork(LossFunctions.MultiClassification.CategoricalCrossEntropy, 0.000005);
    neuralNetwork.addLayer(Layer.Input(inputLenght));
    neuralNetwork.addLayer(Layer.Dropout(0.4));
    neuralNetwork.addLayer(Layer.Dense(512, ActivationFunction.leakyRelu()));
    neuralNetwork.addLayer(Layer.Dropout(0.2));
    neuralNetwork.addLayer(Layer.Dense(10, ActivationFunction.softmax()));

    return neuralNetwork;
}

function writeTrainingText(epoch) {
    fill(250, 160, 50);
    text("Training", ProjectData.CanvasWidth / 2 - 80, 60);
    text("Epoch: " + epoch, ProjectData.CanvasWidth / 2 - 80, 90);
    let acc = neuralNetwork.learningStatistics["Test %"];
    if (acc == undefined)
        acc = 0.00;

    text("Accuracy: " + acc + "%", ProjectData.CanvasWidth / 2 - 80, 120);
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

function controlImages() {
    if (keyIsDown(188)) { // Pressed ',' or '<' ---> decrease speed of showing test data
        dataFramerate = dataFramerate >= 60 ? 60 : dataFramerate + 1;
    }
    else if (keyIsDown(190)) { // Pressed '.' or '>' ---> increase speed of showing test data
        dataFramerate = dataFramerate <= 1 ? 1 : dataFramerate - 1;
    }
    else if (keyIsDown(189)) { // Pressed '-' or '_' ---> decrease speed of showing wrong labeled data
        wrongFramerate = wrongFramerate >= 60 ? 60 : wrongFramerate + 1;
    }
    else if (keyIsDown(187)) { // Pressed '+' or '=' ---> increase speed of showing wrong labeled data
        wrongFramerate = wrongFramerate <= 1 ? 1 : wrongFramerate - 1;
    }
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
    if (mouseButton === LEFT) {
        userDigit.stroke(255);
    }
    if (mouseButton === RIGHT) {
        userDigit.stroke(0);
    }

    userDigit.strokeWeight(14);
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
        neuralNetwork.reinitializeWeights();
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
    userPrediction = neuralNetwork.predict(inputs);
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

function showDataImage() {
    if (drawIteration % dataFramerate == 0) {
        dataImageIndex = Math.floor(Math.random() * images.length);
        dataImageData = images[dataImageIndex];
    }

    if (dataImageData) {
        showImage(dataImageData, 0, 0);
        drawImageFrame(0, 0, 250, 170, 40, 100);
    }
}

function showWrongImage() {

    if (drawIteration % wrongFramerate == 0 && neuralNetwork.badResults.length > 0) {
        badImageIndex = Math.floor(Math.random() * neuralNetwork.badResults.length);
        badResultImageData = neuralNetwork.badResults[badImageIndex];
    }

    if (badResultImageData) {
        showImage(badResultImageData, 0, 200);
        drawImageFrame(0, 200, 255, 20, 20, 100);
    }
}

function showImage(imageData, xPosOffset, yPosOffset) {
    if (!imageData)
        return;

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
    image(testImage, xPosOffset, yPosOffset, 200, 200);
}

function drawImageFrame(x, y, r, g, b, a) {
    let strokeW = 4;
    push();
    stroke(r, g, b, a);
    strokeWeight(strokeW);
    noFill();
    rect(x + strokeW / 2, y + strokeW / 2, 200 - strokeW, 200 - strokeW);
    pop();
}