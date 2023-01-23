class Cell {

    constructor() {
        this.up = null;
        this.right = null;
        this.down = null;
        this.left = null;
        this.image = null;

        this.collapsed = false;
        this.options = MadeCells;
    }

    collapse(up, right, down, left, image) {
        this.up = up;
        this.right = right;
        this.down = down;
        this.left = left;
        this.image = image;

        this.options = null;
        this.collapsed = true;
    }

    collapse(optionIndex, image) {
        optionIndex = optionIndex < 0 ? Mathematics.randIntMax(this.options.length) : optionIndex;
        let option = this.options[optionIndex];

        this.up = option.up;
        this.right = option.right;
        this.down = option.down;
        this.left = option.left;
        this.image = image;

        this.options = null;
        this.collapsed = true;
    }

    updateEntropy(side) {
        console.warn(side);
        switch (side) {
            case SideDirection.Up:
                this.options = this.options.slice(0, 2);
                break;

            case SideDirection.Right:
                this.options.slice(-1, 3);
                break;

            case SideDirection.Down:
                this.options.slice(0, 3);
                break;

            case SideDirection.Left:
                this.options.slice(-1, 3);
                break;

            default:
                break;
        }
    }

    draw(i, j, imageWidth, imageHeight) {
        image(this.image, i * imageWidth, j * imageHeight, imageWidth, imageHeight);
    }

    checkSide(otherCell, side) {
        let match = false;

        switch (side) {
            case SideDirection.Up:
                match = this.#checkMatch(this.up, otherCell.down);
                break;

            case SideDirection.Right:
                match = this.#checkMatch(this.right, otherCell.left);
                break;

            case SideDirection.Down:
                match = this.#checkMatch(this.down, otherCell.up);
                break;

            case SideDirection.Left:
                match = this.#checkMatch(this.left, otherCell.right);
                break;

            default:
                break;
        }

        return match;
    }

    #checkMatch(thisSide, otherSide) {
        for (let i = 0; i < SideRules[thisSide].length; i++) {
            if (SideRules[thisSide][i] == otherSide)
                return true;
        }

        return false;
    }
}