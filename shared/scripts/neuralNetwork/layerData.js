class LayerData {

    constructor(type = "Input", neurons = 0, activationFunction = null, dropoutRate = 0, weightsRegulizer = null) {
        this.type = type;
        this.neurons = neurons;

        this.activationFunction = LayerData.#convertToActivationFunciton(activationFunction);
        this.dropoutRate = dropoutRate;

        if (weightsRegulizer == null)
            weightsRegulizer = new WeightsRegulizer(0, 0);
        this.weightsRegulizer = weightsRegulizer
    }

    getActivationName() {
        return this.activationFunction.name;
    }

    getRegulizerData() {
        return [this.weightsRegulizer.l1, this.weightsRegulizer.l2];
    }

    static #convertToActivationFunciton(activationName) {
        if (activationName == undefined || activationName == null)
            return null;

        if (activationName instanceof ActivationFunction)
            return activationName;

        if (typeof activationName != 'string')
            return null;

        switch (activationName) {
            case ActivationFunctionNames.sigmoid:
                return ActivationFunction.sigmoid();

            case ActivationFunctionNames.tanh:
                return ActivationFunction.tanh();

            case ActivationFunctionNames.relu:
                return ActivationFunction.relu();

            case ActivationFunctionNames.leakyRelu:
                return ActivationFunction.leakyRelu();

            case ActivationFunctionNames.softmax:
                return ActivationFunction.softmax();

            default:
                console.warn(`Could not find ${activationName} activation function! Set to default leakyRelu`);
                return ActivationFunction.leakyRelu();
        }
    }
}