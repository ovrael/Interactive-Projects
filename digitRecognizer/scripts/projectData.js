class ProjectData {
    static CanvasWidth = 900;               // slider,   Width,  200, 1000, 600, 10
    static CanvasHeight = 800;              // slider,   Height,  200, 1000, 600, 10
    static BackgroundColor = '#646464';     // color,    Background,  #646464
}

const scripts = [
    "activationFunction",
    "activationFunctions",
    "lossFunction",
    "lossFunctions",
    "dataManage",
    "weights",
    "layer",
    "neuralNetwork",
    "neuralNetworkDrawer",
];

const head = document.getElementById("mainHead");
for (let i = 0; i < scripts.length; i++) {
    let scriptElement = document.createElement("script");
    scriptElement.src = "../shared/scripts/neuralNetwork/" + scripts[i] + ".js";
    head.append(scriptElement);
}