class Game {

    static #maxPlayers = 13;
    static #ranking = Game.#initRanking();

    static #initRanking() {
        let ranking = new Array(Game.#maxPlayers);
        for (let i = 0; i < ranking.length; i++) {
            ranking[i] = {
                player: "Empty",
                score: 0
            }
        }
        return ranking;
    }

    static gameOver(playerScore) {
        ProjectData.GameOver = true;
        $('#scoreDiv').toggleClass('smallScore bigScore');
        document.getElementById('scoreTextDiv').hidden = true;
        document.getElementById('gameOverDiv').hidden = false;
        document.getElementById('resetGameButton').hidden = false;

        Game.#updateRanking(playerScore);
        Game.#saveRanking();

        Game.#updateRankingDiv();
    }

    static #updateRanking(playerScore) {
        for (let i = 0; i < Game.#ranking.length; i++) {

            if (Game.#ranking[i].player != "Empty" && Game.#ranking[i].score >= playerScore) {
                continue;
            }

            for (let j = Game.#ranking.length - 1; j > i; j--) {
                Game.#ranking[j] = Game.#ranking[j - 1];
            }

            Game.#ranking[i] = {
                player: ProjectData.PlayerName,
                score: playerScore
            }

            if (i == 0)
                Game.#newBest();
            break;
        }
    }

    static #newBest() {
        fireworks.start();
        document.getElementById('newRecordDiv').hidden = false;
    }

    static #updateRankingDiv() {

        let rankingText = '<table>';
        for (let i = 0; i < Game.#ranking.length; i++) {

            if (Game.#ranking[i].player == 'Empty') break;

            rankingText += '<tr><td style="text-align:right">' + (i + 1) + '.</td>' +
                '<td style="width:70%">' + Game.#ranking[i].player + '</td>' +
                '<td style="text-align:right; width:20%">' + Game.#addZeros(Game.#ranking[i].score) + '</td></tr>';
        };
        rankingText += '</table>';

        document.getElementById('ranking').innerHTML = rankingText;
    }

    static #addZeros(score) {
        return String(score).padStart(4, '0');
    }

    static resetRanking() {
        Game.#ranking = Game.#initRanking();
        Game.#saveRanking();
    }

    static #saveRanking() {
        let jsonRanking = JSON.stringify(Game.#ranking);
        localStorage.setItem('ranking', jsonRanking);
    }

    static loadRanking() {
        let jsonRanking = localStorage.getItem('ranking');

        if (jsonRanking) {
            const loadedRanking = JSON.parse(jsonRanking);

            for (let i = 0; i < Game.#ranking.length; i++) {
                if (loadedRanking[i])
                    Game.#ranking[i] = loadedRanking[i];
            }
        }
    }

}