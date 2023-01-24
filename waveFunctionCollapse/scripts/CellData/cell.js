class Cell {

    constructor() {
        this.sides = [];
        this.image = null;

        this.collapsed = false;
        this.options = [];
        for (let i = 0; i < tiles.length; i++) {
            this.options[i] = i;
        }
    }

    draw(i, j, imageWidth, imageHeight) {
        if (this.collapsed) {
            image(this.image, i * imageWidth, j * imageHeight, imageWidth, imageHeight);
        }
        else {

            push();
            stroke(200, 100, 50);
            fill(0);
            rect(i * imageWidth, j * imageHeight, imageWidth, imageHeight);
            pop();

            fill(200, 100, 50);
            textSize(0.5 * ProjectData.CanvasWidth / ProjectData.GridSize);
            textAlign(CENTER, CENTER);
            text(this.options.length, i * imageWidth + imageWidth / 2, j * imageHeight + imageHeight / 2);
        }
    }

    collapse() {

        let index = Mathematics.randIntMax(this.options.length);
        let option = tiles[this.options[index]];

        for (let i = 0; i < option.sides.length; i++) {
            this.sides[i] = option.sides[i];
        }
        this.image = option.image;

        this.options = null;
        this.collapsed = true;
    }

    updateEntropy(sideDirection, otherCell) {

        if (this.collapsed)
            return;

        const step = 2;
        const side = otherCell.sides[(sideDirection + step) % otherCell.sides.length];

        for (let i = 0; i < this.options.length; i++) {
            if (!this.#checkFit(side, tiles[this.options[i]].sides[sideDirection])) {
                this.options.splice(i, 1);
                i--;
            }
        }
    }

    #checkFit(thisSide, otherSide) {
        for (let i = 0; i < SideRules[thisSide].length; i++) {
            if (SideRules[thisSide][i] == otherSide)
                return true;
        }

        return false;
    }
}