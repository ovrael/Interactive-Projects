class ActivationFunction {
    constructor(func, dfunc) {
        this.function = func;
        this.derivative = dfunc;
    }
}

class LossFunction {
    static onehotIndexTarget(target, predictedLength) {

        if (Array.isArray(target))
            return target;

        const targetsIndex = target;
        const targets = [];
        for (let i = 0; i < predictedLength; i++) {
            targets.push(
                (i == targetsIndex) ? 1 : 0
            );
        }

        return targets;
    }
}

const ActivationFunctions = {
    Sigmoid: new ActivationFunction(
        neurons => neurons.map((n) => 1.0 / (1.0 + Math.exp(-n))),
        activations => activations.map((a) => a * (1 - a)),
    ),

    Tanh: new ActivationFunction(
        neurons => neurons.map((n) => Math.tanh(n)),
        activations => activations.map((a) => 1 - (a * a)),
    ),

    ReLU: new ActivationFunction(
        neurons => neurons.map((n) => Math.max(n, 0)),
        activations => activations.map((a) => a > 0 ? 1 : 0),
    ),

    SoftMax: new ActivationFunction(
        neurons => {
            let max = Number.MIN_VALUE;
            for (let i = 0; i < neurons.length; i++) {
                if (neurons[i] > max)
                    max = neurons[i];
            }
            const exponents = neurons.map((n) => Math.exp(n - max));
            const sum = exponents.reduce((a, b) => a + b);
            return exponents.map((e) => e / sum);
        },
        activations => {

            const derivatives = [];
            for (let i = 0; i < activations.length; i++) {
                derivatives.push((1 - activations[i]) * activations[i]);
            }
            return derivatives;
        },
    ),
}

const epsilon = Number.EPSILON;
const LossFunctions =
{
    Regression:
    {
        Difference: function (predicted, targets) {
            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(predicted[i] - targets[i]);
            }
            return errors;
        },

        MeanSquaredError: function (predicted, targets) {
            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(-0.5 * (targets[i] - predicted[i]) * (targets[i] - predicted[i]));
            }
            return errors;
        },

        LogLoss: function (predicted, targets) {
            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(-(targets[i] * Math.log(epsilon + predicted[i])));
            }
            return errors;
        },
    },
    BinaryClassification:
    {
        BinaryCrossEntropy: function (predicted, targets) {
            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(
                    (Math.log(epsilon + predicted[i]) + (1 - targets[i]) * Math.log(1 - predicted[i] + epsilon))
                );
            }
            return errors;
        }
    },
    MultiClassification:
    {
        CategoricalCrossEntropy: function (predicted, targets) {

            targets = LossFunction.onehotIndexTarget(targets, predicted.length);

            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(targets[i] * Math.log(predicted[i] + epsilon) - (1 - targets[i]) * Math.log(1 - predicted[i] + epsilon));
            }
            return errors;
        },

        SimpleSubtraction: function (predicted, targets) {

            targets = LossFunction.onehotIndexTarget(targets, predicted.length);

            const errors = [];
            for (let i = 0; i < predicted.length; i++) {

                errors.push(predicted[i] - targets[i]);
            }
            return errors;
        },

        SimpleSubtraction2: function (predicted, targets) {

            targets = LossFunction.onehotIndexTarget(targets, predicted.length);

            const errors = [];
            for (let i = 0; i < predicted.length; i++) {

                errors.push(targets[i] - predicted[i]);
            }
            return errors;
        },
    }
}

class DataManage {

    static split(data, targets, ratio) {
        const splitData = { trainX: [], trainY: [], testX: [], testY: [] };

        const testMax = data.length * (1 - ratio);

        while (data.length > 0) {

            const i = Math.floor(Math.random() * data.length);
            const x = data.splice(i, 1)[0];
            const y = targets.splice(i, 1)[0];

            if (splitData.testX.length < testMax) {
                if (Math.random() > 0.5) {
                    splitData.trainX.push(x);
                    splitData.trainY.push(y);
                }
                else {
                    splitData.testX.push(x);
                    splitData.testY.push(y);
                }
            }
            else {
                splitData.trainX.push(x);
                splitData.trainY.push(y);
            }
        }

        return splitData;
    }
}

