/** @type {HTMLCanvasElement} */
let canvas;
let cell1;
let cell2;
let projectDataBackUp = Object.entries(ProjectData);
let cellGrid;

const cellImages = [];

function preload() {
    cellImages[0] = loadImage("CellImages/U0_R0_D0_L0.png");
    cellImages[1] = loadImage("CellImages/U0_R1_D1_L1.png");
    cellImages[2] = loadImage("CellImages/U1_R0_D1_L1.png");
    cellImages[3] = loadImage("CellImages/U1_R1_D0_L0.png");
    cellImages[4] = loadImage("CellImages/U1_R1_D0_L1.png");
    cellImages[5] = loadImage("CellImages/U1_R1_D1_L0.png");
    cellImages[6] = loadImage("CellImages/U1_R1_D1_L1.png");
}

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    frameRate(60);
    centerCanvas();

    cellGrid = new CellGrid(4, cellImages);
    // cell1 = new Cell(SideType.NO_LINE, SideType.ONE_LINE, SideType.ONE_LINE, SideType.ONE_LINE);
    // cell2 = new Cell(SideType.ONE_LINE, SideType.ONE_LINE, SideType.ONE_LINE, SideType.ONE_LINE);

    // console.warn(cell1.checkSide(cell2, SideDirection.Up));
    // console.warn(cell1.checkSide(cell2, SideDirection.Right));

    // cellGrid.collapseCell(0, 0, SideType.ONE_LINE, SideType.ONE_LINE, SideType.ONE_LINE, SideType.NO_LINE, cellImages[5]);
    // cellGrid.collapseCell(2, 1, SideType.ONE_LINE, SideType.ONE_LINE, SideType.NO_LINE, SideType.NO_LINE, cellImages[3]);
    // cellGrid.collapseCell(3, 3, SideType.NO_LINE, SideType.ONE_LINE, SideType.ONE_LINE, SideType.ONE_LINE, cellImages[1]);

    cellGrid.collapseCell(0, 0);
    cellGrid.collapseCell(2, 1);
    cellGrid.collapseCell(3, 3);
}

function draw() {
    background(90);
    cellGrid.draw();
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