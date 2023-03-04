class DataPoint {
    constructor(inputs, label, numLabels = -1) {
        this.inputs = inputs;
        this.label = label;
        this.expectedOutputs = label;
        if (numLabels > 0)
            this.expectedOutputs = DataPoint.createOneHot(label, numLabels);
    }

    static createOneHot(label, classesCount) {
        let oneHot = [];
        for (let i = 0; i < classesCount; i++) {
            oneHot[i] = (i == label) ? 1 : 0;
        }
        return oneHot;
    }
}