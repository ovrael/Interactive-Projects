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