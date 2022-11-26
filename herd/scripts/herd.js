class Herd {
    constructor(initUnitsCount = 50) {
        /** @type {Array<Unit>} */
        this.units = [];

        this.treeBoundary = new RectBoundary(0, 0, ProjectData.CanvasWidth, ProjectData.CanvasHeight);
        this.quadtree = {};

        this.debugData = {};
        this.debugData.nearAlignUnits = [];
        this.debugData.nearCohesionUnits = [];
        this.debugData.nearSeparationUnits = [];

        this.addUnits(initUnitsCount);
    }

    update() {

        if (ProjectData.QuadtreeAutomateData) {
            let capacity = Math.floor(Math.log(this.units.length) / Math.log(4));
            const maxDepth = this.units.length / 100;
            if (capacity == 0) capacity = 16;

            this.quadtree = new QuadTree(this.treeBoundary, capacity, maxDepth);
        } else {
            this.quadtree = new QuadTree(this.treeBoundary, ProjectData.QuadtreeCapacity, ProjectData.QuadtreeMaxDepth);
        }

        for (const unit of this.units) {
            this.quadtree.add(
                new Point(
                    unit.position.x,
                    unit.position.y,
                    unit
                )
            );
        }

        if (ProjectData.ShowDebug) {
            this.quadtree.show();
        }

        let k = 0;
        for (const unit of this.units) {
            const alignSearch = new CircleBoundary(unit.position.x, unit.position.y, ProjectData.AlignSearchDistance);
            const cohesionSearch = new CircleBoundary(unit.position.x, unit.position.y, ProjectData.CohesionSearchDistance);
            const separationSearch = new CircleBoundary(unit.position.x, unit.position.y, ProjectData.SeparationSearchDistance);

            const alignNearPoints = this.quadtree.query(alignSearch);
            const cohesionNearPoints = this.quadtree.query(cohesionSearch);
            const separationNearPoints = this.quadtree.query(separationSearch);

            unit.adjust(alignNearPoints, cohesionNearPoints, separationNearPoints);

            if (ProjectData.ShowDebug && k == 0) {
                this.debugData.nearAlignUnits = alignNearPoints;
                this.debugData.nearCohesionUnits = cohesionNearPoints;
                this.debugData.nearSeparationUnits = separationNearPoints;
                k++;
            }
        }

        for (const unit of this.units) {
            unit.update();
        }
    }

    show() {

        strokeWeight(1);

        for (let i = 0; i < this.units.length; i++) {
            this.units[i].show();
        }

        if (ProjectData.ShowDebug) {
            strokeWeight(1);
            const firstUnit = this.units[0];

            if (ProjectData.ShowDebugAlign) {
                noFill();
                stroke(255, 0, 0);
                ellipse(firstUnit.position.x, firstUnit.position.y, ProjectData.AlignSearchDistance * 2);

                for (const unit of this.debugData.nearAlignUnits) {
                    unit.userData.show(ProjectData.ShowDebug);
                }
            }

            if (ProjectData.ShowDebugCohesion) {
                noFill();
                stroke(0, 255, 0);
                ellipse(firstUnit.position.x, firstUnit.position.y, ProjectData.CohesionSearchDistance * 2);
                for (const unit of this.debugData.nearCohesionUnits) {
                    unit.userData.show(ProjectData.ShowDebug);
                }
            }

            if (ProjectData.ShowDebugSeparation) {
                noFill();
                stroke(255, 150, 50);
                ellipse(firstUnit.position.x, firstUnit.position.y, ProjectData.SeparationSearchDistance * 2);
                for (const unit of this.debugData.nearSeparationUnits) {
                    unit.userData.show(ProjectData.ShowDebug);
                }
            }
        }
    }

    addUnits(count) {
        for (let i = 0; i < count; i++) {
            this.units.push(
                new Unit()
            );
        }
    }

    createUnitsAt(x, y) {
        if (x >= width || y >= height || x <= 0 || y <= 0)
            return;

        if (this.units.length >= ProjectData.MaxHerdSize)
            return;

        for (let i = 0; i < ProjectData.ClickCreateCount; i++) {
            this.units.push(
                new Unit(random(x - 40, x + 40), random(y - 40, y + 40))
            );
        }

        document.getElementById('herdSizeSlider').value = this.units.length;
        document.getElementById('herdSizeText').innerHTML = this.units.length;
    }

    changeHerdSize() {
        if (ProjectData.HerdSize > this.units.length) {
            this.addUnits(ProjectData.HerdSize - this.units.length);
        } else if (ProjectData.HerdSize < this.units.length) {
            this.units = this.units.splice(0, ProjectData.HerdSize);
        }
    }

    restoreUnitsSize() {
        for (const unit of this.units) {
            unit.size = ProjectData.UnitSize;
        }
    }

    randomUnitsSize() {
        for (const unit of this.units) {
            unit.size = random(ProjectData.UnitMinSize, ProjectData.UnitMaxSize);
        }
    }

    restoreUnitsColor() {
        for (const unit of this.units) {
            unit.color = ProjectData.UnitColor;
        }
    }

    randomUnitsColor() {
        for (const unit of this.units) {
            unit.color = randColor();
        }
    }
}