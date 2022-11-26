class Crossover {

    #crossoverDelegate;

    constructor(methodName) {

        this.setMethod(methodName);
    }

    setMethod(methodName) {
        switch (methodName) {
            case CrossoverMethod.Random:
                this.#crossoverDelegate = this.#random;
                break;

            case CrossoverMethod.Average:
                this.#crossoverDelegate = this.#average;
                break;

            case CrossoverMethod.SinglePoint:
                this.#crossoverDelegate = this.#singlePoint;
                break;

            case CrossoverMethod.TwoPoint:
                this.#crossoverDelegate = this.#twoPoint;
                break;

            case CrossoverMethod.RandomMultiPoint:
                this.#crossoverDelegate = this.#randomMultiPoint;
                break;

            default:
                console.warn('Cant find ' + methodName + ' crossover. Assign default: random');
                this.#crossoverDelegate = this.#random;
                break;
        }

    }

    run(parents, populationSize, eliteCount) {
        return this.#crossoverDelegate(parents, populationSize, eliteCount);
    }

    #takeTwoParents(parents) {
        const parent1Index = Mathematics.randIntMax(parents.length);
        let parent2Index = Mathematics.randIntMax(parents.length);
        let resetCount = 0;
        while (parent1Index == parent2Index) {
            parent2Index = Mathematics.randIntMax(parents.length);
            if (resetCount > 1000)
                break;
            resetCount++;
        }

        return {
            parent1: parents[parent1Index],
            parent2: parents[parent2Index]
        };
    }

    #random(parents, populationSize, eliteCount) {

        const chosenParents = this.#takeTwoParents(parents);
        const parent1 = chosenParents.parent1;
        const parent2 = chosenParents.parent2;

        let population = new Array(populationSize);
        for (let i = 0; i < population.length - eliteCount; i++) {

            let child1 = GeneticAlgorithm.generateAiCar();
            let child2 = GeneticAlgorithm.generateAiCar();

            for (let i = 0; i < child1.neuralNetwork.layers.length; i++) {
                const child1Layer = child1.neuralNetwork.layers[i];
                const child2Layer = child2.neuralNetwork.layers[i];

                for (let j = 0; j < child1Layer.biases.length; j++) {

                    if (Math.random() > 0.5) {
                        child1Layer.biases[j] = parent1.neuralNetwork.layers[i].biases[j];
                        child2Layer.biases[j] = parent2.neuralNetwork.layers[i].biases[j];
                    } else {
                        child1Layer.biases[j] = parent2.neuralNetwork.layers[i].biases[j];
                        child2Layer.biases[j] = parent1.neuralNetwork.layers[i].biases[j];
                    }
                }

                for (let j = 0; j < child1Layer.weights.length; j++) {
                    for (let k = 0; k < child1Layer.weights[j].length; k++) {
                        if (Math.random() > 0.5) {
                            child1Layer.weights[j][k] = parent1.neuralNetwork.layers[i].weights[j][k];
                            child2Layer.weights[j][k] = parent2.neuralNetwork.layers[i].weights[j][k];
                        } else {
                            child1Layer.weights[j][k] = parent2.neuralNetwork.layers[i].weights[j][k];
                            child2Layer.weights[j][k] = parent1.neuralNetwork.layers[i].weights[j][k];
                        }
                    }
                }
            }

            if (population[i] == undefined) {
                population[i] = child1;
            }

            if (population[i + 1] == undefined) {
                population[i + 1] = child2;
            }
        }

        return population;
    }

    #average(parents, populationSize, eliteCount) {
        const chosenParents = this.#takeTwoParents(parents);
        const parent1 = chosenParents.parent1;
        const parent2 = chosenParents.parent2;

        let population = new Array(populationSize);
        for (let i = 0; i < population.length - eliteCount; i++) {

            let child = GeneticAlgorithm.generateAiCar();

            for (let i = 0; i < child.neuralNetwork.layers.length; i++) {
                const childLayer = child.neuralNetwork.layers[i];

                for (let j = 0; j < childLayer.biases.length; j++) {
                    childLayer.biases[j] = (parent1.neuralNetwork.layers[i].biases[j] + parent2.neuralNetwork.layers[i].biases[j]) / 2;
                }

                for (let j = 0; j < childLayer.weights.length; j++) {
                    for (let k = 0; k < childLayer.weights[j].length; k++) {
                        childLayer.weights[j][k] = (parent1.neuralNetwork.layers[i].weights[j][k] + parent2.neuralNetwork.layers[i].weights[j][k]) / 2;
                    }
                }
            }

            if (population[i] == undefined) {
                population[i] = child;
            }
        }

        return population;
    }

    #getPoints(neuralNetworkExample, pointsCount) {

        if (pointsCount <= 0)
            pointsCount = 1;

        let points = new Array(pointsCount);
        let networkSize = 0;
        for (let i = 0; i < neuralNetworkExample.layers.length; i++) {
            const layer = neuralNetworkExample.layers[i];
            networkSize += layer.weights.length * layer.weights[0].length;
        }

        for (let i = 0; i < points.length; i++) {
            points[i] = lerp(
                0,
                networkSize,
                ((1 + i) / (pointsCount + 1))
            );
        }

        return points;
    }

    #singlePoint(parents, populationSize, eliteCount) {

        const points = this.#getPoints(parents[0].neuralNetwork, 1);
        return this.#multiPoint(parents, populationSize, eliteCount, points);
    }

    #twoPoint(parents, populationSize, eliteCount) {
        const points = this.#getPoints(parents[0].neuralNetwork, 2);
        return this.#multiPoint(parents, populationSize, eliteCount, points);
    }

    #multiPoint(parents, populationSize, eliteCount, points) {
        const chosenParents = this.#takeTwoParents(parents);
        const parent1 = chosenParents.parent1;
        const parent2 = chosenParents.parent2;

        let population = new Array(populationSize);
        for (let i = 0; i < population.length - eliteCount; i++) {

            let child1 = GeneticAlgorithm.generateAiCar();
            let child2 = GeneticAlgorithm.generateAiCar();

            let mainParent = 1; // 1 -> parent1; -1 -> parent2;
            let weightsCountSum = 0;
            let pointsIndex = 0;

            for (let i = 0; i < child1.neuralNetwork.layers.length; i++) {
                const child1Layer = child1.neuralNetwork.layers[i];
                const child2Layer = child2.neuralNetwork.layers[i];

                for (let j = 0; j < child1Layer.biases.length; j++) {

                    if (mainParent > 0) {
                        child1Layer.biases[j] = parent1.neuralNetwork.layers[i].biases[j];
                        child2Layer.biases[j] = parent2.neuralNetwork.layers[i].biases[j];
                    } else {
                        child1Layer.biases[j] = parent2.neuralNetwork.layers[i].biases[j];
                        child2Layer.biases[j] = parent1.neuralNetwork.layers[i].biases[j];
                    }
                }

                for (let j = 0; j < child1Layer.weights.length; j++) {
                    for (let k = 0; k < child1Layer.weights[j].length; k++) {

                        if (weightsCountSum >= points[pointsIndex]) {
                            mainParent *= -1;
                            pointsIndex++;
                        }

                        if (mainParent > 0) {
                            child1Layer.weights[j][k] = parent1.neuralNetwork.layers[i].weights[j][k];
                            child2Layer.weights[j][k] = parent2.neuralNetwork.layers[i].weights[j][k];
                        } else {
                            child1Layer.weights[j][k] = parent2.neuralNetwork.layers[i].weights[j][k];
                            child2Layer.weights[j][k] = parent1.neuralNetwork.layers[i].weights[j][k];
                        }

                        weightsCountSum++;
                    }
                }
            }

            if (population[i] == undefined) {
                population[i] = child1;
            }

            if (population[i + 1] == undefined) {
                population[i + 1] = child2;
            }
        }

        return population;
    }

    #randomMultiPoint(parents, populationSize, eliteCount) {
        const pointsCount = Mathematics.randIntMax(populationSize / 2);
        const points = this.#getPoints(parents[0].neuralNetwork, pointsCount);
        return this.#multiPoint(parents, populationSize, eliteCount, points);
    }
}