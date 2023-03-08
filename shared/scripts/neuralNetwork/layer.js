const LayerType = {
    Input: "Input",
    Dense: "Dense",
    Dropout: "Droput"
}

class Layer {

    constructor(type, numberOfNeurons, numberOfPreviousNeurons = 0, activationFunction) {
        this.type = type;

        this.neuronsCount = numberOfNeurons;
        this.sums = [];         // Sum of activations (previous layer) * weights + biases (current layer) 
        this.activations = [];  // Activation of sums from current layer

        for (let i = 0; i < numberOfNeurons; i++) {
            this.sums.push(0);
            this.activations.push(0);
        }

        if (this.type == LayerType.Input) {
            this.fillNeurons = this.fillNeuronsWithoutDropout;
        }
        else {
            if (numberOfPreviousNeurons <= 0) {
                throw new Error("Hidden layer cannot have 0 previous neurons!");
            }

            /** @type {Weights} */
            this.weights = new Weights(numberOfPreviousNeurons, numberOfNeurons);
            /** @type {Weights} */
            this.biases = new Weights(1, numberOfNeurons);

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
            this.sums[i] = this.biases.data[0][i];
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

    computeDerivativeAtIndex(i) {
        return this.activationFunction.derivative2(this.activations[i]);
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

