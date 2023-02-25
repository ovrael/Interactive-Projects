class ActivationFunction {
    constructor(func, dfunc, bothFunc) {
        this.func = func;
        this.dfunc = dfunc;
        this.bothFunc = bothFunc;
    }
}

const ActivationFunctions = {
    Sigmoid: new ActivationFunction(
        neurons => neurons.map((n) => 1.0 / (1.0 + Math.exp(-n))),
        activations => activations.map((a) => a * (1 - a)),
        neurons => {
            for (let i = 0; i < neurons.length; i++) {
                neurons[i].activation = 1 / (1 + Math.exp(-neurons[i].sum));
                neurons[i].derivative = n.activation * (1 - neurons[i].activation);
            }
            return neurons;
        }
    ),

    Tanh: new ActivationFunction(
        neurons => neurons.map((n) => Math.tanh(n)),
        activations => activations.map((a) => 1 - (a * a)),
        neurons => {
            for (let i = 0; i < neurons.length; i++) {
                neurons[i].activation = Math.tanh(neurons[i].sum);
                neurons[i].derivative = 1 - (neurons[i].activation * neurons[i].activation);
            }
            return neurons;
        }
    ),

    ReLU: new ActivationFunction(
        neurons => neurons.map((n) => Math.max(n, 0)),
        activations => activations.map((a) => a > 0 ? 1 : 0),
        neurons => {
            for (let i = 0; i < neurons.length; i++) {
                neurons[i].activation = Math.max(neurons[i].sum, 0);
                neurons[i].derivative = neurons[i].activation > 0 ? 1 : 0;
            }
            return neurons;
        }
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
                // let sum = 0;
                // for (let j = 0; j < activations.length; j++) {
                //     if (i === j) {
                //         sum += activations[i] * (1 - activations[i]);
                //     } else {
                //         sum += -activations[i] * activations[j];
                //     }
                // }
                // derivatives.push(sum);
            }

            return derivatives;

            // let derVal = new Array(neurons.length);
            // for (let i = 0; i < neurons.length; i++) {
            //     derVal[i] = neurons[i].activation * (1 - neurons[i].activation);
            // }
            // return derVal;

            let max = -1;
            let maxIndex = -1;

            for (let i = 0; i < activations.length; i++) {
                if (activations[i].activation > max) {
                    max = activations[i].activation;
                    maxIndex = i;
                }
            }

            for (let i = 0; i < activations.length; i++) {
                if (i == maxIndex) {
                    derVal[i] = activations[i].activation * (1 - activations[i].activation);
                }
                else {
                    derVal[i] = -activations[maxIndex].activation * activations[i].activation;
                }
            }
        },
        neurons => {

            let max = Number.MIN_VALUE;
            for (let i = 0; i < neurons.length; i++) {
                if (neurons[i].sum > max)
                    max = neurons[i].sum;
            }
            const exponents = neurons.map((n) => Math.exp(n.sum - max));
            const sum = exponents.reduce((a, b) => a + b);
            const activations = exponents.map((e) => e / sum);
            for (let i = 0; i < neurons.length; i++) {
                neurons[i].activation = activations[i];
                neurons[i].derivative = neurons[i].activation * (1 - neurons[i].activation);
            }
            return neurons;
        }
    ),
}

