class Neuron {
    constructor() {
        this.sum = 0;
        this.activation = 0;
        this.derivative = 0;
        this.error = 0;
        this.bias = Math.random() - 0.5;
    }
}