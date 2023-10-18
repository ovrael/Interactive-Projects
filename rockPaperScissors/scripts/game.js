class Game {

    playerTypes = ['rock', 'paper', 'scissors'];

    constructor(canvasWidth, canvasHeight, players) {

        /** @type {Player[]} */
        this.players = [];

        for (let i = 0; i < players; i++) {

            const x = random(0, canvasWidth);
            const y = random(0, canvasHeight);
            const pType = random(this.playerTypes);

            this.players.push(
                new Player(x, y, pType)
            );
        }
    }

    update() {
        for (let i = 0; i < this.players.length; i++) {
            for (let j = i + 1; j < this.players.length; j++) {
                this.players[i].checkCollisions(this.players[j]);
            }
            this.players[i].update();
        }
    }

    draw() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].draw();
        }
    }
}