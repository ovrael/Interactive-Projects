class Timer {
    static {
        setTimeout(Timer.#addSecond, 1000);

        Timer.timeInSeconds = 0;
    }

    static #addSecond() {
        Timer.timeInSeconds += 1;
        setTimeout(Timer.#addSecond, 1000);
    }

    static reset() {
        Timer.timeInSeconds = 0;
    }
}