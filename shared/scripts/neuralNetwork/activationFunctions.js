const ActivationFunctions = {
    Sigmoid: new ActivationFunction(
        neurons => neurons.map((n) => 1.0 / (1.0 + Math.exp(-n))),
        activations => activations.map((a) => a * (1 - a)),
    ),

    Tanh: new ActivationFunction(
        neurons => neurons.map((n) => Math.tanh(n)),
        activations => activations.map((a) => 1 - (a * a)),
    ),

    ReLU: new ActivationFunction(
        neurons => neurons.map((n) => Math.max(n, 0)),
        activations => activations.map((a) => a > 0 ? 1 : 0),
    ),

    SoftMax: new ActivationFunction(
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
                derivatives.push((1 - activations[i]) * activations[i]);
            }
            return derivatives;
        },
    ),
}
