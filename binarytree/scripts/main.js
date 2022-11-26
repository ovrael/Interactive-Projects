/** @type {HTMLCanvasElement} */
let canvas;
let binaryTree = new BinaryTree();

const maxNumber = 200;
let searchNumber;
let searchResult;
let searchText;
let countInterval;
let counter = 5;

const controls = {
    view: { x: 0, y: 0, zoom: 1 },
    viewPos: { prevX: null, prevY: null, isDragging: false },
}


function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    canvas.mouseWheel(e => Controls.zoom(controls).worldZoom(e));
    frameRate(60);
    centerCanvas();

    for (let i = 0; i < 100; i++) {
        binaryTree.addValue(Mathematics.randIntMax(maxNumber));
    }
    binaryTree.print();
    binaryTree.showOnCanvas();

    textAlign(CENTER, CENTER);
    textSize(18);
    textFont('consolas');
}

function draw() {

    background(90);

    translate(controls.view.x, controls.view.y);
    scale(controls.view.zoom);

    binaryTree.showOnCanvas();

    if (!binaryTree.searching) {
        clearInterval(countInterval);
        countInterval = null;
        counter = 5;

        searchNumber = Mathematics.randIntMax(maxNumber);
        searchText = "Searching for: " + searchNumber;

        searchResult = binaryTree.visualiseFind(searchNumber);
        searchResult.then(() => {


            searchText = "Found " + searchNumber + " in the tree! New search in " + counter + " seconds";
            countInterval = setInterval(() => {
                counter--;
                searchText = "Found " + searchNumber + " in the tree! New search in " + counter + " seconds";
            }, 1000);

            setTimeout(() => {
                binaryTree.clearVisit();
                clearInterval(countInterval);
                countInterval = null;

            }, 5000);

        }).catch(() => {
            binaryTree.clearVisit();
        });
    }

    push();
    stroke(255);
    strokeWeight(0);
    text(searchText, width / 2, 20);
    pop();
}

function windowResized() {
    centerCanvas();
}

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    canvas.position(x, y);
}

window.mousePressed = e => Controls.move(controls).mousePressed(e);
window.mouseDragged = e => Controls.move(controls).mouseDragged(e);
window.mouseReleased = e => Controls.move(controls).mouseReleased(e);


class Controls {
    static move(controls) {
        function mousePressed(e) {
            controls.viewPos.isDragging = true;
            controls.viewPos.prevX = e.clientX;
            controls.viewPos.prevY = e.clientY;
        }

        function mouseDragged(e) {
            const { prevX, prevY, isDragging } = controls.viewPos;
            if (!isDragging) return;

            const pos = { x: e.clientX, y: e.clientY };
            const dx = pos.x - prevX;
            const dy = pos.y - prevY;

            if (prevX || prevY) {
                controls.view.x += dx;
                controls.view.y += dy;
                controls.viewPos.prevX = pos.x, controls.viewPos.prevY = pos.y
            }
        }

        function mouseReleased(e) {
            controls.viewPos.isDragging = false;
            controls.viewPos.prevX = null;
            controls.viewPos.prevY = null;
        }

        return {
            mousePressed,
            mouseDragged,
            mouseReleased
        }
    }

    static zoom(controls) {
        // function calcPos(x, y, zoom) {
        //   const newX = width - (width * zoom - x);
        //   const newY = height - (height * zoom - y);
        //   return {x: newX, y: newY}
        // }

        function worldZoom(e) {
            const { x, y, deltaY } = e;
            const direction = deltaY > 0 ? -1 : 1;
            const factor = 0.05;
            const zoom = 1 * direction * factor;

            if (direction < 0 && controls.view.zoom <= 0.4) {
                controls.view.zoom = 0.4;
                return;
            }

            if (direction > 0 && controls.view.zoom >= 5) {
                controls.view.zoom = 5;
                return;
            }

            const wx = (x - controls.view.x) / (width * controls.view.zoom);
            const wy = (y - controls.view.y) / (height * controls.view.zoom);

            controls.view.x -= wx * width * zoom;
            controls.view.y -= wy * height * zoom;
            controls.view.zoom += zoom;

        }

        return { worldZoom }
    }
}