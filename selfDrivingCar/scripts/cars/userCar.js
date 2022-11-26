class UserCar extends Car {
    constructor(x, y, width, height, acceleration, controlType, maxSpeed) {
        super(x, y, width, height, acceleration, controlType);
        this.maxSpeed = maxSpeed;
        this.damaged = false;

        this.sensor = new Sensor(this);
    }

    update(roadBorders, traffic) {

        if (!this.damaged) {
            this.move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#checkDamage(roadBorders, traffic);
        }

        this.sensor.update(roadBorders, traffic);
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

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }

        if (this.damaged) {
            ctx.fillStyle = "gray";
        } else {
            ctx.fillStyle = "#822b24"
        }
        ctx.fill();

        this.sensor.draw(ctx);
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