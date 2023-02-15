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

    train(data, targets, epochs = 1) {
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

        for (let e = 0; e < epochs; e++) {
            let errorSum = 0;
            for (let i = 0; i < data.length; i++) {
                this.#feedForward(data[i]);
                errorSum += this.#backpropError(targets[i]);
                this.#tweakWeights();
                if (isNaN(errorSum)) {
                    console.error("NAN");
                    console.warn("Target: " + targets[i])

                    console.log(this);
                    return;
                }
                else {
                    console.log(i)
                    // console.log(errorSum);

                }
                // console.warn(this);
            }
            // console.log(errorSum);
        }

        console.info("Training finished");

        // console.log("Predicted:");
        // console.log(this.layers[this.layers.length - 1].neurons);
        // console.log("Network");
        // console.log(this);
    }

    // Fills neural network neurons from beggining to the end
    #feedForward(rowData) {
        this.layers[0].fillNeurons(rowData);
        for (let i = 1; i < this.layers.length; i++) {
            this.#computeNextLayer(i);
            for (let n = 0; n < this.layers[i].neurons.length; n++) {
                const element = this.layers[i].neurons[n].activation;
                if (isNaN(element)) {
                    console.warn(this.layers[i - 1]);
                    console.warn(this.layers[i]);
                    console.warn(`i: ${i} n: ${n} is NAN`)
                    throw new Promise("Err");
                }
            }
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
        }
        this.layers[layerIndex].activateNeurons();
    }

    #backpropError(target) {
        let outputErrors = this.errorFunction(this.layers[this.layers.length - 1].neurons, target);
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
            for (let p = 0; p < this.layers[i].weights.previous; p++) {
                for (let c = 0; c < this.layers[i].weights.current; c++) {

                    this.layers[i].weights.data[p][c] -=
                        this.learningRate *
                        this.layers[i].neurons[c].error *
                        this.layers[i].neurons[c].derivative *
                        this.layers[i - 1].neurons[p].activation;
                }
            }
        }
    }
}