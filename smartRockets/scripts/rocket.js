class Rocket {

    constructor(dna) {
        this.position = createVector(ProjectData.CanvasWidth / 2, ProjectData.CanvasHeight - 20);
        this.acceleration = createVector();
        this.velocity = createVector();

        this.dna = dna ? dna : new DNA();
        this.fitness = 0;
        this.lifeTime = 0;

        this.crashed = false;
        this.reachedTarget = false;

        this.isElite = false;
        this.distance = ProjectData.CanvasHeight;
    }

    #checkWalls() {

        if (this.crashed)
            return;

        if (this.position.x < 0 || this.position.x > ProjectData.CanvasWidth)
            this.crashed = true;
        if (this.position.y < 0 || this.position.y > ProjectData.CanvasHeight)
            this.crashed = true;
    }

    #checkObstacles() {

        if (this.crashed)
            return;

        this.crashed = obstacles.checkHit(this.position.x, this.position.y);
    }

    #checkTarget() {

        if (this.reachedTarget)
            return;

        if (this.distance < ProjectData.TargetRange) {
            this.reachedTarget = true;
        }
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    update(time, target) {

        this.#computeFitness();
        this.#checkObstacles();
        this.#checkWalls();
        if (this.crashed) {
            this.lifeTime++;
            return;
        }

        this.#checkTarget();
        if (this.reachedTarget) {
            this.position = createVector(
                target.x,
                target.y
            );
            this.distance = 0;
            return;
        }
        this.lifeTime++;

        this.distance = Mathematics.distance(this.position.x, this.position.y, target.x, target.y);

        this.applyForce(this.dna.genes[time]);
        this.velocity.add(this.acceleration);
        this.velocity.limit(ProjectData.MaxVelocity);

        this.position.add(this.velocity);

        this.acceleration.mult(0);
    }

    show() {
        push();

        translate(this.position.x, this.position.y);

        if (ProjectData.ShowRocketDebug) {
            fill(240, 240, 100);
            textSize(14);
            const round = 10000;
            let roundFitness = int(this.fitness * round) / round;
            text(roundFitness, 0, 0);
        }

        rotate(this.velocity.heading() + PI / 2);
        rectMode(CENTER)
        noStroke();

        let fillColor = this.isElite ? color(ProjectData.EliteRocketColor) : color(ProjectData.RocketColor);
        this.isElite ? fillColor.setAlpha(150) : fillColor.setAlpha(90);
        fill(fillColor);

        triangle(
            0, -ProjectData.RocketHeight / 2,
            -ProjectData.RocketWidth / 2, ProjectData.RocketHeight / 2,
            ProjectData.RocketWidth / 2, ProjectData.RocketHeight / 2
        );


        pop();
    }

    #computeFitness() {


        let fitnessDistance = this.distance > 0 ? this.distance : ProjectData.Epsilon;
        if (this.lifeTime == ProjectData.Lifespan) {
            this.crashed = true;
        }

        // this.fitness = 1 / distance;
        // this.fitness = 1 / distance + 1 / (this.lifeTime / (ProjectData.Lifespan + 1));
        this.fitness = 1 / (ProjectData.DistanceFactor * fitnessDistance + ProjectData.SpeedFactor * this.lifeTime);
        this.fitness *= ProjectData.FitnessFactor;

        if (this.crashed) {
            this.fitness /= 10;
            return;
        }

        if (this.reachedTarget) {
            this.fitness *= 3;
            return;
        }

        // if (this.crashed) {
        //     this.fitness *= 10;
        //     return;
        // }
        // this.fitness = 1 / distance + (this.lifeTime / ProjectData.Lifespan) * ProjectData.LifetimeFactor;
        // console.log(this.fitness, distance, this.lifeTime);
    }
}