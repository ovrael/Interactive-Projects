class Unit {
    constructor(x = -1, y = -1) {
        this.size = ProjectData.UnitRandomSize ? random(ProjectData.UnitMinSize, ProjectData.UnitMaxSize) : ProjectData.UnitSize;
        this.color = ProjectData.UnitRandomColor ? randColor() : ProjectData.UnitColor;

        this.position = createVector(random(width), random(height));
        if (x >= 0 && y >= 0) {
            this.position.set(x, y);
        }

        this.acceleration = createVector();

        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(
            random(
                random(-ProjectData.UnitMaxSpeed / 2, ProjectData.UnitMaxSpeed / 2),
                random(-ProjectData.UnitMaxSpeed / 2, ProjectData.UnitMaxSpeed / 2)
            )
        );

        this.tail = this.createTail();
    }

    show(isDebuging) {

        let showColor = this.color;
        if (ProjectData.ColorBasedOnSpeed && !isDebuging) {

            const speed = this.velocity.mag();
            showColor = lerpColor(
                color(ProjectData.MinSpeedColor.red, ProjectData.MinSpeedColor.green, ProjectData.MinSpeedColor.blue),
                color(ProjectData.MaxSpeedColor.red, ProjectData.MaxSpeedColor.green, ProjectData.MaxSpeedColor.blue),
                map(speed, ProjectData.UnitMinSpeed, ProjectData.UnitMaxSpeed, 1, 0));
        }

        stroke(showColor);

        if (ProjectData.UnitFill)
            fill(showColor);
        else
            noFill();

        this.showBody();

        if (ProjectData.DrawTail)
            this.showTail();
    }

    showBody() {

        if (ProjectData.UnitType == 'triangle') {

            const angle = this.velocity.heading();
            const anglePlus = 2.5;

            triangle(
                this.position.x + Math.cos(angle) * this.size, this.position.y + Math.sin(angle) * this.size,
                this.position.x + Math.cos(angle + anglePlus) * this.size, this.position.y + Math.sin(angle + anglePlus) * this.size,
                this.position.x + Math.cos(angle - anglePlus) * this.size, this.position.y + Math.sin(angle - anglePlus) * this.size
            );


        } else if (ProjectData.UnitType == 'point') {
            strokeWeight(this.size);
            point(this.position.x, this.position.y);
        }
    }

    createTail() {
        let tail = [];
        for (let i = 0; i < 10; i++) {
            let y = this.position.y;
            tail.push(
                new Point(this.position.x, y)
            );
        }

        return tail;
    }

    showTail() {
        strokeWeight(1);

        for (let i = 0; i < this.tail.length - 1; i++) {
            if (Math.abs(this.tail[i].x - this.tail[i + 1].x) < 100
                && Math.abs(this.tail[i].y - this.tail[i + 1].y) < 100)
                line(this.tail[i].x, this.tail[i].y, this.tail[i + 1].x, this.tail[i + 1].y);
        }
    }

    updateTail() {
        this.tail.pop();

        const angle = this.velocity.heading();

        if (ProjectData.UnitType == 'triangle') {
            this.tail.unshift(new Point(this.position.x - Math.cos(angle) * this.size, this.position.y - Math.sin(angle) * this.size));
        } else if (ProjectData.UnitType == 'point') {
            this.tail.unshift(new Point(this.position.x - Math.cos(angle) * this.size / 2, this.position.y - Math.sin(angle) * this.size / 2));
        }
    }

    update() {

        this.velocity.add(this.acceleration);
        this.velocity.limit(ProjectData.UnitMaxSpeed);

        if (ProjectData.UseMass) {
            const mass = map(this.size, ProjectData.UnitMinSize, ProjectData.UnitMaxSize, 1.4, 1);
            this.velocity.mult(mass);
        }

        this.position.add(this.velocity);


        if (ProjectData.DrawTail)
            this.updateTail();

        this.checkEdges();
        this.acceleration.set(0, 0);

        // if (this.velocity.mag() < 0.01) {
        //     this.velocity = new Unit(this.position.x, this.position.y).velocity;
        // }
    }

    checkEdges() {

        if (ProjectData.HardBoundary) {

            if (this.position.x >= width || this.position.x <= 0) {
                this.velocity.x += 3 * Math.sign(this.velocity.x);
                this.velocity.x *= -1.5;

            }

            if (this.position.y >= height || this.position.y <= 0) {
                this.velocity.y += 3 * Math.sign(this.velocity.y);
                this.velocity.y *= -1.5;
            }
        }
        else {

            if (this.position.x < 0)
                this.position.x = width - abs(this.position.x);
            if (this.position.y < 0)
                this.position.y = height - abs(this.position.y);

            this.position.x %= width;
            this.position.y %= height;
        }
    }

    adjust(alignUnits, cohesionUnits, separationUnits) {
        let alignment = this.align(alignUnits);
        let cohesion = this.cohesion(cohesionUnits);
        let separation = this.separation(separationUnits);

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);

        if (ProjectData.UnitRandomMove) {

            if (random() < 0.3) {
                this.acceleration.add(
                    createVector(
                        random(-0.5, 0.5),
                        random(-0.5, 0.5)
                    )
                );
            }
        }

        // this.acceleration.limit(ProjectData.UnitMaxSpeed);
    }

    computeDistanceSquared(otherUnit) {
        return (this.position.x - otherUnit.position.x) * (this.position.x - otherUnit.position.x) + (this.position.y - otherUnit.position.y) * (this.position.y - otherUnit.position.y);
    }

    // VELOCITY
    /**
     * 
     * @param {Array<Point>} nearUnits 
     * @returns 
     */
    align(nearUnits) {

        let force = createVector();

        if (nearUnits.length <= 1)
            return force;

        for (const other of nearUnits) {
            force.add(other.userData.velocity);
        }

        force.div(nearUnits.length);
        force.setMag(ProjectData.UnitMaxSpeed);
        force.sub(this.velocity);
        force.limit(ProjectData.UnitMaxForce);
        force.mult(ProjectData.UnitAlignForce);
        return force;
    }

    // POSITION
    // Boids try to fly towards the centre of mass of neighbouring boids.
    cohesion(nearUnits) {

        let force = createVector();

        if (nearUnits.length <= 1)
            return force;

        for (const other of nearUnits) {
            force.add(other.userData.position);
        }

        force.div(nearUnits.length);
        force.sub(this.position);
        force.setMag(ProjectData.UnitMaxSpeed);
        force.sub(this.velocity);
        force.limit(ProjectData.UnitMaxForce);
        force.mult(ProjectData.UnitCohesionForce);

        return force;
    }

    // POSITION
    // Boids try to keep a small distance away from other objects (including other boids).
    separation(nearUnits) {

        let force = createVector();

        if (nearUnits.length <= 1)
            return force;

        for (const other of nearUnits) {
            let difference = p5.Vector.sub(this.position, other.userData.position);
            const distSq = this.computeDistanceSquared(other.userData);

            if (distSq > 0)
                difference.div(distSq);

            force.add(difference);
        }

        force.div(nearUnits.length);
        force.setMag(ProjectData.UnitMaxSpeed);
        force.sub(this.velocity);
        force.limit(ProjectData.UnitMaxForce);
        force.mult(ProjectData.UnitSeparationForce);

        return force;
    }
}