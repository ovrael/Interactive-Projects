class DataManage {

    static imageSize = 28;

    static split(data, targets, ratio) {
        const splitData = { trainX: [], trainY: [], testX: [], testY: [] };
        const testMax = data.length * (1 - ratio);

        const dataCopy = [...data];
        const targetsCopy = [...targets];


        while (dataCopy.length > 0) {

            const i = Math.floor(Math.random() * dataCopy.length);
            const x = dataCopy.splice(i, 1)[0];
            const y = targetsCopy.splice(i, 1)[0];

            if (splitData.testX.length < testMax) {
                if (Math.random() > 0.5) {
                    splitData.trainX.push(x);
                    splitData.trainY.push(y);
                }
                else {
                    splitData.testX.push(x);
                    splitData.testY.push(y);
                }
            }
            else {
                splitData.trainX.push(x);
                splitData.trainY.push(y);
            }
        }

        return splitData;
    }

    static shuffle(data, targets) {
        const shuffledData = { data: [], targets: [] };
        const dataCopy = [...data];
        const targetsCopy = [...targets];

        while (dataCopy.length > 0) {

            const i = Math.floor(Math.random() * dataCopy.length);
            const x = dataCopy.splice(i, 1)[0];
            const y = targetsCopy.splice(i, 1)[0];

            shuffledData.data.push(x);
            shuffledData.targets.push(y);
        }

        return shuffledData;
    }

    static noiseSingleRow(dataRow) {
        let noiseRow = this.noiseImage(dataRow, 0.03);

        if (Math.random() < 0.05) {
            noiseRow = this.rotateImage(noiseRow, Math.floor(Math.random() * 4));
        }
        if (Math.random() < 0.01) {
            noiseRow = this.flipImage(noiseRow, "xAxis");
        }
        if (Math.random() < 0.01) {
            noiseRow = this.flipImage(noiseRow, "yAxis");
        }

        if (Math.random() < 0.5) {
            noiseRow = this.shiftImage(noiseRow);
        }

        return noiseRow;
    }

    static noiseImage(pixels, chance = 0.01) {
        const newPixels = new Uint8ClampedArray(this.imageSize * this.imageSize);
        for (let i = 0; i < pixels.length; i++) {
            if (Math.random() < chance) {
                newPixels[i] = Math.random();
            }
            else {
                newPixels[i] = pixels[i];
            }
        }
        return newPixels;
    }

    static rotateImage(pixels, rotateCount) {
        const rotations = rotateCount % 4;
        const newPixels = new Uint8ClampedArray(this.imageSize * this.imageSize);
        switch (rotations) {
            case 0:
                return pixels;
            case 1:
                for (let x = 0; x < this.imageSize; x++) {
                    for (let y = 0; y < this.imageSize; y++) {
                        const i = x * this.imageSize + y;
                        const j = (this.imageSize - y - 1) * this.imageSize + x;
                        newPixels[j] = pixels[i];
                    }
                }
                break;
            case 2:
                for (let x = 0; x < this.imageSize; x++) {
                    for (let y = 0; y < this.imageSize; y++) {
                        const i = x * this.imageSize + y;
                        const j = (this.imageSize - x - 1) * this.imageSize + (this.imageSize - y - 1);
                        newPixels[j] = pixels[i];
                    }
                }
                break;
            case 3:
                for (let x = 0; x < this.imageSize; x++) {
                    for (let y = 0; y < this.imageSize; y++) {
                        const i = x * this.imageSize + y;
                        const j = y * this.imageSize + (this.imageSize - x - 1);
                        newPixels[j] = pixels[i];
                    }
                }
                break;
            default:
                throw new Error('Invalid rotateCount');
        }
        return newPixels;
    }

    static flipImage(pixels, reflection) {
        const newPixels = new Uint8ClampedArray(this.imageSize * this.imageSize);

        if (reflection === "xAxis") {
            for (let x = 0; x < this.imageSize; x++) {
                for (let y = 0; y < this.imageSize; y++) {
                    const i = x * this.imageSize + y;
                    let j = (this.imageSize - x - 1) * this.imageSize + y;
                    newPixels[j] = pixels[i];
                }
            }
        } else if (reflection === "yAxis") {
            for (let x = 0; x < this.imageSize; x++) {
                for (let y = 0; y < this.imageSize; y++) {
                    const i = x * this.imageSize + y;
                    let j = x * this.imageSize + (this.imageSize - y - 1);
                    newPixels[j] = pixels[i];
                }
            }
        } else {
            throw new Error("Invalid reflection type");
        }

        return newPixels;
    }

    static shiftImage(pixels) {
        const newPixels = new Uint8ClampedArray(this.imageSize * this.imageSize);
        const direction = Math.floor(Math.random() * 4); // randomly choose left, top, right, or bottom
        const offset = Math.floor(Math.random() * 6) + 1; // random offset between 1 and 8 pixels

        switch (direction) {
            case 0: // left
                for (let x = 0; x < this.imageSize; x++) {
                    for (let y = 0; y < this.imageSize; y++) {
                        const i = x * this.imageSize + y;
                        const j = x * this.imageSize + Math.max(0, y - offset);
                        newPixels[j] = pixels[i];
                    }
                }

                break;
            case 1: // top
                for (let x = 0; x < this.imageSize; x++) {
                    for (let y = 0; y < this.imageSize; y++) {
                        const i = x * this.imageSize + y;
                        const j = Math.max(0, x - offset) * this.imageSize + y;
                        newPixels[j] = pixels[i];
                    }
                }
                break;
            case 2: // right
                for (let x = 0; x < this.imageSize; x++) {
                    for (let y = 0; y < this.imageSize; y++) {
                        const i = x * this.imageSize + y;
                        const j = x * this.imageSize + Math.min(this.imageSize - 1, y + offset);
                        newPixels[j] = pixels[i];
                    }
                }
                break;
            case 3: // bottom
                for (let x = 0; x < this.imageSize; x++) {
                    for (let y = 0; y < this.imageSize; y++) {
                        const i = x * this.imageSize + y;
                        const j = Math.min(this.imageSize - 1, x + offset) * this.imageSize + y;
                        newPixels[j] = pixels[i];
                    }
                }
                break;
            default:
                throw new Error("Invalid direction");
        }

        return newPixels;
    }
}