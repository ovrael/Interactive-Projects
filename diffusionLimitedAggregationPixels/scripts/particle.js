class Particle {

    constructor() {
        this.x = 0;
        this.y = 0;
        this.angle = 0;

        this.#randomEdgePosition();
    }

    #randomEdgePosition() {
        const offset = 1;
        // On X axis
        if (Math.random() > 0.5) {
            this.x = Math.random() * ProjectData.CanvasWidth;
            if (Math.random() > 0.5) {
                this.y = offset;
                //this.angle = 3 * Math.PI / 2;
            } else {
                this.y = ProjectData.CanvasHeight - offset;
                //this.angle = Math.PI / 2;
            }
        }
        else { // On Y axis
            this.y = Math.random() * ProjectData.CanvasHeight;
            if (Math.random() > 0.5) {
                this.x = offset;
                //this.angle = 0;
            } else {
                this.x = ProjectData.CanvasWidth - offset;
                //this.angle = Math.PI;
            }
        }

        this.angle = Math.random() * 2 * Math.PI;
    }

    #checkBorders() {
        // Wrap around the screen
        if (this.x >= ProjectData.CanvasWidth) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = ProjectData.CanvasWidth - 1;
        }
        if (this.y >= ProjectData.CanvasHeight) {
            this.y = 0;
        } else if (this.y < 0) {
            this.y = ProjectData.CanvasHeight - 1;
        }
    }

    move() {
        this.angle += (Math.random() - 0.5) * 0.2;
        //this.angle += Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2;
        this.x += Math.cos(this.angle) * ProjectData.ParticleSpeed;
        this.y += Math.sin(this.angle) * ProjectData.ParticleSpeed;

        this.#checkBorders();
    }
}