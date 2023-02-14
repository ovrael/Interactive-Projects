class ActivationFunction {
    constructor(func, dfunc) {
        this.func = func;
        this.dfunc = dfunc;
    }
}

const ActivationFunctions = {
    Sigmoid: new ActivationFunction(
        outputs => outputs.map((o) => 1 / (1 + Math.exp(-o))),
        der => der.map((d) => 1 / (1 + Math.exp(-d)))
    ),

    Tanh: new ActivationFunction(
        outputs => outputs.map((o) => Math.tanh(o)),
        der => der.map((d) => 1 - (d * d))
    ),

    ReLU: new ActivationFunction(
        outputs => outputs.map((o) => Math.max(o, 0)),
        der => der.map((d) => d > 0 ? 1 : 0)
    ),

    SoftMax: new ActivationFunction(

        outputs => {
            const max = outputs.reduce((a, b) => Math.max(a, b), -Infinity);
            const exponents = outputs.map((o) => Math.exp(o - max));
            const sum = exponents.reduce((a, b) => a + b);
            return exponents.map((e) => e / sum);
        },
        der => {
            let max = -1;
            let maxIndex = -1;

            for (let i = 0; i < der.length; i++) {
                if (der[i] > max) {
                    max = der[i];
                    maxIndex = i;
                }
            }

            let derVal = new Array(der.length);
            for (let i = 0; i < der.length; i++) {
                if (i == maxIndex) {
                    derVal[i] = der[i] * (1 - der[i]);
                }
                else {
                    derVal[i] = -der[maxIndex] * der[i];
                }
            }
            return derVal;
        }
    ),
}

