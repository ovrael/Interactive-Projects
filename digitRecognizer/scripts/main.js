/** @type {HTMLCanvasElement} */
let canvas;
let neuralNetwork;
let projectDataBackUp = Object.entries(ProjectData);

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();

    neuralNetwork = new NeuralNetwork(ErrorFunctions.MeanSquaredError, 0.05);
    neuralNetwork.addLayer(2, ActivationFunctions.Sigmoid);
    neuralNetwork.addLayer(4, ActivationFunctions.Sigmoid);
    neuralNetwork.addLayer(6, ActivationFunctions.Sigmoid);
    neuralNetwork.addLayer(1, ActivationFunctions.Sigmoid);

    data = [];
    data.push([2, 1]);
    data.push([5, 4]);
    data.push([2, 3]);
    data.push([3, 7]);
    data.push([7, 2]);
    data.push([6, 1]);

    targets = [1, 2, 3, 4, 5, 6];

    neuralNetwork.train(data, targets);
}

function draw() {
    background(90);
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
    neuralNetwork = new neuralNetwork();
}