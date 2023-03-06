const LayerType = {
    Input: "Input",
    Dense: "Dense",
    Dropout: "Droput"
}

class Layer {

    constructor(type, numberOfNeurons, numberOfPreviousNeurons = 0, activationFunction) {
        this.type = type;

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

        if (this.type == LayerType.Input) {
            this.fillNeurons = this.fillNeuronsWithoutDropout;
        }
        else {
            /** @type {Weights} */
            this.weights = (numberOfPreviousNeurons > 0) ? new Weights(numberOfPreviousNeurons, numberOfNeurons) : null;
            /** @type {Weights} */
            this.weightsDeltas = (numberOfPreviousNeurons > 0) ? new Weights(numberOfPreviousNeurons, numberOfNeurons) : null;

            /** @type {ActivationFunction} */
            this.activationFunction = activationFunction;
            this.activateNeurons = this.activateNeuronsWithoutDropout;
        }
    }

    #checkDropout(rate) {
        if (rate >= 1)
            return 1 - 1e-10;
        if (rate <= 0)
            return 1e-10;

        return rate;
    }

    addDropout(dropoutRate) {
        this.type = LayerType.Dropout;
        this.dropoutRate = this.#checkDropout(dropoutRate);
        this.dropoutScale = 1 / (1 - dropoutRate);
        // this.dropoutScale = (1 - dropoutRate);
        // this.dropoutScale = 1 / dropoutRate;
    }

    changeDropoutMode(shouldDropout) {
        if (shouldDropout) {
            if (this.type == LayerType.Input)
                this.fillNeurons = this.fillNeuronsWithDropout;
            else
                this.activateNeurons = this.activateNeuronsWithDropout;
        }
        else {
            if (this.type == LayerType.Input)
                this.fillNeurons = this.fillNeuronsWithoutDropout;
            else
                this.activateNeurons = this.activateNeuronsWithoutDropout;
        }
    }

    fillNeuronsWithoutDropout(dataRow) {
        if (dataRow.length != this.neuronsCount) {
            console.error(`Data length (${dataRow.length}) is different than neurons length (${this.neuronsCount})!`);
            return;
        }

        for (let i = 0; i < dataRow.length; i++) {
            this.activations[i] = dataRow[i];
        }
    }

    fillNeuronsWithDropout(dataRow) {
        if (dataRow.length != this.neuronsCount) {
            console.error(`Data length (${dataRow.length}) is different than neurons length (${this.neuronsCount})!`);
            return;
        }

        for (let i = 0; i < dataRow.length; i++) {
            this.activations[i] = dataRow[i] * this.#getDroputValue();
        }
    }

    sumNeurons(previousLayer) {
        for (let i = 0; i < this.neuronsCount; i++) {
            this.sums[i] = this.biases[i];
            for (let j = 0; j < previousLayer.activations.length; j++) {
                this.sums[i] += previousLayer.activations[j] * this.weights.data[j][i];
            }
        }
    }

    activateNeuronsWithoutDropout() {
        this.activations = this.activationFunction.function(this.sums);
    }

    activateNeuronsWithDropout() {
        this.activations = this.activationFunction.function(this.sums);
        for (let i = 0; i < this.activations.length; i++) {
            this.activations[i] *= this.#getDroputValue();
        }
    }

    #getDroputValue() {
        return Math.random() < this.dropoutRate ? 0 : this.dropoutScale;
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

    setWeihtsDeltasToZero() {
        this.weightsDeltas.scalarFillData(0);
    }

    reinitializeWeights() {
        this.weights.initializeRandomWeights();
    }

    static Input(numberOfNeurons) {
        return new LayerData(
            LayerType.Input,
            numberOfNeurons,
            null,
            0
        );
    }

    static Dense(numberOfNeurons, activationFunction) {
        return new LayerData(
            LayerType.Dense,
            numberOfNeurons,
            activationFunction,
            0
        );
    }

    static Dropout(dropoutRate) {
        return new LayerData(
            LayerType.Dropout,
            0,
            null,
            dropoutRate
        );
    }
}

