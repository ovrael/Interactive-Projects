class Fireworks {

    static gravity = 2.5;
    static fraction = 0.25;

    constructor() {
        this.canvas = document.getElementById('fireworksCanvas');
        this.context = this.canvas.getContext('2d');

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.maxFireworks = 12;
        this.fireworks = new Array(this.maxFireworks);
        this.particles = new Array(this.maxFireworks);

        this.shooting = false;
    }


    start() {
        for (let i = 0; i < this.fireworks.length; i++) {
            setTimeout(() => {
                this.fireworks[i] = new Firework();
            }, Mathematics.randIntMinMax(0, 2000));
        }

        this.shooting = true;
    }

    stop() {
        this.shooting = false;
        this.fireworks = new Array(this.maxFireworks);
        this.particles = new Array(this.maxFireworks);
        this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }


    update() {

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        for (let i = 0; i < this.fireworks.length; i++) {
            if (this.fireworks[i]) {

                this.fireworks[i].update();

                if (this.fireworks[i].explode) {

                    this.particles[i] = new Particles(this.fireworks[i].x, this.fireworks[i].y);
                    this.fireworks[i] = undefined;

                    if (this.shooting) {
                        setTimeout(() => {
                            this.fireworks[i] = new Firework();
                        }, Mathematics.randIntMinMax(400, 1600));
                    }
                }
            }

            if (this.particles[i]) {
                this.particles[i].update();

                if (this.particles[i].expired) {
                    this.particles[i] = undefined;
                }
            }
        }
    };

    draw() {

        this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let i = 0; i < this.fireworks.length; i++) {

            if (this.fireworks[i])
                this.fireworks[i].draw(this.context);

            if (this.particles[i])
                this.particles[i].draw(this.context);
        }
    };
}

class Firework {
    constructor() {
        this.x = Mathematics.randFloatMinMax(window.innerWidth * 0.1, window.innerWidth * 0.9);
        this.y = window.innerHeight;
        this.color = randVividColor_HSL();

        this.angle = Mathematics.randFloatMinMax(-Math.PI / 24, Math.PI / 24);
        this.speed = Mathematics.randFloatMinMax(14, 23);

        this.length = 20;
        this.endX = this.x + this.length * Math.sin(this.angle);
        this.endY = this.y + this.length * Math.cos(this.angle);

        this.lastY = window.innerHeight;

        this.explode = false;
    }

    update() {
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
        this.y += Fireworks.gravity;

        this.endX = this.x + this.length * Math.sin(this.angle);
        this.endY = this.y + this.length * Math.cos(this.angle);

        this.speed -= Fireworks.fraction;

        if (this.y > this.lastY)
            this.explode = true;
        else
            this.lastY = this.y;
    }

    draw(ctx) {

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color;

        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.endX, this.endY);

        ctx.stroke();
    }
}

class Particles {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.particlesCount = Mathematics.randIntMinMax(12, 36);
        this.particlesCoordinates = this.#createParticles();
        this.speed = Mathematics.randFloatMinMax(5, 9);

        this.lifetime = Mathematics.randFloatMinMax(2, 4);
        this.decay = 0.045;

        this.color = randVividColor_HSL();

        this.expired = false;
    }

    #createParticles() {
        let particles = new Array(this.particlesCount);

        for (let i = 0; i < particles.length; i++) {
            particles[i] = {
                x: this.x,
                y: this.y
            }
        }

        return particles;
    }

    update() {

        for (let i = 0; i < this.particlesCoordinates.length; i++) {

            const angle = (i / this.particlesCoordinates.length) * (2 * Math.PI);

            this.particlesCoordinates[i].x -= Math.sin(angle) * this.speed;
            this.particlesCoordinates[i].y -= Math.cos(angle) * this.speed;
            this.particlesCoordinates[i].y += Fireworks.gravity;
        }

        this.lifetime -= this.decay;
        this.speed -= Fireworks.fraction / 3;

        if (this.speed < 1)
            this.speed = 1;

        if (this.lifetime < 0)
            this.expired = true;
    }

    draw(ctx) {

        for (let i = 0; i < this.particlesCoordinates.length; i++) {

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.fillStyle = this.color;

            ctx.arc(this.particlesCoordinates[i].x, this.particlesCoordinates[i].y, 3, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}