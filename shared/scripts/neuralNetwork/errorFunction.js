// class ErrorFunction {
//     constructor(func) {
//         this.func = func;
//     }
// }

const epsilon = 0.0000001;

const ErrorFunctions =
{
    Regression:
    {
        Difference: function (predicted, target) {
            return [predicted[0].activation - target];
        },

        MeanSquaredError: function (predicted, target) {
            return [-0.5 * (target - predicted[0].activation) * (target - predicted[0].activation)];
        },

        LogLoss: function (predicted, target) {
            return [-(target * Math.log(epsilon + predicted[0].activation))];
        },
    },
    BinaryClassification:
    {
        BinaryCrossEntropy: function (predicted, target) {
            return [-(Math.log(epsilon + predicted[0].activation) + (1 - target) * Math.log(1 - predicted[0].activation + epsilon))];
        }
    },
    MultiClassification:
    {
        CategoricalCrossEntropy: function (predicted, target) {
            let errors = new Array(predicted.length);
            for (let i = 0; i < errors.length; i++) {
                if (i != target)
                    errors[i] = 0;
                else {
                    errors[i] = -Math.log(predicted[target].activation + epsilon);
                }
            }
            return errors;
        },

        // TestCategory: function (predicted, target) {
        //     let errors = new Array(predicted.length);
        //     for (let i = 0; i < errors.length; i++) {
        //         errors[i] = 1 - predicted[i];
        //     }
        //     return errors;
        // }
    }
}