class DataManage {

    static imageSize = 28;

    static split(data, targets, ratio) {
        const splitData = { trainX: [], trainY: [], testX: [], testY: [] };

        if (ratio > 1) ratio = 1;
        if (ratio < 0) ratio = 0;
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

    static prepareDigitImages(rawData, singleDigitCount, noiseSamples) {

        datapoints = { X: [], Y: [] };
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
                    dataRow.push(pixels[j] > 0.5 ? 1 : 0);
                    // dataRow.push(pixels[j] / 255);
                }
            }

            datapoints.Y.push(pixels[0]);
            datapoints.X.push(dataRow);
            images.push(dataRow);

            for (let j = 0; j < noiseSamples; j++) {
                const noiseRow = DataManage.noiseSingleRow(dataRow);
                datapoints.Y.push(pixels[0]);
                datapoints.X.push(noiseRow);
                images.push(noiseRow);
            }
        }

        return [datapoints, images];
    }

    static noiseSingleRow(dataRow) {
        let noiseRow = this.noiseImage(dataRow, 0.025);
        // if (Math.random() < 0.00) {
        //     noiseRow = this.rotateImage(noiseRow, Math.floor(Math.random() * 4));
        // }
        // if (Math.random() < 0.00) {
        //     noiseRow = this.flipImage(noiseRow, "xAxis");
        // }
        // if (Math.random() < 0.00) {
        //     noiseRow = this.flipImage(noiseRow, "yAxis");
        // }

        if (Math.random() < 0.5) {
            const direction = Math.floor(Math.random() * 4); // randomly choose left, top, right, or bottom
            noiseRow = this.shiftImage(noiseRow, direction);

            if (Math.random() < 0.25) {
                noiseRow = this.shiftImage(noiseRow, direction + 1);
            }
        }

        return noiseRow;
    }

    static noiseImage(pixels, chance = 0.01) {
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

    static getMaxOffset(pixels, direction) {
        let maxOffset = 0;
        switch (direction) {
            case 0: // left
                for (let x = 0; x < this.imageSize / 2; x++) {
                    for (let y = 2; y < this.imageSize - 2; y += 6) {
                        if (pixels[28 * y + x] == 1) {
                            return x;
                        }
                    }
                }

                break;
            case 1: // top
                for (let y = 0; y < this.imageSize / 2; y++) {
                    for (let x = 2; x < this.imageSize - 2; x += 6) {
                        if (pixels[28 * y + x] == 1) {
                            return y;
                        }
                    }
                }
                break;
            case 2: // right
                for (let x = this.imageSize - 1; x > this.imageSize / 2; x--) {
                    for (let y = 2; y < this.imageSize - 2; y += 6) {
                        if (pixels[28 * y + x] == 1) {
                            return this.imageSize - 1 - x;
                        }
                    }
                }
                break;
            case 3: // bottom
                for (let y = this.imageSize - 1; y > this.imageSize / 2; y--) {
                    for (let x = 2; x < this.imageSize - 2; x += 6) {
                        if (pixels[28 * y + x] == 1) {
                            return this.imageSize - 1 - y;
                        }
                    }
                }
                break;
            default:
                throw new Error("Invalid direction");
        }

        return maxOffset;
    }

    static shiftImage(pixels, direction) {
        const newPixels = new Uint8ClampedArray(this.imageSize * this.imageSize);
        direction = direction % 4;
        const maxOffset = this.getMaxOffset(pixels, direction);
        const offset = Math.floor(Math.random() * maxOffset) + 1; // random offset between 1 and 8 pixels

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

    static rotatePixels(pixels, angle) {
        // Determine the size of the square image
        const size = Math.sqrt(pixels.length);

        // Create a 2D array to hold the pixels
        const matrix = [];
        for (let i = 0; i < size; i++) {
            matrix.push(pixels.slice(i * size, (i + 1) * size));
        }

        // Find the center pixel
        const cx = size / 2;
        const cy = size / 2;

        // Convert the angle to radians
        const radians = angle * Math.PI / 180;

        // Rotate the pixels around the center
        const rotated = [];
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const px = x - cx;
                const py = y - cy;
                const qx = Math.round(px * Math.cos(radians) - py * Math.sin(radians)) + cx;
                const qy = Math.round(px * Math.sin(radians) + py * Math.cos(radians)) + cy;

                // Skip if the pixel is out of bounds
                if (qx < 0 || qx >= size || qy < 0 || qy >= size) continue;

                // Add the pixel to the rotated array
                rotated.push(matrix[qy][qx]);
            }
        }

        // Return the rotated pixels as a 1D array
        return rotated;
    }

    // ONLY FOR CLASSIFICATION
    static splitDatapoints(data, ratio, shuffle = true) {
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

    static shuffleDatapoints(data) {
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

    static prepareDatapoints(rawData, labelsCount, singleDigitCount, noiseSamples) {

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
                const noiseRow = DataManage.noiseSingleRow(dataRow);
                datapoints.push(
                    new DataPoint(dataRow, pixels[0], labelsCount)
                );
                images.push(noiseRow);
            }
        }

        return [datapoints, images];
    }
}