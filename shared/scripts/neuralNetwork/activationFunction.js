class ActivationFunction {
    constructor(func, dfunc) {
        this.func = func;
        this.dfunc = dfunc;
    }
}

const ActivationFunctions = {
    Sigmoid: new ActivationFunction(
        neurons => neurons.map((n) => 1 / (1 + Math.exp(-n.sum))),
        neurons2 => neurons2.map((n) => n.activation * (1 - n.activation))
    ),

    Tanh: new ActivationFunction(
        neurons => neurons.map((n) => Math.tanh(n.sum)),
        neurons2 => neurons2.map((n) => 1 - (n.activation * n.activation))
    ),

    ReLU: new ActivationFunction(
        neurons => neurons.map((n) => Math.max(n.sum, 0)),
        neurons2 => neurons2.map((n) => n.activation > 0 ? 1 : 0)
    ),

    SoftMax: new ActivationFunction(

        neurons => {
            let max = Number.MIN_VALUE;
            for (let i = 0; i < neurons.length; i++) {
                if (neurons[i].sum > max)
                    max = neurons[i].sum;
            }
            const exponents = neurons.map((n) => Math.exp(n.sum - max));
            const sum = exponents.reduce((a, b) => a + b);
            return exponents.map((e) => e / sum);
        },
        neurons2 => {
            let max = -1;
            let maxIndex = -1;

            for (let i = 0; i < neurons2.length; i++) {
                if (neurons2[i].activation > max) {
                    max = neurons2[i].activation;
                    maxIndex = i;
                }
            }

            let derVal = new Array(neurons2.length);
            for (let i = 0; i < neurons2.length; i++) {
                if (i == maxIndex) {
                    derVal[i] = neurons2[i].activation * (1 - neurons2[i].activation);
                }
                else {
                    derVal[i] = -neurons2[maxIndex].activation * neurons2[i].activation;
                }
            }
            return derVal;
        }
    ),
}

