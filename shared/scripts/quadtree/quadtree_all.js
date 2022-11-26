const IntersectionType = {
    None: 0,
    Part: 1,
    Full: 2,
}

class Point {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x, y, userData = null) {
        this.x = x;
        this.y = y;

        if (userData)
            this.userData = userData;
    }
}

class CircleBoundary {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.radiusSquared = this.radius * this.radius;

        this.left = this.x - this.radius;
        this.right = this.x + this.radius;
        this.top = this.y - this.radius;
        this.bottom = this.y + this.radius;
    }

    /**
     * 
     * @param {Point} point 
     * @returns {Boolean} 
     */
    contains(point) {
        var distancesquared = (point.x - this.x) * (point.x - this.x) + (point.y - this.y) * (point.y - this.y);
        return distancesquared <= this.radiusSquared;
    }

    /**
     * 
     * @param {RectBoundary} other 
     */
    intersects(other) {

        let intersectionType = IntersectionType.None;

        if (
            other.x <= this.right
            || other.right >= this.left
            || other.y <= this.bottom
            || other.bottom >= this.top
        ) intersectionType = IntersectionType.Part;

        if (intersectionType == IntersectionType.Part) {
            let sum = 0;

            if (this.contains(new Point(other.x, other.y))) sum++;
            if (this.contains(new Point(other.right, other.y))) sum++;
            if (this.contains(new Point(other.right, other.bottom))) sum++;
            if (this.contains(new Point(other.x, other.bottom))) sum++;

            if (sum == 4)
                intersectionType = IntersectionType.Full;
        }

        return intersectionType;
    }

    draw(color = null) {
        push();

        colorMode(RGB);

        if (color === null)
            stroke(200, 80, 80);
        else
            stroke(color);
        strokeWeight(2);
        noFill();

        circle(this.x, this.y, this.radius * 2);

        pop();
    }
}

class RectBoundary {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
        this.right = this.x + this.width;
        this.bottom = this.y + this.height;
    }

    /**
     * 
     * @param {Point} point 
     * @returns {Boolean} 
     */
    contains(point) {
        if (point.x < this.x) return false;
        if (point.x > this.right) return false;
        if (point.y < this.y) return false;
        if (point.y > this.bottom) return false;

        return true;
    }

    /**
     * 
     * @param {RectBoundary} other 
     */
    intersects(other) {
        let intersectionType = IntersectionType.None;

        if (other.x <= this.right
            || other.right >= this.x
            || other.y <= this.bottom
            || other.bottom >= this.y
        ) intersectionType = IntersectionType.Part;

        if (intersectionType == IntersectionType.Part) {
            let sum = 0;
            if (other.x >= this.x) sum++;
            if (other.right <= this.right) sum++;
            if (other.y >= this.y) sum++;
            if (other.bottom <= this.bottom) sum++;

            if (sum == 4)
                intersectionType = IntersectionType.Full;
        }

        return intersectionType;
    }

    subdivide() {
        let parts = {};
        parts["topLeft"] = new RectBoundary(this.x, this.y, this.halfWidth, this.halfHeight);
        parts["topRight"] = new RectBoundary(this.x + this.halfWidth, this.y, this.halfWidth, this.halfHeight);
        parts["bottomLeft"] = new RectBoundary(this.x, this.y + this.halfHeight, this.halfWidth, this.halfHeight);
        parts["bottomRight"] = new RectBoundary(this.x + this.halfWidth, this.y + this.halfHeight, this.halfWidth, this.halfHeight);

        return parts;
    }
}

class QuadTree {
    /**
     * 
     * @param {RectBoundary} boundary 
     * @param {Number} capacity 
     * @param {Number} maxDepth 
     * @param {Number} depth 
     */
    constructor(boundary, capacity, maxDepth = 8, depth = 0) {

        if (!boundary) {
            throw TypeError('boundary is null or undefined');
        }
        if (!(boundary instanceof RectBoundary) && !(boundary instanceof CircleBoundary)) {
            throw TypeError('boundary should be a RectBoundary or CircleBoundary!');
        }
        if (typeof capacity !== 'number') {
            throw TypeError(`capacity should be a number but is a ${typeof capacity}`);
        }
        if (capacity < 1) {
            throw RangeError('capacity must be greater than 0');
        }

        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
        this.depth = depth;
        this.maxDepth = maxDepth;
    }

    add(point) {

        if (!this.boundary.contains(point)) {
            return false;
        }

        if (!this.divided) {

            if (
                this.points.length < this.capacity
                || this.depth === this.maxDepth
            ) {
                this.points.push(point);
                return true;
            }

            this.subdivide();
        }

        return (
            this.topLeft.add(point)
            || this.topRight.add(point)
            || this.bottomLeft.add(point)
            || this.bottomRight.add(point)
        );
    }

    subdivide() {
        const newBoundaries = this.boundary.subdivide();

        let nextDepth = this.depth + 1;
        this.topLeft = new QuadTree(newBoundaries["topLeft"], this.capacity, this.maxDepth, nextDepth);
        this.topRight = new QuadTree(newBoundaries["topRight"], this.capacity, this.maxDepth, nextDepth);
        this.bottomLeft = new QuadTree(newBoundaries["bottomLeft"], this.capacity, this.maxDepth, nextDepth);
        this.bottomRight = new QuadTree(newBoundaries["bottomRight"], this.capacity, this.maxDepth, nextDepth);

        this.divided = true;

        for (const p of this.points) {
            const inserted =
                this.topLeft.add(p) ||
                this.topRight.add(p) ||
                this.bottomLeft.add(p) ||
                this.bottomRight.add(p);

            if (!inserted) {
                throw RangeError('capacity must be greater than 0');
            }
        }

        this.points = [];
    }

    query(range, found) {
        if (!found) {
            found = [];
        }

        let intersection = range.intersects(this.boundary);
        if (intersection == IntersectionType.None) {
            return found;
        }

        if (this.divided) {
            this.topLeft.query(range, found);
            this.topRight.query(range, found);
            this.bottomLeft.query(range, found);
            this.bottomRight.query(range, found);
        }

        if (intersection == IntersectionType.Part) {

            for (const p of this.points) {
                if (!range.contains(p)) continue;

                if (found.length >= ProjectData.Accuracy) return found;

                found.push(p);
            }
        }
        else if (intersection == IntersectionType.Full) {
            for (const p of this.points) {

                if (found.length >= ProjectData.Accuracy) return found;
                found.push(p);
            }
        }

        return found;
    }


    show() {
        strokeWeight(1);
        stroke(255, 111, 111);
        noFill();
        rect(this.boundary.x, this.boundary.y, this.boundary.width, this.boundary.height);
        // strokeWeight(2);
        // stroke(144, 144, 255);
        // for (let i = 0; i < this.points.length; i++) {
        //     point(this.points[i].x, this.points[i].y);
        // }

        if (this.divided) {
            this.topLeft.show();
            this.topRight.show();
            this.bottomLeft.show();
            this.bottomRight.show();
        }
    }
}