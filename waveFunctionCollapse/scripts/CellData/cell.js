class Cell {

    constructor() {
        this.up = null;
        this.right = null;
        this.down = null;
        this.left = null;
        this.image = null;

        this.collapsed = false;
        this.options = [0, 1, 2, 3, 4, 5, 6];
    }

    collapse(up, right, down, left, image) {
        this.up = up;
        this.right = right;
        this.down = down;
        this.left = left;
        this.image = image;

        this.collapsed = true;
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