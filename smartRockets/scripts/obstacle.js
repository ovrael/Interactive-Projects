class Obstacles {
    constructor() {
        this.obstacles = [];
        this.start = {};
        this.end = {};

        this.erased = false;
        this.eraseCooldown = 500;
    }

    showCurrentDrawing() {
        push();
        rectMode(CORNERS);

        let fillColor = color(ProjectData.ObstacleColor);
        fillColor.setAlpha(100);
        fill(fillColor);

        rect(
            this.start.x,
            this.start.y,
            this.end.x,
            this.end.y,
        )
        pop();
    }

    show() {
        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].show();
        }
    }

    setStart(x, y) {
        this.start.x = x;
        this.start.y = y;
    }

    setEnd(x, y) {
        this.end.x = x;
        this.end.y = y;
    }

    create() {
        this.obstacles.push(
            new Obstacle(
                this.start.x,
                this.start.y,
                this.end.x,
                this.end.y,
            )
        );
    }

    delete(x, y) {
        if (this.erased)
            return;

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            if (this.obstacles[i].isInside(x, y)) {
                this.obstacles.splice(i, 1);

                this.erased = true;
                setTimeout(() => {
                    this.erased = false;
                }, this.eraseCooldown);

                return;
            }
        }
    }

    checkHit(x, y) {
        for (let i = 0; i < this.obstacles.length; i++) {

            if (this.obstacles[i].isInside(x, y))
                return true;
        }

        return false;
    }
}

class Obstacle {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        if (x1 > x2) {
            this.x1 = x2;
            this.x2 = x1;
        }

        if (y1 > y2) {
            this.y1 = y2;
            this.y2 = y1;
        }
    }

    show() {
        push();
        rectMode(CORNERS);
        fill(ProjectData.ObstacleColor);
        noStroke();

        rect(
            this.x1,
            this.y1,
            this.x2,
            this.y2
        );

        pop();
    }

    isInside(x, y) {
        return (x > this.x1 &&
            x < this.x2 &&
            y > this.y1 &&
            y < this.y2);
    }
}