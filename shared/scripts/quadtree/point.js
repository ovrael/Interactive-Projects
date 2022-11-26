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