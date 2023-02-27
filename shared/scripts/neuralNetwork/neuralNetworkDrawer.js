class NeuralNetworkDrawer {
    constructor(neuralNetwork, xOffset = 60, yOffset = 80) {
        /** @type {NeuralNetwork} */
        this.neuralNetwork = neuralNetwork;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.size = 50;
        rectMode(CENTER);
    }

    draw(width, height) {
        strokeWeight(2);
        textSize(10);
        textStyle(NORMAL);
        textAlign(CENTER, CENTER);

        push();
        textSize(16);
        text('Target: ' + this.neuralNetwork.lastTarget, width - 40, height / 2 - 80);
        pop();
        const layersCount = this.neuralNetwork.layers.length;
        for (let i = 0; i < layersCount; i++) {

            const xPos = this.xOffset * 0.5 + (width - this.xOffset) * (i / (layersCount - 1));
            if (i == 0) {
                push();
                textSize(12);
                strokeWeight(0);
                fill(0);
                text('INPUT', xPos, 8);
                pop();
            }
            else if (i == layersCount - 1) {
                push();
                textSize(12);
                strokeWeight(0);
                fill(0);
                text('OUTPUT', xPos, 8);
                pop();
            }
            else {
                push();
                textSize(12);
                strokeWeight(0);
                fill(0);
                text('HIDDEN ' + i, xPos, 8);
                pop();
            }

            /** @type{Layer} */
            const layer = this.neuralNetwork.layers[i];

            for (let j = 0; j < layer.neuronsCount; j++) {

                let yPos = this.yOffset * 0.5 + (height - this.yOffset) * (j / (layer.neuronsCount - 1));
                if (layer.neuronsCount == 1) {
                    yPos = height / 2;
                }

                if (i < layersCount - 1) {
                    const nextLayer = this.neuralNetwork.layers[i + 1];
                    for (let k = 0; k < nextLayer.neuronsCount; k++) {
                        const xPos2 = this.xOffset * 0.5 + (width - this.xOffset) * ((i + 1) / (layersCount - 1));
                        let yPos2 = this.yOffset * 0.5 + (height - this.yOffset) * (k / (nextLayer.neuronsCount - 1));
                        if (nextLayer.neuronsCount == 1)
                            yPos2 = height / 2;
                        strokeWeight(1);
                        line(xPos, yPos, xPos2, yPos2);
                    }
                }

                strokeWeight(1);
                fill(0);
                rect(xPos, yPos, this.size, this.size);
                line(xPos, yPos, xPos, yPos + 35);
                rect(xPos, yPos + 35, this.size, 12);

                push();
                strokeWeight(0);
                fill(50, 150, 50);
                text('S: ' + layer.sums[j].toFixed(2), xPos, yPos - 17);
                fill(150, 150, 50);
                text('A: ' + layer.activations[j].toFixed(2), xPos, yPos - 5);
                fill(50, 150, 250);
                text('D: ' + layer.derivatives[j].toFixed(2), xPos, yPos + 7);
                fill(200, 40, 40);
                text('E: ' + layer.errors[j].toFixed(2), xPos, yPos + 19);
                fill(150, 40, 200);
                text('B: ' + layer.biases[j].toFixed(2), xPos, yPos + 35);
                pop();
            }
        }
    }

    drawOutput(width, height) {
        strokeWeight(2);
        textSize(10);
        textStyle(NORMAL);
        textAlign(CENTER, CENTER);

        strokeWeight(0);
        fill(40);
        rect(0, height / 2, width * 2, height / 2);

        /** @type {Layer} */
        const lastLayer = this.neuralNetwork.layers[this.neuralNetwork.layersCount - 1];

        let maxXPos = -1;
        let maxVal = -1;
        let maxIndex = -1;

        for (let i = 0; i < lastLayer.neuronsCount; i++) {

            const xPos = this.xOffset * 0.5 + (width - this.xOffset) * (i / (lastLayer.neuronsCount - 1));
            const yPos = height / 2;

            if (lastLayer.activations[i] > maxVal) {
                maxVal = lastLayer.activations[i];
                maxXPos = xPos;
                maxIndex = i;
            }

            strokeWeight(1);
            fill(0);
            rect(xPos, yPos, this.size, this.size);

            push();
            strokeWeight(0);
            fill(50, 150, 50);
            text('S: ' + lastLayer.sums[i].toFixed(2), xPos, yPos - 17);
            fill(150, 150, 50);
            text('A: ' + lastLayer.activations[i].toFixed(2), xPos, yPos - 5);
            fill(50, 150, 250);
            text('D: ' + lastLayer.derivatives[i].toFixed(2), xPos, yPos + 7);
            fill(200, 40, 40);
            text('E: ' + lastLayer.errors[i].toFixed(2), xPos, yPos + 19);
            fill(150, 40, 200);
            text('B: ' + lastLayer.biases[i].toFixed(2), xPos, yPos + 35);
            pop();
        }

        strokeWeight(0);
        if (this.neuralNetwork.lastTarget == maxIndex)
            fill(70, 200, 50);
        else
            fill(200, 50, 50);

        push();
        textSize(16);
        text('Target: ' + this.neuralNetwork.lastTarget, maxXPos, height / 2 + 150);
        text('Predicted: ' + maxIndex, maxXPos, height / 2 + 175);
        pop();
        rect(maxXPos, height / 2 + 100, 5, 50);

        push();
        translate(maxXPos - 8, height / 2 + 90);
        rotate(Math.PI / 6);
        rect(0, 0, 4, 30);
        pop();

        push();
        translate(maxXPos + 8, height / 2 + 90);
        rotate(-Math.PI / 6);
        rect(0, 0, 4, 30);
        pop();
    }
}