class Weights {

    constructor(previous, current) {
        this.previous = previous;
        this.current = current;
        this.data = new Array(this.previous);

        // Fill weights with nubmers between -1 and 1.
        for (let i = 0; i < this.previous; i++) {
            this.data[i] = new Array(this.current);

            for (let j = 0; j < this.current; j++) {
                this.data[i][j] = (random() - 0.5);
            }
        }
    }

    map(func) {
        // Apply a function to every element of matrix
        for (let i = 0; i < this.previous; i++) {
            for (let j = 0; j < this.current; j++) {
                let val = this.data[i][j];
                this.data[i][j] = func(val, i, j);
            }
        }
        return this;
    }

    multiply(other) {
        if (other instanceof Weights) {
            if (this.previous !== other.previous || this.current !== other.current) {
                console.log('Columns and Rows of A must match Columns and Rows of B.');
                return;
            }

            // hadamard product
            return this.map((e, i, j) => e * other.data[i][j]);
        } else {
            // Scalar product
            return this.map(e => e * other);
        }
    }
}

class Layer {

    constructor(numberOfNeurons, numberOfPreviousNeurons = 0, activationFunction) {
        // /** @type {Array<Neuron>} */
        // this.neurons = new Array(numberOfNeurons);

        this.neuronsCount = numberOfNeurons;
        this.biases = [];       // Small values added each time sum happens
        this.sums = [];         // Sum of activations (previous layer) * weights + biases (current layer) 
        this.activations = [];  // Activation of sums from current layer
        this.derivatives = [];  // Derivatives of activations from current layer
        this.errors = [];       // Errors from current layer
        this.gamma = [];        //error * derivative

        for (let i = 0; i < numberOfNeurons; i++) {
            this.biases.push(Math.random() - 0.5);
            this.sums.push(0);
            this.activations.push(0);
            this.derivatives.push(0);
            this.errors.push(0);
            this.gamma.push(0);
        }

        /** @type {Weights} */
        this.weights = (numberOfPreviousNeurons > 0) ? new Weights(numberOfPreviousNeurons, numberOfNeurons) : null;
        /** @type {Weights} */
        this.weightsDeltas = (numberOfPreviousNeurons > 0) ? new Weights(numberOfPreviousNeurons, numberOfNeurons) : null;

        /** @type {ActivationFunction} */
        this.activationFunction = activationFunction;
    }


    fillNeurons(dataRow) {
        if (dataRow.length != this.neuronsCount) {
            console.error(`Data length (${dataRow.length}) is different than neurons length (${this.neuronsCount})!`);
            return;
        }

        for (let i = 0; i < dataRow.length; i++) {
            this.activations[i] = dataRow[i];
        }
    }

    sumNeurons(previousLayer) {
        for (let i = 0; i < this.neuronsCount; i++) {
            this.sums[i] = 0;
            for (let j = 0; j < previousLayer.activations.length; j++) {
                this.sums[i] += previousLayer.activations[j] * this.weights.data[j][i];
            }
            this.sums[i] += this.biases[i];
        }
    }

    activateNeurons() {
        this.activations = this.activationFunction.function(this.sums);
    }

    computeDerivatives() {
        this.derivatives = this.activationFunction.derivative(this.activations);
    }

    computeGamma(nextLayer) {

        for (let i = 0; i < this.neuronsCount; i++) {
            this.gamma[i] = 0;
            for (let j = 0; j < nextLayer.neuronsCount; j++) {
                this.gamma[i] += nextLayer.gamma[j] * nextLayer.weights.data[i][j];
            }
            this.gamma[i] *= this.derivatives[i];
        }
    }

    computeWeightsDeltas(previousLayer) {
        for (let p = 0; p < this.weightsDeltas.previous; p++) {
            for (let c = 0; c < this.weightsDeltas.current; c++) {
                this.weightsDeltas.data[p][c] =
                    this.gamma[c] * previousLayer.activations[p];
            }
        }
    }

