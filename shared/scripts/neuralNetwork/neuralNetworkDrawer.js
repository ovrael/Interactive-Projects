class NeuralNetworkDrawer {
    constructor(neuralNetwork, xOffset = 60, yOffset = 60) {
        /** @type {NeuralNetwork} */
        this.neuralNetwork = neuralNetwork;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        rectMode(CENTER);
    }


    draw(width, height) {

        const layersCount = this.neuralNetwork.layers.length;
        for (let i = 0; i < layersCount; i++) {

            const xPos = this.xOffset * 0.5 + (width - this.xOffset) * (i / (layersCount - 1));
            const neurons = this.neuralNetwork.layers[i].neurons;

            for (let j = 0; j < neurons.length; j++) {
                const yPos = this.yOffset * 0.5 + (height - this.yOffset) * (j / (neurons.length - 1));
                rect(xPos, yPos, 40, 40);
                text(`(${i},${j})`, xPos, yPos);
            }
        }
    }
}