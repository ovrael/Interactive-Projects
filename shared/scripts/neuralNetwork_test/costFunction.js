class CostFunction {

    constructor(func, derivative, name) {
        this.func = func;
        this.derivative = derivative;
        this.name = name;
        this.epsilon = 1e-12;
    }

    static onehotIndexTarget(target, predictedLength) {

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

    static meanSquaredError() {

        return new CostFunction(
            function (predicted, targets) {
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
        );
    }

    static crossEntropy() {

        return new CostFunction(

            function (outputs, targets) {
                let cost = 0;
                for (let i = 0; i < outputs.length; i++) {
                    const x = outputs[i];
                    const y = targets[i];
                    const v = (y == 1) ? -Math.log(x) : -Math.log(1 - x);
                    cost += isFinite(v) ? v : 0;
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
        );
    }
}