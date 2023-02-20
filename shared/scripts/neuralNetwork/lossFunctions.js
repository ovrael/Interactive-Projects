// class ErrorFunction {
//     constructor(func) {
//         this.func = func;
//     }
// }

const epsilon = 0.000000001;

const LossFunctions =
{
    Regression:
    {
        Difference: function (predicted, targets) {
            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(predicted[i].activation - targets[i]);
            }
            return errors;
        },

        MeanSquaredError: function (predicted, targets) {
            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(-0.5 * (targets[i] - predicted[i].activation) * (targets[i] - predicted[i].activation));
            }
            return errors;
        },

        LogLoss: function (predicted, targets) {
            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(-(targets[i] * Math.log(epsilon + predicted[i].activation)));
            }
            return errors;
        },
    },
    BinaryClassification:
    {
        BinaryCrossEntropy: function (predicted, targets) {
            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(
                    -(Math.log(epsilon + predicted[i].activation) + (1 - targets[i]) * Math.log(1 - predicted[i].activation + epsilon))
                );
            }
            return errors;
        }
    },
    MultiClassification:
    {
        CategoricalCrossEntropy: function (predicted, targets) {

            if (!Array.isArray(targets)) {
                targets = [];
                for (let i = 0; i < predicted.length; i++) {
                    targets.push(
                        (i == targets) ? 1 : 0
                    );
                }
            }

            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                if (targets[i] == 1) {
                    errors.push(-Math.log(predicted[i].activation + epsilon));
                } else {
                    errors.push(-Math.log(1 - predicted[i].activation + epsilon));
                }
            }
            return errors;
        },

        SimpleSubtraction: function (predicted, targets) {

            if (!Array.isArray(targets)) {
                targets = [];
                for (let i = 0; i < predicted.length; i++) {
                    targets.push(
                        (i == targets) ? 1 : 0
                    );
                }
            }

            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(targets[i] - predicted[i].activation);
            }
            return errors;
        },

        Binary: function (predicted, targets) {

            if (!Array.isArray(targets)) {
                targets = [];
                for (let i = 0; i < predicted.length; i++) {
                    targets.push(
                        (i == targets) ? 1 : 0
                    );
                }
            }

            const errors = LossFunctions.BinaryClassification.BinaryCrossEntropy(predicted, targets);
            return errors;
        },

        // if (i != target)
        //     errors[i] = 0;
        // else {
        //     errors[i] = -Math.log(predicted[target].activation + epsilon);
        // }
        // TestCategory: function (predicted, target) {
        //     let errors = new Array(predicted.length);
        //     for (let i = 0; i < errors.length; i++) {
        //         errors[i] = 1 - predicted[i];
        //     }
        //     return errors;
        // }
    }
}