class GASelection {

    #selectionDelegate;

    constructor(methodName, parentsCount) {
        this.parentsCount = Number(parentsCount);
        this.setMethod(methodName);
    }

    setMethod(methodName) {
        switch (methodName) {
            case SelectionMethod.Roulette:
                this.#selectionDelegate = this.#roulette;
                break;

            case SelectionMethod.Tournament:
                this.#selectionDelegate = this.#tournament;
                break;

            case SelectionMethod.TopBest:
                this.#selectionDelegate = this.#topBest;
                break;

            case SelectionMethod.Random:
                this.#selectionDelegate = this.#random;
                break;

            default:
                console.warn('Cant find ' + methodName + ' selection. Assign default: tournament');
                this.#selectionDelegate = this.#tournament;
                break;
        }
    }

    run(population) {
        return this.#selectionDelegate(population);
    }

    #createRoulette(population) {
        let fitnessSum = 0;
        let roulette = [];

        for (let i = 0; i < population.length; i++) {
            fitnessSum += population[i].fitnessValue;
        }

        let chanceSum = 0;
        for (let i = 0; i < population.length; i++) {
            chanceSum += population[i].fitnessValue;
            roulette.push(
                {
                    index: i,
                    chance: chanceSum / fitnessSum
                }
            )
        }
        return roulette;
    }

    #roulette(population) {
        let parents = new Array(this.parentsCount);

        const roulette = this.#createRoulette(population);

        for (let i = 0; i < parents.length; i++) {

            const randomValue = Math.random();

            for (let j = 0; j < roulette.length; j++) {
                if (!(randomValue > roulette[j].chance)) {
                    parents[i] = population[roulette[j].index];
                    break;
                }
            }
        }

        return parents;
    }

    #tournament(population) {
        let parents = new Array(this.parentsCount);
        const groupSize = Math.floor(population.length / 8);

        for (let i = 0; i < parents.length; i++) {
            let group = new Array(groupSize);

            for (let i = 0; i < group.length; i++) {
                group[i] = population[Mathematics.randIntMax(population.length)];
            }

            const fitnessValues = group.map(p => p.fitnessValue);
            const maxFitness = Math.max(...fitnessValues);
            const bestParent = group.find(p => p.fitnessValue == maxFitness);

            parents[i] = bestParent;
        }

        return parents;
    }

    #topBest(population) {
        const sortedPopulation = population.sort(function (a, b) {
            if (a.fitnessValue < b.fitnessValue) {
                return 1;
            } else if (a.fitnessValue > b.fitnessValue) {
                return -1;
            } else {
                return 0;
            }
        });

        return sortedPopulation.slice(0, this.parentsCount);
    }

    #random(population) {
        let parents = new Array(this.parentsCount);

        for (let i = 0; i < parents.length; i++) {
            parents[i] = population[Mathematics.randIntMax(population.length)];
        }

        return parents;
    }
}