    computeWeightsDeltasBatch(previousLayer) {
        for (let p = 0; p < this.weightsDeltas.previous; p++) {
            for (let c = 0; c < this.weightsDeltas.current; c++) {
                this.weightsDeltas.data[p][c] += this.gamma[c] * previousLayer.activations[p];
            }
        }
    }

    resetWeightsDeltas() {
        for (let p = 0; p < this.weightsDeltas.previous; p++) {
            for (let c = 0; c < this.weightsDeltas.current; c++) {
                this.weightsDeltas.data[p][c] = 0;
            }
        }
    }

    updateWeights(learningRate = 0.005) {
        for (let c = 0; c < this.weights.current; c++) {

            this.biases[c] -= this.gamma[c] * learningRate;
            for (let p = 0; p < this.weights.previous; p++) {
                this.weights.data[p][c] -= this.weightsDeltas.data[p][c] * learningRate;
            }
        }
    }
}

class NeuralNetwork {

    constructor(errorFunction, learningRate = 0.05) {
        this.lossFunction = errorFunction;
        this.learningRate = learningRate;

        /** @type {Array<Layer>} */
        this.layers = [];
        this.layersCount = -1;

        this.lastTarget = null;
        this.singleOutput = false;
    }

    // PUBLIC

    /**
        Compiles the neural network with the given error function and learning rate.
        @param {Function} errorFunction - The error function to be used for the neural network.
        @param {number} [learningRate=0.05] - The learning rate to be used for the neural network.
        @returns {undefined} This function does not return anything.
    */
    compile(errorFunction, learningRate = 0.05) {
        this.lossFunction = errorFunction;
        this.learningRate = learningRate;
        this.#updateNeuralNetworkData();
    }

    /**
        Adds a new layer to the neural network with the given number of neurons and activation function.
        @param {number} numberOfNeurons - The number of neurons in the new layer.
        @param {Function} activationFunction - The activation function to be used for the new layer.
        @returns {undefined} This function does not return anything.
    */
    addLayer(numberOfNeurons, activationFunction) {
        let numberOfPreviousNeurons = ((this.layers.length > 0) ? this.layers[this.layers.length - 1].neuronsCount : 0);

        this.layers.push(
            new Layer(numberOfNeurons, numberOfPreviousNeurons, activationFunction)
        );
    }

    /**
        Trains the neural network using the given data and targets with the given parameters.
        @param {Array<Array<number>>} data - The data to be used for training.
        @param {Array<Array<number>>} targets - The target outputs to be used for training.
        @param {number} [trainTestRatio=0.7] - The ratio of data to be used for training, the rest will be used for testing.
        @param {number} [epochs=100] - The number of epochs to be used for training.
        @returns {undefined} This function does not return anything.
    */
    train(data, targets, trainTestRatio = 0.7, epochs = 100) {

        if (!this.#checkConditions(data, targets)) {
            return;
        }

        this.#updateNeuralNetworkData();

        const splitData = DataManage.split(data, targets, trainTestRatio);
        const showResultStep = Math.floor(epochs / 10);

        for (let e = 0; e < epochs; e++) {
            let trainLoss = 0;
            for (let i = 0; i < splitData.trainX.length; i++) {
                this.#feedForward(splitData.trainX[i]);
                trainLoss -= this.#backpropError(splitData.trainY[i]);

                this.#tweakWeights();

                // Used for neural network drawer
                this.lastTarget = splitData.trainY[i];
            }
            trainLoss /= splitData.trainX.length;

            let testResult = this.#validate(splitData.testX, splitData.testY);

            if (e % showResultStep == 0 || e == epochs - 1) {

                const results = {
                    "Epoch": e,
                    "Train Loss": trainLoss,
                    "Test Loss": testResult[0],
                    "Good Test": testResult[1],
                    "Test length": splitData.testX.length,
                }
                console.table(results);
            }
        }

        console.info("Training finished");
        console.table(this);
    }

