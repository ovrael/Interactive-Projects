class Weights {

    constructor(previous, current) {
        this.previous = previous;
        this.current = current;
        this.data = new Array(this.previous);

        // Fill weights with nubmers between -0.5 and 0.5.
        for (let i = 0; i < this.previous; i++) {
            this.data[i] = new Array(this.current);

            for (let j = 0; j < this.current; j++) {
                this.data[i][j] = (random() - 0.5);
            }
        }
    }

    map(func) {
        // Apply a function to every element of matrix
        for (let i = 0; i < this.previous; i++) {
            for (let j = 0; j < this.current; j++) {
                let val = this.data[i][j];
                this.data[i][j] = func(val, i, j);
            }
        }
        return this;
    }

    multiply(other) {
        if (other instanceof Weights) {
            if (this.previous !== other.previous || this.current !== other.current) {
                console.log('Columns and Rows of A must match Columns and Rows of B.');
                return;
            }

            // hadamard product
            return this.map((e, i, j) => e * other.data[i][j]);
        } else {
            // Scalar product
            return this.map(e => e * other);
        }
    }
}