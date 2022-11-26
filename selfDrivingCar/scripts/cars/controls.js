class Controls {
    constructor(controlType) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        switch (controlType) {
            case ControlType.User:
                this.#addKeyboardListener();
                break;

            case ControlType.AI:
                break;

            case ControlType.Traffic:
                this.forward = true;
                break;
        }
    }

    #addKeyboardListener() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = true;
                    break;

                case "ArrowRight":
                    this.right = true;
                    break;

                case "ArrowUp":
                    this.forward = true;
                    break;

                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
        }

        document.onkeyup = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = false;
                    break;

                case "ArrowRight":
                    this.right = false;
                    break;

                case "ArrowUp":
                    this.forward = false;
                    break;

                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
        }
    }
}