    /**
        Trains the neural network using mini-batch gradient descent with the given data and targets with the given parameters.
        @param {Array<Array<number>>} data - The data to be used for training.
        @param {Array<Array<number>>} targets - The target outputs to be used for training.
        @param {number} [batchSize=16] - The batch size to be used for training.
        @param {number} [trainTestRatio=0.7] - The ratio of data to be used for training, the rest will be used for testing.
        @param {number} [epochs=100] - The number of epochs to be used for training.
        @returns {undefined} This function does not return anything.
    */
    trainBatch(data, targets, batchSize = 16, trainTestRatio = 0.7, epochs = 100) {

        if (!this.#checkConditions(data, targets)) {
            return;
        }

        this.#updateNeuralNetworkData();

        const splitData = DataManage.split(data, targets, trainTestRatio);
        const showResultStep = Math.floor(epochs / 10);

        for (let e = 0; e < epochs; e++) {
            let trainLoss = 0;

            let batchTrainX = [];
            let batchTrainY = [];


            for (let i = 0; i < splitData.trainX.length; i++) {

                batchTrainX.push(splitData.trainX[i]);
                batchTrainY.push(splitData.trainY[i]);

                if (batchTrainX.length == batchSize || i == splitData.trainX.length - 1) {

                    for (let layer = 1; layer < this.layers.length; layer++) {
                        this.layers[layer].resetWeightsDeltas();
                    }

                    for (let j = 0; j < batchTrainX.length; j++) {
                        this.#feedForward(batchTrainX[j]);
                        trainLoss -= this.#backpropErrorBatch(batchTrainY[j]);
                    }

                    this.#tweakWeights();
                    batchTrainX = [];
                    batchTrainY = [];
                }

                // Used for neural network drawer
                this.lastTarget = splitData.trainY[i];
            }
            trainLoss /= splitData.trainX.length;

            let testResult = this.#validate(splitData.testX, splitData.testY);

            if (e % showResultStep == 0 || e == epochs - 1) {

                const results = {
                    "Epoch": e,
                    "Train Loss": trainLoss,
                    "Test Loss": testResult[0],
                    "Good Test": testResult[1],
                    "Test length": splitData.testX.length,
                }
                console.table(results);
            }
        }

        console.info("Training finished");
        console.table(this);
    }

    /**
        Given input data, predict the output of the neural network.
        @param {Array} data - The input data for the neural network.
                            If only one data point is provided, it should be a one-dimensional array.
                            If multiple data points are provided, they should be provided as a two-dimensional array,
                            where each row represents a single data point.
        
        @returns {Array} The predicted outputs of the neural network.
                        The output will be a one-dimensional array if only one data point is provided,
                        or a two-dimensional array if multiple data points are provided,
                        here each row represents the predicted output for a single data point.
    */
    predict(data) {
        if (!Array.isArray(data)) {
            data = [data];
        }

        if (data.length != this.layers[0].neuronsCount)
            return;

        this.#feedForward(data);

        return this.layers[this.layersCount - 1].activations;
    }


    // PRIVATE

