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
                this.mWeights = new Array(model.layerCount);
                this.vWeights = new Array(model.layerCount);
                this.mBiases = new Array(model.layerCount);
                this.vBiases = new Array(model.layerCount);

                for (let i = 1; i < model.layers.length; i++) {
                    this.mWeights[i] = Weights.createZero(model.layers[i].weights);
                    this.vWeights[i] = Weights.createZero(model.layers[i].weights);

                    this.mBiases[i] = Weights.createZero(model.layers[i].biasDeltas);
                    this.vBiases[i] = Weights.createZero(model.layers[i].biasDeltas);
                }
                break;

            default:
                this.mWeights = new Array(model.layerCount);
                this.vWeights = new Array(model.layerCount);
                this.mBiases = new Array(model.layerCount);
                this.vBiases = new Array(model.layerCount);

                for (let i = 1; i < model.layers.length; i++) {
                    this.mWeights[i] = Weights.createZero(model.layers[i].weights);
                    this.vWeights[i] = Weights.createZero(model.layers[i].weights);

                    this.mBiases[i] = Weights.createZero(model.layers[i].biasDeltas);
                    this.vBiases[i] = Weights.createZero(model.layers[i].biasDeltas);
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
            const weights = modelData.layers[i].weights;
            const biases = modelData.layers[i].biases;
            const biasesDeltas = modelData.layers[i].biasesDeltas;
            const weightsDeltas = modelData.layers[i].weightsDeltas;

            for (let c = 0; c < weights.current; c++) {
                biases[c] -= this.learningRate * biasesDeltas[c];
                for (let p = 0; p < weights.previous; p++) {
                    weights.data[p][c] -= this.learningRate * weightsDeltas.data[p][c];
                }
            }
        }
    }

    trainAdam(modelData) {
        for (let layer = 1; layer < modelData.layers.length; layer++) {
            const dw = modelData.layers[layer].weightsDeltas.copy();
            const db = modelData.layers[layer].biasDeltas.copy();

            // M(t) = M(t-1) * beta1
            this.mWeights[layer].scalarMultiply(this.beta1);
            this.mBiases[layer].scalarMultiply(this.beta1);

            // M(t) += gradient(t) * (1 - beta1)
            this.mWeights[layer].weightsAdd(Weights.scalarMultiply(dw, 1 - this.beta1));
            this.mBiases[layer].weightsAdd(Weights.scalarMultiply(db, 1 - this.beta1));

            // V(t) = V(t-1) * beta2
            this.vWeights[layer].scalarMultiply(this.beta2);
            this.vBiases[layer].scalarMultiply(this.beta2);

            // V(t) += gradient(t)^2 * (1 - beta2)
            this.vWeights[layer].weightsAdd(Weights.scalarMultiply(Weights.hadamardMultiply(dw, dw), 1 - this.beta2));
            this.vBiases[layer].weightsAdd(Weights.scalarMultiply(Weights.hadamardMultiply(db, db), 1 - this.beta2));

            // Mh(t) = M(t) / (1 - beta1^t)
            const mHatWeights = Weights.scalarDivide(this.mWeights[layer], 1 - Math.pow(this.beta1, modelData.epoch + 1));
            const mHatBiases = Weights.scalarDivide(this.mBiases[layer], 1 - Math.pow(this.beta1, modelData.epoch + 1));

            // Hh(t) = H(t) / (1 - beta2^t)
            const vHatWeights = Weights.scalarDivide(this.vWeights[layer], 1 - Math.pow(this.beta2, modelData.epoch + 1));
            const vHatWeightsSquared = Weights.sqrt(vHatWeights);

            const vHatBiases = Weights.scalarDivide(this.vBiases[layer], 1 - Math.pow(this.beta2, modelData.epoch + 1));
            const vHatBiasesSquared = Weights.sqrt(vHatBiases);

            // Mh / (Hh^(1/2) + epsilon)
            vHatWeightsSquared.scalarAdd(this.epsilon);
            vHatBiasesSquared.scalarAdd(this.epsilon);

            const weightsHatFraction = Weights.weightsDivide(mHatWeights, vHatWeightsSquared);
            const biasesHatFraction = Weights.weightsDivide(mHatBiases, vHatBiasesSquared);

            // Weights and bias change
            const deltaW = Weights.scalarMultiply(weightsHatFraction, this.learningRate);
            const deltaB = Weights.scalarMultiply(biasesHatFraction, this.learningRate);

            modelData.layers[layer].weights.weightsSubtract(deltaW);

            for (let i = 0; i < modelData.layers[layer].biases.length; i++) {
                modelData.layers[layer].biases[i] = deltaB.data[0][i];
            }
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