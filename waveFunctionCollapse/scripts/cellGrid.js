class CellGrid {

    constructor(size, images) {
        this.size = size;
        this.images = images;

        this.grid = new Array(size);

        for (let i = 0; i < this.size; i++) {
            this.grid[i] = new Array(size);
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = new Cell();
            }
        }
    }

    collapseCell(i, j, up, right, down, left, image) {
        this.grid[i][j].collapse(up, right, down, left, image);
        this.#updateCellEntropy(i, j);
    }

    collapseCell(i, j) {
        let index = Mathematics.randIntMax(this.grid[i][j].options.length);
        this.grid[i][j].collapse(index, this.images[index]);
        this.#updateCellEntropy(i, j);
    }

    #updateCellEntropy(i, j) {
        if (i > 0) this.grid[i - 1][j].updateEntropy(SideDirection.Left);
        if (i < this.size - 1) this.grid[i + 1][j].updateEntropy(SideDirection.Right);

        if (j > 0) this.grid[i][j - 1].updateEntropy(SideDirection.Up);
        if (j < this.size - 1) this.grid[i][j + 1].updateEntropy(SideDirection.Down);
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

    printOptions() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                console.log(this.grid[i][j].options);
            }
        }
    }
}