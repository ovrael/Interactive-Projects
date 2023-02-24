class Layer {

    constructor(numberOfNeurons, numberOfPreviousNeurons = 0, activationFunction) {
        // /** @type {Array<Neuron>} */
        // this.neurons = new Array(numberOfNeurons);

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

        /** @type {Weights} */
        this.weights = (numberOfPreviousNeurons > 0) ? new Weights(numberOfPreviousNeurons, numberOfNeurons) : null;
        this.weightsDeltas = (numberOfPreviousNeurons > 0) ? new Weights(numberOfPreviousNeurons, numberOfNeurons) : null;

        /** @type {ActivationFunction} */
        this.activationFunction = activationFunction;
    }

    activateNeurons() {
        this.activations = this.activationFunction.func(this.sums);
        // for (let i = 0; i < activations.length; i++) {
        //     this.neurons[i].activation = activations[i];
        // }
    }

    computeDerivatives() {
        this.derivatives = this.activationFunction.dfunc(this.activations);

        // for (let i = 0; i < derivatives.length; i++) {
        //     this.neurons[i].derivative = derivatives[i];
        // }
    }

    // computeActivationsAndDerivatives() {
    //     this.neurons = this.activationFunction.bothFunc(this.neurons);
    // }

    fillNeurons(dataRow) {
        if (dataRow.length != this.neuronsCount) {
            console.error(`Data length (${dataRow.length}) is different than neurons length (${this.neuronsCount})!`);
            return;
        }

        for (let i = 0; i < dataRow.length; i++) {
            this.activations[i] = dataRow[i];
        }
    }

    sumNeurons(previousLayer) {
        for (let i = 0; i < this.neuronsCount; i++) {

            this.sums[i] = 0;
            for (let j = 0; j < previousLayer.activations.length; j++) {

                this.sums[i] += previousLayer.activations[j] * this.weights.data[j][i];

            }
            this.sums[i] += this.biases[i];
        }
    }

    updateWeights(learningRate = 0.005) {
        for (let p = 0; p < this.weights.previous; p++) {
            for (let c = 0; c < this.weights.current; c++) {
                this.weights.data[p][c] -= this.weightsDeltas.data[p][c] * learningRate;
            }
        }
    }
}