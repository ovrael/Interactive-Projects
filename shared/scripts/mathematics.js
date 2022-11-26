class Mathematics {

    static DEG_TO_RAD = Math.PI / 180.0;

    static randIntMinMax(min, max) {
        return Math.floor(Mathematics.randFloatMinMax(min, max));
    }

    static randIntMax(max) {
        return Mathematics.randIntMinMax(0, max);
    }

    static randFloatMinMax(min, max) {
        return Math.random() * (max - min) + min;
    }

    static add(a, b) {
        return a + b;
    }

    static subtract(a, b) {
        return a - b;
    }

    static multiply(a, b) {
        return a * b;
    }

    static map(value,
        valueStart,
        valueStop,
        desireStart,
        desireStop) {
        return desireStart + (desireStop - desireStart) * ((value - valueStart) / (valueStop - valueStart));
    }

    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    static distanceSquared(x1, y1, x2, y2) {
        return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    }
}