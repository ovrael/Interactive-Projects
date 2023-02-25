class NeuralNetwork {

    constructor(errorFunction, learningRate = 0.05) {
        this.lossFunction = errorFunction;
        this.learningRate = learningRate;

        /** @type {Array<Layer>} */
        this.layers = [];
        this.layersCount = -1;

        this.lastTarget = null;
    }

    compile(errorFunction, learningRate = 0.05) {
        this.lossFunction = errorFunction;
        this.learningRate = learningRate;
        this.layersCount = this.layers.length;
    }

    addLayer(numberOfNeurons, activationFunction) {
        let numberOfPreviousNeurons = ((this.layers.length > 0) ? this.layers[this.layers.length - 1].neuronsCount : 0);
        this.layers.push(
            new Layer(numberOfNeurons, numberOfPreviousNeurons, activationFunction)
        );
    }

    train(data, targets, trainTestRatio = 0.7, epochs = 1) {

        if (!this.#checkConditions(data, targets)) {
            return;
        }

        this.layersCount = this.layers.length;

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

    // Fills neural network neurons from beggining to the end
    #feedForward(rowData) {
        this.layers[0].fillNeurons(rowData);
        for (let i = 1; i < this.layers.length; i++) {
            this.layers[i].sumNeurons(this.layers[i - 1]);
            this.layers[i].activateNeurons();
        }
    }

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

    #backpropError(target) {

        const errorSum = this.#backpropLastLayer(target);

        for (let layer = this.layers.length - 2; layer > 0; layer--) {
            this.layers[layer].computeDerivatives();
            this.layers[layer].computeGamma(this.layers[layer + 1]);
            this.layers[layer].computeWeightsDeltas(this.layers[layer - 1]);
        }

        return errorSum;
    }

    #tweakWeights() {
        for (let i = 1; i < this.layersCount; i++) {
            this.layers[i].updateWeights(this.learningRate);
        }
    }

    #validate(testX, testY) {
        let testLoss = 0;
        let goodTest = 0;

        if (this.layers[this.layersCount - 1].neuronsCount == 1) {
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