const LayerType = {
    Dense: 'Dense',
    Dropout: 'Dropout'
};

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
        /** @type {Weights} */
        this.weightsDeltas = (numberOfPreviousNeurons > 0) ? new Weights(numberOfPreviousNeurons, numberOfNeurons) : null;

        /** @type {ActivationFunction} */
        this.activationFunction = activationFunction;
    }

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

    activateNeurons() {
        this.activations = this.activationFunction.function(this.sums);
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

    resetWeightsDeltas() {
        this.weightsDeltas.scalarFillData(0);
    }

    updateWeights(learningRate = 0.005) {
        for (let c = 0; c < this.weights.current; c++) {

            this.biases[c] -= this.gamma[c] * learningRate;
            for (let p = 0; p < this.weights.previous; p++) {
                this.weights.data[p][c] -= this.weightsDeltas.data[p][c] * learningRate;
            }
        }
    }
}

