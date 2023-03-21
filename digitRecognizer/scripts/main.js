const xOffset = ProjectData.CanvasWidth / 2 - 100;
const yOffset = ProjectData.CanvasHeight / 2 - 100;

/** @type {HTMLCanvasElement} */
let canvas;

/** @type {NeuralNetwork} */
let neuralNetwork;

let splitData;
let rawData;

let userDigit;
let userIsDrawing;
let imageIsEmpty;
let userPrediction;

let drawIteration = 0;
let canControl = true;

let wrongResultSample = undefined;
let dataImageIndex = -1;
let dataImageData = undefined;
let historyGraphics = undefined;
let learningTimeout = null;

function updateDataManageSettings() {
    DataManage.setNormalizationFunction(ProjectData.NormalizationMethod);
    DataManage.maxRotateAngle = ProjectData.MaxRotateAngle;
    DataManage.verticallyShiftChance = ProjectData.VerticallyShiftChance / 100;
    DataManage.horizontallyShiftChance = ProjectData.HorizontallyShiftChance / 100;
    DataManage.noiseSize = ProjectData.NoiseSize / 100;
    DataManage.noiseStrength = ProjectData.NoiseStrength;
}

function preload() {
    readTextFile('./digits_4kEach_zeroCounter.bin');
    updateDataManageSettings();
    const datapoints = DataManage.preprocessMNIST(
        rawData,
        10,
        ProjectData.SamplesPerDigit,
        ProjectData.OversamplesPerDigit,
        ProjectData.AddOriginalDigit
    );

    splitData = DataManage.split(datapoints, ProjectData.SplitFraction, ProjectData.ShouldShuffle);

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

function createOptimizer() {
    let optimizer = undefined;
    switch (ProjectData.OptimizerName) {
        case 'sgd':
            optimizer = Optimizer.sgd(ProjectData.LearningRate, ProjectData.OptimizerMomentum, ProjectData.OptimizerWeightsDecay);
            break;

        case 'adam':
            optimizer = Optimizer.adam(ProjectData.LearningRate, ProjectData.OptimizerBeta1, ProjectData.OptimizerBeta2, ProjectData.OptimizerEpsilon, ProjectData.OptimizerWeightsDecay);
            break;

        case 'rmsProp':
            optimizer = Optimizer.rmsProp(ProjectData.LearningRate, ProjectData.OptimizerMomentum, ProjectData.OptimizerWeightsDecay, ProjectData.OptimizerEpsilon);
            break;

        default:
            optimizer = Optimizer.sgd(0.001, 0.9, 0.075);
            break;
    }
    return optimizer;
}

function createModel() {
    const inputLenght = splitData.train[0].inputs.length;
    // const neuralNetwork = new NeuralNetwork(CostFunction.crossentropy(), Optimizer.adam(0.002));

    const optimizer = createOptimizer();

    const neuralNetwork = new NeuralNetwork(CostFunction.crossentropy(), optimizer);

    neuralNetwork.addLayer(Layer.Input(inputLenght));
    neuralNetwork.addLayer(Layer.Dropout(0.5));
    neuralNetwork.addLayer(Layer.Dense(512, ActivationFunction.leakyRelu(), WeightsRegulizer.L2(0.1)));
    neuralNetwork.addLayer(Layer.Dropout(0.3));
    neuralNetwork.addLayer(Layer.Dense(10, ActivationFunction.softmax(), WeightsRegulizer.L2(0.1)));

    return neuralNetwork;
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
    imageIsEmpty = true;
    userPrediction = null;

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

    if (training || neuralNetwork.trainHistory.history.length > 0) {
        writeTrainingText();
        if (historyGraphics)
            image(historyGraphics, 200, 400);
    }



    if (training && !userIsDrawing && learningTimeout == null) {

        learningTimeout = setTimeout(() => {
            neuralNetwork.train(splitData.train, splitData.test, ProjectData.TrainBatchSize, 1);
            historyGraphics = neuralNetwork.trainHistory.getGraphGraphics(200, 200);
            clearTimeout(learningTimeout);
            learningTimeout = null;
        }, 0);
    }

    if (!userIsDrawing)
        guessUserDigit();

    if (userPrediction != null)
        writeNetworkOutputs();


    if (keyIsPressed && canControl) {
        controlImages();
        canControl = false;
        setTimeout(() => canControl = true, 100);
    }

    drawIteration++;
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

function writeTrainingText() {

    const startX = ProjectData.CanvasWidth / 2 - 85;

    push();
    fill(25);
    textSize(24);
    text("Training data", startX, 40);

    textSize(15);
    fill(50, 168, 131);
    let nnStatus = neuralNetwork.trainingStatus;
    if (nnStatus != TrainingStatus.Before) {
        nnStatus = training ? TrainingStatus.During : TrainingStatus.After;
    }
    text("Status: " + nnStatus, startX, 80);

    fill(134, 182, 252);
    text("Epoch: " + neuralNetwork.learningEpoch, startX, 60);

    pop();

    if (neuralNetwork.trainHistory.history.length == 0) {
        return;
    }
    neuralNetwork.trainHistory.writeLastHistoryPoint(startX);
}

function writeNetworkOutputs() {
    fill(30, 140, 180);
    text("Prediction", ProjectData.CanvasWidth - 160, 40);

    const sortedIndices = sortPredictionIndices();

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
        ProjectData.TrainDataSpeed = ProjectData.TrainDataSpeed >= 60 ? 60 : ProjectData.TrainDataSpeed + 1;
    }
    else if (keyIsDown(190)) { // Pressed '.' or '>' ---> increase speed of showing test data
        ProjectData.TrainDataSpeed = ProjectData.TrainDataSpeed <= 1 ? 1 : ProjectData.TrainDataSpeed - 1;
    }
    else if (keyIsDown(189)) { // Pressed '-' or '_' ---> decrease speed of showing wrong labeled data
        ProjectData.WrongDataSpeed = ProjectData.WrongDataSpeed >= 60 ? 60 : ProjectData.WrongDataSpeed + 1;
    }
    else if (keyIsDown(187)) { // Pressed '+' or '=' ---> increase speed of showing wrong labeled data
        ProjectData.WrongDataSpeed = ProjectData.WrongDataSpeed <= 1 ? 1 : ProjectData.WrongDataSpeed - 1;
    }
}

function sortPredictionIndices() {
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
    imageIsEmpty = false;
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
        if (PanelIsOpen === true) {
            closeSettings();
            return;
        }
        userIsDrawing = false;
        imageIsEmpty = true;
        userPrediction = null;
        userDigit.background(0);
    }
    else if (key === 'r') {
        neuralNetwork.resetNetwork();
        console.warn("Model weights has been reset");
    }
}

