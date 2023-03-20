class LayerData {

    constructor(type = "Input", neurons = 0, activationFunction = null, dropoutRate = 0, weightsRegulizer = null) {
        this.type = type;
        this.neurons = neurons;
        this.activationFunction = activationFunction;
        this.dropoutRate = dropoutRate;

        if (weightsRegulizer == null)
            weightsRegulizer = new WeightsRegulizer(0, 0);
        this.weightsRegulizer = weightsRegulizer
    }

}