class PiApprox {

    constructor(rngSeed = null) {

        if (rngSeed != null) {
            randomSeed(rngSeed);
        }

        this.approximation = 0;
        this.approximationHistory = [];
        this.approximationGraphPoints = [];

        this.circlePoints = [];
        this.squarePoints = [];

        this.radius = ProjectData.CanvasWidth / 2;
        this.twoRadius = this.radius * 2;
        this.squaredRadius = this.radius * this.radius;

        this.graphY1 = this.twoRadius + 50;
        this.graphMidY = this.twoRadius + 100;
        this.graphY2 = this.twoRadius + 150;
    }

    #computeApproximation() {
        const circleCount = this.circlePoints.length;
        const squareCount = this.squarePoints.length;
        const sum = circleCount + squareCount;
        this.approximation = 4 * circleCount / (sum);

        if (sum % 100 == 0) {
            this.approximationHistory.push(this.approximation);
            if (this.approximationHistory.length > 40) {
                this.approximationHistory.shift();
            }
            this.#computeHistoryGraph();
        }
    }

    addPoint() {
        const point =
        {
            x: random(0, this.twoRadius),
            y: random(0, this.twoRadius),
        };

        this.#inCircle(point) ? this.circlePoints.push(point) : this.squarePoints.push(point);
        this.#computeApproximation();
    }

    addPoints(count) {
        for (let i = 0; i < count; i++) {
            this.addPoint();
        }
    }

    #inCircle(point) {
        const distance = (this.radius - point.x) * (this.radius - point.x) + (this.radius - point.y) * (this.radius - point.y);
        return distance < this.squaredRadius;
    }

    #computeHistoryGraph() {
        this.approximationGraphPoints = [];
        let max = Number.MIN_SAFE_INTEGER;
        let min = Number.MAX_SAFE_INTEGER;

        for (let i = 0; i < this.approximationHistory.length; i++) {
            const approxPoint = this.approximationHistory[i] - Math.PI;
            if (approxPoint > max)
                max = approxPoint;

            if (approxPoint < min)
                min = approxPoint;
        }

        if (min < 0)
            min *= -1;

        if (min == 0)
            min = 1e-9;
        if (max == 0)
            max = 1e-9;

        for (let i = 0; i < this.approximationHistory.length; i++) {
            const approxPoint = this.approximationHistory[i] - Math.PI;
            const graphPointY = approxPoint >= 0 ? approxPoint / max : approxPoint / min;
            const graphPointX = (i / (this.approximationHistory.length * 1.3)) * this.twoRadius;

            this.approximationGraphPoints.push(
                {
                    x: graphPointX,
                    y: graphPointY * -45 + this.graphMidY
                }
            );
        }
    }

    draw() {

        push();

        noStroke();
        fill(40, 40, 140, 15);
        circle(this.radius, this.radius, this.twoRadius);

        strokeWeight(0.5);
        stroke(30, 180, 30);
        this.#drawPoints(this.circlePoints);

        stroke(180, 30, 30);
        this.#drawPoints(this.squarePoints);

        stroke(0);
        strokeWeight(1);
        line(0, this.twoRadius, this.twoRadius, this.twoRadius);

        this.#drawApproximation();

        stroke(0);
        strokeWeight(1);
        line(0, this.twoRadius + 50, this.twoRadius, this.twoRadius + 50);

        this.#drawHistory();

        pop();
    }

    #drawPoints(points) {
        if (points.length == 0)
            return;

        points.forEach(p => {
            point(p.x, p.y);
        });
    }

    #drawApproximation() {
        fill(0);
        noStroke();
        textAlign(LEFT);
        textSize(36);
        text(this.approximation, 8, this.twoRadius + 38);

        textAlign(RIGHT);
        textSize(20);
        text(this.circlePoints.length + this.squarePoints.length, this.twoRadius - 8, this.graphY2 - 8);

        textSize(16);
        fill(130, 30, 30);
        text(this.squarePoints.length, this.twoRadius - 8, this.graphY1 + 20);
        fill(30, 130, 30);
        text(this.circlePoints.length, this.twoRadius - 8, this.graphY1 + 40);
    }

    #drawHistory() {
        stroke(25, 170, 40, 100);
        strokeWeight(1);
        line(0, this.graphMidY, this.twoRadius, this.graphMidY);

        if (this.approximationGraphPoints.length < 2)
            return;

        stroke(25, 10, 140);
        strokeWeight(1);

        for (let i = 0; i < this.approximationGraphPoints.length - 1; i++) {
            const p1 = this.approximationGraphPoints[i];
            const p2 = this.approximationGraphPoints[i + 1];
            line(p1.x, p1.y, p2.x, p2.y);
        }
    }
}