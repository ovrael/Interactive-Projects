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

            targets = CostFunction.onehotIndexTarget(targets, predicted.length);

            const errors = [];
            for (let i = 0; i < predicted.length; i++) {
                errors.push(targets[i] * Math.log(predicted[i] + epsilon) - (1 - targets[i]) * Math.log(1 - predicted[i] + epsilon));
            }
            return errors;
        },

        SimpleSubtraction: function (predicted, targets) {

            targets = CostFunction.onehotIndexTarget(targets, predicted.length);

            const errors = [];
            for (let i = 0; i < predicted.length; i++) {

                errors.push(predicted[i] - targets[i]);
            }
            return errors;
        },

        SimpleSubtraction2: function (predicted, targets) {

            targets = CostFunction.onehotIndexTarget(targets, predicted.length);

            const errors = [];
            for (let i = 0; i < predicted.length; i++) {

                errors.push(targets[i] - predicted[i]);
            }
            return errors;
        },
    },

    MeanSquaredError: new CostFunction(

        function (predicted, targets) {
            // cost is sum (for all x,y pairs) of: 0.5 * (x-y)^2
            let cost = 0;
            for (let i = 0; i < predicted.length; i++) {
                const error = predicted[i] - targets[i];
                cost += error * error;
            }
            return 0.5 * cost;
        },
        function (singleOutput, singleTarget) {
            return singleOutput - singleTarget;
        },
        "MeanSquaredError"
    ),
    CrossEntropy: new CostFunction(

        function (predicted, targets) {
            let cost = 0;
            for (let i = 0; i < predicted.length; i++) {
                const x = predicted[i];
                const y = targets[i];
                const v = (y == 1) ? -Math.log(x) : -Math.log(1 - x);
                cost += isNaN(v) ? 0 : v;
            }
            return cost;
        },
        function (singleOutput, singleTarget) {

            if (singleOutput == 0 || singleOutput == 1) {
                return 0;
            }
            return (-singleOutput + singleTarget) / (singleOutput * (singleOutput - 1));
        },
        "CrossEntropy"
    )
}