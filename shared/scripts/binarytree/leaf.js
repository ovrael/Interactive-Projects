class BinaryLeaf {
    constructor(value = null, x = null, y = null, size = null, level = null) {

        this.value = value;

        /** @type {BinaryLeaf} */
        this.left = null;

        /** @type {BinaryLeaf} */
        this.right = null;

        this.visited = false;
        this.level = level;
        this.x = x;
        this.y = y;
        this.size = size;
        if (this.size <= 20)
            this.size = 20;
    }

    addValue(value) {
        if (value < this.value)
            this.#addLeftLeaf(value);
        else if (value > this.value)
            this.#addRightLeaf(value);
    }

    #addLeftLeaf(value) {
        if (this.left == null)
            this.left = new BinaryLeaf(value, this.x - width / Math.pow(2, this.level) * 0.8, this.y + 50, this.size - 2, this.level + 1);
        else
            this.left.addValue(value);
    }

    #addRightLeaf(value) {
        if (this.right == null)
            this.right = new BinaryLeaf(value, this.x + width / Math.pow(2, this.level) * 0.8, this.y + 50, this.size - 2, this.level + 1);
        else
            this.right.addValue(value);
    }

    print(values = []) {

        if (this.left != null) {
            values = values.concat(this.left.print());
        }

        values.push(this.value);

        if (this.right != null) {
            values = values.concat(this.right.print());
        }

        return values;
    }

    find(value) {
        if (this.value == value)
            return this;

        if (value < this.value && this.left != null)
            return this.left.find(value);

        if (value > this.value && this.right != null)
            return this.right.find(value);

        return null;
    }

    #waitingFind(value) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.value == value)
                    resolve(this);

                if (value < this.value && this.left != null)
                    resolve(this.left.visualiseFind(value));

                if (value > this.value && this.right != null)
                    resolve(this.right.visualiseFind(value));

                reject(null);
            }, 500);
        });
    }

    async visualiseFind(value) {
        this.visited = true;

        return await this.#waitingFind(value);
    }

    clearVisit() {
        this.visited = false;

        if (this.left != null) this.left.clearVisit();
        if (this.right != null) this.right.clearVisit();
    }

    showOnCanvas() {

        if (this.x == null || this.y == null || this.size == null) {
            console.warn("Can't draw binary tree on canvas. One of drawing arguments is missing!");
            console.warn(this);
            return;
        }


        if (this.left != null) {

            if (this.left.visited) {
                stroke(111, 250, 111);
            } else {
                stroke(250, 111, 111);
            }
            strokeWeight(1);
            line(this.x, this.y, this.left.x, this.left.y);

            this.left.showOnCanvas();
        }

        if (this.right != null) {
            if (this.right.visited) {
                stroke(111, 250, 111);
            } else {
                stroke(250, 111, 111);
            }
            strokeWeight(1);
            line(this.x, this.y, this.right.x, this.right.y);

            this.right.showOnCanvas();
        }

        push();
        if (this.visited)
            stroke(250, 250, 0);
        else
            stroke(255, 111, 111);

        strokeWeight(0);
        fill(0, 0, 0);
        ellipse(this.x, this.y, this.size, this.size);
        pop();

        push();
        fill(250, 250, 0);

        textSize(18);
        strokeWeight(0);
        textSize(this.size / 2);
        text(this.value, this.x, this.y);
        pop();
    }
}