class DiffusionLimitedAggregationPixels {

    constructor() {

        this.grid = [];
        for (var x = 0; x < ProjectData.CanvasWidth; x++) {
            this.grid[x] = [];
            for (var y = 0; y < ProjectData.CanvasHeight; y++) {
                this.grid[x][y] = 0;
            }
        }

        this.particle = new Particle();
        this.counter = 0;
        this.iterations = 100;

        const sX = Math.round(ProjectData.CanvasWidth / 2);
        const sY = Math.round(ProjectData.CanvasHeight / 2);

        this.grid[sX][sY] = 1;
        point(sX, sY);
    }

    checkCollision(x, y) {

        if (x >= this.grid.length || x < 0 || y >= this.grid[0].length || y < 0) {
            return false;
        }

        return this.grid[x][y] === 1;
    }

    update() {
        let x = 0;
        let y = 0;
        for (let i = 0; i < this.iterations; i++) {
            // Walk around till we hit something
            do {
                // stroke(4, 0, 0);
                // point(this.particle.x, this.particle.y);

                this.particle.move();
                x = Math.round(this.particle.x);
                y = Math.round(this.particle.y);

                // stroke(4, 0, 100);
                // point(this.particle.x, this.particle.y);
            } while (!(
                this.checkCollision(x - 1, y - 1) ||
                this.checkCollision(x, y - 1) ||
                this.checkCollision(x + 1, y - 1) ||
                this.checkCollision(x - 1, y) ||
                this.checkCollision(x, y) ||
                this.checkCollision(x + 1, y) ||
                this.checkCollision(x - 1, y + 1) ||
                this.checkCollision(x, y + 1) ||
                this.checkCollision(x + 1, y + 1)
            ));

            if (x >= 0 && x < ProjectData.CanvasWidth && y >= 0 && y < ProjectData.CanvasHeight) {


                this.grid[x][y] = 1;
                stroke(this.counter / 200, 100, 50);
                point(this.particle.x, this.particle.y);

                // Spawn a new particle
                this.particle = new Particle();
                // x = Math.round(this.particle.x);
                // y = Math.round(this.particle.y);

                this.counter++;
            }
        }
    }
}