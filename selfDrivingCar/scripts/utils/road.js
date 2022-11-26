class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x;

        width = this.#calculateWidth(width);
        this.width = width;

        // LANES
        this.laneCount = laneCount;
        this.left = x - width / 2;
        this.right = x + width / 2;
        this.laneCenters = this.#getLanesCenters();

        const INFINITY = 1000000;
        this.top = -INFINITY;
        this.bottom = INFINITY;

        // BORDERS
        const topLeft = { x: this.left, y: this.top };
        const bottomLeft = { x: this.left, y: this.bottom };

        const topRight = { x: this.right, y: this.top };
        const bottomRight = { x: this.right, y: this.bottom };

        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight],
        ];
    }

    #getLanesCenters() {
        let centers = [];
        for (let i = 0; i < this.laneCount; i++) {
            centers.push(this.getLaneCenter(i))
        }

        return centers;
    }

    #calculateWidth(width) {

        const maxPercentage = 0.985;

        if (width > 1000) {
            return width *= maxPercentage;
        }

        let percentage = 0.9;
        for (let i = 0; i <= width; i += 200) {
            percentage += 0.015;
        }
        if (percentage >= 1.0) percentage = maxPercentage;

        return width * percentage;
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        return this.left + laneWidth / 2 + Math.min(laneIndex, this.laneCount - 1) * laneWidth;
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        for (var i = 1; i <= this.laneCount - 1; i++) {
            const x = lerp(
                this.left,
                this.right,
                i / this.laneCount
            )

            ctx.setLineDash([20, 20]);

            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    }
}