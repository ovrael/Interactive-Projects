class TrafficCar extends Car {
    constructor(x, y, width, height, acceleration, controlType) {
        super(x, y, width, height, acceleration, controlType);
        this.maxSpeed = ProjectData.TrafficMaxSpeed;
        this.polygon = [];
        this.color = ProjectData.TrafficCarColor;

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

    updateMask() {

        const maskCtx = this.mask.getContext("2d")
        maskCtx.clearRect(0, 0, this.width, this.height);
        maskCtx.fillStyle = this.color;
        maskCtx.rect(0, 0, this.width, this.height);
        maskCtx.fill();

        maskCtx.globalCompositeOperation = "destination-atop";
        maskCtx.drawImage(this.image, 0, 0, this.width, this.height);
    }

    update() {
        this.polygon = this.#createPolygon();
        this.move();
    }

    draw(ctx) {
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