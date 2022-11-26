class Controls {

    constructor() {
        this.up = false;
        this.left = false;
        this.right = false;
        this.down = false;

        this.queue = [];

        this.#addKeyboardListener();
    }

    isMoving() {
        if (this.up) return true;
        if (this.left) return true;
        if (this.right) return true;
        if (this.down) return true;

        return false;
    }

    #addKeyboardListener() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case "a":
                case "A":
                case "ArrowLeft":
                    if (this.right && board.getSnakeLength() > 1) return;

                    this.up = false;
                    this.left = true;
                    this.right = false;
                    this.down = false;

                    this.queue.push({
                        up: false,
                        left: true,
                        right: false,
                        down: false,
                    });

                    break;

                case "d":
                case "D":
                case "ArrowRight":
                    if (this.left && board.getSnakeLength() > 1) return;

                    this.up = false;
                    this.left = false;
                    this.right = true;
                    this.down = false;

                    this.queue.push({
                        up: false,
                        left: false,
                        right: true,
                        down: false,
                    });

                    break;

                case "w":
                case "W":
                case "ArrowUp":
                    if (this.down && board.getSnakeLength() > 1) return;
                    this.up = true;
                    this.left = false;
                    this.right = false;
                    this.down = false;

                    this.queue.push({
                        up: true,
                        left: false,
                        right: false,
                        down: false,
                    });

                    break;

                case "s":
                case "S":
                case "ArrowDown":
                    if (this.up && board.getSnakeLength() > 1) return;
                    this.up = false;
                    this.left = false;
                    this.right = false;
                    this.down = true;

                    this.queue.push({
                        up: false,
                        left: false,
                        right: false,
                        down: true,
                    });

                    break;

                case "Escape":
                    ProjectData.Pause = !ProjectData.Pause;
                    document.getElementById('pauseDiv').hidden = !ProjectData.Pause;
                    break;
            }
        }
    }
}