/** @type {HTMLCanvasElement} */
let canvas;

/** @type {NeuralNetwork} */
let neuralNetwork;
let splitData;

let projectDataBackUp = Object.entries(ProjectData);
let images;
let rawData;
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
let badLabelsData = undefined;
let dataImageIndex = 0;
let dataImageData = undefined;
let datapoints;
let historyPoints = [];
let historyGraphics = undefined;
let learningTimeout = null;

function preload() {
    readTextFile('./digits_4kEach_zeroCounter.bin');

    DataManage.setNormalizationFunction(NormalizationType.Scale);
    datapoints = DataManage.preprocessMNIST(rawData, 10, 200, 2, true);
    images = [];
    for (let i = 0; i < datapoints.length; i++) {
        images.push([...datapoints[i].inputs]);
    }

    splitData = DataManage.split(datapoints, 0.7, true);


    console.log("Loaded data!");
    console.log(splitData)
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
        writeTrainingText();
        if (historyGraphics)
            image(historyGraphics, 200, 400);

        trainingTextShowed = true;
    }



    if (training && !userIsDrawing) {
        if (trainingTextShowed && learningTimeout == null) {
            // IT SHOULDN'T BE HERE !!!
            // SPLIT HERE MAKES THAT NEURAL NETWORK LEARNS ALSO ON TEST DATA (IT MIXES DATA EACH TIME)
            // NEED BETTER SOLUTION: 
            // REGULARIZATION, 
            // SGD WITH MOMENTUM,
            // GRADIENT LIMITING, 
            // ETC.

            learningTimeout = setTimeout(() => {
                splitData = DataManage.split(datapoints, 0.7, true);
                neuralNetwork.train(splitData.train, splitData.test, 32, 1, true);
                computeHistoryPoints();
                updateHistoryGraphics();
                clearTimeout(learningTimeout);
                learningTimeout = null;
            }, 50);
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
    const inputLenght = splitData.train[0].inputs.length;
    // const neuralNetwork = new NeuralNetwork(CostFunction.crossEntropy(), Optimizer.adam(0.002));
    const neuralNetwork = new NeuralNetwork(CostFunction.crossEntropy(), Optimizer.sgd(0.001, 0.9, 0.075));

    // const neuralNetwork = new NeuralNetwork(LossFunctions.MultiClassification.CategoricalCrossEntropy, Optimizer.adam(0.0001));

    neuralNetwork.addLayer(Layer.Input(inputLenght));
    // neuralNetwork.addLayer(Layer.Dropout(0.4));
    neuralNetwork.addLayer(Layer.Dense(512, ActivationFunction.leakyRelu()));
    // neuralNetwork.addLayer(Layer.Dropout(0.2));
    neuralNetwork.addLayer(Layer.Dense(10, ActivationFunction.softmax()));

    return neuralNetwork;
}

function writeTrainingText() {
    fill(250, 160, 50);
    text("Training", ProjectData.CanvasWidth / 2 - 80, 60);
    text("Epoch: " + neuralNetwork.learningEpoch, ProjectData.CanvasWidth / 2 - 80, 90);
    let acc = neuralNetwork.learningStatistics["Test %"];
    if (acc == undefined)
        acc = 0.00;

    text("Accuracy: " + Mathematics.toPercent(acc) + "%", ProjectData.CanvasWidth / 2 - 80, 120);
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

        text(`${sortedIndices[i]} = ${Mathematics.toPercent(element)}%`, ProjectData.CanvasWidth - 160, 80 + 40 * i);
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

    userDigit.strokeWeight(ProjectData.DrawDigitStroke);
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
        neuralNetwork.resetNetwork();
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
    for (let i = 0; i < 28 * 28; i++) {
        inputs[i] = DataManage.normalizationFunction(img.pixels[i * 4]);
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
        badLabelsData = neuralNetwork.badLabels[badImageIndex];
    } else if (neuralNetwork.badResults.length == 0) {
        badResultImageData = undefined;
        badLabelsData = undefined;
    }

    if (badResultImageData) {
        showImage(badResultImageData, 0, 200);
        drawImageFrame(0, 200, 255, 20, 20, 100);

        push();
        fill(230, 40, 40);
        text("Guessed: " + badLabelsData[1], 20, 420);
        fill(30, 220, 40);
        text("Label: " + badLabelsData[0], 20, 450);
        pop();
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

function updateHistoryGraphics() {

    if (!historyPoints || historyPoints.length == 0)
        return;

    if (historyGraphics == undefined) {
        historyGraphics = createGraphics(200, 200);
        historyGraphics.translate(0, 100);
    }

    historyGraphics.background(25);

    historyGraphics.strokeWeight(1);
    historyGraphics.stroke(180, 40, 20);
    historyGraphics.line(0, 0, 200, 0);

    historyGraphics.stroke(220, 120, 20);
    historyGraphics.line(50, 70, 60, 70);
    historyGraphics.stroke(130, 220, 40);
    historyGraphics.line(50, 85, 60, 85);

    historyGraphics.textAlign(LEFT, CENTER);
    historyGraphics.textSize(12);
    historyGraphics.noStroke();

    historyGraphics.fill(220, 120, 20);
    historyGraphics.text("Train:", 65, 70);
    historyGraphics.text(Mathematics.round(neuralNetwork.statsHistory[historyPoints.length - 1]["Train Loss"], 12), 100, 70);

    historyGraphics.fill(130, 220, 40);
    historyGraphics.text("Test:", 65, 85);
    historyGraphics.text(Mathematics.round(neuralNetwork.statsHistory[historyPoints.length - 1]["Test Loss"], 12), 100, 85);

    if (historyPoints.length == 1) {
        historyGraphics.strokeWeight(3);
        historyGraphics.stroke(220, 120, 20);
        historyGraphics.point(historyPoints[0].x, -historyPoints[0].trainY);
        historyGraphics.stroke(130, 220, 40);
        historyGraphics.point(historyPoints[0].x, -historyPoints[0].testY);
        return;
    }
    historyGraphics.strokeWeight(1);

    for (let i = 1; i < historyPoints.length; i++) {
        historyGraphics.stroke(220, 120, 20);
        historyGraphics.line(historyPoints[i - 1].x, -historyPoints[i - 1].trainY, historyPoints[i].x, -historyPoints[i].trainY);
        historyGraphics.stroke(130, 220, 40);
        historyGraphics.line(historyPoints[i - 1].x, -historyPoints[i - 1].testY, historyPoints[i].x, -historyPoints[i].testY);
    }
}

function computeHistoryPoints() {
    const history = neuralNetwork.statsHistory;
    if (!history || history.length == 0) return;
    historyPoints = [];

    const minMax = findStatsMaxMin(history);
    const xStep = 180 / history.length;

    for (let i = 0; i < history.length; i++) {
        const element = history[i];
        const trainY = element["Train Loss"] > 0 ? element["Train Loss"] / minMax[1] : -element["Train Loss"] / minMax[0];
        const testY = element["Test Loss"] > 0 ? element["Test Loss"] / minMax[1] : -element["Test Loss"] / minMax[0];

        let currX = xStep * i + 10;
        let currTrainY = trainY * 90;
        let currTestY = testY * 90;

        historyPoints.push(
            {
                x: currX,
                trainY: currTrainY,
                testY: currTestY,
            }
        )
    }
}

function findStatsMaxMin(history) {

    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < history.length; i++) {
        if (history[i]["Train Loss"] > max)
            max = history[i]["Train Loss"];

        if (history[i]["Test Loss"] > max)
            max = history[i]["Test Loss"];

        if (history[i]["Train Loss"] < min)
            min = history[i]["Train Loss"];

        if (history[i]["Test Loss"] < min)
            min = history[i]["Test Loss"];
    }

    return [min, max];
}