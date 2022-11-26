class Board {

    #width = 0;
    #height = 0;
    #fieldSize = 0;
    #fields = null;

    #controls = null;
    #snake = null;

    #checkingFood = false;
    #currentFoodCount = 0;
    #maxFood = 0;
    #score = 0;

    constructor(width, height, fieldSize, maxFood) {
        this.#width = width;
        this.#height = height;
        this.#fieldSize = fieldSize;
        this.#maxFood = maxFood;
        this.#score = 0;
        document.getElementById('scoreTextDiv').innerHTML = "SCORE: " + this.#score;

        this.#controls = new Controls();
        this.#snake = this.#initSnake();
        this.#fields = this.#initFields();
    }

    getSnakeLength() {
        return this.#snake.length;
    }

    #initSnake() {
        let snake = [];

        const midWidth = Math.floor(this.#width / 2);
        const midHeight = Math.floor(this.#height / 2);

        snake.push({
            x: midWidth,
            y: midHeight,
            part: FieldType.SnakeHead
        });
        return snake;
    }

    #initFields() {

        let board = []
        for (let i = 0; i < this.#width; i++) {

            board.push(new Array(this.#height));

            for (let j = 0; j < board[i].length; j++) {
                board[i][j] = FieldType.Empty;
            }
        }

        for (let i = 0; i < this.#snake.length; i++) {
            board[this.#snake[i].x][this.#snake[i].y] = this.#snake[i].part;
        }

        return board;
    }

    #move() {

        let dx = 0;
        let dy = 0;

        let up = this.#controls.up;
        let left = this.#controls.left;
        let right = this.#controls.right;
        let down = this.#controls.down;

        if (this.#controls.queue.length > 0) {
            up = this.#controls.queue[0].up;
            left = this.#controls.queue[0].left;
            right = this.#controls.queue[0].right;
            down = this.#controls.queue[0].down;
            this.#controls.queue.shift();
        }

        if (up) {
            if (this.#snake[0].y <= 0) {
                this.#die();
                return;
            }
            if (this.#snake.length > 1 && (this.#snake[1].y == this.#snake[0].y - 1)) return;

            dy--;
        }

        if (left) {
            if (this.#snake[0].x <= 0) {
                this.#die();
                return;
            }
            if (this.#snake.length > 1 && (this.#snake[1].x == this.#snake[0].x - 1)) return;
            dx--;
        }

        if (right) {
            if (this.#snake[0].x >= this.#width - 1) {
                this.#die();
                return;
            }
            if (this.#snake.length > 1 && (this.#snake[1].x == this.#snake[0].x + 1)) return;
            dx++;
        }

        if (down) {
            if (this.#snake[0].y >= this.#height - 1) {
                this.#die();
                return;
            }
            if (this.#snake.length > 1 && (this.#snake[1].y == this.#snake[0].y + 1)) return;
            dy++;
        }

        if (dx == 0 && dy == 0) return;

        if (this.#fields[this.#snake[0].x + dx][this.#snake[0].y + dy] >= FieldType.SnakeHead) {
            this.#die();
            return;
        }

        this.#fields[this.#snake[this.#snake.length - 1].x][this.#snake[this.#snake.length - 1].y] = FieldType.Empty;

        for (let i = this.#snake.length - 1; i > 0; i--) {
            this.#snake[i].x = this.#snake[i - 1].x;
            this.#snake[i].y = this.#snake[i - 1].y;
        }
        this.#snake[0].x += dx;
        this.#snake[0].y += dy;

        const snakeHead = this.#snake[0];
        const headField = this.#fields[snakeHead.x][snakeHead.y]

        if (headField == FieldType.Food) {
            this.#eatFood(dx, dy);
            this.#updateScore();
        }

        for (let i = 0; i < this.#snake.length; i++) {
            const snakePart = this.#snake[i];
            this.#fields[snakePart.x][snakePart.y] = snakePart.part;
        }
    }

    #die() {
        Game.gameOver(this.#score);
    }

    #eatFood(dx, dy) {
        this.#currentFoodCount--;

        const snakeTail = this.#snake[this.#snake.length - 1];

        if (this.#snake.length > 1) {
            const snakePreviousTail = this.#snake[this.#snake.length - 2];
            dx = 0;
            dy = 0;
            if (snakeTail.x > snakePreviousTail.x) // going left
                dx = -1;

            if (snakeTail.x < snakePreviousTail.x) // going right
                dx = 1;

            if (snakeTail.y > snakePreviousTail.y)  //going up
                dy = -1;

            if (snakeTail.y < snakePreviousTail.y) // going down
                dy = 1;
        }
        let newX = snakeTail.x - dx;
        let newY = snakeTail.y - dy;

        if (newX < 0 || newX >= this.#width) {
            newX = snakeTail.x;

            if (newY > 0 && newY <= this.#height)
                newY--;
            else if (newY == 0)
                newY == 1;
        }

        if (newY < -1 || newY >= this.#height) {
            newY = snakeTail.y;

            if (newX > 0 && newX <= this.#width)
                newX--;
            else if (newX == 0)
                newX == 1;
        }

        if (this.#snake.length > 1)
            this.#snake[this.#snake.length - 1].part = FieldType.Snake;
        this.#snake.push({
            x: newX,
            y: newY,
            part: FieldType.SnakeTail
        });
    }

    #updateScore() {
        this.#score++;
        document.getElementById('scoreTextDiv').innerHTML = "SCORE: " + this.#score;
    }

    #checkFood() {
        if (this.#currentFoodCount >= this.#maxFood) return;
        if (this.#getEmptyFieldsCount() <= 0) return;
        if (this.#checkingFood) return;
        if (!this.#controls.isMoving()) return;

        this.#checkingFood = true;
        const randomTime = Mathematics.randIntMinMax(1, 6) * 1000;

        setTimeout(() => {
            this.#createFood();
            this.#checkingFood = false;
        }, randomTime);
    }

    #getEmptyFieldsCount() {
        return this.#width * this.#height - this.#snake.length - this.#currentFoodCount;
    }

    #createFood() {
        this.#currentFoodCount++;

        let xFood = Mathematics.randIntMax(this.#width);
        let yFood = Mathematics.randIntMax(this.#height);

        let foodField = this.#fields[xFood][yFood];
        while (foodField != FieldType.Empty) {
            xFood = Mathematics.randIntMax(this.#width);
            yFood = Mathematics.randIntMax(this.#height);
            foodField = this.#fields[xFood][yFood];
        }

        this.#fields[xFood][yFood] = FieldType.Food;
    }

    update() {
        this.#move();
        this.#checkFood();
    }

    #drawEmpty(ctx, i, j) {
        ctx.beginPath();
        ctx.moveTo(i * this.#fieldSize, j * this.#fieldSize);
        ctx.lineTo(i * this.#fieldSize + this.#fieldSize, j * this.#fieldSize);
        ctx.lineTo(i * this.#fieldSize + this.#fieldSize, j * this.#fieldSize + this.#fieldSize);
        ctx.lineTo(i * this.#fieldSize, j * this.#fieldSize + this.#fieldSize);
        ctx.lineTo(i * this.#fieldSize, j * this.#fieldSize);
        ctx.lineWidth = 1;
        ctx.fillStyle = ProjectData.BoardColor;
        ctx.stroke();
        ctx.fill();
    }

    #drawFood(ctx, i, j) {
        const offset = Math.floor(this.#fieldSize * 0.35);
        const offset2 = 4;

        ctx.beginPath();
        ctx.moveTo(i * this.#fieldSize + offset2, j * this.#fieldSize + offset);
        ctx.lineTo(i * this.#fieldSize + offset, j * this.#fieldSize + offset2);

        ctx.lineTo(i * this.#fieldSize + this.#fieldSize - offset, j * this.#fieldSize + offset2);
        ctx.lineTo(i * this.#fieldSize + this.#fieldSize - offset2, j * this.#fieldSize + offset);

        ctx.lineTo(i * this.#fieldSize + this.#fieldSize - offset2, j * this.#fieldSize + this.#fieldSize - offset);
        ctx.lineTo(i * this.#fieldSize + this.#fieldSize - offset, j * this.#fieldSize + this.#fieldSize - offset2);

        ctx.lineTo(i * this.#fieldSize + offset, j * this.#fieldSize + this.#fieldSize - offset2);
        ctx.lineTo(i * this.#fieldSize + offset2, j * this.#fieldSize + this.#fieldSize - offset);

        ctx.lineTo(i * this.#fieldSize + offset2, j * this.#fieldSize + offset);
        ctx.lineWidth = 1;
        ctx.fillStyle = ProjectData.FoodColor;
        ctx.stroke();
        ctx.fill();
    }

    #drawSnakeHead(ctx, i, j) {
        ctx.beginPath();
        ctx.moveTo(i * this.#fieldSize, j * this.#fieldSize);
        ctx.lineTo(i * this.#fieldSize + this.#fieldSize, j * this.#fieldSize);
        ctx.lineTo(i * this.#fieldSize + this.#fieldSize, j * this.#fieldSize + this.#fieldSize);
        ctx.lineTo(i * this.#fieldSize, j * this.#fieldSize + this.#fieldSize);
        ctx.lineTo(i * this.#fieldSize, j * this.#fieldSize);
        ctx.lineWidth = 0;
        ctx.fillStyle = ProjectData.SnakeHeadColor;
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "black";

        let dx1 = 0.25;
        let dy1 = 0.25;

        let dx2 = 0.75;
        let dy2 = 0.25;

        if (this.#controls.down) {
            dx1 = 0.25;
            dy1 = 0.75;
            dx2 = 0.75;
            dy2 = 0.75;
        }

        if (this.#controls.left) {
            dx1 = 0.25;
            dy1 = 0.25;
            dx2 = 0.25;
            dy2 = 0.75;
        }

        if (this.#controls.right) {
            dx1 = 0.75;
            dy1 = 0.25;
            dx2 = 0.75;
            dy2 = 0.75;
        }

        ctx.arc(
            i * this.#fieldSize + this.#fieldSize * dx1,
            j * this.#fieldSize + this.#fieldSize * dy1,
            2,
            0,
            360
        );

        ctx.arc(
            i * this.#fieldSize + this.#fieldSize * dx2,
            j * this.#fieldSize + this.#fieldSize * dy2,
            2,
            0,
            360
        );

        ctx.fill();
    }

    #findSnakePart(x, y) {
        for (let i = 0; i < this.#snake.length; i++) {
            const snakePart = this.#snake[i];

            if (snakePart.x == x && snakePart.y == y)
                return i;
        }

        return -1;
    }

    #drawSnake(ctx, i, j) {
        ctx.beginPath();
        ctx.moveTo(i * this.#fieldSize, j * this.#fieldSize);
        ctx.lineTo(i * this.#fieldSize + this.#fieldSize, j * this.#fieldSize);
        ctx.lineTo(i * this.#fieldSize + this.#fieldSize, j * this.#fieldSize + this.#fieldSize);
        ctx.lineTo(i * this.#fieldSize, j * this.#fieldSize + this.#fieldSize);
        ctx.lineTo(i * this.#fieldSize, j * this.#fieldSize);
        ctx.lineWidth = 0;
        ctx.fillStyle = ProjectData.SnakeColor;
        ctx.fill();

        // left
        const snakeIndex = this.#findSnakePart(i, j);
        if (snakeIndex < 0) return;
        if (this.#snake.length < 3) return;

        const prev = this.#snake[snakeIndex - 1];
        const next = this.#snake[snakeIndex + 1];
        // left
        if (!(prev.x == i - 1 && prev.y == j || next.x == i - 1 && next.y == j)) {
            if (i > 0 && this.#fields[i - 1][j] == FieldType.Snake) {
                ctx.beginPath();
                ctx.moveTo(i * this.#fieldSize, j * this.#fieldSize);
                ctx.lineTo(i * this.#fieldSize, j * this.#fieldSize + this.#fieldSize);
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }

        // right
        if (!(prev.x == i + 1 && prev.y == j || next.x == i + 1 && next.y == j)) {
            if (i < this.#fields.length - 2 && this.#fields[i + 1][j] == FieldType.Snake) {
                ctx.beginPath();
                ctx.moveTo(i * this.#fieldSize + this.#fieldSize, j * this.#fieldSize);
                ctx.lineTo(i * this.#fieldSize + this.#fieldSize, j * this.#fieldSize + this.#fieldSize);
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }

        // up
        if (!(prev.x == i && prev.y == j - 1 || next.x == i && next.y == j - 1)) {
            if (j > 0 && this.#fields[i][j - 1] == FieldType.Snake) {
                ctx.beginPath();
                ctx.moveTo(i * this.#fieldSize, j * this.#fieldSize);
                ctx.lineTo(i * this.#fieldSize + this.#fieldSize, j * this.#fieldSize);
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }

        // down
        if (!(prev.x == i && prev.y == j + 1 || next.x == i && next.y == j + 1)) {
            if (j < this.#fields[0].length - 2 && this.#fields[i][j + 1] == FieldType.Snake) {
                ctx.beginPath();
                ctx.moveTo(i * this.#fieldSize, j * this.#fieldSize + this.#fieldSize);
                ctx.lineTo(i * this.#fieldSize + this.#fieldSize, j * this.#fieldSize + this.#fieldSize);
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    #drawSnakeTail(ctx, i, j) {
        const offset = 1;

        let x0 = i * this.#fieldSize;
        let y0 = j * this.#fieldSize;

        let x1 = x0 + this.#fieldSize;
        let y1 = y0;

        let x2 = x0 + this.#fieldSize / 2;
        let y2 = y0 + this.#fieldSize;

        let x3 = x0;
        let y3 = y0;

        const tail = this.#snake[this.#snake.length - 1];
        const prevTail = this.#snake[this.#snake.length - 2];
        let up = prevTail.y < tail.y;
        let down = prevTail.y > tail.y;
        let left = prevTail.x < tail.x;
        let right = prevTail.x > tail.x;

        if (up) {
            y0 -= offset;
            y1 = y0;
            y3 = y0;
        }

        if (down) {
            y0 += this.#fieldSize;
            y2 = y0 - this.#fieldSize;

            y0 += offset;
            y1 = y0;
            y3 = y0;
        }

        if (left) {
            y1 = y0 + this.#fieldSize;

            x2 = x0 + this.#fieldSize;
            y2 = y0 + this.#fieldSize / 2;

            x0 -= offset;
            x1 = x0;
            x3 = x0;
        }

        if (right) {
            x0 += this.#fieldSize;

            y1 = y0 + this.#fieldSize;

            x2 = x0 - this.#fieldSize;
            y2 = y0 + this.#fieldSize / 2;

            x0 += offset;
            x1 = x0;
            x3 = x0;
        }

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);

        ctx.lineWidth = 0;
        ctx.fillStyle = ProjectData.SnakeTailColor;
        ctx.fill();
    }

    draw(ctx) {

        for (let i = 0; i < this.#fields.length; i++) {
            for (let j = 0; j < this.#fields[i].length; j++) {

                switch (this.#fields[i][j]) {

                    case FieldType.Empty:
                        this.#drawEmpty(ctx, i, j);
                        break;

                    case FieldType.Snake:
                        this.#drawSnake(ctx, i, j);
                        break;

                    case FieldType.SnakeHead:
                        this.#drawSnakeHead(ctx, i, j);
                        break;

                    case FieldType.SnakeTail:
                        this.#drawEmpty(ctx, i, j);
                        this.#drawSnakeTail(ctx, i, j);
                        break;

                    case FieldType.Food:
                        this.#drawEmpty(ctx, i, j);
                        this.#drawFood(ctx, i, j);
                        break;

                    default:
                        console.warn("Cant find field type: " + this.#fields[i][j]);
                        break;
                }
            }
        }
    }

    updateWidth() {
        if (ProjectData.BoardFieldsWidth > this.#width) {
            this.#increaseWidth(ProjectData.BoardFieldsWidth - this.#width);
        } else if (ProjectData.BoardFieldsWidth < this.#width) {
            this.#reduceWidth(this.#width - ProjectData.BoardFieldsWidth);
        }
    }

    #reinitSnakeHead() {
        if (this.#snake.length == 1 && !this.#controls.isMoving()) {

            this.#fields[this.#snake[0].x][this.#snake[0].y] = FieldType.Empty;
            this.#snake = this.#initSnake();
            this.#fields[this.#snake[0].x][this.#snake[0].y] = FieldType.Snake;
        }
    }

    #getMostRightSnakePosition() {
        let maxRight = 0;
        for (let i = 0; i < this.#snake.length; i++) {
            if (this.#snake[i].x > maxRight) {
                maxRight = this.#snake[i].x;
            }
        }

        return maxRight;
    }

    #increaseWidth(change) {

        for (let i = 0; i < change; i++) {
            this.#fields.push(new Array(this.#height));
        }

        for (let i = this.#width; i < this.#fields.length; i++) {
            for (let j = 0; j < this.#fields[i].length; j++) {
                this.#fields[i][j] = FieldType.Empty;
            }
        }

        this.#width = this.#fields.length;
        this.#reinitSnakeHead();
    }

    #reduceWidth(change) {
        const maxRightCut = this.#getMostRightSnakePosition();

        for (let i = 0; i < change; i++) {

            if (this.#fields.length == maxRightCut + 1)
                break;

            const lastIndex = this.#fields.length - 1;
            for (let j = 0; j < this.#fields[lastIndex].length; j++) {
                if (this.#fields[lastIndex][j] == FieldType.Food) {
                    this.#currentFoodCount--;
                }
            }
            this.#fields.pop();
        }

        this.#width = this.#fields.length;
        ProjectData.BoardFieldsWidth = this.#width;

        this.#reinitSnakeHead();
    }

    updateHeight() {
        if (ProjectData.BoardFieldsHeight > this.#height) {
            this.#increaseHeight(ProjectData.BoardFieldsHeight - this.#height);
        } else if (ProjectData.BoardFieldsHeight < this.#height) {
            this.#reduceHeight(this.#height - ProjectData.BoardFieldsHeight);
        }
    }

    #getMostBottomSnakePosition() {
        let maxBottom = 0;
        for (let i = 0; i < this.#snake.length; i++) {
            if (this.#snake[i].y > maxBottom) {
                maxBottom = this.#snake[i].y;
            }
        }

        return maxBottom;
    }

    #increaseHeight(change) {

        for (let i = 0; i < this.#fields.length; i++) {
            for (let j = 0; j < change; j++) {
                this.#fields[i].push(FieldType.Empty);
            }
        }

        this.#height = this.#fields[0].length;
        this.#reinitSnakeHead();
    }

    #reduceHeight(change) {
        const maxBottomCut = this.#getMostBottomSnakePosition();

        for (let i = 0; i < change; i++) {

            if (this.#fields[0].length == maxBottomCut + 1)
                break;

            const lastIndex = this.#fields[0].length - 1;

            for (let j = 0; j < this.#fields.length; j++) {
                if (this.#fields[j][lastIndex] == FieldType.Food) {
                    this.#currentFoodCount--;
                }
                this.#fields[j].pop();
            }
        }

        this.#height = this.#fields[0].length;
        ProjectData.BoardFieldsHeight = this.#height;

        this.#reinitSnakeHead();
    }

    updateFieldSize() {
        this.#fieldSize = ProjectData.BoardFieldSize;
    }

    updateMaxFood() {
        this.#maxFood = ProjectData.MaxFood;

        let i = 0;
        while (this.#currentFoodCount > this.#maxFood) {

            for (let j = 0; j < this.#fields[i].length; j++) {
                if (this.#fields[i][j] == FieldType.Food) {
                    this.#fields[i][j] = FieldType.Empty;
                    this.#currentFoodCount--;
                    break;
                }
            }
            i++;
        }
    }
}