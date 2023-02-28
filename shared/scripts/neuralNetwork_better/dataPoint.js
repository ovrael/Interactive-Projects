class DataPoint {
    constructor(inputs, label, numLabels) {
        this.inputs = inputs;
        this.label = label;
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