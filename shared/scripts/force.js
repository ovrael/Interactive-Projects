class Force {

    constructor(minX = 0, maxX = 0, minY = 0, maxY = 0, noiseAxis = '', noiseXChange = 0.01, noiseYChange = 0.01) {

        this.minX = minX;
        this.maxX = maxX;
        this.constX = this.minX == this.maxX ? this.minX : null;

        this.minY = minY;
        this.maxY = maxY;
        this.constY = this.minY == this.maxY ? this.minY : null;

        noiseAxis = noiseAxis.toLowerCase();
        this.noiseX = noiseAxis.includes('x') ? true : false;
        this.noiseY = noiseAxis.includes('y') ? true : false;

        this.noiseXOffset = 0;
        this.noiseXChange = noiseXChange;
        this.noiseYOffset = 0;
        this.noiseYChange = noiseYChange;

        this.force = createVector(0, 0);

        if (this.constX != null)
            this.force.x = this.constX;
        if (this.constY != null)
            this.force.y = this.constY;
    }

    static createConstForce(constX = 0, constY = 0) {
        return new Force(constX, constX, constY, constY);
    }

    #updateX(noisePosX, noisePosY) {

        if (this.constX != null) {
            this.force.x = this.constX;
            return;
        }

        let newX = this.force.x;
        if (this.noiseX) {
            let noiseVal = noise(noisePosX, noisePosY, this.noiseXOffset);
            newX = map(noiseVal, 0, 1, this.minX, this.maxX);
            this.noiseXOffset += this.noiseXChange;
        }
        else {
            newX = Mathematics.randFloatMinMax(this.minX, this.maxX);
        }
        this.force.x = newX;
    }

    #updateY(noisePosX, noisePosY) {

        if (this.constY != null) {
            this.force.y = this.constY;
            return;
        }

        let newY = this.force.y;
        if (this.noiseY) {
            let noiseVal = noise(noisePosX, noisePosY, this.noiseYOffset);
            newY = map(noiseVal, 0, 1, this.minY, this.maxY);
            this.noiseYOffset += this.noiseYChange;
        }
        else {
            newY = Mathematics.randFloatMinMax(this.minY, this.maxY);
        }

        this.force.y = newY;
    }

    update(noisePosX, noisePosY) {
        this.#updateX(noisePosX, noisePosY);
        this.#updateY(noisePosX, noisePosY);
    }

    setForceValues(newX, newY) {
        this.force.set(newX, newY);
    }

    #swapValues(v1, v2) {

        const tmp = v1;
        v1 = v2;
        v2 = tmp;

        return [v1, v2];
    }

    setForceValues(minX, maxX, minY, maxY) {

        if (minX > maxX || maxX < minX) {
            const swap = this.#swapValues(minX, maxX);
            minX = swap[1];
            maxX = swap[0];
        }

        if (minY > maxY || maxY < minY) {
            const swap = this.#swapValues(minX, maxX);
            minX = swap[1];
            maxX = swap[0];
        }

        if (minX == maxX) {
            this.constX = minX;
        }
        else {
            this.constX = null;
        }

        if (minY == maxY) {
            this.constY = minY;
        }
        else {
            this.constY = null;
        }


        this.minX = minX;
        this.maxX = maxX;

        this.minY = minY;
        this.maxY = maxY;
    }

    setNoiseValues(xChange, yChange) {
        this.noiseX = xChange == 0 ? false : true;
        this.noiseXChange = xChange;

        this.noiseY = yChange == 0 ? false : true;
        this.noiseYChange = yChange;
    }
}