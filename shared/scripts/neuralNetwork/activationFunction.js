class ActivationFunction {
    constructor(func, dfunc) {
        this.func = func;
        this.dfunc = dfunc;
    }
}

const ActivationFunctions = {
    Sigmoid: new ActivationFunction(
        x => 1 / (1 + Math.exp(-x)),
        y => y * (1 - y)
    ),

    Tanh: new ActivationFunction(
        x => Math.tanh(x),
        y => 1 - (y * y)
    )
}

