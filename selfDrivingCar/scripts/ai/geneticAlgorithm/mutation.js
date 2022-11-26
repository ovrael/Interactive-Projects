class Mutation {
    #mutationDelegate;

    constructor(methodName, chance, amount) {

        this.chance = Number(chance);
        this.amount = Number(amount);
        this.setMethod(methodName);
    }

    setMethod(methodName) {

        switch (methodName) {
            case MutationMethod.EveryGene:
                this.#mutationDelegate = this.#everyGene;
                break;

            case MutationMethod.RandomSingleLayer:
                this.#mutationDelegate = this.#randomSingleLayer;
                break;

            case MutationMethod.RandomMultiLayer:
                this.#mutationDelegate = this.#randomMultiLayer;
                break;

            default:
                console.warn('Cant find ' + methodName + ' mutation. Assign default: everyGene');
                this.#mutationDelegate = this.#everyGene;
                break;
        }
    }

    run(population) {
        return this.#mutationDelegate(population);
    }

    #everyGene(population) {
        for (let i = 0; i < population.length; i++) {

            if (!population[i]) {
                continue;
            }

            if (Math.random() > this.mutationChance) {
                continue;
            }

            population[i].neuralNetwork.layers.forEach(layer => {
                for (let i = 0; i < layer.biases.length; i++) {
                    layer.biases[i] = lerp(
                        layer.biases[i],
                        Math.random() * 2 - 1,
                        this.amount
                    )
                }

                for (let i = 0; i < layer.weights.length; i++) {
                    for (let j = 0; j < layer.weights[i].length; j++) {
                        layer.weights[i][j] = lerp(
                            layer.weights[i][j],
                            Math.random() * 2 - 1,
                            this.amount
                        )
                    }
                }
            });
        }

        return population;
    }

    #randomSingleLayer(population) {
        for (let i = 0; i < population.length; i++) {

            if (!population[i]) {
                continue;
            }

            if (Math.random() > this.mutationChance) {
                return;
            }

            const randomLayerIndex = Mathematics.randIntMax(population[i].neuralNetwork.layers.length);

            for (let i = 0; i < population[i].neuralNetwork.layers[randomLayerIndex].biases.length; i++) {
                population[i].neuralNetwork.layers[randomLayerIndex].biases[i] = lerp(
                    population[i].neuralNetwork.layers[randomLayerIndex].biases[i],
                    Math.random() * 2 - 1,
                    this.amount
                )
            }

            for (let i = 0; i < population[i].neuralNetwork.layers[randomLayerIndex].weights.length; i++) {
                for (let j = 0; j < population[i].neuralNetwork.layers[randomLayerIndex].weights[i].length; j++) {
                    population[i].neuralNetwork.layers[randomLayerIndex].weights[i][j] = lerp(
                        population[i].neuralNetwork.layers[randomLayerIndex].weights[i][j],
                        Math.random() * 2 - 1,
                        this.amount
                    )
                }
            }
        }

        return population;
    }

    #randomMultiLayer(population) {
        for (let i = 0; i < population.length; i++) {

            if (!population[i]) {
                continue;
            }

            if (Math.random() > this.mutationChance) {
                continue;
            }

            population[i].neuralNetwork.layers.forEach(layer => {

                if (Math.random() > 0.5) {
                    return;
                }

                for (let i = 0; i < layer.biases.length; i++) {
                    layer.biases[i] = lerp(
                        layer.biases[i],
                        Math.random() * 2 - 1,
                        this.amount
                    )
                }

                for (let i = 0; i < layer.weights.length; i++) {
                    for (let j = 0; j < layer.weights[i].length; j++) {
                        layer.weights[i][j] = lerp(
                            layer.weights[i][j],
                            Math.random() * 2 - 1,
                            this.amount
                        )
                    }
                }
            });
        }

        return population;
    }
}