// class ErrorFunction {
//     constructor(func) {
//         this.func = func;
//     }
// }

const ErrorFunctions =
{
    Regression:
    {
        Difference: function (predicted, target) {
            return predicted[0].activation - target;
        },

        MeanSquaredError: function (predicted, target) {
            return -0.5 * (target - predicted[0].activation) * (target - predicted[0].activation);
        },

        LogLoss: function (predicted, target) {
            return -(target * Math.log(1e-15 + predicted[0].activation));
        },
    },
    BinaryClassification:
    {
        BinaryCrossEntropy: function (predicted, target) {
            return -(Math.log(1e-15 + predicted[0].activation) + (1 - target) * Math.log(1 - predicted[0].activation + 1e-15));
        }
    },
    MultiClassification:
    {
        CategoricalCrossEntropy: function (predicted, target) {
            return -Math.log(predicted[target].activation + 1e-15);
        }
    }
}