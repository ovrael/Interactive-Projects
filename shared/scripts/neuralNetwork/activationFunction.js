class ActivationFunction {
    constructor(func, dfunc, bothFunc) {
        this.func = func;
        this.dfunc = dfunc;
        this.bothFunc = bothFunc;
    }
}

const ActivationFunctions = {
    Sigmoid: new ActivationFunction(
        neurons => neurons.map((n) => 1 / (1 + Math.exp(-n.sum))),
        neurons2 => neurons2.map((n) => n.activation * (1 - n.activation)),
        neurons3 => {
            for (let i = 0; i < neurons3.length; i++) {
                neurons3[i].activation = 1 / (1 + Math.exp(-neurons3[i].sum));
                neurons3[i].derivative = n.activation * (1 - neurons3[i].activation);
            }
            return neurons3;
        }
    ),

    Tanh: new ActivationFunction(
        neurons => neurons.map((n) => Math.tanh(n.sum)),
        neurons2 => neurons2.map((n) => 1 - (n.activation * n.activation)),
        neurons3 => {
            for (let i = 0; i < neurons3.length; i++) {
                neurons3[i].activation = Math.tanh(neurons3[i].sum);
                neurons3[i].derivative = 1 - (neurons3[i].activation * neurons3[i].activation);
            }
            return neurons3;
        }
    ),

    ReLU: new ActivationFunction(
        neurons => neurons.map((n) => Math.max(n.sum, 0)),
        neurons2 => neurons2.map((n) => n.activation > 0 ? 1 : 0),
        neurons3 => {
            for (let i = 0; i < neurons3.length; i++) {
                neurons3[i].activation = Math.max(neurons3[i].sum, 0);
                neurons3[i].derivative = neurons3[i].activation > 0 ? 1 : 0;
            }
            return neurons3;
        }
    ),

    SoftMax: new ActivationFunction(
        neurons => {
            let max = -10000000;
            for (let i = 0; i < neurons.length; i++) {
                if (neurons[i].sum > max)
                    max = neurons[i].sum;
            }
            const exponents = neurons.map((n) => Math.exp(n.sum - max));
            const sum = exponents.reduce((a, b) => a + b);
            return exponents.map((e) => e / sum);
        },
        neurons2 => {

            let derVal = new Array(neurons2.length);
            for (let i = 0; i < neurons2.length; i++) {
                derVal[i] = neurons2[i].activation * (1 - neurons2[i].activation);
            }
            return derVal;

            let max = -1;
            let maxIndex = -1;

            for (let i = 0; i < neurons2.length; i++) {
                if (neurons2[i].activation > max) {
                    max = neurons2[i].activation;
                    maxIndex = i;
                }
            }

            for (let i = 0; i < neurons2.length; i++) {
                if (i == maxIndex) {
                    derVal[i] = neurons2[i].activation * (1 - neurons2[i].activation);
                }
                else {
                    derVal[i] = -neurons2[maxIndex].activation * neurons2[i].activation;
                }
            }
        },
        neurons3 => {

            let max = Number.MIN_VALUE;
            for (let i = 0; i < neurons3.length; i++) {
                if (neurons3[i].sum > max)
                    max = neurons3[i].sum;
            }
            const exponents = neurons3.map((n) => Math.exp(n.sum - max));
            const sum = exponents.reduce((a, b) => a + b);
            const activations = exponents.map((e) => e / sum);
            for (let i = 0; i < neurons3.length; i++) {
                neurons3[i].activation = activations[i];
                neurons3[i].derivative = neurons3[i].activation * (1 - neurons3[i].activation);
            }
            return neurons3;
        }
    ),
}

