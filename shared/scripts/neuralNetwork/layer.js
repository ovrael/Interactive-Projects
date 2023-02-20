class Layer {

    constructor(numberOfNeurons, numberOfPreviousNeurons = 0, activationFunction) {
        /** @type {Array<Neuron>} */
        this.neurons = new Array(numberOfNeurons);

        for (let i = 0; i < numberOfNeurons; i++) {
            this.neurons[i] = new Neuron();
        }

        /** @type {Weights} */
        this.weights = (numberOfPreviousNeurons > 0) ? new Weights(numberOfPreviousNeurons, numberOfNeurons) : null;

        /** @type {ActivationFunction} */
        this.activationFunction = activationFunction;
    }

    activateNeurons() {
        let activations = this.activationFunction.func(this.neurons);
        for (let i = 0; i < activations.length; i++) {
            this.neurons[i].activation = activations[i];
        }
    }

    computeDerivatives() {
        let derivatives = this.activationFunction.dfunc(this.neurons);

        for (let i = 0; i < derivatives.length; i++) {
            this.neurons[i].derivative = derivatives[i];
        }
    }

    computeActivationsAndDerivatives() {
        this.neurons = this.activationFunction.bothFunc(this.neurons);
    }

    fillNeurons(dataRow) {
        if (dataRow.length != this.neurons.length) {
            console.error(`Data length (${dataRow.length}) is different than neurons length (${this.neurons.length})!`);
            return;
        }

        for (let i = 0; i < dataRow.length; i++) {
            this.neurons[i].activation = dataRow[i];
        }
    }

    sumNeurons(previousNeurons) {
        for (let i = 0; i < this.neurons.length; i++) {

            this.neurons[i].sum = 0;
            for (let j = 0; j < previousNeurons.length; j++) {

                this.neurons[i].sum += previousNeurons[j].activation * this.weights.data[j][i];

            }
            this.neurons[i].sum += this.neurons[i].bias;
        }
    }
}