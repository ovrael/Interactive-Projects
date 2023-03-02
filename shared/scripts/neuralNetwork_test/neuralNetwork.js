class NeuralNetwork {

    constructor(errorFunction, learningRate = 0.05) {
        this.lossFunction = errorFunction;
        this.learningRate = learningRate;

        /** @type {Array<Layer>} */
        this.layers = [];
        this.rememberedDropoutData = null;
        this.layersCount = -1;

        this.lastTarget = null;
        this.singleOutput = false;
        this.isLearning = false;

        this.learningStatistics = {};
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

    reinitializeWeights() {

        if (this.layers.length == 0)
            return;

        for (let i = 1; i < this.layers.length; i++) {
            this.layers[i].reinitializeWeights();
        }
    }

    /**
    Adds a new layer to the neural network with the given number of neurons and activation function.
    @param {number} numberOfNeurons - The number of neurons in the new layer.
    @param {Function} activationFunction - The activation function to be used for the new layer.
    @returns {undefined} This function does not return anything.
*/
    addLayer(layerData) {

        if (!(layerData instanceof LayerData)) {
            console.error("Layer data is not instance of LayerData class!");
            return null;
        }

        switch (layerData.type) {
            case LayerType.Input:
                this.#addInputLayer(layerData);
                break;
            case LayerType.Dense:
                this.#addDenseLayer(layerData);
                break;

            case LayerType.Dropout:
                this.rememberedDropoutData = layerData;
                break;
            default:
                break;
        }

        this.layersCount = this.layers.length;
    }

    // constructor(type, numberOfNeurons, numberOfPreviousNeurons = 0, activationFunction, dropoutRate)

    #addInputLayer(layerData) {
        if (this.layers.length > 0) {
            console.error("Input layer already exists in the neural network!");
            return null;
        }

        this.layers.push(
            new Layer(LayerType.Input, layerData.neurons, 0, null, 0)
        );
    }

    #addDenseLayer(layerData) {
        if (this.layers.length == 0) {
            console.error("There is no input layer in the neural network!");
            return null;
        }

        // Prevents from adding dropout to last layer.
        // this.rememberedDropoutLayer changes to null after this operation.
        if (this.rememberedDropoutData != null) {
            this.#addDropoutLayer(this.rememberedDropoutData);
        }

        this.layers.push(
            new Layer(
                LayerType.Dense,
                layerData.neurons,
                this.layers[this.layers.length - 1].neuronsCount,
                layerData.activationFunction,
                0
            )
        );
    }

    #addDropoutLayer(layerData) {
        if (this.layers.length == 0) {
            console.error("There is no input layer in the neural network!");
            return null;
        }

        this.layers[this.layers.length - 1].addDropout(layerData.dropoutRate);
        this.rememberedDropoutData = null;
    }

    #changeLayersDropout(shouldDropout) {
        for (let i = 0; i < this.layersCount - 1; i++) {
            if (this.layers[i].type == LayerType.Dropout) {
                this.layers[i].changeDropoutMode(shouldDropout);
            }
        }
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
                    "Test %": (testResult[1] / splitData.testX.length).toFixed(2),
                }
                this.learningStatistics = results;
                console.log(results["Test %"]);
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
                        this.layers[layer].setWeihtsDeltasToZero();
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
                    "Test %": (testResult[1] / splitData.testX.length).toFixed(2),
                }
                console.table(results);
            }
        }

        console.info("Training finished");
        console.table(this);
    }

    trainAdam(data, targets, batchSize = 16, trainTestRatio = 0.7, epochs = 100, alpha = 0.001, beta1 = 0.9, beta2 = 0.999, epsilon = 1e-8) {
        if (!this.#checkConditions(data, targets)) {
            return;
        }

        if (this.isLearning)
            return;

        this.isLearning = true;

        this.#updateNeuralNetworkData();

        const splitData = DataManage.split(data, targets, trainTestRatio);
        const showResultStep = Math.floor(epochs / 10);

        let m = [];
        let v = [];

        for (let i = 1; i < this.layers.length; i++) {
            m[i] = Weights.createZero(this.layers[i].weights);
            v[i] = Weights.createZero(this.layers[i].weights);
        }

        strokeWeight(5);
        fill(250, 50, 50);
        textSize(20);
        for (let e = 0; e < epochs; e++) {

            let trainLoss = 0;

            let batchTrainX = [];
            let batchTrainY = [];

            const shuffledTrainData = DataManage.shuffle(splitData.trainX, splitData.trainY);
            this.#changeLayersDropout(true);

            for (let i = 0; i < shuffledTrainData.data.length; i++) {

                batchTrainX.push(shuffledTrainData.data[i]);
                batchTrainY.push(shuffledTrainData.targets[i]);

                if (batchTrainX.length == batchSize || i == shuffledTrainData.data.length - 1) {
                    for (let layer = 1; layer < this.layers.length; layer++) {
                        this.layers[layer].setWeihtsDeltasToZero();
                    }

                    for (let j = 0; j < batchTrainX.length; j++) {
                        this.#feedForward(batchTrainX[j]);
                        trainLoss -= this.#backpropErrorBatch(batchTrainY[j]);
                    }

                    for (let layer = 1; layer < this.layers.length; layer++) {
                        const dw = this.layers[layer].weightsDeltas.copy();

                        m[layer] = Weights.scalarMultiply(m[layer], beta1);
                        m[layer].weightsAdd(Weights.scalarMultiply(dw, 1 - beta1));

                        v[layer] = Weights.scalarMultiply(v[layer], beta2);
                        v[layer].weightsAdd(Weights.scalarMultiply(Weights.hadamardMultiply(dw, dw), 1 - beta2));

                        const mHat = Weights.scalarDivide(m[layer], 1 - Math.pow(beta1, e + 1));
                        const vHat = Weights.scalarDivide(v[layer], 1 - Math.pow(beta2, e + 1));
                        const vHatSquared = Weights.sqrt(vHat);

                        const delta = Weights.scalarMultiply(Weights.weightsDivide(mHat, Weights.scalarAdd(vHatSquared, epsilon)), alpha);
                        this.layers[layer].weights.weightsSubtract(delta);
                    }

                    batchTrainX = [];
                    batchTrainY = [];
                }

                this.lastTarget = shuffledTrainData.targets[i];
            }

            trainLoss /= shuffledTrainData.data.length;

            this.#changeLayersDropout(false);
            const shuffledTestData = DataManage.shuffle(splitData.testX, splitData.testY);
            let testResult = this.#validate(shuffledTestData.data, shuffledTestData.targets);

            if (e % showResultStep == 0 || e == epochs - 1) {
                const results = {
                    "Epoch": e,
                    "Train Loss": trainLoss,
                    "Test Loss": testResult[0],
                    "Good Test": testResult[1],
                    "Test length": splitData.testX.length,
                    "Test %": (testResult[1] / splitData.testX.length).toFixed(2),
                }
                this.learningStatistics = results;
                console.table(results);
            }
        }
        this.isLearning = false;
        this.#changeLayersDropout(this.isLearning);

        console.info("Training finished");
        // console.table(this);
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

    predictSingle(data) {
        if (!Array.isArray(data)) {
            data = [data];
        }

        if (data.length != this.layers[0].neuronsCount)
            return;

        this.#feedForward(data);

        return this.#getMaxOutputNeuronIndex();
    }

    predictSingleWithActivation(data) {
        if (!Array.isArray(data)) {
            data = [data];
        }

        if (data.length != this.layers[0].neuronsCount)
            return;

        this.#feedForward(data);

        const outputIndex = this.#getMaxOutputNeuronIndex();
        const result = {
            index: outputIndex,
            activation: this.layers[this.layersCount - 1].activations[outputIndex]
        };

        return result;
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

    #backpropLastLayerBatch2(target) {
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

    // #adamOptimizer(epoch, alpha = 0.001, beta1 = 0.9, beta2 = 0.999, epsilon = 1e-8) {
    //     for (let layer = 1; layer < this.layers.length; layer++) {
    //         const dw = this.layers[layer].weightsDeltas.copy();

    //         m[layer] = Weights.scalarMultiply(m[layer], beta1).weightsAdd(Weights.scalarMultiply(1 - beta1, dw));
    //         v[layer] = Weights.scalarMultiply(v[layer], beta2).weightsAdd(Weights.scalarMultiply(1 - beta2, Weights.hadamardMultiply(dw, dw)));

    //         const mHat = Weights.scalarDivide(m[layer], 1 - Math.pow(beta1, epoch + 1));
    //         const vHat = Weights.scalarDivide(v[layer], 1 - Math.pow(beta2, epoch + 1));
    //         const vHatSquared = Weights.scalarPower(vHat, 0.5);

    //         const delta = Weights.scalarMultiply(alpha, Weights.weightsDivide(mHat, Weights.scalarAdd(vHatSquared, epsilon)));
    //         this.layers[layer].weights.scalarAdd(delta);
    //     }
    // }

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
            console.warn("SINGLE OUTPUT")
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

                let maxIndex = this.#getMaxOutputNeuronIndex();

                // console.log(`${maxIndex} == ${testY[i]}`)
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
    #getMaxOutputNeuronIndex() {
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