class Genetics {
    constructor() {
        this.time = 0;
        this.generation = 0;

        this.population = [];
        for (let i = 0; i < ProjectData.PopulationSize; i++) {
            this.population.push(
                new Rocket()
            );
        }

        this.dnaMatingPool = [];

        this.target = createVector(ProjectData.CanvasWidth / 2, 50);
        this.reachedTargetUnits = 0;
        this.crashedUnits = 0;

        this.bestFitness = 0;
        this.bestTime = ProjectData.Lifespan;
        this.bestDistance = ProjectData.CanvasHeight;
    }

    update() {

        this.#showTarget();

        if (this.time >= ProjectData.Lifespan)
            this.#newGeneration();


        this.reachedTargetUnits = 0;
        this.crashedUnits = 0;

        for (let i = this.population.length - 1; i >= 0; i--) {
            this.population[i].update(this.time, this.target);
            this.population[i].show();

            if (this.population[i].reachedTarget)
                this.reachedTargetUnits++;

            if (this.population[i].crashed)
                this.crashedUnits++;
        }

        if (this.crashedUnits + this.reachedTargetUnits == this.population.length) {
            this.#newGeneration();
        }

        this.time++;
    }

    setTarget(x, y) {
        this.target = createVector(x, y);
    }

    showDebugs() {
        if (ProjectData.ShowPopulationDebug)
            this.#showPopulationDebug();

        if (ProjectData.ShowDebug)
            this.#showDebug();

        if (ProjectData.ShowBestDebug)
            this.#showBestDebug();
    }

    manualNextGeneration() {
        this.#newGeneration();
    }

    #showDebug() {
        push();

        fill(230, 230, 45, 150);
        noStroke();

        textSize(18);
        textAlign(LEFT);

        let timeText = "- Time -";
        let lifespanText = ` / ${ProjectData.Lifespan}`;
        let timeValueText = `${this.time}`;

        text(timeText, ProjectData.CanvasWidth - textWidth(timeText) - 10, 25);
        text(lifespanText, ProjectData.CanvasWidth - textWidth(lifespanText) - 10, 50);
        text(timeValueText, ProjectData.CanvasWidth - textWidth(lifespanText) - textWidth(timeValueText) - 10, 50);

