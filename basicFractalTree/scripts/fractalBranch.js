class FractalBranch {
    constructor(start, position, level) {

        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, 0);

        this.defaultPosition = createVector(position.x, position.y);
        this.position = createVector(position.x, position.y);

        this.level = level + 1;

        this.rotateAngle = ProjectData.GrowthAngle;
        this.growthChange = ProjectData.GrowthChange;
        this.startBranchLength = ProjectData.StartBranchLength;
        this.fruitColor = ProjectData.FruitColor;
        this.fruitSize = ProjectData.FruitSize;
        this.fruitHealth = ProjectData.LooseFruit ? 100 : -1;
        this.fruitPicked = false;

        const xElasticity = 5 + 5 * this.level;
        const yElasticity = 1 + this.level / 5;
        this.fruitMagStrength = 2.2;

        this.boundaries = {
            minX: this.defaultPosition.x - xElasticity,
            maxX: this.defaultPosition.x + xElasticity,
            minY: this.defaultPosition.y - yElasticity,
            maxY: this.defaultPosition.y + yElasticity,
        }

        /** @type {FractalBranch} */
        this.left = null;
        /** @type {FractalBranch} */
        this.right = null;

        if (ProjectData.Animate) {

            if (ProjectData.NewRandom) {
                this.rotateAngle = ProjectData.RandomAngle;
                this.growthChange = ProjectData.RandomGrowthChange;
                this.startBranchLength = ProjectData.RandomStartBranchLength;
                this.fruitColor = ProjectData.RandomFruitColor;
                this.fruitSize = ProjectData.RandomFruitSize;
            }

            if (this.level == ProjectData.MaxAnimateLevel)
                return;

            setTimeout(() => {
                this.left = this.#createBranch(-1, this.level, start);
                this.right = this.#createBranch(1, this.level, start);
            }, ProjectData.GrowthRateInMs);
        }
        else {

            if (this.level == ProjectData.CurrentLevel) {
                return;
            }

            this.left = this.#createBranch(-1, this.level, start);
            this.right = this.#createBranch(1, this.level, start);
        }
    }

    #createBranch(direction, level, start) {

        var dir = p5.Vector.sub(this.defaultPosition, start);
        if (level == 1) {
            dir.y = -this.startBranchLength;
        }


        dir.rotate(direction * this.rotateAngle);
        dir.mult(this.growthChange);
        const newEnd = p5.Vector.add(this.defaultPosition, dir);

        return new FractalBranch(this.defaultPosition, newEnd, level);
    }

    #showFruit() {
        push();
        strokeWeight(this.fruitSize);
        stroke(this.fruitColor);
        point(this.position.x, this.position.y);
        pop();
    }

    #getBackForce() {
        let desired = p5.Vector.sub(this.defaultPosition, this.position);
        let steer = p5.Vector.sub(desired, this.velocity);
        // console.log(steer);
        steer.limit(ProjectData.MaxTreeBackVelocity);
        // steer.mult(0.4);
        return steer;
    }

    #checkPosition() {

        if (this.position.x < this.boundaries.minX) {
            this.position.x = this.boundaries.minX;
        } else if (this.position.x > this.boundaries.maxX) {
            this.position.x = this.boundaries.maxX;
        }

        if (this.position.y < this.boundaries.minY) {
            this.position.y = this.boundaries.minY;
        } else if (this.position.y > this.boundaries.maxY) {
            this.position.y = this.boundaries.maxY;
        }
    }

    clearVelocity() {
        this.velocity.set(0, 0);

        if (this.left != null) this.left.clearVelocity();
        if (this.right != null) this.right.clearVelocity();
    }

    #updateFruit(velocity) {

        if (this.position.y > ProjectData.CanvasHeight)
            return;


        if (this.fruitHealth < 0) {
            this.fruitPicked = true;
            return;
        }


        if (velocity.mag() > this.fruitMagStrength) {
            this.fruitHealth--;
        }

    }

    update() {

        if (this.fruitPicked) {
            this.applyForce(
                new Force(0, 0, 5, 8, '', 0, 0)
            );
        }

        this.velocity.add(this.acceleration);
        this.velocity.add(this.#getBackForce());
        this.velocity.limit(ProjectData.MaxTreeVelocity);

        this.position.add(this.velocity);

        if (!this.fruitPicked)
            this.#checkPosition();

        this.acceleration.set(0, 0);

        if (this.left != null) {
            this.left.update();
            if (this.left.position.y > ProjectData.CanvasHeight) {
                this.left == null;
            }
        }
        if (this.right != null) {
            this.right.update();
            if (this.right.position.y > ProjectData.CanvasHeight) {
                this.right == null;
            }

        }

        if (ProjectData.LooseFruit && !ProjectData.Animate && this.level == ProjectData.CurrentLevel) {
            this.#updateFruit(this.velocity);
        }
    }

    show() {

        if (ProjectData.ShowFruit) {
            let checkLevel = ProjectData.Animate ? ProjectData.MaxAnimateLevel : ProjectData.CurrentLevel;
            if (this.level == checkLevel) {
                this.#showFruit();
            }
        }

        if (this.left == null || this.right == null) {
            return;
        }

        if (ProjectData.RealColors) {

            if (this.level < ProjectData.CurrentLevel - 2) {
                strokeWeight(2);
                stroke(102, 61, 21);
            } else {
                strokeWeight(1);
                stroke(50, 255, 60);
            }
        } else {
            strokeWeight(1);
            stroke(ProjectData.TreeColor);
        }

        if (!this.left.fruitPicked)
            line(this.position.x, this.position.y, this.left.position.x, this.left.position.y);
        if (!this.right.fruitPicked)
            line(this.position.x, this.position.y, this.right.position.x, this.right.position.y);
        this.left.show();
        this.right.show();
    }

    jitter() {
        this.position.x += Mathematics.randFloatMinMax(-ProjectData.JitterPowerX, ProjectData.JitterPowerX);
        this.position.y += Mathematics.randFloatMinMax(-ProjectData.JitterPowerY, ProjectData.JitterPowerY);

        if (this.left != null) {
            this.left.jitter();
        }
        if (this.right != null) {
            this.right.jitter();
        }
    }

    grow(start) {

        if (this.left != null) {
            this.left.grow(this.defaultPosition);
        }
        else {
            this.left = this.#createBranch(-1, this.level, start);
        }

        if (this.right != null) {
            this.right.grow(this.defaultPosition);
        } else {
            this.right = this.#createBranch(1, this.level, start);
        }
    }

    shrink() {
        if (this.level > ProjectData.CurrentLevel - 1) {
            this.left = null;
            this.right = null;
        }
        else {
            this.left.shrink();
            this.right.shrink();
        }
    }

    applyForce(force) {

        force.update(this.position.x, this.position.y);
        let forceCopy = force.force.copy();

        this.acceleration.add(forceCopy);

        if (this.left != null) {
            this.left.applyForce(force);
        }
        if (this.right != null) {
            this.right.applyForce(force);
        }
    }

    getMaxLevel() {
        if (this.left == null)
            return this.level;
        else
            return this.left.getMaxLevel();
    }
}