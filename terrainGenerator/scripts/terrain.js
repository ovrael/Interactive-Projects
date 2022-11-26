class Terrain {

    static #PERLIN_RANGE = 0.866;
    static #SIMPLEX_RANGE = 0.35;

    constructor() {
        this.noiseFunction;
        this.updateNoiseFunction();

        this.columns = Math.ceil(ProjectData.CanvasWidth / ProjectData.TerrainScale);
        this.rows = Math.ceil(ProjectData.CanvasHeight / ProjectData.TerrainScale);

        this.minRow = this.rows + 5;
        this.maxRow = Math.ceil(-this.rows - ProjectData.TerrainRowsOffset);

        this.minCol = Math.ceil(-(this.columns + ProjectData.TerrainColumnsOffset) * 0.5);
        this.maxCol = Math.ceil((this.columns + ProjectData.TerrainColumnsOffset) * 0.5) + 1;

        this.terrainWidth = -this.minCol + this.maxCol;
        this.terrainLength = -this.maxRow + this.minRow;

        this.zOffset = 0;
        this.flying = 0;

        let yOffset = 0;
        this.heights = new Array(this.terrainWidth);
        for (let i = 0; i < this.heights.length; i++) {
            let xOffset = 0;
            this.heights[i] = new Array(this.terrainLength);
            for (let j = 0; j < this.heights[i].length; j++) {
                this.heights[i][j] = map(this.noiseFunction(xOffset, yOffset), 0, 1, 0, ProjectData.MaxHeight) - ProjectData.CameraHeight;
                xOffset += ProjectData.XNoiseOffset;
            }
            yOffset += ProjectData.XNoiseOffset;
        }
    }

    update() {
        let yOffset = 0;
        for (let i = 0; i < this.heights.length; i++) {
            let xOffset = -this.flying;
            for (let j = 0; j < this.heights[i].length; j++) {
                this.heights[i][j] = map(this.noiseFunction(xOffset, yOffset), 0, 1, 0, ProjectData.MaxHeight) - ProjectData.CameraHeight
                xOffset += ProjectData.XNoiseOffset;
            }
            yOffset += ProjectData.YNoiseOffset;
        }

        this.flying += ProjectData.FlyingSpeed;
    }

    show() {

        rotateX(ProjectData.CameraAngle);

        if (ProjectData.DrawTerrainLines) {
            stroke(ProjectData.TerrainLineColor);
        }
        else {
            noStroke();
        }

        for (let y = this.maxRow; y < this.minRow - 1; y++) {
            beginShape(TRIANGLE_STRIP);

            for (let x = this.minCol; x < this.maxCol; x++) {

                const i = x - this.minCol;
                const j = y - this.maxRow;

                if (ProjectData.FillTerrain) {
                    let value = map(this.heights[i][j], -ProjectData.CameraHeight * 0.95, ProjectData.MaxHeight - ProjectData.CameraHeight, 0, 1);
                    fill(this.#getColor(value));
                }
                else
                    noFill();

                vertex(x * ProjectData.TerrainScale, y * ProjectData.TerrainScale, this.heights[i][j]);
                vertex(x * ProjectData.TerrainScale, (y + 1) * ProjectData.TerrainScale, this.heights[i][j + 1]);
            }
            endShape();
        }
    }

    updateNoiseFunction() {
        let noiseFunc = ProjectData.NoiseFunction.toLowerCase();

        switch (noiseFunc) {

            case 'simplex':
                this.noiseFunction = this.#customSimplex;
                break;

            case 'perlin':
                this.noiseFunction = this.#customPerlin;
                break;

            case 'p5Noise':
                this.noiseFunction = this.#customP5Noise;
                break;

            default:
                console.warn("Cant find: " + ProjectData.NoiseFunction + ", set to default simplex noise.");
                this.noiseFunction = this.#customSimplex;
                break;
        }
    }

    #customSimplex(xOffset, yOffset) {
        let value = tooloud.Simplex.noise(xOffset, yOffset, 0);

        return Mathematics.map(value, -Terrain.#SIMPLEX_RANGE, Terrain.#SIMPLEX_RANGE, 0, 1);
    }

    #customPerlin(xOffset, yOffset) {
        let value = tooloud.Perlin.noise(xOffset, yOffset, 0);

        return Mathematics.map(value, -Terrain.#PERLIN_RANGE, Terrain.#PERLIN_RANGE, 0, 1);
    }

    #customP5Noise(xOffset, yOffset) {
        return noise(xOffset, yOffset);
    }

    #getColor(value) {

        let color = value * 255;

        if (ProjectData.MainColor != 'none') {

            let red = ProjectData.MainColor == 'red' ? ProjectData.RedFill * value : ProjectData.RedFill * 0.2;
            let green = ProjectData.MainColor == 'green' ? ProjectData.GreenFill * value : ProjectData.GreenFill * 0.2;
            let blue = ProjectData.MainColor == 'blue' ? ProjectData.BlueFill * value : ProjectData.BlueFill * 0.2;

            color = [red, green, blue];
        }

        return color;
    }
}