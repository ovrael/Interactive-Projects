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
                this.mWeights = new Array(model.backpropLayers.length);
                this.vWeights = new Array(model.backpropLayers.length);
                this.mBiases = new Array(model.backpropLayers.length);
                this.vBiases = new Array(model.backpropLayers.length);

                for (let i = 0; i < model.backpropLayers.length; i++) {
                    this.mWeights[i] = Weights.createZero(model.backpropLayers[i].weightsDeltas);
                    this.vWeights[i] = Weights.createZero(model.backpropLayers[i].weightsDeltas);

                    this.mBiases[i] = Weights.createZero(model.backpropLayers[i].biasDeltas);
                    this.vBiases[i] = Weights.createZero(model.backpropLayers[i].biasDeltas);
                }
                break;

            default:
                this.mWeights = new Array(model.backpropLayers.length);
                this.vWeights = new Array(model.backpropLayers.length);
                this.mBiases = new Array(model.backpropLayers.length);
                this.vBiases = new Array(model.backpropLayers.length);

                for (let i = 0; i < model.backpropLayers.length; i++) {
                    this.mWeights[i] = Weights.createZero(model.backpropLayers[i].weightsDeltas);
                    this.vWeights[i] = Weights.createZero(model.backpropLayers[i].weightsDeltas);

                    this.mBiases[i] = Weights.createZero(model.backpropLayers[i].biasDeltas);
                    this.vBiases[i] = Weights.createZero(model.backpropLayers[i].biasDeltas);
                }
                break;
        }
    }

    setSGD(data) {
        this.name = "sgd";
        this.learningRate = data.learningRate == null ? 0.001 : data.learningRate;
        this.momentum = data.momentum == null ? 0.9 : data.momentum;
        this.updateWeightsFunction = this.trainSGD;
    }

    setAdam(data) {
        this.name = "adam";
        this.learningRate = data.learningRate == null ? 0.001 : data.learningRate;
        this.beta1 = data.beta1 == null ? 0.900 : data.beta1;
        this.beta2 = data.beta2 == null ? 0.999 : data.beta2;
        this.epsilon = data.epsilon == null ? 1e-8 : data.epsilon;
        this.updateWeightsFunction = this.trainAdam;
    }

    updateWeights(modelData) {
        this.updateWeightsFunction(modelData);
    }

    trainSGD(modelData) {
        for (let i = 0; i < modelData.backpropLayers.length; i++) {
            const weights = modelData.layers[i + 1].weights;
            const biases = modelData.layers[i + 1].biases;
            const biasesDeltas = modelData.backpropLayers[i].biasesDeltas;
            const weightsDeltas = modelData.backpropLayers[i].weightsDeltas;

            for (let c = 0; c < weights.current; c++) {
                biases[c] -= this.learningRate * biasesDeltas[0][c];
                for (let p = 0; p < weights.previous; p++) {
                    weights.data[p][c] -= this.learningRate * weightsDeltas.data[p][c];
                }
            }
        }
    }

    trainAdam(modelData) {

        for (let layer = 0; layer < modelData.backpropLayers.length; layer++) {

            const dw = modelData.backpropLayers[layer].weightsDeltas.copy();

            // M(t) = M(t-1) * beta1
            this.mWeights[layer] = Weights.scalarMultiply(this.mWeights[layer], this.beta1);

            // M(t) += gradient(t) * (1 - beta1)
            this.mWeights[layer].weightsAdd(Weights.scalarMultiply(dw, 1 - this.beta1));

            // V(t) = V(t-1) * beta2
            this.vWeights[layer] = Weights.scalarMultiply(this.vWeights[layer], this.beta2);

            // V(t) += gradient(t)^2 * (1 - beta2)
            this.vWeights[layer].weightsAdd(Weights.scalarMultiply(Weights.hadamardMultiply(dw, dw), 1 - this.beta2));

            // Mh(t) = M(t) / (1 - beta1^t)
            const mHatWeights = Weights.scalarDivide(this.mWeights[layer], 1 - Math.pow(this.beta1, modelData.epoch + 1));

            // Vh(t) = V(t) / (1 - beta2^t)
            const vHatWeights = Weights.scalarDivide(this.vWeights[layer], 1 - Math.pow(this.beta2, modelData.epoch + 1));
            
            
            // √(Vh) + epsilon
            const vHatWeightsSqrt = Weights.sqrt(vHatWeights);
            vHatWeightsSqrt.scalarAdd(this.epsilon);

            // Mh / (√(Vh) + epsilon)
            const weightsHatFraction = Weights.weightsDivide(mHatWeights, vHatWeightsSqrt);

            // Weights and bias change
            const deltaW = Weights.scalarMultiply(weightsHatFraction, this.learningRate);

            modelData.layers[layer + 1].weights.weightsSubtract(deltaW);

            // const db = modelData.backpropLayers[layer].biasDeltas.copy();
            // this.mBiases[layer] = Weights.scalarMultiply(this.mBiases[layer], this.beta1);
            // this.mBiases[layer].weightsAdd(Weights.scalarMultiply(db, 1 - this.beta1));
            // this.vBiases[layer] = Weights.scalarMultiply(this.vBiases[layer], this.beta2);
            // this.vBiases[layer].weightsAdd(Weights.scalarMultiply(Weights.hadamardMultiply(db, db), 1 - this.beta2));
            // const mHatBiases = Weights.scalarDivide(this.mBiases[layer], 1 - Math.pow(this.beta1, modelData.epoch + 1));
            // const vHatBiases = Weights.scalarDivide(this.vBiases[layer], 1 - Math.pow(this.beta2, modelData.epoch + 1));
            // const vHatBiasesSqrt = Weights.sqrt(vHatBiases);
            // vHatBiasesSqrt.scalarAdd(this.epsilon);
            // const biasesHatFraction = Weights.weightsDivide(mHatBiases, vHatBiasesSqrt);
            // const deltaB = Weights.scalarMultiply(biasesHatFraction, this.learningRate);
            // modelData.layers[layer + 1].biases.weightsSubtract(deltaB);
        }
    }

    trainAdam_old(modelData) {
        for (let layer = 0; layer < modelData.backpropLayers.length; layer++) {
            const dw = modelData.backpropLayers[layer].weightsDeltas.copy();

            this.mWeights[layer] = Weights.scalarMultiply(this.mWeights[layer], this.beta1);
            this.mWeights[layer].weightsAdd(Weights.scalarMultiply(dw, 1 - this.beta1));

            this.vWeights[layer] = Weights.scalarMultiply(this.vWeights[layer], this.beta2);
            this.vWeights[layer].weightsAdd(Weights.scalarMultiply(Weights.hadamardMultiply(dw, dw), 1 - this.beta2));

            const mHat = Weights.scalarDivide(this.mWeights[layer], 1 - Math.pow(this.beta1, modelData.epoch + 1));
            const vHat = Weights.scalarDivide(this.vWeights[layer], 1 - Math.pow(this.beta2, modelData.epoch + 1));
            const vHatSquared = Weights.sqrt(vHat);

            const delta = Weights.scalarMultiply(Weights.weightsDivide(mHat, Weights.scalarAdd(vHatSquared, this.epsilon)), this.learningRate);
            modelData.layers[layer + 1].weights.weightsSubtract(delta);
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