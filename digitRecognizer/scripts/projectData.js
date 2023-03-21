class ProjectData {
    static CanvasWidth = 600;               /* Keep width at 600px */
    static CanvasHeight = 600;              /* Keep height at 600px */
    static BackgroundColor = '#646464';     /* Keep background color at smooth gray */

    // tab: Look
    // section: Drawing
    static DrawDigitStroke = 10;            // slider, Draw thickness,  4, 32, 10, 1

    // section: Image display
    static TrainDataSpeed = 40;             // slider, Training data speed  , 1, 60, 5, 1
    static WrongDataSpeed = 30;             // slider, Wrong data speed     , 1, 60, 30, 1

    // tab: Data
    // section: Loading data
    static SamplesPerDigit = 300;           // slider, Samples per digit,  10, 1000, 300, 10
    static SplitFraction = 0.7;             // slider, Test/Validation split fraction, 0.1, 1.0, 0.7, 0.01
    static ShouldShuffle = true;            // checkbox, Shuffle splitted data?, true
    static NormalizationMethod = 'scale'    // select, Normalization method, scale, lightPixel, halfLightPixel, noNormalization

    // section: Oversampling
    static OversamplesPerDigit = 1;         // slider, Generated samples per digit, 0, 10, 2, 1
    static AddOriginalDigit = false;        // checkbox, Add original digits?, true

    static MaxRotateAngle = 20;             // slider, Max rotate angle,  0, 90, 20, 1
    static HorizontallyShiftChance = 60;    // slider, Horizontally shift chance %,  0, 100, 60, 1
    static VerticallyShiftChance = 60;      // slider, Vertically Shift Chance %,   0, 100, 60, 1
    static NoiseSize = 1;                   // slider, Noise size,  0, 100, 1, 1
    static NoiseStrength = 100;             // slider, Noise strength,  0, 120, 100, 1

    // tab: Model
    // section: Creation
    static CostFunctionName = 'crossentropy'// select, Cost function, Crossentropy[crossentropy], Mean Squared Error[mse]
    static OptimizerName = 'sgd'            // select, Optimizer, Stochastic Gradient Descent[sgd], Adam[adam], RMSprop[rmsProp]

    // tab: Model 2
    // section: Hyperparameters
    static TrainBatchSize = 64;             // slider, Train batch size,  1, 512, 64, 1

    // section: Optimizer
    static LearningRate = 0.001;            // slider, Learning rate, 0.00001, 0.1, 0.001, 0.00001

    static OptimizerMomentum = 0;
    static OptimizerWeightsDecay = 0;
    static OptimizerBeta1 = 0.9;
    static OptimizerBeta2 = 0.999;
    static OptimizerEpsilon = 1e-8;
}

// const scriptsTest = [
//     "activationFunction",
//     "costFunction",
//     "dataPoint",
//     "dataManage",
//     "optimizer",
//     "weights",
//     "weightsRegulizer",
//     "layerData",
//     "layer",
//     "backpropLayer",
//     "trainHistory",
//     "neuralNetwork",
// ];

// const head = document.getElementById("mainHead");

// const scriptsToLoad = scriptsTest;
// const folder = "neuralNetwork_test";
// const path = "../shared/scripts/" + folder + "/";

// for (let i = 0; i < scriptsToLoad.length; i++) {
//     let scriptElement = document.createElement("script");
//     scriptElement.src = path + scriptsToLoad[i] + ".js";
//     head.append(scriptElement);
// }