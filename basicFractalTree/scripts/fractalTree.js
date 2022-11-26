class FractalTree {

    constructor() {
        this.currentBranchLenght = ProjectData.StartBranchLength;

        this.root = createVector(ProjectData.CanvasWidth / 2, ProjectData.CanvasHeight);
        this.trunkHeight = ProjectData.Animate && ProjectData.NewRandom ? Mathematics.randIntMinMax(10, 250) : ProjectData.TrunkLength;
        this.trunkPos = createVector(ProjectData.CanvasWidth / 2, ProjectData.CanvasHeight - this.trunkHeight);

        if (ProjectData.Animate && ProjectData.NewRandom) {
            ProjectData.RandomAngle = Mathematics.randIntMinMax(10, 120);
            ProjectData.RandomGrowthChange = Mathematics.randFloatMinMax(0.7, 0.8);
            ProjectData.RandomStartBranchLength = Mathematics.randIntMinMax(90, 200);
            ProjectData.RandomFruitColor = randColor();
            ProjectData.RandomFruitSize = Mathematics.randIntMinMax(6, 20);
        }

        this.trunk = null;

        if (ProjectData.Animate) {
            setTimeout(() => {
                this.trunk = new FractalBranch(this.root, this.trunkPos, 0)
            }, ProjectData.GrowthRateInMs)
        }
        else {
            this.trunk = new FractalBranch(this.root, this.trunkPos, 0);
        }
    }

    update() {
        if (this.trunk == null)
            return;

        if (ProjectData.ApplyJitter) {
            this.trunk.jitter();
        }

        this.trunk.update();
    }

    show() {

        if (this.trunk == null)
            return;

        push();

        if (ProjectData.RealColors) {
            let trunkWidth = this.trunkHeight / 40;
            if (trunkWidth < 3)
                trunkWidth = 3;
            strokeWeight(trunkWidth);
            stroke(102, 61, 21);
        } else {
            strokeWeight(1);
            stroke(ProjectData.TreeColor);
        }
        line(this.root.x, this.root.y, this.trunk.position.x, this.trunk.position.y);
        pop();

        this.trunk.show();
    }

    grow() {

        if (ProjectData.CurrentLevel >= ProjectData.MaxLevel)
            return;

        if (this.trunk == null)
            return;

        ProjectData.CurrentLevel++;
        this.trunk.grow(this.root);
    }

    shrink() {

        if (ProjectData.CurrentLevel <= ProjectData.MinLevel)
            return;

        if (this.trunk == null)
            return;

        ProjectData.CurrentLevel--;
        this.trunk.shrink();
    }

    applyForce(force) {
        if (this.trunk == null)
            return;
        this.trunk.applyForce(force);
    }

    clearVelocity() {
        this.trunk.clearVelocity();
    }

    getMaxLevel() {
        if (this.trunk == null)
            return 0;

        return this.trunk.getMaxLevel();
    }
}