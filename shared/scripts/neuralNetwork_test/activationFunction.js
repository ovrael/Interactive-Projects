class ActivationFunction {
    constructor(func, dfunc, dfunc2) {
        this.function = func;
        this.derivative = dfunc;
        this.derivative2 = dfunc2;
    }

    static sigmoid() {
        return new ActivationFunction(
            neurons => neurons.map((n) => 1.0 / (1.0 + Math.exp(-n))),
            activations => activations.map((a) => a * (1 - a)),
        );
    }
    static tanh() {
        return new ActivationFunction(
            neurons => neurons.map((n) => Math.tanh(n)),
            activations => activations.map((a) => 1 - (a * a)),
        );
    }
    static relu() {
        return new ActivationFunction(
            neurons => neurons.map((n) => Math.max(n, 0)),
            activations => activations.map((a) => a > 0 ? 1 : 0),
        );
    }


    static leakyRelu() {
        return new ActivationFunction(
            neurons => neurons.map((n) => n > 0 ? n : 0.001 * n),
            activations => activations.map((a) => a > 0 ? 1 : 0.001),
            activation => activation > 0 ? 1 : 0.001,
        );
    }

    static softmax() {
        return new ActivationFunction(
            neurons => {
                let max = Number.MIN_VALUE;
                for (let i = 0; i < neurons.length; i++) {
                    if (neurons[i] > max)
                        max = neurons[i];
                }
                const exponents = neurons.map((n) => Math.exp(n - max));
                const sum = exponents.reduce((a, b) => a + b);
                return exponents.map((e) => e / sum);
            },
            activations => {

                const derivatives = [];
                for (let i = 0; i < activations.length; i++) {
                    derivatives.push(activations[i] * (1 - activations[i]));
                }
                return derivatives;
            },
            activation => activation * (1 - activation),
        );
    }
}