class LightningGenerator {
    constructor() {
        this.pathPoints = [];
    }

    recreate() {

        this.pathPoints = [];
        const startEndXOffset = ProjectData.CanvasWidth * 0.15;
        this.pathPoints.push(
            new p5.Vector(random(startEndXOffset, ProjectData.CanvasWidth - startEndXOffset), 0)
        );

        const midYOffset = ProjectData.CanvasHeight / 2 * 0.1;
        this.pathPoints.push(
            new p5.Vector(random(0, ProjectData.CanvasWidth), random(ProjectData.CanvasHeight / 2 - midYOffset, ProjectData.CanvasHeight / 2 + midYOffset))
        );

        this.pathPoints.push(
            new p5.Vector(random(startEndXOffset, ProjectData.CanvasWidth - startEndXOffset), ProjectData.CanvasHeight)
        );

        this._createMidpoints(1, 0);
        this._createMidpoints(0, 0);
    }

    _createMidpoints(startIndex, counter) {

        if (counter > 3) {
            return;
        }

        if (startIndex >= this.pathPoints.length) return;

        const first = this.pathPoints[startIndex];
        const second = this.pathPoints[startIndex + 1];

        if (dist(first.x, first.y, second.x, second.y) < 20) return;


        let minX = first.x;
        let maxX = second.x;
        if (first.x > second.x) {
            minX = second.x;
            maxX = first.x;
        }

        let meanY = (first.y + second.y) / 2;
        const offsetY = 10;

        const midpointX = random(minX - 10, maxX + 10);
        const midpointY = random(meanY - offsetY, meanY + offsetY);

        let newPath = [];

        for (let i = 0; i <= startIndex; i++) {
            newPath.push(this.pathPoints[i]);
        }
        newPath.push(new p5.Vector(midpointX, midpointY));
        for (let i = startIndex + 1; i < this.pathPoints.length; i++) {
            newPath.push(this.pathPoints[i]);
        }

        this.pathPoints = newPath;
        this._createMidpoints(startIndex + 1, counter + 1);
        this._createMidpoints(startIndex, counter + 1);
    }

    draw() {

        if (this.pathPoints.length === 0) return;

        push();

        noFill();
        strokeWeight(8);
        stroke(130, 130, 210, 150);
        beginShape();
        for (let i = 0; i < this.pathPoints.length; i++) {
            vertex(this.pathPoints[i].x, this.pathPoints[i].y);
        }
        endShape();

        strokeWeight(2);
        stroke(250, 250, 250, 255);
        beginShape();
        for (let i = 0; i < this.pathPoints.length; i++) {
            vertex(this.pathPoints[i].x, this.pathPoints[i].y);
        }
        endShape();

        pop();

    }
}