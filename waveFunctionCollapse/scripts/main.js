/** @type {HTMLCanvasElement} */
let canvas;
let cell1;
let cell2;
let projectDataBackUp = Object.entries(ProjectData);
let cellGrid;

// const images = {};
const tiles = [];
const images = [];
const imagesDirectory = "images/";

function preload() {
    images[0] = loadImage(imagesDirectory + "blank.png");
    images[1] = loadImage(imagesDirectory + "half_line.png");
    images[2] = loadImage(imagesDirectory + "line.png");
    images[3] = loadImage(imagesDirectory + "turn.png");
    images[4] = loadImage(imagesDirectory + "line_dash.png");
    images[5] = loadImage(imagesDirectory + "cross.png");
}

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();

    loadtiles();

    cellGrid = new CellGrid(ProjectData.GridSize, images);
}

function draw() {
    background(90);
    cellGrid.update();
    cellGrid.draw();

    if (mouseIsPressed) {
        cellGrid.collapseNextCell();
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
}

function loadtiles() {
    tiles[0] = new Tile([SideType.NO_LINE, SideType.NO_LINE, SideType.NO_LINE, SideType.NO_LINE], images[0]);

    tiles[1] = new Tile([SideType.NO_LINE, SideType.ONE_LINE, SideType.NO_LINE, SideType.NO_LINE], images[1]);
    tiles[2] = tiles[1].rotate(1);
    tiles[3] = tiles[1].rotate(2);
    tiles[4] = tiles[1].rotate(3);

    tiles[5] = new Tile([SideType.ONE_LINE, SideType.NO_LINE, SideType.ONE_LINE, SideType.NO_LINE], images[2]);
    tiles[6] = tiles[5].rotate(1);

    tiles[7] = new Tile([SideType.NO_LINE, SideType.ONE_LINE, SideType.ONE_LINE, SideType.NO_LINE], images[3]);
    tiles[8] = tiles[7].rotate(1);
    tiles[9] = tiles[7].rotate(2);
    tiles[10] = tiles[7].rotate(3);

    tiles[11] = new Tile([SideType.ONE_LINE, SideType.ONE_LINE, SideType.ONE_LINE, SideType.NO_LINE], images[4]);
    tiles[12] = tiles[11].rotate(1);
    tiles[13] = tiles[11].rotate(2);
    tiles[14] = tiles[11].rotate(3);

    tiles[15] = new Tile([SideType.ONE_LINE, SideType.ONE_LINE, SideType.ONE_LINE, SideType.NO_LINE], images[4]);
    tiles[16] = tiles[15].rotate(1);
    tiles[17] = tiles[15].rotate(2);
    tiles[18] = tiles[15].rotate(3);

    tiles[19] = new Tile([SideType.ONE_LINE, SideType.ONE_LINE, SideType.ONE_LINE, SideType.ONE_LINE], images[5]);
}