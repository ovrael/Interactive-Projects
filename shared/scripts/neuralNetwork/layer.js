class Layer {

    constructor(numberOfNeurons, numberOfPreviousNeurons = 0, activationFunction) {
        this.neurons = [];
        this.biases = [];

        for (let i = 0; i < numberOfNeurons; i++) {
            this.neurons.push(0);
            this.biases.push(Math.random() - 0.5);
        }

        this.weights = (numberOfPreviousNeurons > 0) ? new Weights(numberOfPreviousNeurons, numberOfNeurons) : null;
        this.activationFunction = activationFunction;
    }

    activate() {

    }

    fillNeurons(data) {
        if (data[0].length != this.neurons.length) {
            console.error("Data length is different than neurons length!");
            return;
        }

        for (let i = 0; i < data.length; i++) {
            this.neurons[i] = data[i];
        }
    }

}