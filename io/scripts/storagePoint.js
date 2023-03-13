const StoragePointType = ["send", "take"]

class StoragePoint {
    constructor(x, y, vehiclesCount) {
        this.x = x;
        this.y = y;
        this.type = random(StoragePointType);
        this.visited = new Array(vehiclesCount).fill(false);
    }

    draw() {

        switch (this.type) {
            case "send":
                strokeWeight(8);
                stroke(ProjectData.SendColor);
                point(this.x, this.y);
                break;

            case "take":
                strokeWeight(8);
                stroke(ProjectData.TakeColor);
                point(this.x, this.y);
                break;

            case "warehouse":
                noStroke()
                fill(ProjectData.WarehouseColor);
                rect(this.x, this.y, 28, 10);
                break;

            default:
                break;
        }

    }
}

const CarColors = [
    [255, 40, 30],
    [30, 255, 20],
    [20, 30, 255]
]

class Car {
    constructor(startX, startY, id) {
        this.x = startX;
        this.y = startY;
        this.id = id;
        this.color = random(CarColors);
        this.route = [];

        this.w = 10;
        this.h = 4;
    }

    draw() {

        push();

        fill(0);
        circle(this.x - 4, this.y + this.h / 2 + 2, 4);
        circle(this.x + 4, this.y + this.h / 2 + 2, 4);

        fill(this.color);
        rect(this.x, this.y, 18, 6);

        pop();
    }

    drawRoute() {

        if (this.route.length == 0)
            return;

        push();

        strokeWeight(1.5);
        stroke(this.color);

        line(this.x, this.y, this.route[0].x, this.route[0].y);

        for (let i = 0; i < this.route.length - 1; i++) {
            const p1 = this.route[i];
            const p2 = this.route[i + 1];

            line(p1.x, p1.y, p2.x, p2.y);
        }

        pop();
    }

    addToRoad(point) {
        this.route.push(
            {
                x: point.x,
                y: point.y
            }
        )
    }

    generateRoute(storagePoints) {


        let points = this.getUnvisitedPoints(storagePoints);
        let fastEnd = false;

        while (points.length > 0 && !fastEnd) {

            const randPoint = random(points);
            randPoint.visited[this.id] = true;

            this.addToRoad(randPoint);

            fastEnd = random(0, 1000) < 200;
            points = this.getUnvisitedPoints(storagePoints);
        }

        this.addToRoad(this);
    }

    getUnvisitedPoints(storagePoints) {

        let points = [];
        for (let storagePoint of storagePoints) {
            if (!storagePoint.visited[this.id])
                points.push(storagePoint);
        }

        return points;
    }
}