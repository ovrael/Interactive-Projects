class Optimizer {

    constructor(optimizerData) {

        if (!optimizerData) {
            throw new Error("Bad optimizer data");
        }

        if (!optimizerData.name) {
            console.warn("No optimizer name, creating default Adam optimizer.");
            return Optimizer.adam();
        }

        switch (optimizerData.name) {
            case "sgd":
                this.setSGD(optimizerData);
                break;

            case "adam":
                this.setAdam(optimizerData);
                break;

            default:
                this.setAdam(optimizerData);
                break;
        }

    }

    setNeuralNetworkData(model) {
        switch (this.name) {
            case "sgd":
                break;

            case "adam":
                this.m = new Array(model.layerCount);
                this.v = new Array(model.layerCount);

                for (let i = 1; i < model.layers.length; i++) {
                    this.m[i] = Weights.createZero(model.layers[i].weights);
                    this.v[i] = Weights.createZero(model.layers[i].weights);
                }
                break;

            default:
                this.m = new Array(model.layerCount);
                this.v = new Array(model.layerCount);

                for (let i = 1; i < model.layers.length; i++) {
                    this.m[i] = Weights.createZero(model.layers[i].weights);
                    this.v[i] = Weights.createZero(model.layers[i].weights);
                }
                break;
        }
    }

    setSGD(data) {
        this.name = "sgd";
        this.learningRate = data.learningRate || 0.005;
        this.momentum = data.momentum || 0.9;
        this.updateWeightsFunction = this.trainSGD;
    }

    setAdam(data) {
        this.name = "adam";
        this.learningRate = data.learningRate || 0.001;
        this.beta1 = data.beta1 || 0.900;
        this.beta2 = data.beta2 || 0.999;
        this.epsilon = data.epsilon || 1e-8;
        this.updateWeightsFunction = this.trainAdam;
    }

    updateWeights(modelData) {
        return this.updateWeightsFunction(modelData);
    }

    trainSGD(modelData) {


    }

    trainAdam(modelData) {
        for (let layer = 1; layer < modelData.layers.length; layer++) {
            const dw = modelData.layers[layer].weightsDeltas.copy();

            this.m[layer] = Weights.scalarMultiply(this.m[layer], this.beta1);
            this.m[layer].weightsAdd(Weights.scalarMultiply(dw, 1 - this.beta1));

            this.v[layer] = Weights.scalarMultiply(this.v[layer], this.beta2);
            this.v[layer].weightsAdd(Weights.scalarMultiply(Weights.hadamardMultiply(dw, dw), 1 - this.beta2));

            const mHat = Weights.scalarDivide(this.m[layer], 1 - Math.pow(this.beta1, modelData.epoch + 1));
            const vHat = Weights.scalarDivide(this.v[layer], 1 - Math.pow(this.beta2, modelData.epoch + 1));
            const vHatSquared = Weights.sqrt(vHat);

            const delta = Weights.scalarMultiply(Weights.weightsDivide(mHat, Weights.scalarAdd(vHatSquared, this.epsilon)), this.learningRate);
            modelData.layers[layer].weights.weightsSubtract(delta);
        }
        return modelData.layers;
    }

    /**
    Computes the BATCH error for the last layer of the neural network.
    @param {Array} target - the target output for the training data.
    @returns {number} the sum of errors for the output layer.
*/
    #backpropLastLayerBatch(target) {
        let errorSum = 0;
        let outputErrors = this.neuralNetwork.costFunction(this.neuralNetwork.layers[this.neuralNetwork.layers.length - 1].activations, target);

        this.neuralNetwork.layers[this.neuralNetwork.layersCount - 1].computeDerivatives();
        for (let i = 0; i < this.neuralNetwork.layers[this.neuralNetwork.layers.length - 1].neuronsCount; i++) {
            this.neuralNetwork.layers[this.neuralNetwork.layers.length - 1].errors[i] = outputErrors[i];
            this.neuralNetwork.layers[this.neuralNetwork.layers.length - 1].gamma[i] = outputErrors[i] * this.neuralNetwork.layers[this.neuralNetwork.layers.length - 1].derivatives[i];
            errorSum += outputErrors[i];
        }

        this.neuralNetwork.layers[this.neuralNetwork.layersCount - 1].computeWeightsDeltasBatch(this.neuralNetwork.layers[this.neuralNetwork.layersCount - 2]);

        return errorSum;
    }


    /**
        Computes the BATCH error for each layer of the neural network.
        @param {Array} target - the target output for the training data.
        @returns {number} the sum of errors for the neural network.
    */
    #backpropErrorBatch(target) {

        const errorSum = this.#backpropLastLayerBatch(target);

        for (let layer = this.neuralNetwork.layers.length - 2; layer > 0; layer--) {
            this.neuralNetwork.layers[layer].computeDerivatives();
            this.neuralNetwork.layers[layer].computeGamma(this.neuralNetwork.layers[layer + 1]);
            this.neuralNetwork.layers[layer].computeWeightsDeltasBatch(this.neuralNetwork.layers[layer - 1]);
        }

        return errorSum;
    }

    static sgd(learningRate = 0.005, momentum = 0.9) {
        return new Optimizer(
            {
                "name": "sgd",
                "learningRate": learningRate,
                "momentum": momentum,
            }
        );
    }

    static adam(learningRate = 0.001, beta1 = 0.9, beta2 = 0.999, epsilon = 1e-8) {
        return new Optimizer(
            {
                "name": "adam",
                "learningRate": learningRate,
                "beta1": beta1,
                "beta2": beta2,
                "epsilon": epsilon
            }
        );
    }
}