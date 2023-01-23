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
    // for (let i = 0; i < 300; i++) {
    //     particles.push(
    //         new Particle(1.15, ProjectData.CanvasWidth - 10, i * 2)
    //     );
    // }
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

    checkParticles();
}

function checkParticles() {
    if (particles.length < ProjectData.ParticlesCount) {
        particles.push(
            new Particle(-1, ProjectData.CanvasWidth - 5, random(0, ProjectData.CanvasHeight))
        );
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