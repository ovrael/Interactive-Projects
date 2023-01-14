class Particle {
    constructor(mass, xPos, yPos) {
        this.pulled = false;

        this.mass = mass;
        this.xPos = xPos;
        this.yPos = yPos;

        this.tail = [];
        this.tailLenght = 5;

        this.position = createVector(this.xPos, this.yPos);
        this.acceleration = createVector();
        this.velocity = createVector(-5, 0);
    }

    draw() {
        push();

        strokeWeight(ProjectData.ParticleSize);
        stroke(200, 100, 50);

        point(this.position.x, this.position.y);

        this.drawTail();
        pop();
    }

    drawTail() {
        strokeWeight(1);
        noFill();
        beginShape();
        for (let i = 0; i < this.tail.length; i++) {
            vertex(this.tail[i].x, this.tail[i].y);
        }
        endShape();
    }

    #checkBoundaries() {
        if (this.position.x < 0 || this.position.x > ProjectData.CanvasWidth) {
            // this.position = createVector(ProjectData.CanvasWidth - 50, ProjectData.CanvasHeight / 2 - 50);
            this.velocity = createVector(-5, 0);
        }
    }

    update() {
        if (this.pulled)
            return;

        this.#checkBoundaries();

        // this.velocity.add(this.acceleration);
        this.velocity.limit(ProjectData.MaxForce);

        this.position.add(this.velocity);


        this.acceleration.mult(0);
        this.tail.push(this.position.copy());
        if (this.tail.length > this.tailLength) {
            this.tail.splice(0, 1);
        }
    }

    applyForce(force) {
        this.velocity.add(force);
    }
}