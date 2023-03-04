class DataPoint {
    constructor(inputs, label, numLabels = -1) {
        this.inputs = inputs;
        this.label = label;
        if (numLabels > 0)
            this.expectedOutputs = DataPoint.createOneHot(label, numLabels);
    }

    static createOneHot(index, num) {
        let oneHot = [];
        for (let i = 0; i < num; i++) {
            oneHot[index] = (i == num) ? 1 : 0;
        }
        return oneHot;
    }
}