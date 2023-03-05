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

        /** @type {NeuralNetwork} */
        this.neuralNetwork = null;
    }

    setNeuralNetwork(model) {
        this.neuralNetwork = model;
    }

    setSGD(data) {
        this.learningRate = data.learningRate || 0.005;
        this.trainFunction = this.trainSGD;
    }

    setAdam(data) {
        this.learningRate = data.learningRate || 0.001;
        this.beta1 = data.beta1 || 0.900;
        this.beta2 = data.beta2 || 0.999;
        this.epsilon = data.epsilon || 1e-8;
        this.trainFunction = this.trainAdam;
    }

    train(trainData, epochs = 10, batchSize = 1, validationData = null) {
        if (this.neuralNetwork == null) {
            console.error("Optimizer has no connected neural network");
            return;
        }

        this.trainFunction(trainData, epochs, batchSize, validationData);


        // if (!validationData || validationData.length == 0) {
        //     return;
        // }
    }

    trainSGD(data, epochs = 10, batchSize = 1, validationData = null) {


    }

    trainAdam(trainData, epochs = 10, batchSize = 1, validationData = null) {
        let m = [];
        let v = [];
        const showResultStep = Math.floor(epochs / 10);

        for (let i = 1; i < this.neuralNetwork.layers.length; i++) {
            m[i] = Weights.createZero(this.neuralNetwork.layers[i].weights);
            v[i] = Weights.createZero(this.neuralNetwork.layers[i].weights);
        }

        for (let e = 0; e < epochs; e++) {

            let trainLoss = 0;

            /** @type {Array<DataPoint>} */
            let batchTrain = [];

            /** @type {Array<DataPoint>} */
            const shuffledTrainData = DataManage.shuffle(trainData);
            this.neuralNetwork.changeLayersDropout(true);

            for (let i = 0; i < shuffledTrainData.length; i++) {

                batchTrain.push(shuffledTrainData[i]);

                if (batchTrain.length == batchSize || i == shuffledTrainData.length - 1) {
                    for (let layer = 1; layer < this.neuralNetwork.layers.length; layer++) {
                        this.neuralNetwork.layers[layer].setWeihtsDeltasToZero();
                    }

                    for (let j = 0; j < batchTrain.length; j++) {
                        this.neuralNetwork.feedForward(batchTrain[j].inputs);
                        trainLoss -= this.#backpropErrorBatch(batchTrain[j].expectedOutputs);
                    }

                    for (let layer = 1; layer < this.neuralNetwork.layers.length; layer++) {
                        const dw = this.neuralNetwork.layers[layer].weightsDeltas.copy();

                        m[layer] = Weights.scalarMultiply(m[layer], this.beta1);
                        m[layer].weightsAdd(Weights.scalarMultiply(dw, 1 - this.beta1));

                        v[layer] = Weights.scalarMultiply(v[layer], this.beta2);
                        v[layer].weightsAdd(Weights.scalarMultiply(Weights.hadamardMultiply(dw, dw), 1 - this.beta2));

                        const mHat = Weights.scalarDivide(m[layer], 1 - Math.pow(this.beta1, e + 1));
                        const vHat = Weights.scalarDivide(v[layer], 1 - Math.pow(this.beta2, e + 1));
                        const vHatSquared = Weights.sqrt(vHat);

                        const delta = Weights.scalarMultiply(Weights.weightsDivide(mHat, Weights.scalarAdd(vHatSquared, this.epsilon)), this.learningRate);
                        this.neuralNetwork.layers[layer].weights.weightsSubtract(delta);
                    }

                    batchTrain = [];
                }

                this.neuralNetwork.lastTarget = shuffledTrainData[i].label;
            }

            trainLoss /= shuffledTrainData.length;

            this.neuralNetwork.changeLayersDropout(false);
            const shuffledTestData = DataManage.shuffle(validationData);

            this.badResults = [];
            let testResult = this.neuralNetwork.validate(shuffledTestData);

            if (e % showResultStep == 0 || e == epochs - 1) {
                const results = {
                    "Epoch": e,
                    "Train Loss": trainLoss,
                    "Test Loss": testResult[0],
                    "Good Test": testResult[1],
                    "Test length": validationData.length,
                    "Test %": testResult[1] / validationData.length,
                }
                this.neuralNetwork.learningStatistics = results;
                console.table(results);
            }
        }
        this.neuralNetwork.isLearning = false;
        this.neuralNetwork.changeLayersDropout(false);

        console.info("Training finished");
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

    static sgd(learningRate = 0.005) {
        return new Optimizer(
            {
                "name": "sgd",
                "learningRate": learningRate,
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