class BackpropLayer {
    constructor(currentNeurons, previousNeurons, regulizer) {

        this.currentNeurons = currentNeurons;
        this.previousNeurons = previousNeurons;

        /** @type {Weights} */
        this.gamma = new Weights(1, currentNeurons);

        /** @type {Weights} */
        this.weightsGradient = new Weights(previousNeurons, currentNeurons);

        /** @type {Weights} */
        this.biasGradient = new Weights(1, currentNeurons);

        this.clearGradient();
    }

    clearGradient() {
        for (let i = 0; i < this.currentNeurons; i++) {
            this.biasGradient.data[0][i] = 0;

            for (let j = 0; j < this.previousNeurons; j++) {
                this.weightsGradient.data[j][i] = 0;
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

    updateGradient(previousActivations, currentForwardLayer) {
        for (let i = 0; i < this.currentNeurons; i++) {
            this.biasGradient.data[0][i] += this.gamma.data[0][i];

            for (let j = 0; j < this.previousNeurons; j++) {
                this.weightsGradient.data[j][i] += this.gamma.data[0][i] * previousActivations[j];
                this.weightsGradient.data[j][i] += currentForwardLayer.backpropSingleRegularization(j, i);
            }
        }
    }
}