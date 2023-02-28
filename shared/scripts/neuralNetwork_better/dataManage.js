class DataManage {

    static imageSize = 28;

    // ONLY FOR CLASSIFICATION
    static split(data, ratio, shuffle = true) {
        const splitData = { train: [], test: [] };

        if (ratio > 1) ratio = 1;
        if (ratio < 0) ratio = 0;
        const trainMax = Math.floor(data.length * ratio);
        const testMax = data.length - trainMax;

        if (shuffle)
            data = DataManage.shuffleDatapoints(data);

        for (let i = 0; i < trainMax; i++) {
            splitData.train.push(allData[i]);
        }
        for (let i = 0; i < testMax; i++) {
            splitData.test.push(allData[trainMax + i]);
        }

        return splitData;
    }

    static shuffle(data) {
        let elementsRemainingToShuffle = data.length;
        let randomIndex = 0;

        while (elementsRemainingToShuffle > 1) {
            // Choose a random element from array
            randomIndex = Math.floor(Math.random() * elementsRemainingToShuffle);
            const chosenElement = data[randomIndex];

            // Swap the randomly chosen element with the last unshuffled element in the array
            elementsRemainingToShuffle--;
            data[randomIndex] = data[elementsRemainingToShuffle];
            data[elementsRemainingToShuffle] = chosenElement;
        }
    }

    static prepareData(rawData, labelsCount, singleDigitCount, noiseSamples) {

        datapoints = [];
        images = [];

        const allRows = 40000;
        const digitCount = singleDigitCount * 10; // all clear rows + noiseSamples* noise rows
        let inputsCount = allRows / digitCount;

        if (inputsCount < 1)
            inputsCount = 1;

        const rows = rawData.split("\n");
        for (let i = 0; i < rows.length / inputsCount; i++) {
            let pixels = rows[i * inputsCount].split(" ");

            let dataRow = [];
            for (let j = 1; j < pixels.length - 1; j++) {
                if (pixels[j].includes("x")) {
                    let zeroCounts = pixels[j].split("x")[0];
                    for (let k = 0; k < Number(zeroCounts); k++) {
                        dataRow.push(0);
                    }
                }
                else {
                    dataRow.push(pixels[j] / 255);
                }
            }

            datapoints.push(
                new DataPoint(dataRow, pixels[0], labelsCount)
            );

            images.push(dataRow);

            for (let j = 0; j < noiseSamples; j++) {
                const noiseRow = DataManage.noiseImage(dataRow);
                datapoints.push(
                    new DataPoint(dataRow, pixels[0], labelsCount)
                );
                images.push(noiseRow);
            }
        }

        return [datapoints, images];
    }

    static noiseImage(dataRow) {
        let noiseRow = this.noisePixels(dataRow, 0.03);

        if (Math.random() < 0.05) {
            noiseRow = this.rotateImage(noiseRow, Math.floor(Math.random() * 4));
        }
        if (Math.random() < 0.01) {
            noiseRow = this.flipImage(noiseRow, "xAxis");
        }
        if (Math.random() < 0.01) {
            noiseRow = this.flipImage(noiseRow, "yAxis");
        }

        if (Math.random() < 0.2) {
            noiseRow = this.shiftImage(noiseRow);
        }

        return noiseRow;
    }

    static noisePixels(pixels, chance = 0.01) {
        const newPixels = new Uint8ClampedArray(this.imageSize * this.imageSize);
        for (let i = 0; i < pixels.length; i++) {
            if (Math.random() < chance) {
                newPixels[i] = Math.random() * 0.5 + 0.25;
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