    /**
        Updates the neural network layers count and whether the output is a single value.
    */
    #updateNeuralNetworkData() {
        this.layersCount = this.layers.length;
        this.singleOutput = this.layers[this.layersCount - 1].neuronsCount == 1;
    }

    /**
        Checks whether the neural network meets certain conditions for training.
        @param {Array} data - the training data to be checked.
        @param {Array} targets - the target outputs for the training data to be checked.
        @returns {boolean} true if the neural network meets the conditions, false otherwise.
    */
    #checkConditions(data, targets) {
        if (this.layers.length < 3) {
            console.error("Neural network is too small. It should have at least 3 layers!");
            return false;
        }

        if (data.length == 0) {
            console.error("No data to train!");
            return false;
        }

        if (data.length != targets.length) {
            console.error("Data is different size than targets! " + data.length + " != " + targets.length);
            return false;
        }

        if (data[0].length != this.layers[0].neuronsCount) {
            console.error("Data is different size than first layer of neural network!");
            return false;
        }

        return true;
    }

    /**
        Feeds the input data forward through the neural network.
        @param {Array} rowData - the input data to be fed forward through the network.
    */
    #feedForward(rowData) {
        this.layers[0].fillNeurons(rowData);
        for (let i = 1; i < this.layers.length; i++) {
            this.layers[i].sumNeurons(this.layers[i - 1]);
            this.layers[i].activateNeurons();
        }
    }

    /**
        Computes the error for the last layer of the neural network.
        @param {Array} target - the target output for the training data.
        @returns {number} the sum of errors for the output layer.
    */
    #backpropLastLayer(target) {
        let errorSum = 0;
        let outputErrors = this.lossFunction(this.layers[this.layers.length - 1].activations, target);

        this.layers[this.layersCount - 1].computeDerivatives();
        for (let i = 0; i < this.layers[this.layers.length - 1].neuronsCount; i++) {
            this.layers[this.layers.length - 1].errors[i] = outputErrors[i];
            this.layers[this.layers.length - 1].gamma[i] = outputErrors[i] * this.layers[this.layers.length - 1].derivatives[i];
            errorSum += outputErrors[i];
        }

        this.layers[this.layersCount - 1].computeWeightsDeltas(this.layers[this.layersCount - 2]);

        return errorSum;
    }

    /**
        Computes the error for each layer of the neural network.
        @param {Array} target - the target output for the training data.
        @returns {number} the sum of errors for the neural network.
    */
    #backpropError(target) {

        const errorSum = this.#backpropLastLayer(target);

        for (let layer = this.layers.length - 2; layer > 0; layer--) {
            this.layers[layer].computeDerivatives();
            this.layers[layer].computeGamma(this.layers[layer + 1]);
            this.layers[layer].computeWeightsDeltas(this.layers[layer - 1]);
        }

        return errorSum;
    }

    /**
        Computes the BATCH error for the last layer of the neural network.
        @param {Array} target - the target output for the training data.
        @returns {number} the sum of errors for the output layer.
    */
    #backpropLastLayerBatch(target) {
        let errorSum = 0;
        let outputErrors = this.lossFunction(this.layers[this.layers.length - 1].activations, target);

        this.layers[this.layersCount - 1].computeDerivatives();
        for (let i = 0; i < this.layers[this.layers.length - 1].neuronsCount; i++) {
            this.layers[this.layers.length - 1].errors[i] = outputErrors[i];
            this.layers[this.layers.length - 1].gamma[i] = outputErrors[i] * this.layers[this.layers.length - 1].derivatives[i];
            errorSum += outputErrors[i];
        }

        this.layers[this.layersCount - 1].computeWeightsDeltasBatch(this.layers[this.layersCount - 2]);

        return errorSum;
    }

    /**
        Computes the BATCH error for each layer of the neural network.
        @param {Array} target - the target output for the training data.
        @returns {number} the sum of errors for the neural network.
    */
    #backpropErrorBatch(target) {

        const errorSum = this.#backpropLastLayerBatch(target);

        for (let layer = this.layers.length - 2; layer > 0; layer--) {
            this.layers[layer].computeDerivatives();
            this.layers[layer].computeGamma(this.layers[layer + 1]);
            this.layers[layer].computeWeightsDeltasBatch(this.layers[layer - 1]);
        }

        return errorSum;
    }

    /**
        Adjusts the weights of the network using backpropagation and the learning rate
    */
    #tweakWeights() {
        for (let i = 1; i < this.layersCount; i++) {
            this.layers[i].updateWeights(this.learningRate);
        }
    }

    /**
        Validates the network on a test dataset and returns the average loss and number of correct predictions
        @param {number[][]} testX - the test input data
        @param {number[]} testY - the test target values
        @returns {number[]} - an array containing the average loss and number of correct predictions
    */
    #validate(testX, testY) {
        let testLoss = 0;
        let goodTest = 0;

        if (this.singleOutput) {
            for (let i = 0; i < testX.length; i++) {
                this.#feedForward(testX[i]);
                let outputErrors = this.lossFunction(this.layers[this.layers.length - 1].activations, testY[i]);
                testLoss = -outputErrors.reduce((a, b) => a + b, 0);

                const res = this.layers[this.layers.length - 1].activations[0] > 0.5 ? 1 : 0;

                if (res == testY[i]) {
                    goodTest++;
                }
                this.lastTarget = testY[i];
            }
        }
        else {

            for (let i = 0; i < testX.length; i++) {
                this.#feedForward(testX[i]);
                let outputErrors = this.lossFunction(this.layers[this.layers.length - 1].activations, testY[i]);
                testLoss = -outputErrors.reduce((a, b) => a + b, 0);

                let maxIndex = this.#getMaxNeuronIndex();
                if (maxIndex == testY[i]) {
                    goodTest++;
                }
                this.lastTarget = testY[i];
            }
        }

        testLoss /= testX.length;

        return [testLoss, goodTest];
    }

    /**
        Gets the index of the neuron with the maximum activation value in the last layer of the network
        @returns {number} - the index of the neuron with the maximum activation value
    */
    #getMaxNeuronIndex() {
        let maxIndex = -1;
        let maxValue = Number.MIN_VALUE;
        const lastLayer = this.layers[this.layersCount - 1];
        for (let i = 0; i < lastLayer.neuronsCount; i++) {
            if (lastLayer.activations[i] > maxValue) {
                maxIndex = i;
                maxValue = lastLayer.activations[i];
            }
        }

        return maxIndex;
    }
}

