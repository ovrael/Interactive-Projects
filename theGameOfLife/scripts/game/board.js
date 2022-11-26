class Board {
    constructor(width, height, canvas) {
        this.width = width;
        this.height = height;

        this.canvas = canvas;
        /** @type {CanvasRenderingContext2D} */
        this.context = canvas.getContext('2d');
        this.controls = new Controls(canvas);

        this.fields = this.#initFields();
        this.updateFields = this.#clearFields();
        this.#copyMainFields();
    }

    #initFields() {
        let fields = new Array(this.width);
        for (let i = 0; i < fields.length; i++) {
            fields[i] = new Array(this.height);

            for (let j = 0; j < fields[i].length; j++) {

                const rand = Math.random();

                if (rand < ProjectData.GenerateBlockadesChance) {
                    fields[i][j] = FieldType.Blockade;
                    continue;
                }

                if (Math.random() < ProjectData.AliveChance) {
                    fields[i][j] = FieldType.Alive;
                } else {
                    fields[i][j] = FieldType.Empty;
                }
            }
        }
        return fields;
    }

    #clearFields() {
        let fields = new Array(this.width);
        for (let i = 0; i < fields.length; i++) {
            fields[i] = new Array(this.height);

            for (let j = 0; j < fields[i].length; j++) {

                fields[i][j] = FieldType.Empty;
            }
        }

        return fields;
    }

    #updateMainFields() {
        for (let i = 0; i < this.fields.length; i++) {
            for (let j = 0; j < this.fields[i].length; j++) {
                this.fields[i][j] = this.updateFields[i][j];
            }
        }
    }

    #copyMainFields() {
        for (let i = 0; i < this.fields.length; i++) {
            for (let j = 0; j < this.fields[i].length; j++) {
                this.updateFields[i][j] = this.fields[i][j];
            }
        }
    }

    #clickOnField() {
        if (this.controls.clickedCoords.length > 0) {

            const clickedFieldCoords = this.controls.clickedCoords.pop();

            const fieldX = Math.floor(clickedFieldCoords.x / ProjectData.FieldSize);
            const fieldY = Math.floor(clickedFieldCoords.y / ProjectData.FieldSize);

            if (fieldX < 0 || fieldX >= this.fields.length || fieldY < 0 || fieldY >= this.fields[0].length) return;

            const clickedField = this.fields[fieldX][fieldY];


            if (clickedFieldCoords.mode == 'single') {
                if (clickedField == FieldType.Alive) {
                    this.fields[fieldX][fieldY] = FieldType.Empty;
                    this.updateFields[fieldX][fieldY] = FieldType.Empty;
                    return;
                }

                if (clickedField == FieldType.Empty) {
                    this.fields[fieldX][fieldY] = FieldType.Alive;
                    this.updateFields[fieldX][fieldY] = FieldType.Alive;
                    return;
                }


                return;
            }

            if (clickedFieldCoords.mode == 'double') {

                if (clickedField == FieldType.Blockade) {
                    this.fields[fieldX][fieldY] = FieldType.Empty;
                    this.updateFields[fieldX][fieldY] = FieldType.Empty;
                    return;
                }

                if (clickedField == FieldType.Empty) {
                    this.fields[fieldX][fieldY] = FieldType.Blockade;
                    this.updateFields[fieldX][fieldY] = FieldType.Blockade;
                    return;
                }

                return;
            }
        }
    }

    #moveContext() {
        this.context.translate(this.controls.xOffset, this.controls.yOffset);
        this.controls.xOffset = 0;
        this.controls.yOffset = 0;
    }

    #countNeighbours(i, j) {

        let neighboursAlive = 0;

        // ON THE LEFT, DIFFERENT HEIGHTS
        if (i > 0) {

            // SAME HEIGHT
            if (this.fields[i - 1][j] == FieldType.Alive) neighboursAlive++;

            // ON TOP
            if (j > 0) {
                if (this.fields[i - 1][j - 1] == FieldType.Alive) neighboursAlive++;
            }

            // ON BOTTOM
            if (j < this.fields[i].length - 1) {
                if (this.fields[i - 1][j + 1] == FieldType.Alive) neighboursAlive++;
            }
        }

        // SAME WIDTH, DIFFERENT HEIGHTS
        // ON TOP
        if (j > 0) {
            if (this.fields[i][j - 1] == FieldType.Alive) neighboursAlive++;
        }

        // ON BOTTOM
        if (j < this.fields[i].length - 1) {
            if (this.fields[i][j + 1] == FieldType.Alive) neighboursAlive++;
        }

        // ON THE RIGHT, DIFFERENT HEIGHTS
        if (i < this.fields.length - 1) {

            // SAME HEIGHT
            if (this.fields[i + 1][j] == FieldType.Alive) neighboursAlive++;

            // ON TOP
            if (j > 0) {
                if (this.fields[i + 1][j - 1] == FieldType.Alive) neighboursAlive++;
            }

            // ON BOTTOM
            if (j < this.fields[i].length - 1) {
                if (this.fields[i + 1][j + 1] == FieldType.Alive) neighboursAlive++;
            }
        }

        return neighboursAlive;
    }

    checkLife() {
        for (let i = 0; i < this.fields.length; i++) {
            for (let j = 0; j < this.fields[i].length; j++) {

                if (this.fields[i][j] == FieldType.Blockade)
                    continue;

                const neighboursAlive = this.#countNeighbours(i, j);

                if (this.fields[i][j] == FieldType.Empty) {
                    if (neighboursAlive == 3) {
                        this.updateFields[i][j] = FieldType.Alive;
                        continue;
                    }
                }

                if (this.fields[i][j] == FieldType.Alive) {
                    if (neighboursAlive < 2 || neighboursAlive > 3)
                        this.updateFields[i][j] = FieldType.Empty;
                    continue;
                }
            }
        }

        this.#updateMainFields();
    }


    update() {
        this.#copyMainFields();
        this.#moveContext();
        this.#clickOnField();
    }

    #takeColor(fieldType) {
        switch (fieldType) {
            case FieldType.Empty:
                return ProjectData.EmptyColor;

            case FieldType.Alive:
                return ProjectData.AliveColor;

            case FieldType.Blockade:
                return ProjectData.BlockadeColor;

            default:
                console.warn('Cant find fieldtype: ' + fieldType);
                break;
        }

        return ProjectData.EmptyColor;
    }

    #drawField(x, y) {

        // DON'T DRAW TOO FAR ON LEFT
        if ((x + 1) * ProjectData.FieldSize + this.controls.canvasXOffset < (ProjectData.FieldsWidth * ProjectData.FieldSize - mainCanvas.width) / 2) {
            return;
        }

        // DON'T DRAW TOO FAR ON RIGHT
        if ((x - 1) * ProjectData.FieldSize * ProjectData.CanvasScale + this.controls.canvasXOffset > (ProjectData.FieldsWidth * ProjectData.FieldSize * ProjectData.CanvasScale + mainCanvas.width) / 2) {
            return;
        }

        // DON'T DRAW TOO FAR ON TOP
        if ((y + 1) * ProjectData.FieldSize * ProjectData.CanvasScale + this.controls.canvasYOffset < (ProjectData.FieldsHeight * ProjectData.FieldSize * ProjectData.CanvasScale - mainCanvas.height) / 2) {
            return;
        }

        // DON'T DRAW TOO FAR ON BOTTOM
        if ((y - 1) * ProjectData.FieldSize * ProjectData.CanvasScale + this.controls.canvasYOffset > (ProjectData.FieldsHeight * ProjectData.FieldSize * ProjectData.CanvasScale + mainCanvas.height) / 2) {
            return;
        }

        const field = this.fields[x][y];

        this.context.beginPath();
        const size = ProjectData.FieldSize;
        const x0 = x * size;
        const y0 = y * size;
        this.context.moveTo(x0, y0);
        this.context.lineTo(x0 + size, y0);
        this.context.lineTo(x0 + size, y0 + size);
        this.context.lineTo(x0, y0 + size);
        this.context.lineTo(x0, y0);

        this.context.strokeStyle = 'black';
        this.context.lineWidth = 0.1;
        this.context.stroke();

        this.context.fillStyle = this.#takeColor(field);
        this.context.fill();
    }

    draw() {

        const outsideXOffset = ProjectData.FieldSize * ProjectData.FieldsWidth * 0.5;
        const outsideYOffset = ProjectData.FieldSize * ProjectData.FieldsWidth * 0.5;

        this.context.fillStyle = 'rgb(30,30,30)';
        this.context.rect(
            -outsideXOffset,
            -outsideYOffset,
            this.width * ProjectData.FieldSize + 2 * outsideXOffset,
            this.height * ProjectData.FieldSize + 2 * outsideYOffset);
        this.context.fill();

        for (let i = 0; i < this.fields.length; i++) {
            for (let j = 0; j < this.fields[i].length; j++) {
                this.#drawField(i, j);
            }
        }
    }

    reset() {
        this.fields = this.#initFields();
        this.updateFields = this.#clearFields();
        this.#copyMainFields();
    }

    clear() {
        this.fields = this.#clearFields();
        this.updateFields = this.#clearFields();
    }

    updateWidth() {
        if (ProjectData.FieldsWidth > this.width) {
            this.#increaseWidth(ProjectData.FieldsWidth - this.width);
        } else if (ProjectData.FieldsWidth < this.width) {
            this.#reduceWidth(this.width - ProjectData.FieldsWidth);
        }
    }

    #increaseWidth(change) {
        for (let i = 0; i < change; i++) {
            this.fields.push(new Array(this.height));
            this.updateFields.push(new Array(this.height));
        }

        for (let i = this.width; i < this.fields.length; i++) {
            for (let j = 0; j < this.fields[i].length; j++) {
                this.fields[i][j] = FieldType.Empty;
                this.updateFields[i][j] = FieldType.Empty;
            }
        }

        this.width = this.fields.length;
    }

    #reduceWidth(change) {
        for (let i = 0; i < change; i++) {
            this.fields.pop();
            this.updateFields.pop();
        }

        this.width = this.fields.length;
        ProjectData.FieldsWidth = this.width;
    }

    updateHeight() {
        if (ProjectData.FieldsHeight > this.height) {
            this.#increaseHeight(ProjectData.FieldsHeight - this.height);
        } else if (ProjectData.FieldsHeight < this.height) {
            this.#reduceHeight(this.height - ProjectData.FieldsHeight);
        }
    }

    #increaseHeight(change) {

        for (let i = 0; i < this.fields.length; i++) {
            for (let j = 0; j < change; j++) {
                this.fields[i].push(FieldType.Empty);
                this.updateFields[i].push(FieldType.Empty);
            }
        }

        this.height = this.fields[0].length;
    }

    #reduceHeight(change) {

        for (let i = 0; i < change; i++) {
            for (let j = 0; j < this.fields.length; j++) {
                this.fields[j].pop();
                this.updateFields[j].pop();
            }
        }

        this.height = this.fields[0].length;
        ProjectData.FieldsHeight = this.height;
    }

    updateFieldSize(newSize) {
        const sign = newSize > ProjectData.FieldSize ? -1 : 1;
        const dx = Math.floor(Math.abs(this.controls.canvasXOffset) / ProjectData.FieldSize) * sign;
        const dy = Math.floor(Math.abs(this.controls.canvasYOffset) / ProjectData.FieldSize) * sign;

        if (this.controls.canvasXOffset > 0) {
            this.controls.canvasXOffset -= dx;
        } else if (this.controls.canvasXOffset < 0) {
            this.controls.canvasXOffset += dx;
        }

        if (this.controls.canvasYOffset > 0) {
            this.controls.canvasYOffset -= dy;
        } else if (this.controls.canvasYOffset < 0) {
            this.controls.canvasYOffset += dy;
        }

        ProjectData.FieldSize = newSize;
    }

    loadBoard(loadedBoard) {
        this.width = loadedBoard.length;
        this.height = loadedBoard[0].length;

        this.fields = new Array(this.width);
        this.updateFields = new Array(this.width);

        for (let i = 0; i < this.fields.length; i++) {
            this.fields[i] = new Array(this.height);
            this.updateFields[i] = new Array(this.height);

            for (let j = 0; j < this.fields[i].length; j++) {
                this.fields[i][j] = loadedBoard[i][j];
                this.updateFields[i][j] = loadedBoard[i][j];
            }
        }

        ProjectData.FieldsWidth = this.width;
        ProjectData.FieldsHeight = this.height;
        this.draw();
    }
}