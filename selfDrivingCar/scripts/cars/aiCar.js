class AICar extends Car {
    constructor(x, y, width, height, acceleration, controlType, sensorRayCount) {
        super(x, y, width, height, acceleration, controlType);
        this.startX = Number(x);
        this.startY = Number(y);
        this.maxSpeed = ProjectData.AIMaxSpeed;
        this.damaged = false;
        this.broken = false;
        this.color = ProjectData.AICarColor;
        this.isElite = false;

        this.polygon = this.#createPolygon();

        this.sensor = new Sensor(this, sensorRayCount);
        this.neuralNetwork = new NeuralNetwork(
            [this.sensor.rayCount, 16, 8, 4]
        );

        this.fitnessValue = 0;
        this.beginning = true;
        this.stopPenaltyTimeout = null;
        this.oldX;

        setTimeout(() => {
            this.beginning = false;

            if (this.y > this.startY - 250) {
                this.damaged = true;
            };
        }, 5000);

        this.image = new Image();
        this.image.src = "img/aiCar.png";

        this.mask = document.createElement("canvas");
        this.mask.width = width;
        this.mask.height = height;

        const maskCtx = this.mask.getContext("2d")
        this.image.onload = () => {
            maskCtx.fillStyle = this.color;
            maskCtx.rect(0, 0, this.width, this.height);
            maskCtx.fill();

            maskCtx.globalCompositeOperation = "destination-atop";
            maskCtx.drawImage(this.image, 0, 0, this.width, this.height);
        }
    }

    update(roadBorders, traffic, roadLanes, bestCar) {

        if (!this.damaged) {
            this.move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#checkDamage(roadBorders, traffic);
        }

        this.sensor.update(roadBorders, traffic);
        this.#moveAI();
        this.#checkFitness(roadLanes);


        if (this.speed < (ProjectData.AIMaxSpeed - 1) && !this.beginning) {
            this.stopPenaltyTimeout = setTimeout(() => {
                if (this.speed < ProjectData.AIMaxSpeed)
                    this.damaged = true;
            }, 5000);
        } else {
            clearTimeout(this.stopPenaltyTimeout);
            this.stopPenaltyTimeout = null;
        }

        if ((this.y > bestCar.y + window.innerHeight * 0.8) && !this.beginning) {
            this.damaged = true;
        }
    }

    updateMask() {

        const maskCtx = this.mask.getContext("2d")
        maskCtx.clearRect(0, 0, this.width, this.height);
        maskCtx.fillStyle = this.color;
        maskCtx.rect(0, 0, this.width, this.height);
        maskCtx.fill();

        maskCtx.globalCompositeOperation = "destination-atop";
        maskCtx.drawImage(this.image, 0, 0, this.width, this.height);
    }

    #moveAI() {
        const offsets = this.sensor.readings.map(s => s == null ? 0 : 1 - s.offset);
        const outputs = NeuralNetwork.feedForward(offsets, this.neuralNetwork);

        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
    }

    #checkFitness(roadLanes) {

        let addFitness = 1;
        // this.fitnessValue = 2 * this.traveledDistance;
        if (this.damaged) {

            addFitness = -0.01;

            if (this.beginning) {
                addFitness = -1;
            }

            if (this.y > this.startY) {
                addFitness = -5;
            }
        }

        // let onLane = false;
        // for (let i = 0; i < roadLanes.length; i++) {
        //     const lane = roadLanes[i];
        //     if (this.x == lane && this.x != this.startX) {
        //         onLane = true;
        //         break;
        //     }
        // }
        // addFitness *= onLane ? 2 : 0.2;


        this.fitnessValue += addFitness;
    }

    #checkDamage(roadBorders, traffic) {
        for (var i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }

        for (var i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    draw(ctx, drawSensors = false) {
        if (drawSensors) {
            this.sensor.draw(ctx);
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        if (!this.damaged) {
            ctx.drawImage(this.mask, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = "multiply";
        }
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

        ctx.restore();
    }

    #createPolygon() {
        const points = [];
        const radius = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);


        points.push({
            x: this.x - Math.sin(this.angle - alpha) * radius,
            y: this.y - Math.cos(this.angle - alpha) * radius
        });

        points.push({
            x: this.x - Math.sin(this.angle + alpha) * radius,
            y: this.y - Math.cos(this.angle + alpha) * radius
        });

        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius
        });

        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius
        });


        return points;
    }
}