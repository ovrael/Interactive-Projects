class ProjectData {
    static CanvasWidth = 600;               // slider,   Width,  200, 1000, 600, 10
    static CanvasHeight = 600;              // slider,   Height,  200, 1000, 600, 10
    static BackgroundColor = '#646464';     // color,    Background,  #646464

    static DrawDigitStroke = 10;
}

const scripts = [
    "activationFunction",
    "costFunction",
    "lossFunctions",
    // "dataPoint",
    "dataManage",
    "weights",
    "layer",
    "dropoutLayer",
    "neuralNetwork",
    "neuralNetworkDrawer",
];

const scriptsBackup = [
    "activationFunction",
    "costFunction",
    "lossFunctions",
    "dataPoint",
    "dataManage",
    "weights",
    "layerData",
    "layer",
    "neuralNetwork",
];

const scriptsTest = [
    "activationFunction",
    "costFunction",
    "lossFunctions",
    "dataPoint",
    "dataManage",
    "optimizer",
    "weights",
    "layerData",
    "layer",
    "neuralNetwork",
];

const head = document.getElementById("mainHead");

const scriptsToLoad = scriptsTest;
const folder = "neuralNetwork_test";
const path = "../shared/scripts/" + folder + "/";

for (let i = 0; i < scriptsToLoad.length; i++) {
    let scriptElement = document.createElement("script");
    scriptElement.src = path + scriptsToLoad[i] + ".js";
    head.append(scriptElement);
}