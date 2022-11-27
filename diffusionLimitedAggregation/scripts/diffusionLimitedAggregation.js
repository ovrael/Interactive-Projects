class DiffusionLimitedAggregation {

    constructor() {
        this.movingParticles = [];
        this.staticParticles = [];
        this.movingParticlesQuadtree = {};
        this.staticParticlesQuadtree = {};
        this.treeBoundary = new RectBoundary(0, 0, ProjectData.CanvasWidth, ProjectData.CanvasHeight);
        this.startParticle = new Particle();
        this.startParticle.setStart();
        this.farthestDistance = this.startParticle.size;
        this.staticParticles.push(this.startParticle);
    }

    #checkQuantity() {
        const offset = 0.3;
        const startPos = 0.05;
        const endPos = 0.65;
        const spawnParticleCount = 5;

        if (this.movingParticles.length < ProjectData.MaxMovingParticles && this.staticParticles.length < ProjectData.MaxStaticParticles) {
            let xSpawn = Math.random() > 0.5 ? startPos : endPos;
            let ySpawn = Math.random() > 0.5 ? startPos : endPos;

            for (let i = 0; i < spawnParticleCount; i++) {
                this.movingParticles.push(
                    new Particle(
                        Mathematics.randIntMinMax(ProjectData.CanvasWidth * xSpawn, ProjectData.CanvasWidth * (xSpawn + offset)),
                        Mathematics.randIntMinMax(ProjectData.CanvasHeight * ySpawn, ProjectData.CanvasHeight * (ySpawn + offset))
                    )
                );
            }
        }
    }

    #createQuadtrees() {
        this.movingParticlesQuadtree = new QuadTree(this.treeBoundary, 32, 5);
        for (const p of this.movingParticles) {
            this.movingParticlesQuadtree.add(
                new Point(
                    p.position.x,
                    p.position.y,
                    p
                )
            );
        }

        this.staticParticlesQuadtree = new QuadTree(this.treeBoundary, 8, 6);
        for (const p of this.staticParticles) {
            this.staticParticlesQuadtree.add(
                new Point(
                    p.position.x,
                    p.position.y,
                    p
                )
            );
        }
    }

    #getAvailableMovingParticles() {
        const nearestMovingParticlesSearch = new CircleBoundary(
            this.startParticle.position.x,
            this.startParticle.position.y,
            this.farthestDistance + 2 * ProjectData.CurrentParticleSize
        );
        const nearMovingParticles = this.movingParticlesQuadtree.query(nearestMovingParticlesSearch);

        if (ProjectData.ShowDebug)
            nearestMovingParticlesSearch.draw();

        return nearMovingParticles;
    }

    #collidedMovingParticles(particle) {
        const nearestMovingParticlesSearch = new CircleBoundary(
            particle.position.x,
            particle.position.y,
            ProjectData.CurrentParticleSize
        );
        const nearMovingParticles = this.movingParticlesQuadtree.query(nearestMovingParticlesSearch);

        for (let i = 0; i < nearMovingParticles.length; i++) {
            if (nearMovingParticles[i].userData == particle)
                continue;

            nearMovingParticles[i].userData.staticCollide = true;
        }
    }

    #checkMovingParticles() {

        for (let i = 0; i < this.movingParticles.length; i++) {
            if (!this.movingParticles[i].isStatic) {
                continue;
            }

            if (this.movingParticles[i].staticCollide) {
                this.movingParticles.splice(i, 1);
                continue;
            }

            const distance = Mathematics.distance(
                this.movingParticles[i].position.x,
                this.movingParticles[i].position.y,
                this.startParticle.position.x,
                this.startParticle.position.y
            );

            if (distance > this.farthestDistance) {
                this.farthestDistance = distance;
            }

            this.#collidedMovingParticles(this.movingParticles[i]);

            this.staticParticles.push(this.movingParticles[i]);
            this.movingParticles.splice(i, 1);
        }
    }

    #checkTouch(nearMovingParticles) {

        for (const particle of nearMovingParticles) {

            const attachSearch = new CircleBoundary(particle.x, particle.y, ProjectData.CurrentParticleSize);

            if (ProjectData.ShowDebug)
                attachSearch.draw(color(90, 220, 100));

            const nearStaticParticles = this.staticParticlesQuadtree.query(attachSearch);

            particle.userData.checkTouch(nearStaticParticles);
        }
    }

    update() {
        this.#checkQuantity();
        for (let i = 0; i < this.movingParticles.length; i++) {
            this.movingParticles[i].update();
        }

        this.#createQuadtrees();
        let nearMovingParticles = this.#getAvailableMovingParticles();

        // Do sprawdzenia

        this.#checkTouch(nearMovingParticles);
        this.#checkMovingParticles();


        if (ProjectData.ShowDebug)
            this.movingParticlesQuadtree.show();
    }

    #drawMoving() {
        push();

        stroke(114, 86, 74);
        //stroke(105, 255, 100);
        for (let i = 0; i < this.movingParticles.length; i++) {
            this.movingParticles[i].draw();
        }

        pop();
    }

    #drawStatic() {
        push();

        // stroke(255, 90, 100);
        for (let i = 0; i < this.staticParticles.length; i++) {
            this.staticParticles[i].draw();
        }

        pop();
    }

    draw() {

        this.#drawMoving();
        this.#drawStatic();

    }
}