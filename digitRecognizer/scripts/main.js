/** @type {HTMLCanvasElement} */
let canvas;
let neuralNetwork;
let projectDataBackUp = Object.entries(ProjectData);
let nnDrawer;
let data;
let images;
let rawData;
let trainImage;
let imageElement;

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

    const rows = rawData.split("\n");
    for (let i = 0; i < rows.length / 10; i++) {
        let pixels = rows[i * 10].split(" ");
        data.Y.push(pixels[0]);
        data.X.push(pixels.slice(1, 785).map(p => p / 255));
        images.push(pixels.slice(1, 785).map(p => p / 255));
    }
}

function setup() {
    imageElement = createImage(28, 28);

    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();


    // let dataX = prepareData();
    // let dataY = prepareTargets();
    // let dataX = [];
    // let dataY = [];

    // for (let i = 0; i < 1000; i++) {
    //     const x1 = Math.floor(Math.random() * 2);
    //     const x2 = Math.floor(Math.random() * 2);
    //     const y = (x1 + x2) % 2;
    //     dataX.push([x1, x2]);
    //     dataY.push([y]);
    // }

    const inputLenght = data.X[0].length;
    // const inputLenght = dataX[0].length;
    neuralNetwork = new NeuralNetwork(LossFunctions.MultiClassification.SimpleSubtraction, 0.000005);
    neuralNetwork.addLayer(inputLenght, ActivationFunctions.Tanh);
    neuralNetwork.addLayer(64, ActivationFunctions.Sigmoid);
    neuralNetwork.addLayer(64, ActivationFunctions.Sigmoid);
    neuralNetwork.addLayer(10, ActivationFunctions.SoftMax);

    // neuralNetwork.trainBatch(dataX, dataY, 32, 0.7, 100);
    console.warn("STARTED TRAINING");
    neuralNetwork.trainBatch(data.X, data.Y, 32, 0.7, 500);

    // neuralNetwork.trainImage(data.X, data.Y, 0.7, 5);
    // nnDrawer = new NeuralNetworkDrawer(neuralNetwork);
    // background(90);
    // nnDrawer.draw(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(24);
}

function draw() {
    background(90);
    const imageIndex = Math.floor(Math.random() * images.length);
    const imageData = images[imageIndex];

    const testImage = createImage(28, 28);
    testImage.loadPixels();
    for (let i = 0; i < imageData.length; i++) {
        let bright = imageData[i];
        let index = i * 4;
        testImage.pixels[index + 0] = 255 - bright * 255;
        testImage.pixels[index + 1] = 255 - bright * 255;
        testImage.pixels[index + 2] = 255 - bright * 255;
        testImage.pixels[index + 3] = 255;
    }
    testImage.updatePixels();
    image(testImage, ProjectData.CanvasWidth / 2 - 100, ProjectData.CanvasHeight / 2 - 100, 200, 200);
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

function prepareTargets() {
    let targets = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 50; j++) {
            targets.push(i);
        }
    }
    return targets;
}

