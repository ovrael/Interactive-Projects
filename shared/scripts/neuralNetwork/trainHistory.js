class TrainHistory {
    constructor() {
        this.history = [];
        this.graphPoints = [];

        this.wrongResults = [];
    }

    addResults(result) {
        this.history.push(result);
    }

    clearWrongResults() {
        this.wrongResults = [];
    }

    addWrongResult(wrongResult) {
        this.wrongResults.push(wrongResult);
    }

    getGraphGraphics(graphicsWidth = 200, graphicsHeight = 200) {

        console.log(this.history)
        this.#computeHistoryPoints(graphicsWidth, graphicsHeight);

        if (!this.graphPoints || this.graphPoints.length == 0)
            return;

        const historyGraphics = createGraphics(graphicsWidth, graphicsHeight);
        historyGraphics.translate(0, graphicsHeight / 2);

        historyGraphics.background(25);
        historyGraphics.strokeWeight(1);
        historyGraphics.stroke(180, 40, 20);
        historyGraphics.line(0, 0, graphicsWidth, 0);
        push();
        historyGraphics.noStroke();
        historyGraphics.fill(180, 40, 20);
        historyGraphics.textSize(14);
        historyGraphics.text("0", graphicsWidth - 12, -8);
        pop();

        if (this.graphPoints.length == 1) {
            historyGraphics.strokeWeight(3);
            historyGraphics.stroke(220, 120, 20);
            historyGraphics.point(this.graphPoints[0].x, -this.graphPoints[0].trainY);
            historyGraphics.stroke(130, 220, 40);
            historyGraphics.point(this.graphPoints[0].x, -this.graphPoints[0].testY);
            return historyGraphics;
        }

        historyGraphics.strokeWeight(1);
        for (let i = 1; i < this.graphPoints.length; i++) {
            historyGraphics.stroke(220, 120, 20);
            historyGraphics.line(this.graphPoints[i - 1].x, -this.graphPoints[i - 1].trainY, this.graphPoints[i].x, -this.graphPoints[i].trainY);
            historyGraphics.stroke(130, 220, 40);
            historyGraphics.line(this.graphPoints[i - 1].x, -this.graphPoints[i - 1].testY, this.graphPoints[i].x, -this.graphPoints[i].testY);
        }

        return historyGraphics;
    }

    writeLastHistoryPoint(startX) {
        push();
        textSize(16);
        const lastHistoryPoint = this.history.at(-1);

        let acc = lastHistoryPoint["Test %"];
        if (acc == undefined)
            acc = 0.00;

        fill(250, 160, 50);
        text("Accuracy: " + Mathematics.toPercent(acc) + "%", startX, 120);

        fill(220, 120, 20);
        text("Train:", startX, 140);
        text(Mathematics.round(lastHistoryPoint["Train Loss"], 12), startX + 45, 140);

        fill(130, 220, 40);
        text("Test:", startX, 160);
        text(Mathematics.round(lastHistoryPoint["Test Loss"], 12), startX + 45, 160);
        pop();
    }

    #computeHistoryPoints(graphicsWidth, graphicsHeight) {
        this.graphPoints = [];
        if (!this.history || this.history.length == 0)
            return this.graphPoints;

        const minMax = this.#findStatsMaxMin();
        const xStep = (graphicsWidth * 0.9) / (this.history.length * 1.2);

        for (let i = 0; i < this.history.length; i++) {
            const historyPoint = this.history[i];
            const trainY = historyPoint["Train Loss"] > 0 ? historyPoint["Train Loss"] / minMax[1] : -historyPoint["Train Loss"] / minMax[0];
            const testY = historyPoint["Test Loss"] > 0 ? historyPoint["Test Loss"] / minMax[1] : -historyPoint["Test Loss"] / minMax[0];

            let currX = xStep * i + 10;
            let currTrainY = trainY * ((0.9 * graphicsHeight) / 2);
            let currTestY = testY * ((0.9 * graphicsHeight) / 2);

            this.graphPoints.push(
                {
                    x: currX,
                    trainY: currTrainY,
                    testY: currTestY,
                }
            )
        }
    }

    #findStatsMaxMin() {

        let max = Number.MIN_SAFE_INTEGER;
        let min = Number.MAX_SAFE_INTEGER;

        for (let i = 0; i < this.history.length; i++) {
            const historyPoint = this.history[i];
            if (historyPoint["Train Loss"] > max)
                max = historyPoint["Train Loss"];

            if (historyPoint["Test Loss"] > max)
                max = historyPoint["Test Loss"];

            if (historyPoint["Train Loss"] < min)
                min = historyPoint["Train Loss"];

            if (historyPoint["Test Loss"] < min)
                min = historyPoint["Test Loss"];
        }

        return [min, max];
    }
}