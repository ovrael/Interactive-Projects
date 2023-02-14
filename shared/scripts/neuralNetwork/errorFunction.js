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
            return target - predicted[0];
        },

        MeanSquaredError: function (predicted, target) {
            return (target - predicted[0]) * (target - predicted[0]) * 0.5;
        },

        LogLoss: function (predicted, target) {
            return target * Math.log(1e-15 + predicted[0]);
        },
    },
    BinaryClassification:
    {
        BinaryCrossEntropy: function (predicted, target) {
            return Math.log(1e-15 + predicted[0]) + (1 - target) * Math.log(1 - predicted[0] + 1e-15);
        }
    },
    MultiClassification:
    {
        CrossEntropy: function (predicted, target) {
            return -Math.log(predicted[target]);
        }
    }
}