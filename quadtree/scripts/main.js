p5.disableFriendlyErrors = true; // disables FES


/** @type {HTMLCanvasElement} */
let canvas;
/** @type {QuadTree} */
let quadtree;

let gpu;

function setup() {
    canvas = createCanvas(ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    // frameRate(1);
    centerCanvas();

    const boundary = new RectBoundary(0, 0, ProjectData.CanvasWidth, ProjectData.CanvasHeight);
    quadtree = new QuadTree(boundary, 8);

    for (let i = 0; i < 1000; i++) {
        quadtree.add(
            new Point(
                randomGaussian(width / 2, height / 8),
                randomGaussian(width / 2, height / 8)
            )
        );
    }
}

function draw() {
    background(25);
    quadtree.show();

    stroke(100, 255, 122);
    strokeWeight(1);

    let rectRange = new RectBoundary(
        mouseX - 50,
        mouseY - 50,
        100,
        100
    );

    let circleRange = new CircleBoundary(
        mouseX,
        mouseY,
        80
    );

    // rect(rectRange.x, rectRange.y, rectRange.width, rectRange.height);
    ellipse(circleRange.x, circleRange.y, circleRange.radius * 2);

    // let queryPoints = quadtree.query(rectRange);
    let queryPoints = quadtree.query(circleRange);

    stroke(100, 255, 122);
    strokeWeight(4);
    for (let i = 0; i < queryPoints.length; i++) {
        point(queryPoints[i].x, queryPoints[i].y);
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