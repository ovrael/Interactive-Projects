class Particle {
    constructor(x = ProjectData.CanvasWidth / 2, y = ProjectData.CanvasHeight / 2) {
        this.position = createVector(x, y);
        this.size = ProjectData.StartParticleSize;
        this.colorAngle = 115;
        this.staticConnections = 0;
        this.staticCollide = false;

        this.acceleration = createVector(
            Mathematics.randFloatMinMax(0.01, 0.05),
            Mathematics.randFloatMinMax(0.01, 0.05)
        );
        this.velocity = createVector();

        if (Math.random() > 0.5) {
            this.acceleration.x *= -1;
        }
        if (Math.random() > 0.5) {
            this.acceleration.y *= -1;
        }

        this.isStatic = false;
    }

    #setColor(newColor) {

        this.colorAngle = newColor;

        if (this.colorAngle >= 359)
            this.colorAngle -= 359;
    }

    #setSize(newSize) {
        this.size = newSize;

        if (this.size < ProjectData.MinimumParticleSize)
            this.size = ProjectData.MinimumParticleSize;

        if (this.size < ProjectData.CurrentParticleSize)
            ProjectData.CurrentParticleSize = this.size;
    }

    setStatic(previousSize, previousColor) {
        this.isStatic = true;

        this.velocity.mult(0);
        this.acceleration.mult(0);

        this.#setSize(previousSize * ProjectData.ShrinkChange);
        this.#setColor(previousColor + ProjectData.ColorChange);
    }

    setStart() {
        this.setStatic(ProjectData.StartParticleSize * (1 / ProjectData.ShrinkChange), -ProjectData.ColorChange);
    }

    #checkBoundaries() {

        if ((this.position.x + this.size / 2 >= ProjectData.CanvasWidth) || (this.position.x - this.size / 2 <= 0)) {
            this.acceleration.x *= -1;
            this.velocity.x *= -1;
        }

        if ((this.position.y + this.size / 2 >= ProjectData.CanvasHeight) || (this.position.y - this.size / 2 <= 0)) {
            this.acceleration.y *= -1;
            this.velocity.y *= -1;
        }
    }

    #checkBoundaries2() {
        if (this.position.x + this.size / 2 >= ProjectData.CanvasWidth) {
            this.position.x = this.size / 2;
        }

        if (this.position.x - this.size / 2 <= 0) {
            this.position.x = ProjectData.CanvasWidth - this.size / 2;
        }

        if (this.position.y + this.size / 2 >= ProjectData.CanvasHeight) {
            this.position.y = this.size / 2;
        }

        if (this.position.y - this.size / 2 <= 0) {
            this.position.y = ProjectData.CanvasHeight - this.size / 2;
        }
    }

    canAttachNewParticles() {
        return this.staticConnections < ProjectData.MaxStaticConnections;
    }

    checkTouch(nearStaticParticles) {

        for (let i = 0; i < nearStaticParticles.length; i++) {
            const other = nearStaticParticles[i].userData;

            // if (!other.canAttachNewParticles())
            //     continue;

            this.setStatic(other.size, other.colorAngle);
            other.staticConnections++;
        }
    }

    attachParticles(nearParticles) {
        for (let i = 0; i < nearParticles.length; i++) {
            if (!this.canAttachNewParticles())
                return;

            this.staticConnections++;
            nearParticles[i].userData.setStatic(this.size, this.colorAngle);
        }
    }

    update() {

        if (this.isStatic)
            return;

        if (ProjectData.RandomWalkers) {

            this.velocity = createVector(
                Mathematics.randFloatMinMax(this.size / 2 - 2, this.size / 2 + 2),
                Mathematics.randFloatMinMax(this.size / 2 - 2, this.size / 2 + 2)
            );

            if (Math.random() > 0.5) {
                this.velocity.x *= -1;
            }
            if (Math.random() > 0.5) {
                this.velocity.y *= -1;
            }
        }
        else {

            this.velocity.add(this.acceleration);
            this.velocity.limit(ProjectData.MaxProjectileSpeed);
        }

        this.position.add(this.velocity);

        // this.acceleration.mult(0);

        // this.#checkBoundaries();
        this.#checkBoundaries2();
    }

    draw() {
        push();
        if (this.isStatic)
            strokeWeight(this.size);
        else
            strokeWeight(ProjectData.CurrentParticleSize);

        stroke(this.colorAngle, 86, 74);
        point(this.position.x, this.position.y);
        pop();
    }
}