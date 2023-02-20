class NeuralNetwork {

    constructor(errorFunction, learningRate = 0.05) {
        // /** @type {ErrorFunction} */
        this.lossFunction = errorFunction;
        this.learningRate = learningRate;

        /** @type {Array<Layer>} */
        this.layers = [];
        /** @type {Layer} */
        this.lastLayer = null;
        this.layersCount = -1;


    }

    compile(errorFunction, learningRate = 0.05) {
        this.lossFunction = errorFunction;
        this.learningRate = learningRate;
    }

    addLayer(numberOfNeurons, activationFunction) {
        let numberOfPreviousNeurons = ((this.layers.length > 0) ? this.layers[this.layers.length - 1].neurons.length : 0);
        this.layers.push(
            new Layer(numberOfNeurons, numberOfPreviousNeurons, activationFunction)
        );
    }

    train(data, targets, trainTestRatio = 0.7, epochs = 1) {
        if (this.layers.length < 3) {
            console.error("Neural network is too small. It should have at least 3 layers!");
            return;
        }

        if (data.length == 0) {
            console.error("No data to train!");
            return;
        }

        if (data.length != targets.length) {
            console.error("Data is different size than targets! " + data.length + " != " + targets.length);

            return;
        }

        if (data[0].length != this.layers[0].neurons.length) {
            console.error("Data is different size than first layer of neural network!");
            return;
        }

        this.lastLayer = this.layers[this.layers.length - 1];
        this.layersCount = this.layers.length;

        const splitData = this.#splitData(data, targets, trainTestRatio);

        for (let e = 0; e < epochs; e++) {
            let trainLoss = 0;
            for (let i = 0; i < splitData.trainX.length; i++) {
                this.#feedForward(splitData.trainX[i]);
                trainLoss += this.#backpropError(splitData.trainY[i]);
                this.#tweakWeights();
                // console.warn(this);
            }

            let testResult = this.#validate(splitData.testX, splitData.testY);

            const results = {
                "Epoch": e,
                "Train Loss": trainLoss,
                "Test Loss": testResult[0],
                "Good Test": testResult[1],
                "All length": splitData.testX.length,
            }
            console.table(results);
        }

        console.info("Training finished");
        console.table(this);
    }

    #splitData(data, targets, ratio) {
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

    // Fills neural network neurons from beggining to the end
    #feedForward(rowData) {
        this.layers[0].fillNeurons(rowData);
        for (let i = 1; i < this.layers.length; i++) {
            this.layers[i].sumNeurons(this.layers[i - 1].neurons);
            this.layers[i].activateNeurons();
        }
    }

    #backpropError(target) {
        let outputErrors = this.lossFunction(this.layers[this.layers.length - 1].neurons, target);
        let errorSum = 0;

        for (let i = 0; i < this.layers[this.layers.length - 1].neurons.length; i++) {
            this.layers[this.layers.length - 1].neurons[i].error = outputErrors[i];
            errorSum += outputErrors[i];
        }

        for (let l = this.layers.length - 2; l > 0; l--) {
            for (let n = 0; n < this.layers[l].neurons.length; n++) {
                this.layers[l].neurons[n].error = 0;
                for (let e = 0; e < this.layers[l + 1].neurons.length; e++) {
                    this.layers[l].neurons[n].error +=
                        this.layers[l + 1].neurons[e].error * this.layers[l + 1].weights.data[n][e];
                }
            }
        }

        return errorSum;
    }

    #tweakWeights() {
        for (let i = 1; i < this.layersCount; i++) {
            this.layers[i].computeDerivatives();

            for (let c = 0; c < this.layers[i].weights.current; c++) {
                const change = this.learningRate *
                    this.layers[i].neurons[c].error *
                    this.layers[i].neurons[c].derivative;

                this.layers[i].neurons[c].bias -= change;
                for (let p = 0; p < this.layers[i].weights.previous; p++) {
                    this.layers[i].weights.data[p][c] -= change * this.layers[i - 1].neurons[p].activation;
                }
            }
        }
    }

    #validate(testX, testY) {
        let testLoss = 0;
        let goodTest = 0;

        for (let i = 0; i < testX.length; i++) {
            this.#feedForward(testX[i]);
            let outputErrors = this.lossFunction(this.layers[this.layers.length - 1].neurons, testY[i]);
            for (let j = 0; j < outputErrors.length; j++) {
                testLoss += outputErrors[j];
            }

            let maxIndex = -1;
            let maxValue = Number.MIN_VALUE;
            for (let i = 0; i < this.layers[this.layersCount - 1].neurons.length; i++) {
                if (this.layers[this.layersCount - 1].neurons[i].activation > maxValue) {
                    maxIndex = i;
                    maxValue = this.layers[this.layersCount - 1].neurons[i].activation;
                }
            }
            if (maxIndex == testY[i]) {
                goodTest++;
            }
        }

        return [testLoss, goodTest];
    }
}