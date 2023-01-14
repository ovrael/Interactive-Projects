/** @type {HTMLCanvasElement} */
let canvas;
let blackhole;
let particles;
let projectDataBackUp = Object.entries(ProjectData);


function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();
    ellipseMode(RADIUS);

    blackhole = new Blackhole(
        ProjectData.BlackholeMass,
        ProjectData.BlackholeRadius,
        ProjectData.BlackholeEventHorizonRadius,
        ProjectData.BlackholePosX,
        ProjectData.BlackholePosY
    );

    particles = [];
    for (let i = 0; i < 1; i++) {
        particles.push(
            new Particle(1)
        );
    }
}

function draw() {
    background(90);

    blackhole.update(particles);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }

    blackhole.draw();
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
    }
}

function windowResized() {
    centerCanvas();
}

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    canvas.position(x, y);
}

function resetCanvas() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    centerCanvas();
    blackhole = new blackhole();
}