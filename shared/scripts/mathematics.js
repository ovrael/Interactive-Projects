class Mathematics {

    static DEG_TO_RAD = Math.PI / 180.0;
    static Epsilon = 1e-12;

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

    static round(number, decimalPlaces = 2) {
        // Shift the decimal point to the right by the desired number of decimal places
        const shift = 10 ** decimalPlaces;
        const shiftedNumber = number * shift;
        // Round the shifted number to the nearest integer
        const roundedShiftedNumber = Math.round(shiftedNumber);
        // Shift the decimal point back to the left by the desired number of decimal places
        const roundedNumber = roundedShiftedNumber / shift;
        return roundedNumber;
    }
    
    static toPercent(number) {
        return Math.round(number * 10000) / 100;
    }
}