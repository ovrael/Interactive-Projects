class ObjectRotation {

    static #angle = -Math.PI / 6;
    static #angleSmoothed = -Math.PI / 2;

    static #lerpAmount = 0.02;
    static #wheelMultiplier = 0.005;
    static #mouseDragChange = 0.01;

    static getAngleSmoothed() {
        return this.#angleSmoothed;
    }

    static update() {
        this.#angleSmoothed = lerp(this.#angleSmoothed, this.#angle, this.#lerpAmount);
    }

    static applyRotation() {
        rotateY(this.#angleSmoothed);
    }

    static mouseWheel(event) {
        this.#lerpAmount = 0.02;
        this.#angle += event.delta * this.#wheelMultiplier;
        return false;
    }

    static mouseDrag(event) {
        this.#lerpAmount = 0.25;
        this.#angle += event.movementX * this.#mouseDragChange;
    }

    static mousePressed() {
        this.#angle = this.#angleSmoothed;
    }

}