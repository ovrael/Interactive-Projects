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
        neurons => neurons.map((n) => n.activation * (1 - n.activation)),
        neurons => {
            for (let i = 0; i < neurons.length; i++) {
                neurons[i].activation = 1 / (1 + Math.exp(-neurons[i].sum));
                neurons[i].derivative = n.activation * (1 - neurons[i].activation);
            }
            return neurons;
        }
    ),

    Tanh: new ActivationFunction(
        neurons => neurons.map((n) => Math.tanh(n.sum)),
        neurons => neurons.map((n) => 1 - (n.activation * n.activation)),
        neurons => {
            for (let i = 0; i < neurons.length; i++) {
                neurons[i].activation = Math.tanh(neurons[i].sum);
                neurons[i].derivative = 1 - (neurons[i].activation * neurons[i].activation);
            }
            return neurons;
        }
    ),

    ReLU: new ActivationFunction(
        neurons => neurons.map((n) => Math.max(n.sum, 0)),
        neurons => neurons.map((n) => n.activation > 0 ? 1 : 0),
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
                if (neurons[i].sum > max)
                    max = neurons[i].sum;
            }
            const exponents = neurons.map((n) => Math.exp(n.sum - max));
            const sum = exponents.reduce((a, b) => a + b);
            return exponents.map((e) => e / sum);
        },
        neurons => {

            const derivatives = [];

            for (let i = 0; i < neurons.length; i++) {
                let sum = 0;

                for (let j = 0; j < neurons.length; j++) {
                    if (i === j) {
                        sum += neurons[i].activation * (1 - neurons[i].activation);
                    } else {
                        sum += -neurons[i].activation * neurons[j].activation;
                    }
                }

                derivatives.push(sum);
            }

            return derivatives;

            // let derVal = new Array(neurons.length);
            // for (let i = 0; i < neurons.length; i++) {
            //     derVal[i] = neurons[i].activation * (1 - neurons[i].activation);
            // }
            // return derVal;

            let max = -1;
            let maxIndex = -1;

            for (let i = 0; i < neurons.length; i++) {
                if (neurons[i].activation > max) {
                    max = neurons[i].activation;
                    maxIndex = i;
                }
            }

            for (let i = 0; i < neurons.length; i++) {
                if (i == maxIndex) {
                    derVal[i] = neurons[i].activation * (1 - neurons[i].activation);
                }
                else {
                    derVal[i] = -neurons[maxIndex].activation * neurons[i].activation;
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

