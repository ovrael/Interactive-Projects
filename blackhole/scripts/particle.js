class Particle {
    constructor(mass, xPos, yPos, randomStartVelocity) {
        this.pulled = false;
        this.tooFar = false;
        this.outside = false;

        this.mass = mass;
        this.xPos = xPos;
        this.yPos = yPos;

        this.tail = [];
        this.tailLength = ProjectData.ParticleTailLength;

        this.position = createVector(this.xPos, this.yPos);
        this.acceleration = createVector();

        this.velocity = createVector(-5, 0);
        if (randomStartVelocity) {
            this.velocity = createVector(random(5), random(5));
        }

        if (this.mass <= 0) {
            this.mass = random(0.2, 4.0);
        }

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
        stroke(240, 40, 20, 80);
        strokeWeight(1);
        noFill();
        beginShape();
        for (let i = 0; i < this.tail.length; i++) {
            vertex(this.tail[i].x, this.tail[i].y);
        }
        endShape();
    }

    #checkBoundaries() {
        // if (this.position.x < 0 || this.position.x > ProjectData.CanvasWidth) {
        //     // this.position = createVector(ProjectData.CanvasWidth - 50, ProjectData.CanvasHeight / 2 - 50);
        //     this.velocity = createVector(-5, 0);
        // }

        if (this.position.x < 0 || this.position.x > ProjectData.CanvasWidth
            || this.position.y < 0 || this.position.y > ProjectData.CanvasHeight) {
            // this.position = createVector(ProjectData.CanvasWidth - 50, ProjectData.CanvasHeight / 2 - 50);
            this.outside = true;
        }
    }

    update() {
        if (this.pulled) {
            if (this.tail.length > 0) {
                this.tail.splice(0, 1);
            }
            return;
        }

        this.#checkBoundaries();

        if (this.outside && this.tooFar) {
            this.tail = [];
            return;
        }

        this.#updatePosition();
        this.#updateTail();
    }

    applyForce(force) {
        this.velocity.add(force);
    }

    #updatePosition() {
        // this.velocity.add(this.acceleration);
        this.velocity.limit(ProjectData.MaxForce);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    #updateTail() {

        this.tail.push(this.position.copy());
        if (this.tail.length > this.tailLength) {
            this.tail.splice(0, 1);
        }
    }
}