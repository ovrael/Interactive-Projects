class ProjectData {
    static CanvasWidth = 600;               /* Keep width at 600px */
    static CanvasHeight = 600;              /* Keep height at 600px */
    static BackgroundColor = '#646464';     /* Keep background color at smooth gray */

    // tab: Look
    // firstSection: Drawing
    static DrawDigitStroke = 10;            // slider, Draw thickness,  4, 32, 10, 1

    // section: Image display
    static TrainDataSpeed = 40;             // slider, Training data speed  , 1, 60, 5, 1
    static WrongDataSpeed = 30;             // slider, Wrong data speed     , 1, 60, 30, 1

    // tab: Data
    // firstSection: Loading data
    static SamplesPerDigit = 300;           // slider, Samples per digit,  10, 1000, 300, 10
    static SplitFraction = 0.7;             // slider, Test/Validation split fraction, 0.1, 0.9, 0.7, 0.01
    static ShouldShuffle = true;            // checkbox, Shuffle splitted data?, true
    static NormalizationMethod = 'scale'    // select, Normalization method, Scale[scale], Light pixel[lightPixel], Half light pixel[halfLightPixel], No normalization[noNormalization]

    // section: Oversampling
    static AddOriginalDigit = false;        // checkbox, Add original digits?, true
    static OversamplesPerDigit = 1;         // slider, Generated samples per digit, 0, 10, 2, 1

    static MaxRotateAngle = 20;             // slider, Max rotate angle,  0, 90, 20, 1
    static HorizontallyShiftChance = 60;    // slider, Horizontally shift chance %,  0, 100, 60, 1
    static VerticallyShiftChance = 60;      // slider, Vertically Shift Chance %,   0, 100, 60, 1
    static NoiseSize = 1;                   // slider, Noise size,  0, 100, 1, 1
    static NoiseStrength = 100;             // slider, Noise strength,  0, 120, 100, 1

    // tab: Create model
    // firstSection: Layers
    static Model = null;
    static LayersData = [
        Layer.Input(28 * 28),
        Layer.Dropout(0.5),
        Layer.Dense(512, ActivationFunction.leakyRelu(), WeightsRegulizer.L2(0.1)),
        Layer.Dropout(0.3),
        Layer.Dense(10, ActivationFunction.softmax(), WeightsRegulizer.L2(0.1)),
    ];
    static LayersCount = 0;

    static MinLayers = 3;
    static MaxLayers = 10;

    static MinNeurons = 1;
    static MaxNeurons = 1024;


    // tab: Adjust model
    // firstSection: Hyperparameters
    static TrainBatchSize = 64;             // slider, Train batch size,  1, 512, 64, 1
    static LearningRate = 0.001;            // slider, Learning rate, 0.00001, 0.1, 0.001, 0.00001
    static CostFunctionName = 'crossentropy'// select, Cost function, Crossentropy[crossentropy], Mean Squared Error[mse]

    // section: Optimizer

    static OptimizerName = 'sgd'            // select, Optimizer type, Stochastic Gradient Descent[sgd], Adam[adam], RMSprop[rmsProp]
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