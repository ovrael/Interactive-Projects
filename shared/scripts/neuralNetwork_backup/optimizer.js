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
        this.updateWeightsFunction(modelData);
    }

    trainSGD(modelData) {
        for (let i = 1; i < modelData.layersCount; i++) {
            const weights = modelData.layers.weights;
            const biases = modelData.layers.biases;
            const gamma = modelData.layer.gamma;
            const weightsDeltas = modelData.layer.weightsDeltas;

            for (let c = 0; c < weights.current; c++) {

                biases[c] -= gamma[c] * this.learningRate;
                for (let p = 0; p < weights.previous; p++) {
                    weights.data[p][c] -= weightsDeltas.data[p][c] * this.learningRate;
                }
            }
        }
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