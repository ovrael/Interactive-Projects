class NeuralNetwork {

    constructor(errorFunction, learningRate = 0.05) {
        this.errorFunction = errorFunction;
        this.learningRate = learningRate;

        this.layers = [];
    }

    addLayer(numberOfNeurons, activationFunction) {

        let numberOfPreviousNeurons = ((this.layers.length > 0) ? this.layers[this.layers.length - 1].neurons.length : 0);

        this.layers.push(
            new Layer(numberOfNeurons, numberOfPreviousNeurons, activationFunction)
        );
    }

    train(data, targets) {
        if (this.layers.length < 3) {
            console.error("Neural network is too small. It should have at least 3 layers!");
            return;
        }

        if (data.length == 0) {
            console.error("No data to train!");
            return;
        }

        if (data[0].length != this.layers[0].neurons.length) {
            console.error("Data is different size than first layer of neural network!");
            return;
        }

        this.#feedForward(data);
        let error = this.#computeError(this.layers[this.layers.length - 1].neurons, targets);
        console.log("Error: " + error);
        console.log("Predicted:");
        console.log(this.layers[this.layers.length - 1].neurons);
        console.log("Targets:");
        console.log(targets);
    }

    // Fills neural network neurons from beggining to the end
    #feedForward(data) {
        this.layers[0].fillNeurons(data);
        for (let i = 1; i < this.layers.length; i++) {
            this.#computeNextLayer(i);
        }
    }

    #computeNextLayer(currentIndex) {

        const prevLayer = this.layers[currentIndex - 1];

        for (let i = 0; i < this.layers[currentIndex].neurons.length; i++) {

            for (let j = 0; j < prevLayer.neurons.length; j++) {

                this.layers[currentIndex].neurons[i] += prevLayer.neurons[j] * this.layers[currentIndex].weights[j][i];

            }
            this.layers[currentIndex].neurons[i] += this.layers[currentIndex].biases[i];
        }
    }

    #computeError(predicted, targets) {

        let errorSum = 0;

        for (let i = 0; i < targets.length; i++) {
            errorSum += this.errorFunction(targets[i], predicted[i]);
        }


        let meanError = sum_score / targets.length;

        return meanError;
    }
}