class NeuralNetworkDrawer {
    constructor(neuralNetwork, xOffset = 60, yOffset = 80) {
        /** @type {NeuralNetwork} */
        this.neuralNetwork = neuralNetwork;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.size = 50;
        rectMode(CENTER);
    }

    draw(width, height) {
        strokeWeight(2);
        textSize(10);
        textStyle(NORMAL);
        textAlign(CENTER, CENTER);

        push();
        textSize(16);
        text('Target: ' + this.neuralNetwork.lastTarget, width - 40, height / 2 - 80);
        pop();
        const layersCount = this.neuralNetwork.layers.length;
        for (let i = 0; i < layersCount; i++) {

            const xPos = this.xOffset * 0.5 + (width - this.xOffset) * (i / (layersCount - 1));
            if (i == 0) {
                push();
                textSize(12);
                strokeWeight(0);
                fill(0);
                text('INPUT', xPos, 8);
                pop();
            }
            else if (i == layersCount - 1) {
                push();
                textSize(12);
                strokeWeight(0);
                fill(0);
                text('OUTPUT', xPos, 8);
                pop();
            }
            else {
                push();
                textSize(12);
                strokeWeight(0);
                fill(0);
                text('HIDDEN ' + i, xPos, 8);
                pop();
            }

            /** @type{Layer} */
            const layer = this.neuralNetwork.layers[i];

            for (let j = 0; j < layer.neuronsCount; j++) {

                let yPos = this.yOffset * 0.5 + (height - this.yOffset) * (j / (layer.neuronsCount - 1));
                if (layer.neuronsCount == 1) {
                    yPos = height / 2;
                }

                if (i < layersCount - 1) {
                    const nextLayer = this.neuralNetwork.layers[i + 1];
                    for (let k = 0; k < nextLayer.neuronsCount; k++) {
                        const xPos2 = this.xOffset * 0.5 + (width - this.xOffset) * ((i + 1) / (layersCount - 1));
                        let yPos2 = this.yOffset * 0.5 + (height - this.yOffset) * (k / (nextLayer.neuronsCount - 1));
                        if (nextLayer.neuronsCount == 1)
                            yPos2 = height / 2;
                        strokeWeight(1);
                        line(xPos, yPos, xPos2, yPos2);
                    }
                }

                strokeWeight(1);
                fill(0);
                rect(xPos, yPos, this.size, this.size);
                line(xPos, yPos, xPos, yPos + 35);
                rect(xPos, yPos + 35, this.size, 12);

                push();
                strokeWeight(0);
                fill(50, 150, 50);
                text('S: ' + layer.sums[j].toFixed(2), xPos, yPos - 17);
                fill(150, 150, 50);
                text('A: ' + layer.activations[j].toFixed(2), xPos, yPos - 5);
                fill(50, 150, 250);
                text('D: ' + layer.derivatives[j].toFixed(2), xPos, yPos + 7);
                fill(200, 40, 40);
                text('E: ' + layer.errors[j].toFixed(2), xPos, yPos + 19);
                fill(150, 40, 200);
                text('B: ' + layer.biases[j].toFixed(2), xPos, yPos + 35);
                pop();
            }
        }
    }
}