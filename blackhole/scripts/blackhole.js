class Blackhole {
    #canRunHorizonAnimation = true;

    constructor(mass, radius, eventHorizonRadius, posX = 150, posY = 300) {
        this.mass = mass;
        this.radius = radius;
        this.eventHorizonRadius = eventHorizonRadius;
        this.tmpRadius = eventHorizonRadius;

        this.position = createVector(posX, posY);
    }

    draw() {
        push();

        stroke(0, 0, 0);
        strokeWeight(0);
        fill(0);

        circle(this.position.x, this.position.y, this.radius);

        stroke(180, 30, 140, 100);
        strokeWeight(2);
        noFill();

        circle(this.position.x, this.position.y, this.eventHorizonRadius);

        if (this.tmpRadius <= this.radius) {
            this.tmpRadius = this.eventHorizonRadius;
        } else {
            circle(this.position.x, this.position.y, this.tmpRadius);
            this.tmpRadius -= ProjectData.BlackholeSpeed;
        }

        // if (this.#canRunHorizonAnimation) {
        //     this.#canRunHorizonAnimation = false;
        //     this.#runHorizonAnimation(this.eventHorizonRadius - 2);
        // }

        pop();
    }

    update(particles) {
        for (let i = 0; i < particles.length; i++) {
            this.attract(particles[i]);
        }
    }

    #runHorizonAnimation(newRadius) {
        if (newRadius <= this.radius) {
            this.#canRunHorizonAnimation = true;
            return;
        }

        stroke(180, 30, 140, 100);
        strokeWeight(2);
        fill(0, 200, 50);

        rect(50, 50, 100, 30);
        circle(this.position.x, this.position.y, newRadius);

        setTimeout(() => {
            this.#runHorizonAnimation(newRadius - 2);
        }, 500);
    }

    // F=G(m1 m2) /r2
    attract(attractedObject) {

        let force = p5.Vector.sub(this.position, attractedObject.position);
        let distance = force.mag();
        let gravityStrength = ProjectData.GravitationConstant * this.mass * attractedObject.mass / (distance * distance);

        force.setMag(gravityStrength)

        attractedObject.applyForce(force);
    }
}