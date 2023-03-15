class NeuralNetwork {

    constructor(errorFunction, optimizer) {
        /** @type {CostFunction} */
        this.costFunction = errorFunction;
        /** @type {Optimizer} */
        this.optimizer = optimizer;

        /** @type {Array<Layer>} */
        this.layers = [];
        /** @type {Array<BackpropLayer>} */
        this.backpropLayers = [];
        this.rememberedDropoutData = null;
        this.layersCount = -1;

        this.lastTarget = null;
        this.singleOutput = false;
        this.isLearning = false;

        this.learningEpoch = 0;
        this.learningStatistics = {};
        this.badResults = [];
        this.badLabels = [];
        this.statsHistory = [];
    }

    // PUBLIC

    /**
        Compiles the neural network with the given error function and learning rate.
        @param {Function} costFunction - The error function to be used for the neural network.
        @param {number} [learningRate=0.05] - The learning rate to be used for the neural network.
        @returns {undefined} This function does not return anything.
    */
    compile(costFunction, optimzer) {
        this.costFunction = costFunction;
        this.optimizer = optimzer;
        this.#updateNeuralNetworkData();
    }

    resetNetwork() {

        if (this.layers.length == 0)
            return;

        for (let i = 1; i < this.layers.length; i++) {
            this.layers[i].reinitializeWeights();
        }

        this.isLearning = false;

        this.learningStatistics = {};
        this.badResults = [];
        this.badLabels = [];
        this.statsHistory = [];

        this.learningEpoch = 0;
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
                this.#addBackpropLayer();
                break;

            case LayerType.Dropout:
                this.rememberedDropoutData = layerData;
                break;
            default:
                break;
        }
        this.layersCount = this.layers.length;
    }

    #addBackpropLayer() {
        this.backpropLayers.push(
            new BackpropLayer(
                this.layers[this.layers.length - 1].neuronsCount,
                this.layers[this.layers.length - 2].neuronsCount
            )
        );
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
     * It takes a batch of data, feeds it forward, calculates the error, and then backpropagates the
     * error.
     * @param trainData - The training data.
     * @param [validationData=null] - The data to test the network on.
     * @param [batchSize=1] - The number of data points to be used in a single training step.
     * @param [epochs=10] - The number of epochs to train for.
     * @param [continous=false] - If true, the training will continue from the last epoch.
     * @returns the results of the training.
     */
    train(trainData, validationData = null, batchSize = 1, epochs = 10) {

        if (!this.#checkConditions(trainData)) {
            return;
        }

        console.log("Neural network is learning!");

        if (this.learningEpoch == 0) {
            this.optimizer.setNeuralNetworkData(this);
        }


        this.isLearning = true;
        this.#updateNeuralNetworkData();

        const showResultStep = Math.floor(epochs / 10);

        for (let e = 0; e < epochs; e++) {

            let trainLoss = 0;

            /** @type {Array<DataPoint>} */
            let batchTrain = [];

            /** @type {Array<DataPoint>} */
            const shuffledTrainData = DataManage.shuffle(trainData);
            this.#changeLayersDropout(true);

            for (let i = 0; i < shuffledTrainData.length; i++) {

                batchTrain.push(shuffledTrainData[i]);

                if (batchTrain.length == batchSize || i == shuffledTrainData.length - 1) {

                    for (let j = 0; j < batchTrain.length; j++) {
                        this.#feedForward(batchTrain[j].inputs);

                        trainLoss += this.costFunction.func(this.layers[this.layers.length - 1].activations, batchTrain[j].expectedOutputs);

                        this.#backpropError(batchTrain[j].expectedOutputs);
                    }

                    this.optimizer.updateWeights(
                        {
                            "layers": this.layers,
                            "backpropLayers": this.backpropLayers,
                        }
                    );

                    this.#clearGradients();

                    batchTrain = [];
                }

                this.lastTarget = shuffledTrainData[i].label;
            }

            trainLoss /= shuffledTrainData.length;

            this.#changeLayersDropout(false);
            const shuffledTestData = DataManage.shuffle(validationData);

            let testResult = this.#validate(shuffledTestData);

            if (e % showResultStep == 0 || e == epochs - 1) {
                const results = {
                    "Epoch": this.learningEpoch,
                    "Train Loss": trainLoss,
                    "Test Loss": testResult[0],
                    "Good Test": testResult[1],
                    "Test length": validationData.length,
                    "Test %": testResult[1] / validationData.length,
                }
                this.learningStatistics = results;
                this.statsHistory.push(results);
                console.table(results);
            }

            this.learningEpoch++;
        }
        this.isLearning = false;
        this.#changeLayersDropout(this.isLearning);

        console.info("Training finished");
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
    #checkConditions(dataPoints) {

        if (this.isLearning)
            return false;

        if (this.layers.length < 3) {
            console.error("Neural network is too small. It should have at least 3 layers!");
            return false;
        }

        if (dataPoints.length == 0) {
            console.error("No data to train!");
            return false;
        }

        if (dataPoints[0].inputs.length != this.layers[0].neuronsCount) {
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
       Computes the BATCH error for the last layer of the neural network.
       @param {Array} target - the target output for the training data.
       @returns {number} the sum of errors for the output layer.
   */
    #backpropLastLayer(targets) {

        const lastLayer = this.layers[this.layers.length - 1];

        for (let i = 0; i < lastLayer.neuronsCount; i++) {
            const activationDerivative = lastLayer.computeDerivativeAtIndex(i);
            const costDerivative = this.costFunction.derivative(lastLayer.activations[i], targets[i]);
            this.backpropLayers.at(-1).gamma.data[0][i] = activationDerivative * costDerivative;
        }

        this.backpropLayers.at(-1).updateGradient(this.layers.at(-2).activations);

    }


    /**
        Computes the BATCH error for each layer of the neural network.
        @param {Array} targets - the target output for the training data.
        @returns {number} the sum of errors for the neural network.
    */
    #backpropError(targets) {

        this.#backpropLastLayer(targets);
        for (let layer = this.backpropLayers.length - 2; layer >= 0; layer--) {
            this.backpropLayers[layer].computeGamma(this.backpropLayers[layer + 1], this.layers[layer + 1]);
            this.backpropLayers[layer].updateGradient(this.layers[layer].activations);
        }
    }

    #clearGradients() {

        // console.log(JSON.parse(JSON.stringify(this.layers)));

        for (let i = 0; i < this.backpropLayers.length; i++) {
            this.backpropLayers[i].clearGradient();
        }
    }

    /**
        Validates the network on a test dataset and returns the average loss and number of correct predictions
        @param {Array<DataPoint>} testData - the test input data
        @returns {number[]} - an array containing the average loss and number of correct predictions
    */
    #validate(testData) {
        let cost = 0;
        let goodTest = 0;
        this.badResults = [];
        this.badLabels = [];

        if (this.singleOutput) {
            console.warn("SINGLE OUTPUT")
            for (let i = 0; i < testData.length; i++) {
                this.#feedForward(testData[i].inputs);
                cost += this.costFunction.func(this.layers[this.layers.length - 1].activations, testData[i].expectedOutputs);

                const res = this.layers[this.layers.length - 1].activations[0] > 0.5 ? 1 : 0;

                if (res == testData[i].label) {
                    goodTest++;
                }
                this.lastTarget = testData[i].label;
            }
        }
        else {

            for (let i = 0; i < testData.length; i++) {
                this.#feedForward(testData[i].inputs);
                cost += this.costFunction.func(this.layers[this.layers.length - 1].activations, testData[i].expectedOutputs);

                let maxIndex = this.#getMaxOutputNeuronIndex();
                if (maxIndex == undefined) {
                    console.warn(this.layers[this.layers.length - 1].activations);
                    throw new Error("Can't find max index");
                }

                if (maxIndex == testData[i].label) {
                    goodTest++;
                } else {
                    this.badResults.push(testData[i].inputs);
                    this.badLabels.push([testData[i].label, maxIndex]);
                }
                this.lastTarget = testData[i].label;
            }
        }
        cost /= testData.length;

        return [cost, goodTest];
    }


    /**
        Gets the index of the neuron with the maximum activation value in the last layer of the network
        @returns {number} - the index of the neuron with the maximum activation value
    */
    #getMaxOutputNeuronIndex() {
        let maxIndex = -1;
        let maxValue = Number.MIN_SAFE_INTEGER;
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