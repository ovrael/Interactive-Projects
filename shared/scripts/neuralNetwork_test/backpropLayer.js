class BackpropLayer {
    constructor(currentNeurons, previousNeurons) {

        this.neuronsCount = currentNeurons;
        
        /** @type {Weights} */
        this.derivatives = (previousNeurons > 0) ? new Weights(1, currentNeurons) : null;
        /** @type {Weights} */
        this.errors = (previousNeurons > 0) ? new Weights(1, currentNeurons) : null;
        /** @type {Weights} */
        this.gamma = (previousNeurons > 0) ? new Weights(1, currentNeurons) : null;

        /** @type {Weights} */
        this.weightsDeltas = (previousNeurons > 0) ? new Weights(previousNeurons, currentNeurons) : null;
        /** @type {Weights} */
        this.biasDeltas = (previousNeurons > 0) ? new Weights(1, currentNeurons) : null;
    }
}