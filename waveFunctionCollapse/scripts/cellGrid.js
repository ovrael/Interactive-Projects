class CellGrid {

    constructor(size, images) {
        this.size = size;
        this.images = images;

        this.imageWidth = ProjectData.CanvasWidth / this.size;
        this.imageHeight = ProjectData.CanvasHeight / this.size;

        this.collapsedCells = 0;
        this.grid = new Array(size);

        for (let i = 0; i < this.size; i++) {
            this.grid[i] = new Array(size);
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = new Cell();
            }
        }
    }

    update() {
        if (this.collapsedCells >= this.size * this.size)
            return;

        this.collapseNextCell();
    }

    draw() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j].draw(i, j, this.imageWidth, this.imageHeight);
            }
        }
    }

    reset() {
        this.collapsedCells = 0;
        this.grid = new Array(size);

        for (let i = 0; i < this.size; i++) {
            this.grid[i] = new Array(size);
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = new Cell();
            }
        }
    }

    #findNextCells() {
        let nextCells = [];
        let minOptions = tiles.length; // full options

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {

                if (this.grid[i][j].collapsed)
                    continue;

                if (this.grid[i][j].options.length < minOptions) {
                    nextCells = [];
                    minOptions = this.grid[i][j].options.length;
                }

                if (this.grid[i][j].options.length == minOptions) {
                    nextCells.push({ x: i, y: j });
                }
            }
        }

        return nextCells;
    }


    collapseNextCell() {
        if (this.collapsedCells >= this.size * this.size)
            return;

        let nextCells = this.#findNextCells();
        let minCellPos = { x: 0, y: 0 };
        if (nextCells.length == this.size * this.size)
            minCellPos = { x: Mathematics.randIntMax(this.size), y: Mathematics.randIntMax(this.size) };
        else
            minCellPos = random(nextCells);

        this.collapseCell(minCellPos.x, minCellPos.y);
        this.collapsedCells++;
    }

    collapseCell(i, j) {

        if (this.collapsed) {
            console.warn(`CELL [${i}][${j}] is already collapsed, check if everything work as it should?`);
            return;
        }

        if (this.grid[i][j].options.length == 0) {
            console.log("CAN'T COLLAPSE - RESTARTING GRID");
            reset();
            return;
        }

        this.grid[i][j].collapse();
        this.#updateCellEntropy(i, j);
    }

    #updateCellEntropy(i, j) {
        if (i > 0) this.grid[i - 1][j].updateEntropy(SideDirection.Right, this.grid[i][j]);
        if (i < this.size - 1) this.grid[i + 1][j].updateEntropy(SideDirection.Left, this.grid[i][j]);

        if (j > 0) this.grid[i][j - 1].updateEntropy(SideDirection.Down, this.grid[i][j]);
        if (j < this.size - 1) this.grid[i][j + 1].updateEntropy(SideDirection.Up, this.grid[i][j]);
    }
}