class Layer {

    constructor(numberOfNeurons, numberOfPreviousNeurons = 0, activationFunction) {
        this.neurons = new Array(numberOfNeurons);
        this.biases = new Array(numberOfNeurons);

        for (let i = 0; i < numberOfNeurons; i++) {
            this.neurons[i] = 0;
            this.biases[i] = Math.random() - 0.5;
        }

        /** @type {Weights} */
        this.weights = (numberOfPreviousNeurons > 0) ? new Weights(numberOfPreviousNeurons, numberOfNeurons) : null;
        /** @type {ActivationFunction} */
        this.activationFunction = activationFunction;
    }

    activateNeurons() {
        this.neurons = this.activationFunction.func(this.neurons);
    }

    fillNeurons(dataRow) {
        if (dataRow.length != this.neurons.length) {
            console.error("Data length is different than neurons length!");
            return;
        }

        for (let i = 0; i < dataRow.length; i++) {
            this.neurons[i] = dataRow[i];
        }
    }

}