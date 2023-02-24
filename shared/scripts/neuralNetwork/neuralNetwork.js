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

        this.lastTarget = null;
    }

    compile(errorFunction, learningRate = 0.05) {
        this.lossFunction = errorFunction;
        this.learningRate = learningRate;
    }

    addLayer(numberOfNeurons, activationFunction) {
        let numberOfPreviousNeurons = ((this.layers.length > 0) ? this.layers[this.layers.length - 1].neuronsCount : 0);
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

        if (data[0].length != this.layers[0].neuronsCount) {
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
                trainLoss += this.#backpropError2(splitData.trainY[i]);
                this.#tweakWeights();
                // console.warn(this);
                this.lastTarget = splitData.trainY[i];
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
            this.layers[i].sumNeurons(this.layers[i - 1]);
            this.layers[i].activateNeurons();
        }
    }

    #backpropError(target) {
        let outputErrors = this.lossFunction(this.layers[this.layers.length - 1].activations, target);
        this.layers[this.layersCount - 1].computeDerivatives();
        let errorSum = 0;

        for (let i = 0; i < this.layers[this.layers.length - 1].neuronsCount; i++) {
            this.layers[this.layers.length - 1].errors[i] = outputErrors[i];
            this.layers[this.layers.length - 1].gamma[i] = outputErrors[i] * this.layers[this.layers.length - 1].derivatives[i];
            errorSum += outputErrors[i];
        }

        for (let l = this.layers.length - 2; l > 0; l--) {
            for (let n = 0; n < this.layers[l].neuronsCount; n++) {
                this.layers[l].errors[n] = 0;
                for (let e = 0; e < this.layers[l + 1].neuronsCount; e++) {
                    this.layers[l].errors[n] +=
                        this.layers[l + 1].errors[e] * this.layers[l + 1].weights.data[n][e];
                }
            }
        }

        return errorSum;
    }

    #backpropError2(target) {
        let outputErrors = this.lossFunction(this.layers[this.layers.length - 1].activations, target);
        this.layers[this.layersCount - 1].computeDerivatives();
        let errorSum = 0;

        for (let i = 0; i < this.layers[this.layers.length - 1].neuronsCount; i++) {
            this.layers[this.layers.length - 1].errors[i] = outputErrors[i];
            this.layers[this.layers.length - 1].gamma[i] = outputErrors[i] * this.layers[this.layers.length - 1].derivatives[i];
            errorSum += outputErrors[i];
        }

        for (let p = 0; p < this.layers[this.layersCount - 1].weightsDeltas.previous; p++) {
            for (let c = 0; c < this.layers[this.layersCount - 1].weightsDeltas.current; c++) {
                this.layers[this.layersCount - 1].weightsDeltas.data[p][c] =
                    this.layers[this.layersCount - 1].gamma[c] * this.layers[this.layersCount - 2].activations[p];
            }
        }

        for (let l = this.layers.length - 2; l > 0; l--) {
            this.layers[l].computeDerivatives();
            for (let n = 0; n < this.layers[l].neuronsCount; n++) {
                this.layers[l].gamma[n] = 0;
                for (let g = 0; g < this.layers[l + 1].neuronsCount; g++) {
                    this.layers[l].gamma[n] +=
                        this.layers[l + 1].gamma[g] * this.layers[l + 1].weights.data[n][g];
                }
                this.layers[l].gamma[n] *= this.layers[l].derivatives[n];
            }

            for (let p = 0; p < this.layers[l].weights.previous; p++) {
                for (let c = 0; c < this.layers[l].weights.current; c++) {
                    this.layers[l].weightsDeltas.data[p][c] =
                        this.layers[l].gamma[c] * this.layers[l - 1].activations[p];
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
                    this.layers[i].errors[c] *
                    this.layers[i].derivatives[c];

                this.layers[i].biases[c] += change;
                for (let p = 0; p < this.layers[i].weights.previous; p++) {
                    this.layers[i].weights.data[p][c] += change * this.layers[i - 1].activations[p];
                }
            }
        }
    }

    #validate(testX, testY) {
        let testLoss = 0;
        let goodTest = 0;

        for (let i = 0; i < testX.length; i++) {
            this.#feedForward(testX[i]);
            let outputErrors = this.lossFunction(this.layers[this.layers.length - 1].activations, testY[i]);
            for (let j = 0; j < outputErrors.length; j++) {
                testLoss += outputErrors[j];
            }

            let maxIndex = -1;
            let maxValue = Number.MIN_VALUE;
            for (let i = 0; i < this.layers[this.layersCount - 1].neuronsCount; i++) {
                if (this.layers[this.layersCount - 1].activations[i] > maxValue) {
                    maxIndex = i;
                    maxValue = this.layers[this.layersCount - 1].activations[i];
                }
            }
            if (maxIndex == testY[i]) {
                goodTest++;
            }
        }

        return [testLoss, goodTest];
    }
}