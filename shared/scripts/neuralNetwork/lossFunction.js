class LossFunction {
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
}