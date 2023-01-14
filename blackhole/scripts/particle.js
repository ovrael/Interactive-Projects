class Particle {
    constructor(mass) {
        this.mass = mass;
        this.position = createVector(ProjectData.CanvasWidth - 50, ProjectData.CanvasHeight / 2 - 50);
        this.acceleration = createVector();
        this.velocity = createVector(-5, 0);
    }

    draw() {
        push();

        strokeWeight(10);
        stroke(200, 100, 50);

        point(this.position.x, this.position.y);

        pop();
    }

    #checkBoundaries() {
        if (this.position.x < 0 || this.position.x > ProjectData.CanvasWidth) {
            this.position = createVector(ProjectData.CanvasWidth - 50, ProjectData.CanvasHeight / 2 - 50);
            this.velocity = createVector();
        }
    }

    update() {
        this.#checkBoundaries();

        // this.velocity.add(this.acceleration);
        this.velocity.limit(ProjectData.MaxForce);

        this.position.add(this.velocity);


        this.acceleration.mult(0);
    }

    applyForce(force) {
        this.velocity.add(force);
    }
}