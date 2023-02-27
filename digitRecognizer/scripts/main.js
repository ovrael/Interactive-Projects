/** @type {HTMLCanvasElement} */
let canvas;
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

function preload() {
    readTextFile('./digits10k.bin');
    prepareDigitImages(rawData);
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

function prepareDigitImages(rawData) {

    data = { X: [], Y: [] };
    images = [];

    const inputsCount = 5;

    const rows = rawData.split("\n");
    for (let i = 0; i < rows.length / inputsCount; i++) {
        let pixels = rows[i * inputsCount].split(" ");
        data.Y.push(pixels[0]);
        data.X.push(pixels.slice(1, 785).map(p => p / 255));
        images.push(pixels.slice(1, 785).map(p => p / 255));
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

    // nnDrawer = new NeuralNetworkDrawer(model, 100);
    // nnDrawer.drawOutput(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
}

function draw() {
    background(21, 21, 21);

    if (training) {
        epoch++;
        console.warn("TRAINING");
        model.trainAdam(data.X, data.Y, 128, 0.7, 1);
    }

    // model.trainAdam(data.X, data.Y, 128, 0.7, 160);
    strokeWeight(5);
    fill(250, 50, 50);
    textSize(60);
    text("Epoch: " + epoch, 250, 250);
}

function mousePressed() {
    training = !training;
    console.warn("Change training to: " + training);
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
    // model.fakeTrain(100);
    // background(90);
    // const imageIndex = Math.floor(Math.random() * images.length);
    // const imageData = images[imageIndex];

    // const testImage = createImage(28, 28);
    // testImage.loadPixels();
    // for (let i = 0; i < imageData.length; i++) {
    //     let bright = imageData[i];
    //     let index = i * 4;
    //     testImage.pixels[index + 0] = 255 - bright * 255;
    //     testImage.pixels[index + 1] = 255 - bright * 255;
    //     testImage.pixels[index + 2] = 255 - bright * 255;
    //     testImage.pixels[index + 3] = 255;
    // }
    // testImage.updatePixels();
    // image(testImage, ProjectData.CanvasWidth / 2 - 100, ProjectData.CanvasHeight / 2 - 100, 200, 200);
}