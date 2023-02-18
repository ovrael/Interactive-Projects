class NeuralNetwork {

    constructor(errorFunction, learningRate = 0.05) {
        // /** @type {ErrorFunction} */
        this.errorFunction = errorFunction;
        this.learningRate = learningRate;

        /** @type {Array<Layer>} */
        this.layers = [];
        /** @type {Layer} */
        this.lastLayer = null;
        this.layersCount = -1;


    }

    compile(errorFunction, learningRate = 0.05) {
        this.errorFunction = errorFunction;
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
            let errorSum = 0;
            for (let i = 0; i < splitData.trainX.length; i++) {
                this.#feedForward(splitData.trainX[i][0]);
                errorSum += this.#backpropError(splitData.trainY[i][0]);
                this.#tweakWeights();
                // console.warn(this);
            }
            console.log("Train error: " + errorSum);


            errorSum = 0;
            let good = 0;

            for (let i = 0; i < splitData.testX.length; i++) {
                this.#feedForward(splitData.testX[i][0]);
                errorSum += this.#backpropError(splitData.testY[i][0]);

                let maxIndex = -1;
                let maxValue = Number.MIN_VALUE;
                for (let i = 0; i < this.layers[this.layersCount - 1].neurons.length; i++) {
                    if (this.layers[this.layersCount - 1].neurons[i].activation > maxValue) {
                        maxIndex = i;
                        maxValue = this.layers[this.layersCount - 1].neurons[i].activation;
                    }
                }
                if (maxIndex == splitData.testY[i][0]) {
                    good++;
                }
            }
            console.log("Test error: " + errorSum);
            console.log("Test good/test: " + `${good}/${splitData.testX.length}`);
        }

        console.info("Training finished");
    }

    #splitData(data, targets, ratio) {
        let splitData = {
            trainX: [],
            trainY: [],
            testX: [],
            testY: [],
        };

        const testMax = data.length * (1 - ratio);

        while (data.length > 0) {

            const i = Math.floor(Math.random() * data.length);
            const x = data.splice(i, 1);
            const y = targets.splice(i, 1);
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
        for (let layer = 1; layer < this.layers.length; layer++) {
            this.#computeNextLayer(layer);
        }
    }

    #computeNextLayer(layerIndex) {

        const prevLayer = this.layers[layerIndex - 1];

        for (let i = 0; i < this.layers[layerIndex].neurons.length; i++) {

            for (let j = 0; j < prevLayer.neurons.length; j++) {

                this.layers[layerIndex].neurons[i].sum +=
                    prevLayer.neurons[j].activation * this.layers[layerIndex].weights.data[j][i];
            }
            this.layers[layerIndex].neurons[i].sum += this.layers[layerIndex].neurons[i].bias;
            if (isNaN(this.layers[layerIndex].neurons[i].sum)) {
                console.warn(this);
                console.warn(`(computeNextLayer): Layer: ${layerIndex}, neuron: ${i} is NAN`);
                throw new Error("NAN");
            }
        }
        this.layers[layerIndex].activateNeurons();
    }

    #backpropError(target) {
        let outputErrors = this.errorFunction(this.layers[this.layers.length - 1].neurons, target);
        let errorSum = 0;

        for (let i = 0; i < this.layers[this.layers.length - 1].neurons.length; i++) {
            this.layers[this.layers.length - 1].neurons[i].error = outputErrors[i];
            errorSum += outputErrors[i];
            if (isNaN(outputErrors[i])) {
                console.warn(`(backpropError): output error index: ${i} is NAN`);
                throw new Error("NAN");
            }
        }

        for (let l = this.layers.length - 2; l > 0; l--) {
            for (let n = 0; n < this.layers[l].neurons.length; n++) {
                this.layers[l].neurons[n].error = 0;
                for (let e = 0; e < this.layers[l + 1].neurons.length; e++) {
                    this.layers[l].neurons[n].error +=
                        this.layers[l + 1].neurons[e].error * this.layers[l + 1].weights.data[n][e];
                }
                if (isNaN(this.layers[l].neurons[n].error)) {
                    console.warn(`(backpropError2): layer: ${l} neuron: ${n} is NAN`);
                    throw new Error("NAN");
                }
            }
        }

        return errorSum;
    }

    #tweakWeights() {
        for (let i = 1; i < this.layersCount; i++) {
            this.layers[i].computeDerivatives();
            for (let p = 0; p < this.layers[i].weights.previous; p++) {
                for (let c = 0; c < this.layers[i].weights.current; c++) {
                    const product = this.learningRate *
                        this.layers[i].neurons[c].error *
                        this.layers[i].neurons[c].derivative *
                        this.layers[i - 1].neurons[p].activation;

                    this.layers[i].weights.data[p][c] += product;
                }
            }
        }
    }
}