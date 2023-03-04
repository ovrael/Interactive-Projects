class DropoutLayer {
    constructor(chance, numberOfNeurons) {
        if (chance < 0) chance = 0;
        if (chance > 1) chance = 1;
        this.rate = chance;
        this.dropoutFactor = 1 - this.rate;

        this.neuronsCount = numberOfNeurons;

        this.dropouts = new Array(this.neuronsCount);
        for (let i = 0; i < this.dropouts.length; i++) {
            this.dropouts[i] = 0;
        }
    }

    #randomDropout() {
        if (this.rate > 0.0)
            this.dropouts = this.dropouts.map(d => d = (Math.random() < this.rate) ? 0 : (1.0 / this.dropoutFactor));
    }

    applyDropout(activations) {
        this.#randomDropout();

        const outputs = [];
        for (let i = 0; i < activations.length; i++) {
            outputs.push(this.dropouts[i] * activations[i]);
        }
        return outputs;
    }
}