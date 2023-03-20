class WeightsRegulizer {
    constructor(l1 = 0, l2 = 0) {

        this.l1 = l1;
        this.l2 = l2;

        this.forward = this.#noRegularizationForward;
        this.backprop = this.#noRegularizationBackprop;
        this.backpropSingle = this.#noRegularizationBackpropSingle;

        if (l1 == 0 && l2 == 0)
            return;

        if (l1 > 0 && l2 > 0) {
            this.forward = this.#l1l2RegularizationForward;
            this.backprop = this.#l1l2RegularizationBackprop;
            this.backpropSingle = this.#l1l2RegularizationBackpropSingle;
            return;
        }

        if (l2 > 0) {
            this.forward = this.#l2RegularizationForward;
            this.backprop = this.#l2RegularizationBackprop;
            this.backpropSingle = this.#l2RegularizationBackpropSingle;
            return;
        }

        if (l1 > 0) {
            this.forward = this.#l1RegularizationForward;
            this.backprop = this.#l1RegularizationBackprop;
            this.backpropSingle = this.#l1RegularizationBackpropSingle;
            return;
        }
    }

    setWeightsLength() {

    }

    // FORWARD
    #noRegularizationForward(weights) {
        return 0;
    }

    #l1RegularizationForward(weights) {
        let sum = 0;
        for (let p = 0; p < weights.previous; p++) {
            for (let c = 0; c < weights.currents; c++) {
                sum += Math.abs(weights.data[p][c]);
            }
        }
        return (sum / (weights.previous * weights.current));
    }

    #l2RegularizationForward(weights) {
        let sum = 0;
        for (let p = 0; p < weights.previous; p++) {
            for (let c = 0; c < weights.currents; c++) {
                sum += weights.data[p][c] * weights.data[p][c];
            }
        }
        return sum / (weights.previous * weights.current);
    }

    #l1l2RegularizationForward(weights) {
        const l1 = this.#l1RegularizationForward(weights);
        const l2 = this.#l2RegularizationForward(weights);
        return l1 + l2;
    }

    // BACKPROP
    #noRegularizationBackprop(weights) {
        return Weights.createZero(weights);
    }

    #l1RegularizationBackprop(weights) {
        let regularization = Weights.copy(weights);
        for (let p = 0; p < weights.previous; p++) {
            for (let c = 0; c < weights.currents; c++) {
                regularization.data[p][c] = weights.data[p][c] >= 0 ? 1 : -1;
            }
        }
        return regularization;
    }

    #l2RegularizationBackprop(weights) {
        return Weights.scalarMultiply(weights, 2);
    }

    #l1l2RegularizationBackprop(weights) {
        const l1 = this.#l1RegularizationBackprop(weights);
        const l2 = this.#l2RegularizationBackprop(weights);
        return Weights.weightsAdd(l1, l2);
    }

    // BACKPROP SINGLE
    #noRegularizationBackpropSingle(weight) {
        return 0;
    }

    #l1RegularizationBackpropSingle(weight) {
        return weight >= 0 ? 1 : -1;
    }

    #l2RegularizationBackpropSingle(weight) {
        return weight * 2;
    }

    #l1l2RegularizationBackpropSingle(weight) {
        const l1 = this.#l1RegularizationBackpropSingle(weight);
        const l2 = this.#l2RegularizationBackpropSingle(weight);
        return l1 + l2;
    }

    static L1(value) {
        return new WeightsRegulizer(value, 0);
    }

    static L2(value) {
        return new WeightsRegulizer(0, value);
    }

    static L1_L2(l1, l2) {
        return new WeightsRegulizer(l1, l2);
    }
}