class BackpropLayer {
    constructor(currentNeurons, previousNeurons) {

        this.currentNeurons = currentNeurons;
        this.previousNeurons = previousNeurons;

        // /** @type {Weights} */
        // this.derivatives = (previousNeurons > 0) ? new Weights(1, currentNeurons) : null;
        // /** @type {Weights} */
        // this.errors = (previousNeurons > 0) ? new Weights(1, currentNeurons) : null;

        /** @type {Weights} */
        this.gamma = new Weights(1, currentNeurons);

        /** @type {Weights} */
        this.weightsDeltas = new Weights(previousNeurons, currentNeurons);

        /** @type {Weights} */
        this.biasDeltas = new Weights(1, currentNeurons);

        this.clearGradient();
        // this.weightsDeltas.scalarFillData(1);
    }

    clearGradient() {
        for (let i = 0; i < this.currentNeurons; i++) {

            // this.gamma.data[0][i] = 0;
            this.biasDeltas.data[0][i] = 0;

            for (let j = 0; j < this.previousNeurons; j++) {
                this.weightsDeltas.data[j][i] = 0;
            }
        }
    }

    computeGamma(nextBackpropLayer, nextLayer) {
        for (let i = 0; i < nextBackpropLayer.previousNeurons; i++) {
            this.gamma.data[0][i] = 0;
            for (let j = 0; j < nextBackpropLayer.currentNeurons; j++) {
                this.gamma.data[0][i] += nextBackpropLayer.gamma.data[0][j] * nextLayer.weights.data[i][j];
            }


            this.gamma.data[0][i] *= nextLayer.computeDerivativeAtIndex(i);
        }
    }

    updateGradient(previousActivations) {
        for (let i = 0; i < this.currentNeurons; i++) {
            this.biasDeltas.data[0][i] += this.gamma.data[0][i];

            for (let j = 0; j < this.previousNeurons; j++) {
                this.weightsDeltas.data[j][i] += this.gamma.data[0][i] * previousActivations[j];
            }
        }
    }
}