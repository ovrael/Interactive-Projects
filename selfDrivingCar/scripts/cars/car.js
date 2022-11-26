class Car {
    constructor(x, y, width, height, acceleration, controlType) {

        // BASE CAR
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // MOVEMENT
        this.speed = 0;
        this.maxReverseSpeed = -3;

        this.acceleration = acceleration;
        this.friction = ProjectData.CarFriction;

        // rotating
        this.angle = 0;
        this.angleChange = ProjectData.SteeringStrength;

        this.controls = new Controls(controlType);
        this.traveledDistance = 0;
    }

    static carConstructor(x, y, width, height, acceleration, controlType, rayCount = 8) {
        const MAX_SPEED = 5;
        switch (controlType) {
            case ControlType.User:
                return new UserCar(x, y, width, height, acceleration, controlType, MAX_SPEED);
            case ControlType.Traffic:
                return new TrafficCar(x, y, width, height, acceleration, controlType);
            case ControlType.AI:
                return new AICar(x, y, width, height, acceleration, controlType, rayCount);
        }
    }

    move() {
        // Acceleration
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }

        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        // LIMITATIONS
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        if (this.speed < this.maxReverseSpeed) {
            this.speed = this.maxReverseSpeed;
        }

        // FRICTION
        if (this.speed > 0) {
            this.speed -= this.friction;
        }

        if (this.speed < 0) {
            this.speed += this.friction;
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // TURNING
        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += this.angleChange * flip;
            }

            if (this.controls.right) {
                this.angle -= this.angleChange * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
        this.traveledDistance += Math.cos(this.angle) * this.speed;
    }
}