        pop();
    }

    #showPopulationDebug() {
        push();

        fill(230, 230, 45, 150);
        noStroke();

        textSize(18);
        textAlign(LEFT);
        text('- Population data -', 10, 25);
        text(`Generation: ${this.generation}`, 10, 50);
        text(`Reached target: ${this.reachedTargetUnits} / ${this.population.length}`, 10, 75);
        text(`Crashed: ${this.crashedUnits} / ${this.population.length}`, 10, 100);

        pop();
    }

    #showBestDebug() {
        push();

        fill(230, 230, 45, 150);
        noStroke();

        textSize(18);
        textAlign(LEFT);

        let roundDistance = (int(this.bestDistance) * 10) / 10;

        text('- Best rocket data -', 10, 225);
        text(`Fitness: ${this.bestFitness}`, 10, 250);
        text(`Time: ${this.bestTime}`, 10, 275);
        text(`Distance: ${roundDistance}`, 10, 300);



        pop();
    }

    #showTarget() {

        push();

        noStroke();
        let fillColor = color(ProjectData.TargetColor);
        fillColor.setAlpha(140);
        fill(fillColor);
        ellipseMode(RADIUS);
        ellipse(this.target.x, this.target.y, ProjectData.TargetRange, ProjectData.TargetRange);

        pop();
    }

    #newGeneration() {
        this.#selection();
        this.#crossover();
        this.#mutation();

        this.time = 0;
        this.generation++;
    }

    #selection() {

        let maxFit = 0;
        this.bestTime = ProjectData.Lifespan;
        this.bestDistance = ProjectData.CanvasHeight;

        for (let i = 0; i < this.population.length; i++) {
            if (this.population[i].fitness > maxFit)
                maxFit = this.population[i].fitness;

            if (this.bestTime > this.population[i].lifeTime)
                this.bestTime = this.population[i].lifeTime;

            if (this.bestDistance > this.population[i].distance)
                this.bestDistance = this.population[i].distance;
        }

        this.bestFitness = (int(maxFit * 10)) / 10;

        for (let i = 0; i < this.population.length; i++) {
            this.population[i].fitness /= maxFit;
        }

        this.dnaMatingPool = [];

        for (let i = 0; i < this.population.length; i++) {
            const n = this.population[i].fitness * ProjectData.BestGenesStrength;
            for (let j = 0; j < n; j++) {
                this.dnaMatingPool.push(this.population[i].dna);
            }
        }
    }

    #crossover() {
        let newPopulation = [];

        this.population.sort((a, b) => (a.fitness < b.fitness) ? 1 : -1);

        for (let i = 0; i < ProjectData.EliteUnits; i++) {
            newPopulation.push(
                new Rocket(this.population[i].dna)
            );
            newPopulation[i].isElite = true;
        }

        for (let i = ProjectData.EliteUnits; i < ProjectData.PopulationSize; i++) {
            let parentA = random(this.dnaMatingPool);
            let parentB = random(this.dnaMatingPool);

            let childDNA = this.#crossoverParents(parentA, parentB);
            newPopulation.push(
                new Rocket(childDNA)
            );
        }

        this.population = newPopulation;
    }

    #crossoverParents(parentA, parentB) {

        let childGenes = [];
        let midPoint = Math.floor(random(parentA.genes.length));

        for (let i = 0; i < parentA.genes.length; i++) {
            if (i < midPoint)
                childGenes.push(parentA.genes[i]);
            else
                childGenes.push(parentB.genes[i]);
        }

        return new DNA(childGenes);
    }

    #crossoverParents2(parentA, parentB) {

        let childGenes = [];
        let firstPoint = Math.floor(random(parentA.genes.length));
        let secondPoint = Math.floor(random(parentA.genes.length));

        if (secondPoint < firstPoint) {
            let tmp = firstPoint;
            firstPoint = secondPoint;
            secondPoint = tmp;
        }

        for (let i = 0; i < parentA.genes.length; i++) {
            if (i < firstPoint)
                childGenes.push(parentA.genes[i]);
            else if (i >= firstPoint && i < secondPoint)
                childGenes.push(parentB.genes[i]);
            else
                childGenes.push(parentA.genes[i]);
        }

        return new DNA(childGenes);
    }

    #crossoverParents3(parentA, parentB) {

        let childGenes = [];

        for (let i = 0; i < parentA.genes.length; i++) {
            if (i % 2 == 0)
                childGenes.push(parentA.genes[i]);
            else
                childGenes.push(parentB.genes[i]);
        }

        return new DNA(childGenes);
    }

    #mutation() {
        for (let i = ProjectData.EliteUnits; i < this.population.length; i++) {
            for (let j = 0; j < this.population[i].dna.genes.length; j++) {

                if (random() < ProjectData.MutationChance) {
                    this.population[i].dna.genes[j] = p5.Vector.random2D();
                    this.population[i].dna.genes[j].setMag(ProjectData.MaxForce);
                }

            }
        }
    }

    #mutation2() {
        for (let i = ProjectData.EliteUnits; i < this.population.length; i++) {
            for (let j = 0; j < this.population[i].dna.genes.length; j++) {

                if (random() < ProjectData.MutationChance) {

                    let change = createVector(
                        random() / 10 - 0.01,
                        random() / 10 - 0.01
                    )

                    this.population[i].dna.genes[j].add(change);
                    this.population[i].dna.genes[j].setMag(ProjectData.MaxForce);
                }

            }
        }
    }

    #mutation3() {
        for (let i = ProjectData.EliteUnits; i < this.population.length; i++) {
            for (let j = 0; j < this.population[i].dna.genes.length; j++) {

                if (random() < ProjectData.MutationChance) {

                    let change = createVector(
                        randomGaussian(0, 0.01),
                        randomGaussian(0, 0.01)
                    )

                    this.population[i].dna.genes[j].add(change)
                    this.population[i].dna.genes[j].setMag(ProjectData.MaxForce);
                }

            }
        }
    }

    #mutation4() {
        for (let i = ProjectData.EliteUnits; i < this.population.length; i++) {
            if (random() < ProjectData.MutationChance) {
                this.population[i].dna = new DNA();
            }
        }
    }
}