/** @type {HTMLCanvasElement} */
let canvas;
let PROJECT_VARIABLE;
let projectDataBackUp = Object.entries(ProjectData);

let password = [];

let t0;

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();

    // PROJECT_VARIABLE = NEW_CUSTOM_CLASS_Object();
    password = 'abaa';
    t0 = performance.now();
}

function draw() {
    background(90);
    drawPassword(password);


    tryHack(password);

    noLoop();
}

function intToChar(int) {
    // 👇️ for Uppercase letters, replace `a` with `A`
    const code = 'a'.charCodeAt(0);

    return String.fromCharCode(code + int);
}

function checkPass(hack, pass) {
    for (let i = 0; i < pass.length; i++) {
        if (pass[i] != hack[i])
            return false;
    }

    return true;
}

async function tryHack(pass) {
    drawHack('    ');
    for (let i = 0; i < 26; i++) {

        for (let j = 0; j < 26; j++) {

            for (let k = 0; k < 26; k++) {

                for (let l = 0; l < 26; l++) {
                    await new Promise(r => setTimeout(r, 5));

                    let hack = [];
                    hack.push(intToChar(i));
                    hack.push(intToChar(j));
                    hack.push(intToChar(k));
                    hack.push(intToChar(l));
                    drawHack(hack);

                    let t1 = performance.now();

                    push();
                    stroke(90);
                    fill(90);
                    rect(300, 0, 750, 60);
                    pop();
                    text(`Czas: ${Math.floor(t1 - t0) / 1000} sekund`, 300, 50);

                    if (checkPass(hack, pass)) {
                        stroke(0);
                        fill(0);

                        textSize(60);
                        text('Hasło zhackowane', 30, 450);


                        return;
                    }
                }

            }

        }

    }
}

function drawPassword(pass) {
    const startX = 20;
    const startY = 20;
    const width = 60;
    const height = 100;
    const space = 10;

    for (let i = 0; i < pass.length; i++) {

        stroke(200, 90, 100);
        fill(200, 90, 100);
        rect(startX + i * (space + width), startY, width, height);

        stroke(0);
        fill(0);

        textSize(60);
        text(pass[i], startX + i * (space + width) + space, startY + height - 20);
    }
}

function drawHack(tryPass) {
    const startX = 20;
    const startY = 200;
    const width = 60;
    const height = 100;
    const space = 10;

    for (let i = 0; i < tryPass.length; i++) {

        stroke(90, 200, 100);
        fill(90, 200, 100);
        rect(startX + i * (space + width), startY, width, height);

        stroke(0);
        fill(0);

        textSize(60);
        text(tryPass[i], startX + i * (space + width) + space, startY + height - 20);
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
    PROJECT_VARIABLE = new PROJECT_VARIABLE();
}