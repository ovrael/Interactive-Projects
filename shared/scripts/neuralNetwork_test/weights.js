class Weights {

    constructor(previous, current) {
        this.previous = previous;
        this.current = current;
        this.data = new Array(this.previous);

        // Fill weights with nubmers between -0.5 and 0.5.
        for (let i = 0; i < this.previous; i++) {
            this.data[i] = new Array(this.current);
        }

        this.initializeRandomWeights();
        // this.xavierInitialization();
    }

    initializeRandomWeights() {
        for (let i = 0; i < this.previous; i++) {
            for (let j = 0; j < this.current; j++) {
                this.data[i][j] = Weights.randomNormalDistribution(0, 1) / Math.sqrt(this.current);
            }
        }
    }

    xavierInitialization() {
        const stdDeviation = 1 / ((this.previous + this.current) * 0.5);
        for (let i = 0; i < this.previous; i++) {
            for (let j = 0; j < this.current; j++) {
                this.data[i][j] = Weights.randomNormalDistribution(0, stdDeviation);
            }
        }
    }

    heInitialization() {
        const stdDeviation = 2 / this.previous;
        for (let i = 0; i < this.previous; i++) {
            for (let j = 0; j < this.current; j++) {
                this.data[i][j] = Weights.randomNormalDistribution(0, stdDeviation);
            }
        }
    }

    lecunInitialization() {
        const stdDeviation = 1 / this.previous;
        for (let i = 0; i < this.previous; i++) {
            for (let j = 0; j < this.current; j++) {
                this.data[i][j] = Weights.randomNormalDistribution(0, stdDeviation);
            }
        }
    }

    weightsFillData(otherWeights) {
        for (let i = 0; i < this.previous; i++) {
            for (let j = 0; j < this.current; j++) {
                this.data[i][j] = otherWeights.data[i][j];
            }
        }
    }

    scalarFillData(scalar) {
        for (let i = 0; i < this.previous; i++) {
            for (let j = 0; j < this.current; j++) {
                this.data[i][j] = scalar;
            }
        }
    }

    map(func) {
        // Apply a function to every element of matrix
        for (let i = 0; i < this.previous; i++) {
            for (let j = 0; j < this.current; j++) {
                let val = this.data[i][j];
                this.data[i][j] = func(val, i, j);
            }
        }
        return this;
    }

    copy() {
        const newWeights = new Weights(this.previous, this.current);
        newWeights.weightsFillData(this);
        return newWeights;
    }

    scalarAdd(scalar) {
        this.map((e, i, j) => e + scalar);
    }

    scalarSubtruct(scalar) {
        this.scalarAdd(-scalar);
    }

    scalarMultiply(scalar) {
        this.map((e, i, j) => e * scalar);
    }

    scalarDivide(scalar) {
        this.map((e, i, j) => e / scalar);
    }

    scalarPower(scalar) {
        this.map((e, i, j) => Math.pow(e, scalar));
    }

    sqrt() {
        this.map((e, i, j) => Math.sqrt(e));
    }

    weightsAdd(otherWeights) {
        this.map((e, i, j) => e + otherWeights.data[i][j]);
    }

    weightsSubtract(otherWeights) {
        this.map((e, i, j) => e - otherWeights.data[i][j]);
    }

    hadamardMultiply(otherWeights) {
        this.map((e, i, j) => e * otherWeights.data[i][j]);
    }

    weightsDivide(otherWeights) {
        this.map((e, i, j) => e / otherWeights.data[i][j]);
    }

    static copy(other) {
        return other.copy();
    }

    static createZero(weights) {
        const newWeights = weights.copy();
        newWeights.scalarFillData(0);
        return newWeights;
    }

    static createZeroBySize(previous, current) {
        const newWeights = new Weights(previous, current);
        newWeights.scalarFillData(0);
        return newWeights;
    }

    static scalarAdd(weights, scalar) {
        const newWeights = Weights.copy(weights);
        newWeights.scalarAdd(scalar);
        return newWeights;
    }

    static scalarSubtract(weights, scalar) {
        const newWeights = Weights.copy(weights);
        newWeights.scalarSubtract(scalar);
        return newWeights;
    }

    static scalarMultiply(weights, scalar) {
        const newWeights = Weights.copy(weights);
        newWeights.scalarMultiply(scalar);
        return newWeights;
    }

    static scalarDivide(weights, scalar) {
        const newWeights = Weights.copy(weights);
        newWeights.scalarDivide(scalar);
        return newWeights;
    }


    static scalarPower(weights, scalar) {
        const newWeights = Weights.copy(weights);
        newWeights.scalarPower(scalar);
        return newWeights;
    }

    static sqrt(weights) {
        const newWeights = Weights.copy(weights);
        newWeights.sqrt();
        return newWeights;
    }

    static weightsAdd(weights, otherWeights) {
        const newWeights = Weights.copy(weights);
        newWeights.weightsAdd(otherWeights);
        return newWeights;
    }

    static weightsSubtract(weights, otherWeights) {
        const newWeights = Weights.copy(weights);
        newWeights.weightsSubtract(otherWeights);
        return newWeights;
    }

    static weightsDivide(weights, otherWeights) {
        const newWeights = Weights.copy(weights);
        newWeights.weightsDivide(otherWeights);
        return newWeights;
    }

    static hadamardMultiply(weights, otherWeights) {
        const newWeights = Weights.copy(weights);
        newWeights.hadamardMultiply(otherWeights);
        return newWeights;
    }

    static randomNormalDistribution(mean, standardDeviation) {
        const x1 = 1 - Math.random();
        const x2 = 1 - Math.random();

        const y1 = Math.sqrt(-2.0 * Math.log(x1)) * Math.cos(2.0 * Math.PI * x2);
        return y1 * standardDeviation + mean;
    }

    sumWeights() {
        let sum = 0;
        for (let i = 0; i < this.previous; i++) {
            for (let j = 0; j < this.current; j++) {
                sum += this.data[i][j];
            }
        }
        return sum;
    }
}