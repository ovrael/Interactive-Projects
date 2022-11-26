class Mathematics {
    static randIntMinMax(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    static randIntMax(max) {
        return Mathematics.randIntMinMax(0, max);
    }
}