class MarchingSquares {

    static #PERLIN_RANGE = 0.866;
    static #SIMPLEX_RANGE = 0.35;
    static #AUTO_MAP_LIMIT = 1_000;
    static #HALF_SQUARE_SIZE = ProjectData.SquareSize / 2;

    static #automapValues = [];
    static #counter = 0;

    static #min = 3;
    static #max = -3;

    constructor() {
        this.corners = [];
        this.zOffset = 0;

        const seed = Date.now() * random();
        tooloud.Perlin.setSeed(seed);
        tooloud.Simplex.setSeed(seed);
        tooloud.Worley.setSeed(seed);

        this.noiseFunction;
        this.noiseFunctionHelper;
        this.updateNoiseFunction();

        let cornersWidth = Math.floor(ProjectData.CanvasWidth / ProjectData.SquareSize) + 2;
        let cornersHeight = Math.floor(ProjectData.CanvasHeight / ProjectData.SquareSize) + 2;

        this.corners = new Array(cornersWidth);
        for (let i = 0; i < this.corners.length; i++) {
            this.corners[i] = new Array(cornersHeight);

            for (let j = 0; j < this.corners[i].length; j++) {
                this.corners[i][j] = Mathematics.randIntMax(2);
            }
        }
    }

    update() {
        let xOffset = 0;
        MarchingSquares.#HALF_SQUARE_SIZE = ProjectData.SquareSize / 2;

        for (let i = 0; i < this.corners.length; i++) {

            xOffset += ProjectData.XNoiseOffset;
            let yOffset = 0;

            for (let j = 0; j < this.corners[i].length; j++) {

                this.corners[i][j] = float(this.noiseFunction(xOffset, yOffset, this.zOffset));

                if (ProjectData.HardBoundaries) {
                    this.corners[i][j] = this.#binaryRound(this.corners[i][j]);
                }

                yOffset += ProjectData.YNoiseOffset;
            }
        }

        if (MarchingSquares.#counter < MarchingSquares.#AUTO_MAP_LIMIT) {
            let newMin = Math.min(...MarchingSquares.#automapValues);
            let newMax = Math.max(...MarchingSquares.#automapValues);

            if (newMin < MarchingSquares.#min)
                MarchingSquares.#min = newMin;

            if (newMax > MarchingSquares.#max)
                MarchingSquares.#max = newMax;
        }

        MarchingSquares.#counter++;
        MarchingSquares.#automapValues = [];

        this.zOffset += ProjectData.ZNoiseChange;
    }

    show() {
        for (let i = 0; i < this.corners.length - 1; i++) {
            for (let j = 0; j < this.corners[i].length - 1; j++) {

                const midPoints = this.#getMidPoints(i, j);
                const state = this.#getState(
                    this.#binaryRound(this.corners[i][j]),
                    this.#binaryRound(this.corners[i + 1][j]),
                    this.#binaryRound(this.corners[i + 1][j + 1]),
                    this.#binaryRound(this.corners[i][j + 1])
                );


                // strokeWeight(ProjectData.SquareSize * 0.4);
                if (ProjectData.DrawFields) {
                    let color = this.#getColor(this.corners[i][j]);

                    fill(color);
                    noStroke();
                    rect(i * ProjectData.SquareSize, j * ProjectData.SquareSize, ProjectData.SquareSize, ProjectData.SquareSize);
                }

                if (ProjectData.DrawLines) {
                    this.#drawLines(state, midPoints);
                }
            }
        }
    }

    resetAutoMapData() {
        MarchingSquares.#max = -3;
        MarchingSquares.#min = 3;
        MarchingSquares.#counter = 0;
    }

    updateNoiseFunction() {
        this.resetAutoMapData();
        let noiseFunc = ProjectData.NoiseFunction.toLowerCase();

        switch (noiseFunc) {

            case 'simplex':
                this.noiseFunction = this.#customSimplex;
                this.noiseFunctionHelper = this.#customSimplex;
                break;

            case 'perlin':
                this.noiseFunction = this.#customPerlin;
                this.noiseFunctionHelper = this.#customPerlin;
                break;

            case 'worley - euclidean':
                this.noiseFunction = this.#customWorleyEuclidean;
                this.noiseFunctionHelper = this.#customWorleyEuclidean;

                break;

            case 'worley - manhattan':
                this.noiseFunction = this.#customWorleyManhattan;
                this.noiseFunctionHelper = this.#customWorleyManhattan;

                break;

            default:
                console.warn("Cant find: " + ProjectData.NoiseFunction + ", set to default simplex noise.");
                this.noiseFunction = this.#customSimplex;
                this.noiseFunctionHelper = this.#customSimplex;
                break;
        }

        if (ProjectData.IsFractalNoise) {
            this.noiseFunction = this.#customFractal;
        }
    }

    #customFractal(xOffset, yOffset, zOffset) {
        return tooloud.Fractal.noise(
            xOffset,
            yOffset,
            zOffset,
            ProjectData.FractalOctaves,
            this.noiseFunctionHelper
        );
    }

    #customSimplex(xOffset, yOffset, zOffset) {
        let value = tooloud.Simplex.noise(xOffset, yOffset, zOffset);

        return Mathematics.map(value, -MarchingSquares.#SIMPLEX_RANGE, MarchingSquares.#SIMPLEX_RANGE, 0, 1);
    }

    #customPerlin(xOffset, yOffset, zOffset) {
        let value = tooloud.Perlin.noise(xOffset, yOffset, zOffset);

        return Mathematics.map(value, -MarchingSquares.#PERLIN_RANGE, MarchingSquares.#PERLIN_RANGE, 0, 1);
    }

    #customWorleyEuclidean(xOffset, yOffset, zOffset) {
        let noiseValues = tooloud.Worley.Euclidean(xOffset, yOffset, zOffset);
        let singleNoiseValue = MarchingSquares.computeWorleyNoise(noiseValues);

        if (MarchingSquares.#counter < MarchingSquares.#AUTO_MAP_LIMIT) {
            MarchingSquares.#automapValues.push(singleNoiseValue);
        }

        return Mathematics.map(singleNoiseValue, MarchingSquares.#min, MarchingSquares.#max, 0, 1);
    }

    #customWorleyManhattan(xOffset, yOffset, zOffset) {
        let noiseValues = tooloud.Worley.Manhattan(xOffset, yOffset, zOffset);
        let singleNoiseValue = MarchingSquares.computeWorleyNoise(noiseValues);

        if (MarchingSquares.#counter < MarchingSquares.#AUTO_MAP_LIMIT) {
            MarchingSquares.#automapValues.push(singleNoiseValue);
        }

        return Mathematics.map(singleNoiseValue, MarchingSquares.#min, MarchingSquares.#max, 0, 1);
    }

    static computeWorleyNoise(noiseValues) {
        const a = ProjectData.Worley0Sign * noiseValues[0];
        const b = ProjectData.Worley1Sign * noiseValues[1];
        const c = ProjectData.Worley2Sign * noiseValues[2];

        let value = a;
        if (ProjectData.Worley1Sign != 0)
            value = ProjectData.Worley0Function(a, b);

        value = ProjectData.Worley1Function(value, c);

        return value;
    }

    #getColor(cornerValue) {

        let color = cornerValue * 255;

        if (ProjectData.MainColor != 'none') {

            let red = ProjectData.MainColor == 'red' ? ProjectData.RedFill * cornerValue : ProjectData.RedFill * 0.2;
            let green = ProjectData.MainColor == 'green' ? ProjectData.GreenFill * cornerValue : ProjectData.GreenFill * 0.2;
            let blue = ProjectData.MainColor == 'blue' ? ProjectData.BlueFill * cornerValue : ProjectData.BlueFill * 0.2;

            color = [red, green, blue];
        }

        return color;
    }

    #computeLerpAmount(a, b) {
        if (b == a)
            return 0.5;

        return (0.5 - a) / (b - a);
    }