function guessUserDigit() {
    let img = userDigit.get();
    if (imageIsEmpty) {
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

function showDataImage() {
    if (drawIteration % ProjectData.TrainDataSpeed == 0) {
        dataImageIndex = Math.floor(Math.random() * splitData.train.length);
        dataImageData = splitData.train[dataImageIndex].inputs;
    }

    showImage(dataImageData, 0, 0);
    drawImageFrame(0, 0, 250, 170, 40, 100);
}

function showWrongImage() {

    if (neuralNetwork.trainHistory.wrongResults.length == 0)
        return;

    const wrongResults = neuralNetwork.trainHistory.wrongResults;

    if (drawIteration % ProjectData.WrongDataSpeed == 0) {
        const badImageIndex = Math.floor(Math.random() * wrongResults.length);
        wrongResultSample = wrongResults[badImageIndex];
    }

    if (wrongResultSample == undefined)
        return;

    showImage(wrongResultSample.dataPoint.inputs, 0, 200);
    drawImageFrame(0, 200, 255, 20, 20, 100);

    push();
    textSize(20);
    fill(230, 40, 40);
    text("Guessed: " + wrongResultSample.wrongLabel, 20, 420);
    fill(30, 220, 40);
    text("Label: " + wrongResultSample.dataPoint.label, 20, 450);
    pop();
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