class Player {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;

        this.range = 7;
    }

    update() {
        let dx = random(-2, 2);
        let dy = random(-2, 2);

        if (this.x + this.range + dx >= ProjectData.CanvasWidth)
            dx *= -1;

        if (this.x - this.range + dx < 0)
            dx *= -1;

        if (this.y + this.range + dy >= ProjectData.CanvasHeight)
            dy *= -1;

        if (this.y - this.range + dy < 0)
            dy *= -1;

        this.x += dx;
        this.y += dy;
    }

    draw() {
        push();

        noStroke();
        fill(this._getColor());

        circle(this.x, this.y, this.range * 2);

        pop();
    }

    checkCollisions(other) {
        if (dist(this.x, this.y, other.x, other.y) > this.range * 2) {
            return;
        }

        switch (this.type) {
            case "rock":
                switch (other.type) {
                    case "paper":
                        this.type = "paper";
                        break;

                    case "scissors":
                        other.type = "rock";
                        break;
                }

            case "paper":
                switch (other.type) {
                    case "scissors":
                        this.type = "scissors";
                        break;

                    case "rock":
                        other.type = "paper";
                        break;
                }

            case "scissors":
                switch (other.type) {
                    case "rock":
                        this.type = "rock";
                        break;

                    case "paper":
                        other.type = "scissors";
                        break;
                }
        }

        switch (other.type) {
            case "rock":
                if (this.type === "paper")
                    other.type = "paper";

            case "paper":
                if (this.type === "scissors")
                    other.type = "scissors";

            case "scissors":
                if (this.type === "rock")
                    other.type = "rock";
        }
    }


    _getColor() {
        switch (this.type) {
            case "rock":
                return [158, 155, 155];

            case "paper":
                return [235, 235, 235];

            case "scissors":
                return [201, 10, 10];

            default:
                return [158, 155, 155];
        }
    }
}