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
                this.mWeights = new Array(model.backpropLayers.length);
                this.mBiases = new Array(model.backpropLayers.length);
                for (let i = 0; i < model.backpropLayers.length; i++) {
                    this.mWeights[i] = Weights.createZero(model.backpropLayers[i].weightsGradient);
                    this.mBiases[i] = Weights.createZero(model.backpropLayers[i].biasGradient);
                }
                break;

            case "adam":
                this.mWeights = new Array(model.backpropLayers.length);
                this.vWeights = new Array(model.backpropLayers.length);
                this.mBiases = new Array(model.backpropLayers.length);
                this.vBiases = new Array(model.backpropLayers.length);

                for (let i = 0; i < model.backpropLayers.length; i++) {
                    this.mWeights[i] = Weights.createZero(model.backpropLayers[i].weightsGradient);
                    this.vWeights[i] = Weights.createZero(model.backpropLayers[i].weightsGradient);

                    this.mBiases[i] = Weights.createZero(model.backpropLayers[i].biasGradient);
                    this.vBiases[i] = Weights.createZero(model.backpropLayers[i].biasGradient);
                }
                break;

            default:
                this.mWeights = new Array(model.backpropLayers.length);
                this.vWeights = new Array(model.backpropLayers.length);
                this.mBiases = new Array(model.backpropLayers.length);
                this.vBiases = new Array(model.backpropLayers.length);

                for (let i = 0; i < model.backpropLayers.length; i++) {
                    this.mWeights[i] = Weights.createZero(model.backpropLayers[i].weightsGradient);
                    this.vWeights[i] = Weights.createZero(model.backpropLayers[i].weightsGradient);

                    this.mBiases[i] = Weights.createZero(model.backpropLayers[i].biasGradient);
                    this.vBiases[i] = Weights.createZero(model.backpropLayers[i].biasGradient);
                }
                break;
        }
    }

    setSGD(data) {
        this.name = "sgd";
        this.iteration = 0;
        this.learningRate = data.learningRate == null ? 0.001 : data.learningRate;
        this.currentLearningRate = this.learningRate;
        this.weightsDecay = data.weightsDecay == null ? 0.0 : data.weightsDecay;

        this.momentum = data.momentum == null ? 0.0 : data.momentum;

        this.updateWeightsFunction = this.trainSGD;
    }

    setAdam(data) {
        this.name = "adam";
        this.iteration = 0;
        this.learningRate = data.learningRate == null ? 0.001 : data.learningRate;
        this.currentLearningRate = this.learningRate;
        this.weightsDecay = data.weightsDecay == null ? 0 : data.weightsDecay;

        this.beta1 = data.beta1 == null ? 0.900 : data.beta1;
        this.beta2 = data.beta2 == null ? 0.999 : data.beta2;
        this.epsilon = data.epsilon == null ? 1e-8 : data.epsilon;

        this.updateWeightsFunction = this.trainAdam;
    }

    updateWeights(modelData) {
        this.updateWeightsFunction(modelData);
    }

    trainSGD(modelData) {

        this.#decayLearningRate();

        if (this.momentum > 0 && this.momentum <= 1) {
            for (let i = 0; i < modelData.backpropLayers.length; i++) {
                const weightsChange = Weights.scalarMultiply(modelData.backpropLayers[i].weightsGradient, this.currentLearningRate);
                const biasChange = Weights.scalarMultiply(modelData.backpropLayers[i].biasGradient, this.currentLearningRate);

                this.mWeights[i] = Weights.scalarMultiply(this.mWeights[i], this.momentum);
                this.mBiases[i] = Weights.scalarMultiply(this.mBiases[i], this.momentum);

                this.mWeights[i].weightsSubtract(weightsChange);
                this.mBiases[i].weightsSubtract(biasChange);

                modelData.layers[i + 1].weights.weightsAdd(this.mWeights[i]);
                modelData.layers[i + 1].biases.weightsAdd(this.mBiases[i]);
            }
        }
        else {
            for (let i = 0; i < modelData.backpropLayers.length; i++) {
                const weightsChange = Weights.scalarMultiply(modelData.backpropLayers[i].weightsGradient, this.currentLearningRate);
                const biasChange = Weights.scalarMultiply(modelData.backpropLayers[i].biasGradient, this.currentLearningRate);

                modelData.layers[i + 1].weights.weightsSubtract(weightsChange);
                modelData.layers[i + 1].biases.weightsSubtract(biasChange);
            }
        }
    }

    trainAdam(modelData) {

        this.#decayLearningRate();

        for (let layer = 0; layer < modelData.backpropLayers.length; layer++) {

            const dw = modelData.backpropLayers[layer].weightsGradient.copy();
            const db = modelData.backpropLayers[layer].biasGradient.copy();

            // UPDATE MOMENTUM WITH GRADIENT
            // M(t) = M(t-1) * beta1
            this.mWeights[layer] = Weights.scalarMultiply(this.mWeights[layer], this.beta1);
            this.mBiases[layer] = Weights.scalarMultiply(this.mBiases[layer], this.beta1);

            // M(t) += gradient(t) * (1 - beta1)
            this.mWeights[layer].weightsAdd(Weights.scalarMultiply(dw, 1 - this.beta1));
            this.mBiases[layer].weightsAdd(Weights.scalarMultiply(db, 1 - this.beta1));

            // COMPUTE CORRECTED MOMENTUM
            // Mh(t) = M(t) / (1 - beta1^t)
            const mHatWeights = Weights.scalarDivide(this.mWeights[layer], 1 - Math.pow(this.beta1, this.iteration + 1));
            const mHatBiases = Weights.scalarDivide(this.mBiases[layer], 1 - Math.pow(this.beta1, this.iteration + 1));

            // UPDATE SECOND MOMENTUM (CACHE?)
            // V(t) = V(t-1) * beta2
            this.vWeights[layer] = Weights.scalarMultiply(this.vWeights[layer], this.beta2);
            this.vBiases[layer] = Weights.scalarMultiply(this.vBiases[layer], this.beta2);

            // V(t) += gradient(t)^2 * (1 - beta2)
            this.vWeights[layer].weightsAdd(Weights.scalarMultiply(Weights.hadamardMultiply(dw, dw), 1 - this.beta2));
            this.vBiases[layer].weightsAdd(Weights.scalarMultiply(Weights.hadamardMultiply(db, db), 1 - this.beta2));

            // COMPUTE CORRECTED SECOND MOMENTUM
            // Vh(t) = V(t) / (1 - beta2^t)
            const vHatWeights = Weights.scalarDivide(this.vWeights[layer], 1 - Math.pow(this.beta2, this.iteration + 1));
            const vHatBiases = Weights.scalarDivide(this.vBiases[layer], 1 - Math.pow(this.beta2, this.iteration + 1));

            // √(Vh) + epsilon
            const vHatWeightsSqrt = Weights.sqrt(vHatWeights);
            vHatWeightsSqrt.scalarAdd(this.epsilon);

            const vHatBiasesSqrt = Weights.sqrt(vHatBiases);
            vHatBiasesSqrt.scalarAdd(this.epsilon);

            // Mh / (√(Vh) + epsilon)
            const weightsHatFraction = Weights.weightsDivide(mHatWeights, vHatWeightsSqrt);
            const biasesHatFraction = Weights.weightsDivide(mHatBiases, vHatBiasesSqrt);

            // Weights and bias change
            const deltaW = Weights.scalarMultiply(weightsHatFraction, this.currentLearningRate);
            const deltaB = Weights.scalarMultiply(biasesHatFraction, this.currentLearningRate);

            modelData.layers[layer + 1].weights.weightsSubtract(deltaW);
            modelData.layers[layer + 1].biases.weightsSubtract(deltaB);

            this.iteration++;
        }
    }

    #decayLearningRate() {

        if (this.weightsDecay <= 0)
            return;

        this.currentLearningRate = this.learningRate * (1.0 / (1.0 + this.weightsDecay * this.iteration))
    }

    /**
          Given input data, predict the output of the neural network.
          @param {Number} learningRate [0.001] - how much weights and biases should change during learning
          @param {Number} momentum [0.0] - momentum
          @param {Number} weightsDecay [0.0] - how much learning rate should change during learning
          
       @returns {Optimizer} The optimizer that uses Stochastic Gradient Descent algorithm to update weights in neuaral network.
      */
    static sgd(learningRate = 0.005, momentum = 0, weightsDecay = 0) {
        return new Optimizer(
            {
                "name": "sgd",
                "learningRate": learningRate,
                "momentum": momentum,
                "weightsDecay": weightsDecay,
            }
        );
    }

    /**
       Given input data, predict the output of the neural network.
       @param {Number} learningRate [0.001] - how much weights and biases should change during learning
       @param {Number} beta1 [0.900] - beta
       @param {Number} beta2 [0.999] - beta
       @param {Number} epsilon [1e-8] - very small number to avoid dividing by zero
       @param {Number} weightsDecay [0.0] - how much learning rate should change during learning
       
       @returns {Optimizer} The optimizer that uses ADAM algorithm to update weights in neuaral network.
   */
    static adam(learningRate = 0.001, beta1 = 0.9, beta2 = 0.999, epsilon = 1e-8, weightsDecay = 0) {
        return new Optimizer(
            {
                "name": "adam",
                "learningRate": learningRate,
                "beta1": beta1,
                "beta2": beta2,
                "epsilon": epsilon,
                "weightsDecay": weightsDecay,
            }
        );
    }
}