function prepareData() {

    let data = []
    data.push([5.1, 3.5, 1.4, 0.2]);
    data.push([4.9, 3.0, 1.4, 0.2]);
    data.push([4.7, 3.2, 1.3, 0.2]);
    data.push([4.6, 3.1, 1.5, 0.2]);
    data.push([5.0, 3.6, 1.4, 0.2]);
    data.push([5.4, 3.9, 1.7, 0.4]);
    data.push([4.6, 3.4, 1.4, 0.3]);
    data.push([5.0, 3.4, 1.5, 0.2]);
    data.push([4.4, 2.9, 1.4, 0.2]);
    data.push([4.9, 3.1, 1.5, 0.1]);
    data.push([5.4, 3.7, 1.5, 0.2]);
    data.push([4.8, 3.4, 1.6, 0.2]);
    data.push([4.8, 3.0, 1.4, 0.1]);
    data.push([4.3, 3.0, 1.1, 0.1]);
    data.push([5.8, 4.0, 1.2, 0.2]);
    data.push([5.7, 4.4, 1.5, 0.4]);
    data.push([5.4, 3.9, 1.3, 0.4]);
    data.push([5.1, 3.5, 1.4, 0.3]);
    data.push([5.7, 3.8, 1.7, 0.3]);
    data.push([5.1, 3.8, 1.5, 0.3]);
    data.push([5.4, 3.4, 1.7, 0.2]);
    data.push([5.1, 3.7, 1.5, 0.4]);
    data.push([4.6, 3.6, 1.0, 0.2]);
    data.push([5.1, 3.3, 1.7, 0.5]);
    data.push([4.8, 3.4, 1.9, 0.2]);
    data.push([5.0, 3.0, 1.6, 0.2]);
    data.push([5.0, 3.4, 1.6, 0.4]);
    data.push([5.2, 3.5, 1.5, 0.2]);
    data.push([5.2, 3.4, 1.4, 0.2]);
    data.push([4.7, 3.2, 1.6, 0.2]);
    data.push([4.8, 3.1, 1.6, 0.2]);
    data.push([5.4, 3.4, 1.5, 0.4]);
    data.push([5.2, 4.1, 1.5, 0.1]);
    data.push([5.5, 4.2, 1.4, 0.2]);
    data.push([4.9, 3.1, 1.5, 0.2]);
    data.push([5.0, 3.2, 1.2, 0.2]);
    data.push([5.5, 3.5, 1.3, 0.2]);
    data.push([4.9, 3.6, 1.4, 0.1]);
    data.push([4.4, 3.0, 1.3, 0.2]);
    data.push([5.1, 3.4, 1.5, 0.2]);
    data.push([5.0, 3.5, 1.3, 0.3]);
    data.push([4.5, 2.3, 1.3, 0.3]);
    data.push([4.4, 3.2, 1.3, 0.2]);
    data.push([5.0, 3.5, 1.6, 0.6]);
    data.push([5.1, 3.8, 1.9, 0.4]);
    data.push([4.8, 3.0, 1.4, 0.3]);
    data.push([5.1, 3.8, 1.6, 0.2]);
    data.push([4.6, 3.2, 1.4, 0.2]);
    data.push([5.3, 3.7, 1.5, 0.2]);
    data.push([5.0, 3.3, 1.4, 0.2]);
    data.push([7.0, 3.2, 4.7, 1.4]);
    data.push([6.4, 3.2, 4.5, 1.5]);
    data.push([6.9, 3.1, 4.9, 1.5]);
    data.push([5.5, 2.3, 4.0, 1.3]);
    data.push([6.5, 2.8, 4.6, 1.5]);
    data.push([5.7, 2.8, 4.5, 1.3]);
    data.push([6.3, 3.3, 4.7, 1.6]);
    data.push([4.9, 2.4, 3.3, 1.0]);
    data.push([6.6, 2.9, 4.6, 1.3]);
    data.push([5.2, 2.7, 3.9, 1.4]);
    data.push([5.0, 2.0, 3.5, 1.0]);
    data.push([5.9, 3.0, 4.2, 1.5]);
    data.push([6.0, 2.2, 4.0, 1.0]);
    data.push([6.1, 2.9, 4.7, 1.4]);
    data.push([5.6, 2.9, 3.6, 1.3]);
    data.push([6.7, 3.1, 4.4, 1.4]);
    data.push([5.6, 3.0, 4.5, 1.5]);
    data.push([5.8, 2.7, 4.1, 1.0]);
    data.push([6.2, 2.2, 4.5, 1.5]);
    data.push([5.6, 2.5, 3.9, 1.1]);
    data.push([5.9, 3.2, 4.8, 1.8]);
    data.push([6.1, 2.8, 4.0, 1.3]);
    data.push([6.3, 2.5, 4.9, 1.5]);
    data.push([6.1, 2.8, 4.7, 1.2]);
    data.push([6.4, 2.9, 4.3, 1.3]);
    data.push([6.6, 3.0, 4.4, 1.4]);
    data.push([6.8, 2.8, 4.8, 1.4]);
    data.push([6.7, 3.0, 5.0, 1.7]);
    data.push([6.0, 2.9, 4.5, 1.5]);
    data.push([5.7, 2.6, 3.5, 1.0]);
    data.push([5.5, 2.4, 3.8, 1.1]);
    data.push([5.5, 2.4, 3.7, 1.0]);
    data.push([5.8, 2.7, 3.9, 1.2]);
    data.push([6.0, 2.7, 5.1, 1.6]);
    data.push([5.4, 3.0, 4.5, 1.5]);
    data.push([6.0, 3.4, 4.5, 1.6]);
    data.push([6.7, 3.1, 4.7, 1.5]);
    data.push([6.3, 2.3, 4.4, 1.3]);
    data.push([5.6, 3.0, 4.1, 1.3]);
    data.push([5.5, 2.5, 4.0, 1.3]);
    data.push([5.5, 2.6, 4.4, 1.2]);
    data.push([6.1, 3.0, 4.6, 1.4]);
    data.push([5.8, 2.6, 4.0, 1.2]);
    data.push([5.0, 2.3, 3.3, 1.0]);
    data.push([5.6, 2.7, 4.2, 1.3]);
    data.push([5.7, 3.0, 4.2, 1.2]);
    data.push([5.7, 2.9, 4.2, 1.3]);
    data.push([6.2, 2.9, 4.3, 1.3]);
    data.push([5.1, 2.5, 3.0, 1.1]);
    data.push([5.7, 2.8, 4.1, 1.3]);
    data.push([6.3, 3.3, 6.0, 2.5]);
    data.push([5.8, 2.7, 5.1, 1.9]);
    data.push([7.1, 3.0, 5.9, 2.1]);
    data.push([6.3, 2.9, 5.6, 1.8]);
    data.push([6.5, 3.0, 5.8, 2.2]);
    data.push([7.6, 3.0, 6.6, 2.1]);
    data.push([4.9, 2.5, 4.5, 1.7]);
    data.push([7.3, 2.9, 6.3, 1.8]);
    data.push([6.7, 2.5, 5.8, 1.8]);
    data.push([7.2, 3.6, 6.1, 2.5]);
    data.push([6.5, 3.2, 5.1, 2.0]);
    data.push([6.4, 2.7, 5.3, 1.9]);
    data.push([6.8, 3.0, 5.5, 2.1]);
    data.push([5.7, 2.5, 5.0, 2.0]);
    data.push([5.8, 2.8, 5.1, 2.4]);
    data.push([6.4, 3.2, 5.3, 2.3]);
    data.push([6.5, 3.0, 5.5, 1.8]);
    data.push([7.7, 3.8, 6.7, 2.2]);
    data.push([7.7, 2.6, 6.9, 2.3]);
    data.push([6.0, 2.2, 5.0, 1.5]);
    data.push([6.9, 3.2, 5.7, 2.3]);
    data.push([5.6, 2.8, 4.9, 2.0]);
    data.push([7.7, 2.8, 6.7, 2.0]);
    data.push([6.3, 2.7, 4.9, 1.8]);
    data.push([6.7, 3.3, 5.7, 2.1]);
    data.push([7.2, 3.2, 6.0, 1.8]);
    data.push([6.2, 2.8, 4.8, 1.8]);
    data.push([6.1, 3.0, 4.9, 1.8]);
    data.push([6.4, 2.8, 5.6, 2.1]);
    data.push([7.2, 3.0, 5.8, 1.6]);
    data.push([7.4, 2.8, 6.1, 1.9]);
    data.push([7.9, 3.8, 6.4, 2.0]);
    data.push([6.4, 2.8, 5.6, 2.2]);
    data.push([6.3, 2.8, 5.1, 1.5]);
    data.push([6.1, 2.6, 5.6, 1.4]);
    data.push([7.7, 3.0, 6.1, 2.3]);
    data.push([6.3, 3.4, 5.6, 2.4]);
    data.push([6.4, 3.1, 5.5, 1.8]);
    data.push([6.0, 3.0, 4.8, 1.8]);
    data.push([6.9, 3.1, 5.4, 2.1]);
    data.push([6.7, 3.1, 5.6, 2.4]);
    data.push([6.9, 3.1, 5.1, 2.3]);
    data.push([5.8, 2.7, 5.1, 1.9]);
    data.push([6.8, 3.2, 5.9, 2.3]);
    data.push([6.7, 3.3, 5.7, 2.5]);
    data.push([6.7, 3.0, 5.2, 2.3]);
    data.push([6.3, 2.5, 5.0, 1.9]);
    data.push([6.5, 3.0, 5.2, 2.0]);
    data.push([6.2, 3.4, 5.4, 2.3]);
    data.push([5.9, 3.0, 5.1, 1.8]);


    let dataMaxes = [];
    for (let i = 0; i < data[0].length; i++) {
        dataMaxes.push(data[0][i]);
    }

    for (let i = 1; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            const element = data[i][j];
            if (element > dataMaxes[j]) {
                dataMaxes[j] = element;
            }
        }
    }

    for (let i = 1; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            data[i][j] /= dataMaxes[j];
        }
    }

    return data;
}