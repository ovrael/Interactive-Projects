class Controls {

    constructor(canvas) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;

        this.canvasXOffset = 0;
        this.canvasYOffset = 0;

        this.xOffset = 0;
        this.yOffset = 0;

        this.clickedCoords = [];

        this.moveFunction;

        this.#addMouseListeners();
    }

    #addMouseListeners() {

        this.canvas.addEventListener('mousedown', (e) => {

            switch (e.button) {
                case 0: // LEFT CLICK
                    this.#leftClick(e, 'single');
                    break;
                case 1: // SCROLL CLICK
                    if (!ProjectData.ComfortableControls) {
                        this.#removeMoveCanvasEvent();
                        this.#addMoveCanvasEvent();
                    } else {
                        document.body.style.cursor = 'pointer';
                        this.#leftClick(e, 'double');
                        document.body.style.cursor = 'pointer';
                    }
                    break;
                case 2: // RIGHT CLICK
                    if (!ProjectData.ComfortableControls) break;

                    this.#removeMoveCanvasEvent();
                    this.#addMoveCanvasEvent();

                    break;
                default:
                    break;
            }
        }, false);

        document.addEventListener('contextmenu', (e) => {
            if (ProjectData.ComfortableControls)
                e.preventDefault();

        }, false);

        this.canvas.addEventListener('dblclick', (e) => {

            if (e.button != 0)
                return;

            if (ProjectData.ComfortableControls)
                return;

            this.#leftClick(e, 'double');

            document.body.style.cursor = 'default';
        }, false);

        document.addEventListener('mouseup', (e) => {

            switch (e.button) {
                case 1: // SCROLL UP
                    if (!ProjectData.ComfortableControls)
                        this.#removeMoveCanvasEvent();
                    break;
                case 2: // RIGHT CLICK
                    if (ProjectData.ComfortableControls)
                        this.#removeMoveCanvasEvent();

                    break;
                default:
                    break;
            }

            document.body.style.cursor = 'default';

        }, false);
    }

    #addMoveCanvasEvent() {
        this.canvas.addEventListener('mousemove', this.moveFunction = (event) => {
            document.body.style.cursor = 'grab';

            const boundariesWidth = 200;
            // CHECK IF MOVED CONTEXT WILL BE OUTSIED BOUNDARIES
            if (Math.abs(this.canvasXOffset + event.movementX) + this.canvas.width * 0.5 >= ProjectData.FieldSize * ProjectData.FieldsWidth * 0.5 + boundariesWidth) {
                return;
            }

            if (Math.abs(this.canvasYOffset + event.movementY) + this.canvas.height * 0.5 >= ProjectData.FieldSize * ProjectData.FieldsHeight * 0.5 + boundariesWidth) {
                return;
            }

            this.xOffset += event.movementX;
            this.yOffset += event.movementY;

            this.canvasXOffset += event.movementX;
            this.canvasYOffset += event.movementY;
        }, false);
    }

    #removeMoveCanvasEvent() {
        this.canvas.removeEventListener('mousemove', this.moveFunction);
        document.body.style.cursor = 'default';
    }

    #leftClick(/** @type {MouseEvent} */ event, mode) {

        const contextWidth = ProjectData.FieldsWidth * ProjectData.FieldSize;
        const contextHeight = ProjectData.FieldsHeight * ProjectData.FieldSize;

        this.clickedCoords.push({
            x: event.clientX - window.innerWidth / 2 - this.canvasXOffset + contextWidth / 2,
            y: event.clientY - window.innerHeight / 2 - this.canvasYOffset + contextHeight / 2,
            mode: mode
        });
    }
}