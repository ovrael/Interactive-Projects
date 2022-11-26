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
}