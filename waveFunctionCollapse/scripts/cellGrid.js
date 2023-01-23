class CellGrid {
    constructor(size) {
        this.size = size;
        this.grid = [];

        for (let i = 0; i < this.size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = new Cell();
            }
        }
    }

    draw() {
        const imageWidth = ProjectData.CanvasWidth / this.size;
        const imageHeight = ProjectData.CanvasHeight / this.size;

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j].collapsed) {
                    this.grid[i][j].draw(i, j, imageWidth, imageHeight);
                }
                else {
                    fill(0);
                    rect(i * imageWidth, j * imageHeight, imageWidth, imageHeight);
                }
            }
        }
    }
}