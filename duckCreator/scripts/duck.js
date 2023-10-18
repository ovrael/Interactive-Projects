class Duck {

    // HEAD
    static #headWidth = 60;
    static #headHeight = 20;
    static #headLength = 80;

    // BODY
    static #bodyColor = [240, 240, 240];
    static #bodyWidth = 60;
    static #bodyHeight = 20;
    static #bodyLength = 80;

    // TAIL
    static #tailWidth = 60;
    static #tailHeight = 20;
    static #tailLength = 80;
    static #tailAngle = (30 / 180) * Math.PI; // IN RADIANS

    // LEGS
    static #legsColor = [250, 200, 50];
    static #legsFingerColor = [210, 140, 0];
    static #legsSpacing = 40;
    static #legsHeight = 30;
    static #legsFingerLength = 20;
    static #legsFingerAngle = (40 / 180) * Math.PI; // IN RADIANS
    static #legsRadius = 2;
    static change = 1;

    // OTHER
    static #platformHeight = 10;

    static #drawSpecificPart = true;

    static toggleDrawing() {
        this.#drawSpecificPart = !this.#drawSpecificPart;
    }

    static init() {

        this.#bodyWidth = random(50, 80);
        this.#bodyHeight = random(20, 80);
        this.#bodyLength = random(60, 120);

        this.#headWidth = random(this.#bodyWidth * 0.7, this.#bodyWidth * 0.8);
        this.#headHeight = random(this.#bodyHeight * 0.6, this.#bodyHeight * 0.8);
        this.#headLength = random(this.#headWidth * 0.9, this.#headWidth * 1.1);

        this.#tailWidth = random(20, 30);
        this.#tailHeight = random(3, 6);
        this.#tailLength = random(20, 40);
        this.#tailAngle = random(-PI / 4, -PI / 12);

    }

    static draw() {

        // if (this.#legsHeight >= 10)
        //     this.#legsHeight -= 1;

        this.#drawHead();

        if (this.#drawSpecificPart)
            this.#drawBody();
        this.#drawTail();

        this.#drawLegs();
    }

    static #drawHead() {
        push();

        translate(0, -(this.#legsHeight + this.#bodyHeight / 2 + this.#platformHeight), 0);
        translate(0, -(this.#headHeight + this.#bodyHeight) / 2, this.#bodyLength * 0.4);
        fill(this.#bodyColor);
        strokeWeight(0.5);

        box(this.#headWidth, this.#headHeight, this.#headLength);

        pop();
    }

    static #drawBody() {

        push();
        translate(0, -(this.#legsHeight + this.#bodyHeight / 2 + this.#platformHeight), 0);
        fill(this.#bodyColor);
        strokeWeight(0.5);

        box(this.#bodyWidth, this.#bodyHeight, this.#bodyLength);

        pop();
    }

    static #drawTail() {
        push();
        strokeWeight(0.5);

        // Translate at body height
        translate(0, -(this.#legsHeight + this.#bodyHeight - this.#tailHeight / 2 + this.#platformHeight), 0);
        // Translate at body end
        translate(0, 0, -(this.#bodyLength + this.#tailLength) / 2);
        // Translate for start tail rotation
        translate(0, this.#tailLength / 3, this.#tailLength);

        // Rotate around tail start
        rotateX(this.#tailAngle);

        // // Rever rotation translation
        translate(0, 0, -this.#tailLength);


        fill(this.#bodyColor);
        strokeWeight(0.3);

        box(this.#tailWidth, this.#tailHeight, this.#tailLength);

        pop();
    }

    static #drawLegs() {
        push();
        translate(0, -(this.#platformHeight + this.#legsHeight / 2) - 1, 0);

        // translate(0, -(10 + this.#legsHeight / 2) - 1, -20);
        noStroke();
        fill(this.#legsColor);

        translate(-this.#legsSpacing / 2, 0, 0);
        this.#drawLeg();

        translate(this.#legsSpacing, 0, 0);
        this.#drawLeg();

        pop();
    }

    static #drawLeg() {

        const halfLegsHeight = this.#legsHeight / 2;

        cylinder(this.#legsRadius, this.#legsHeight, 10, 1);

        const leftFinger = Tools.rotatePoint(0, this.#legsFingerLength, this.#legsFingerAngle);
        const rightFinger = Tools.rotatePoint(0, this.#legsFingerLength, -this.#legsFingerAngle);
        fill(this.#legsColor);

        push();
        beginShape(LINES);
        vertex(-this.#legsRadius, halfLegsHeight, 0);

        // LEFT FINGER
        vertex(leftFinger.x, halfLegsHeight, leftFinger.y);

        // CENTER FINGER
        quadraticVertex(leftFinger.x / 2, halfLegsHeight, this.#legsFingerLength * 0.3, 0, halfLegsHeight, this.#legsFingerLength);

        // RIGHT FINGER
        quadraticVertex(rightFinger.x / 2, halfLegsHeight, this.#legsFingerLength * 0.3, rightFinger.x, halfLegsHeight, rightFinger.y)

        vertex(this.#legsRadius, halfLegsHeight, 0);
        vertex(-this.#legsRadius, halfLegsHeight, 0);
        endShape(CLOSE);

        strokeWeight(2);
        stroke(this.#legsFingerColor);
        line(0, halfLegsHeight, 0, leftFinger.x, halfLegsHeight, leftFinger.y)
        line(0, halfLegsHeight, 0, 0, halfLegsHeight, this.#legsFingerLength)
        line(0, halfLegsHeight, 0, rightFinger.x, halfLegsHeight, rightFinger.y)

        pop();
    }

}