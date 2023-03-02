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
        let inputsCount = Math.floor(allRows / digitCount);

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

        const rotateAngle = Math.random() * 40 - 20;
        let noiseRow = [...dataRow];
        noiseRow = this.rotatePixels(noiseRow, rotateAngle);

        // return dataRow;
        // const direction = Math.floor(Math.random() * 4); // randomly choose left, top, right, or bottom
        // noiseRow = this.shiftPixels(noiseRow, direction);

        if (Math.random() < 0.8) {
            const direction = Math.floor(Math.random() * 4); // randomly choose left, top, right, or bottom
            noiseRow = this.shiftPixels(noiseRow, direction);

            if (Math.random() < 0.4) {
                const changeDirection = Math.random() < 0.5 ? 2 : 0;
                noiseRow = this.shiftPixels(noiseRow, direction + 1 + changeDirection);
            }
        }
        noiseRow = this.noisePixels(noiseRow, 0.01);

        for (let i = 0; i < noiseRow.length; i++) {
            if (noiseRow[i] == undefined) {
                noiseRow[i] = 0;
            }
        }

        return noiseRow;
        // if (Math.random() < 0.00) {
        //     noiseRow = this.flipPixels(noiseRow, "xAxis");
        // }
        // if (Math.random() < 0.00) {
        //     noiseRow = this.flipPixels(noiseRow, "yAxis");
        // }

        // if (Math.random() < 1) {
        //     const direction = Math.floor(0); // randomly choose left, top, right, or bottom
        //     // const direction = Math.floor(Math.random() * 4); // randomly choose left, top, right, or bottom
        //     noiseRow = this.shiftPixels(noiseRow, direction);

        //     // if (Math.random() < 0.5) {
        //     //     const changeDirection = Math.random() < 0.5 ? 2 : 0;
        //     //     noiseRow = this.shiftPixels(noiseRow, direction + 1 + changeDirection);
        //     // }
        // }


        return noiseRow;
    }

    static rotatePixels(pixels, rotateAngle = 5) {
        // Convert degree to radians
        const radians = rotateAngle * Math.PI / 180;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        // Calculate center point of image
        const centerX = Math.floor(this.imageSize / 2); // (28-1)/2
        const centerY = Math.floor(this.imageSize / 2);

        // Create output array
        const rotated = new Array(this.imageSize * this.imageSize);

        for (let y = 0; y < 28; y++) {
            for (let x = 0; x < 28; x++) {
                // Calculate new x and y coordinates
                const newX = (x - centerX) * cos - (y - centerY) * sin + centerX;
                const newY = (x - centerX) * sin + (y - centerY) * cos + centerY;

                // Round to nearest integer
                const pixelX = Math.round(newX);
                const pixelY = Math.round(newY);

                // Check if pixel is within bounds of original image
                if (pixelX >= 0 && pixelX < 28 && pixelY >= 0 && pixelY < 28) {
                    // Copy pixel value to new location in rotated image
                    const index = y * 28 + x;
                    const newIndex = pixelY * 28 + pixelX;
                    rotated[newIndex] = pixels[index];
                }
            }
        }

        for (let i = 0; i < rotated.length; i++) {
            if (rotated[i] == undefined) {
                rotated[i] = 0;
            }
        }

        return rotated;
        // 0, 90, 180, 270 angles are rotated without making noise
        if (rotateAngle % 90 == 0)
            return rotated;

        // FILTER NOISE -> Find black pixels and change them to white if at least 6 naighbours are white as well
        for (let x = 1; x < this.imageSize - 1; x++) {
            for (let y = 1; y < this.imageSize - 1; y++) {

                if (rotated[this.imageSize * y + x] == 1)
                    continue;

                let pixelsSum = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        pixelsSum += rotated[this.imageSize * (y + j) + (x + i)];
                    }
                }
                rotated[this.imageSize * y + x] = pixelsSum > 4 && pixelsSum < 7 ? 1 : 0;
            }
        }

        return rotated;
    }

    static noisePixels(pixels, chance = 0.01) {
        const newPixels = new Array(this.imageSize * this.imageSize);
        for (let i = 0; i < pixels.length; i++) {
            if (Math.random() < chance) {
                newPixels[i] = Math.round((Math.random() * 0.5 + 0.25) * 100) / 100;
            }
            else {
                newPixels[i] = pixels[i];
            }
        }
        return newPixels;
    }

    static rotatePixelsBy90(pixels, rotateCount = 1) {
        const rotations = rotateCount % 4;
        const newPixels = new Array(this.imageSize * this.imageSize);
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

    static flipPixels(pixels, reflection = "xAxis") {
        const newPixels = new Array(this.imageSize * this.imageSize);

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

    static getMaxOffset(pixels, direction = 0) {
        let maxOffset = 0;
        switch (direction) {
            case 0: // left
                for (let x = 0; x < this.imageSize; x++) {
                    for (let y = 0; y < this.imageSize; y++) {
                        if (pixels[this.imageSize * y + x] == 1) {
                            return x;
                        }
                    }
                }

                break;
            case 1: // top
                for (let y = 0; y < this.imageSize; y++) {
                    for (let x = 0; x < this.imageSize; x++) {
                        if (pixels[this.imageSize * y + x] == 1) {
                            return y;
                        }
                    }
                }
                break;
            case 2: // right
                for (let x = this.imageSize - 1; x >= 0; x--) {
                    for (let y = 0; y < this.imageSize; y++) {
                        if (pixels[this.imageSize * y + x] == 1) {
                            return this.imageSize - 1 - x;
                        }
                    }
                }
                break;
            case 3: // bottom
                for (let y = this.imageSize - 1; y >= 0; y--) {
                    for (let x = 0; x < this.imageSize; x++) {
                        if (pixels[this.imageSize * y + x] == 1) {
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

    static shiftPixels(pixels, direction = 0) {
        const newPixels = new Array(this.imageSize * this.imageSize);
        direction = direction % 4;
        const maxOffset = this.getMaxOffset(pixels, direction);
        const offset = Math.floor(Math.random() * maxOffset + 2); // random offset between 1 and 8 pixels

        switch (direction) {
            case 0: // left
                for (let y = 0; y < this.imageSize; y++) {
                    for (let x = 0; x < this.imageSize; x++) {
                        const i = y * this.imageSize + x;
                        const j = y * this.imageSize + Math.max(0, x - offset);
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