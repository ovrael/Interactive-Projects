class Blackhole {
    constructor(mass, radius, eventHorizonRadius, posX = 150, posY = 300) {
        this.mass = mass;
        this.radius = radius;
        this.eventHorizonRadius = eventHorizonRadius;
        this.tmpRadius = eventHorizonRadius;
        this.animationSpeed = ProjectData.BlackholeInitialAnimationSpeed;

        this.position = createVector(posX, posY);
    }

    draw() {
        push();

        stroke(0, 0, 0);
        strokeWeight(0);
        fill(0);

        circle(this.position.x, this.position.y, this.radius);

        this.#animateHorizon();
        pop();
    }

    #animateHorizon() {
        stroke(180, 30, 140, 80);
        strokeWeight(15);
        noFill();

        // circle(this.position.x, this.position.y, this.eventHorizonRadius);

        if (this.tmpRadius <= this.radius) {
            this.tmpRadius = this.eventHorizonRadius;
            this.animationSpeed = ProjectData.BlackholeInitialAnimationSpeed;
        } else {
            circle(this.position.x, this.position.y, this.tmpRadius);
            this.tmpRadius -= this.animationSpeed;
            this.animationSpeed += ProjectData.BlackholeAnimationSpeedChange;
        }
    }

    update(particles) {
        for (let i = 0; i < particles.length; i++) {
            this.#checkParticleDistance(particles[i]);
            if ((particles[i].pulled && particles[i].tail.length == 0)
                || (particles[i].tooFar && particles[i].outside)) {

                if (ProjectData.BlackholeCanGrow)
                    this.#pullParticle(particles[i]);

                particles.splice(i, 1);
                i--;
                continue;
            }


            this.attract(particles[i]);
        }
    }

    #pullParticle(particle) {
        this.mass += particle.mass;
        this.radius += 0.1 * particle.mass;
        this.eventHorizonRadius += 0.5 * particle.mass;
    }

    #checkParticleDistance(particle) {
        let dSquared = Mathematics.distanceSquared(this.position.x, this.position.y, particle.position.x, particle.position.y);
        particle.pulled = dSquared < 16;
        particle.tooFar = dSquared > this.eventHorizonRadius * this.eventHorizonRadius
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