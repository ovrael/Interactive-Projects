class Layer {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        Layer.#randomize(this);
    }

    static #randomize(layer) {
        for (let i = 0; i < layer.inputs.length; i++) {
            for (let j = 0; j < layer.outputs.length; j++) {
                layer.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < layer.biases.length; i++) {
            layer.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward(givenInputs, layer) {
        for (let i = 0; i < givenInputs.length; i++) {
            layer.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < layer.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < layer.inputs.length; j++) {
                sum += layer.inputs[j] * layer.weights[j][i];
            }

            if (sum > layer.biases[i]) {
                layer.outputs[i] = 1;
            } else {
                layer.outputs[i] = 0;
            }
        }

        return layer.outputs;
    }
}