    #getMidPoints(i, j) {

        const x = i * ProjectData.SquareSize;
        const y = j * ProjectData.SquareSize;

        let midPoints = {
            top: {
                x: x + MarchingSquares.#HALF_SQUARE_SIZE,
                y: y
            },
            right: {
                x: x + ProjectData.SquareSize,
                y: y + MarchingSquares.#HALF_SQUARE_SIZE,
            },
            bottom: {
                x: x + MarchingSquares.#HALF_SQUARE_SIZE,
                y: y + ProjectData.SquareSize,
            },
            left: {
                x: x,
                y: y + MarchingSquares.#HALF_SQUARE_SIZE,
            }
        }

        if (ProjectData.SmoothSquares) {

            let lerpAmounts = {
                top: 0.5,
                right: 0.5,
                bottom: 0.5,
                left: 0.5
            }

            let topLeft = this.corners[i][j];
            let topRight = this.corners[i + 1][j];
            let botLeft = this.corners[i][j + 1];
            let botRight = this.corners[i + 1][j + 1];

            lerpAmounts.top = this.#computeLerpAmount(topLeft, topRight);
            lerpAmounts.right = this.#computeLerpAmount(topRight, botRight);
            lerpAmounts.bottom = this.#computeLerpAmount(botLeft, botRight);
            lerpAmounts.left = this.#computeLerpAmount(topLeft, botLeft);


            midPoints.top.x = lerp(x, x + ProjectData.SquareSize, lerpAmounts.top);
            midPoints.right.y = lerp(y, y + ProjectData.SquareSize, lerpAmounts.right);
            midPoints.bottom.x = lerp(x, x + ProjectData.SquareSize, lerpAmounts.bottom);
            midPoints.left.y = lerp(y, y + ProjectData.SquareSize, lerpAmounts.left);
        }

