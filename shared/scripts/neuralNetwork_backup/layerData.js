class LayerData {

    constructor(type = "Input", neurons = 0, activationFunction = null, dropoutRate = 0) {
        this.type = type;
        this.neurons = neurons;
        this.activationFunction = activationFunction;
        this.dropoutRate = dropoutRate;
    }

}