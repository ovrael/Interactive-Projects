class BinaryTree {
    constructor(fromArray = []) {

        this.searching = false;
        
        if (fromArray.length > 0) {
            this.root = new BinaryLeaf(fromArray[0], width / 2, 100, 40, 1);

            for (let i = 1; i < fromArray.length; i++) {
                this.root.addValue(value);
            }
        }
        else {
            this.root = null;
        }
    }

    addValue(value) {

        if (this.root == null) {
            this.root = new BinaryLeaf(value, width / 2, 100, 40, 1);
        } else {
            this.root.addValue(value);
        }

    }

    print() {
        if (this.root == null) {
            console.warn("Can't print(); Binary tree is empty!");
            return;
        }

        console.log(this.root.print());
    }

    find(value) {
        if (this.root == null) {
            console.warn("Can't find(); Binary tree is empty!");
            return;
        }

        return this.root.find(value);
    }

    async visualiseFind(value) {
        this.searching = true;

        if (this.root == null) {
            console.warn("Can't visualiseFind(); Binary tree is empty!");
            return;
        }

        return await this.root.visualiseFind(value);
    }

    clearVisit() {
        if (this.root != null) {
            this.root.clearVisit();
        }
        this.searching = false;
    }

    showOnCanvas() {
        if (this.root == null) {
            console.warn("Can't showOnCanvas(); Binary tree is empty!");
            return;
        }

        this.root.showOnCanvas();
    }
}