class Tools {
    static rotatePoint(x, y, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const xPrim = x * cos - y * sin;
        const yPrim = y * cos + x * sin;

        return { x: xPrim, y: yPrim };
    }
}