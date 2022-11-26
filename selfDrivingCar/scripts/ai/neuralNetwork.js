class NeuralNetwork {
    constructor(neuronCounts) {
        this.layers = [];

        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.layers.push(
                new Layer(neuronCounts[i], neuronCounts[i + 1])
            );
        }
    }

    static feedForward(givenInputs, network) {
        let outputs = Layer.feedForward(givenInputs, network.layers[0]);

        for (let i = 1; i < network.layers.length; i++) {
            outputs = Layer.feedForward(outputs, network.layers[i]);
        }

        return outputs;
    }
}