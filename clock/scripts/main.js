const clock = new Clock();
const clockSize = 400;
const frameWidth = 10;
const fontSize = 48;
const tipOffset = clockSize / 12;

let centerX = 0;
let centerY = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(51);
    frameRate(24);

    textAlign(CENTER);
    textSize(fontSize);
    textFont('consolas');

    centerX = width / 2;
    centerY = height / 2 - 100;
}

function draw() {
    background(51);

    fill(0);
    ellipse(centerX, centerY, clockSize + frameWidth, clockSize + frameWidth);


    fill(71);
    ellipse(centerX, centerY, clockSize, clockSize);

    drawHoursLines();
    drawSeconds();
    drawMinutes();
    drawHours();

    textSize(fontSize);
    fill(clock.textColor);
    text(clock.getTime(), centerX, (height + clockSize) / 2 + frameWidth + fontSize);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    centerX = width / 2;
    centerY = height / 2 - 100;
}


function drawHoursLines() {
    strokeWeight(2);
    stroke(0);

    for (let i = 0; i < 12; i++) {
        push();
        translate(centerX, centerY);
        const angle = Math.PI * 2 * (i / 12);
        rotate(angle);
        line(0, clockSize / 2, 0, clockSize / 2 - tipOffset / 2);
        pop();
    }
}

function drawSeconds() {

    push();
    strokeWeight(3);
    stroke(240, 30, 30);

    const angle = Math.PI * 2 * clock.getSecondsAngle();
    translate(centerX, centerY);
    rotate(angle);
    line(0, 0, 0, clockSize / 2 - tipOffset);
    pop();
}

function drawMinutes() {

    push();
    strokeWeight(4);
    stroke(255, 180, 50);

    const angle = Math.PI * 2 * clock.getMinutesAngle();
    translate(centerX, centerY);
    rotate(angle);
    line(0, 0, 0, clockSize / 2 - tipOffset * 1.5);
    pop();
}

function drawHours() {

    push();
    strokeWeight(6);
    stroke(50, 150, 20);

    const angle = Math.PI * 2 * clock.getHoursAngle();
    translate(centerX, centerY);
    rotate(angle);
    line(0, 0, 0, clockSize / 2 - tipOffset * 3);
    pop();
}
