class ErrorFunction {
    constructor(func) {
        this.func = func;
    }
}

const ErrorFunctions =
{
    Difference: new ErrorFunction(
        (predicted, target) => target - predicted
    ),

    MeanSquaredError: new ErrorFunction(
        (predicted, target) => (target - predicted) * (target - predicted)
    ),

    LogLoss: new ErrorFunction(
        (predicted, target) => target * Math.log(1e-15 + predicted)
    ),
}