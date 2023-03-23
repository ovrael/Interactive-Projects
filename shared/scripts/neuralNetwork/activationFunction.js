const ActivationFunctionNames =
{
    sigmoid: "sigmoid",
    tanh: "tanh",
    relu: "relu",
    leakyRelu: "leakyRelu",
    softmax: "softmax",
}

// TO ADD - MORE FUNCTIONS E.G. ELU
class ActivationFunction {
    constructor(func, dfunc, name) {
        this.function = func;
        this.derivative = dfunc;
        this.name = name;
    }

    static sigmoid() {
        return new ActivationFunction(
            neurons => neurons.map((n) => 1.0 / (1.0 + Math.exp(-n))),
            // activations => activations.map((a) => a * (1 - a)),
            activation => activation * (1 - activation),
            ActivationFunctionNames.sigmoid
        );
    }
    static tanh() {
        return new ActivationFunction(
            neurons => neurons.map((n) => Math.tanh(n)),
            activation => 1 - (activation * activation),
            ActivationFunctionNames.tanh
        );
    }
    static relu() {
        return new ActivationFunction(
            neurons => neurons.map((n) => Math.max(n, 0)),
            // activations => activations.map((a) => a > 0 ? 1 : 0),
            activation => activation > 0 ? 1 : 0,
            ActivationFunctionNames.relu
        );
    }


    static leakyRelu() {
        return new ActivationFunction(
            neurons => neurons.map((n) => n > 0 ? n : 0.001 * n),
            // activations => activations.map((a) => a > 0 ? 1 : 0.001),
            activation => activation > 0 ? 1 : 0.001,
            ActivationFunctionNames.leakyRelu
        );
    }

    static softmax() {
        return new ActivationFunction(
            neurons => {

                // neurons = neurons.map((n) => isNaN(n) ? 0 : n);

                let max = Number.MIN_VALUE;
                for (let i = 0; i < neurons.length; i++) {
                    if (neurons[i] > max)
                        max = neurons[i];
                }
                const exponents = neurons.map((n) => Math.exp(n - max));
                const sum = exponents.reduce((a, b) => a + b);

                return exponents.map((e) => e / sum);
            },
            // activations => {

            //     const derivatives = [];
            //     for (let i = 0; i < activations.length; i++) {
            //         derivatives.push(activations[i] * (1 - activations[i]));
            //     }
            //     return derivatives;
            // },
            activation => activation * (1 - activation),
            ActivationFunctionNames.softmax
        );
    }
}