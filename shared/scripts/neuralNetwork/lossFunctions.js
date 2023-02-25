class ErrorFunction {
    constructor(func) {
        this.func = func;
    }

    static checkTargets(target, predictedLength) {

        if (Array.isArray(target))
            return target;

        const targetsIndex = target;
        const targets = [];
        for (let i = 0; i < predictedLength; i++) {
            targets.push(
                (i == targetsIndex) ? 1 : 0
            );
        }

        return targets;
    }
}

const epsilon = Number.EPSILON;

const LossFunctions =
{
    Regression:
    {
        Difference: function (predicted, targets) {
            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(predicted[i] - targets[i]);
            }
            return errors;
        },

        MeanSquaredError: function (predicted, targets) {
            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(-0.5 * (targets[i] - predicted[i]) * (targets[i] - predicted[i]));
            }
            return errors;
        },

        LogLoss: function (predicted, targets) {
            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(-(targets[i] * Math.log(epsilon + predicted[i])));
            }
            return errors;
        },
    },
    BinaryClassification:
    {
        BinaryCrossEntropy: function (predicted, targets) {
            // targets = ErrorFunction.checkTargets(targets, predicted.length);
            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(
                    (Math.log(epsilon + predicted[i]) + (1 - targets[i]) * Math.log(1 - predicted[i] + epsilon))
                );
            }
            return errors;
        }
    },
    MultiClassification:
    {
        CategoricalCrossEntropy: function (predicted, targets) {

            targets = ErrorFunction.checkTargets(targets, predicted.length);

            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(targets[i] * Math.log(predicted[i] + epsilon) - (1 - targets[i]) * Math.log(1 - predicted[i] + epsilon));
            }
            return errors;
        },

        SimpleSubtraction: function (predicted, targets) {

            targets = ErrorFunction.checkTargets(targets, predicted.length);

            const errors = [];
            for (let i = 0; i < predicted.length; i++) {

                errors.push(predicted[i] - targets[i]);
            }
            return errors;
        },

        SimpleSubtraction2: function (predicted, targets) {

            targets = ErrorFunction.checkTargets(targets, predicted.length);

            const errors = [];
            for (let i = 0; i < predicted.length; i++) {

                errors.push(targets[i] - predicted[i]);
            }
            return errors;
        },
    }
}