        return midPoints;
    }

    #binaryRound(value) {
        if (value > 0.5)
            return 1;
        return 0;
    }

    #getState(a, b, c, d) {
        return 8 * a + 4 * b + 2 * c + d;
    }


    #pointsLine(p1, p2) {
        stroke(ProjectData.LineColor);
        strokeWeight(2);
        line(p1.x, p1.y, p2.x, p2.y);
    }

    #drawLines(state, midPoints) {

        switch (state) {
            case 0:
                // No line
                break;

            case 1:
                this.#pointsLine(midPoints.left, midPoints.bottom);
                break
            case 2:
                this.#pointsLine(midPoints.right, midPoints.bottom);
                break;
            case 3:
                this.#pointsLine(midPoints.right, midPoints.left);
                break;
            case 4:
                this.#pointsLine(midPoints.right, midPoints.top);
                break;
            case 5:
                this.#pointsLine(midPoints.left, midPoints.top);
                this.#pointsLine(midPoints.right, midPoints.bottom);
                break;
            case 6:
                this.#pointsLine(midPoints.top, midPoints.bottom);
                break;
            case 7:
                this.#pointsLine(midPoints.top, midPoints.left);
                break;
            case 8:
                this.#pointsLine(midPoints.top, midPoints.left);
                break;
            case 9:
                this.#pointsLine(midPoints.top, midPoints.bottom);
                break;
            case 10:
                this.#pointsLine(midPoints.top, midPoints.right);
                this.#pointsLine(midPoints.left, midPoints.bottom);
                break;
            case 11:
                this.#pointsLine(midPoints.top, midPoints.right);
                break
            case 12:
                this.#pointsLine(midPoints.right, midPoints.left);
                break;
            case 13:
                this.#pointsLine(midPoints.right, midPoints.bottom);
                break;
            case 14:
                this.#pointsLine(midPoints.left, midPoints.bottom);
                break;
            case 15:
                // No line
                break;

            default:
                break;
        }
    }
}