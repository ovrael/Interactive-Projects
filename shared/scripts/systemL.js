class systemL {
    constructor(alphabet = [], rules = {}) {
        /** @type {Array} */
        this.alphabet = alphabet;
        this.rules = rules;
        this.sentence = '';
    }

    addSign(sign) {
        if (sign.length != 1) {
            console.error("Sign length must be equal 1! It has to be 1 character.");
            return;
        }

        if (this.alphabet.indexOf(sign) > -1) {
            console.warn("Sign already is in the alphabet.");
            return;
        }

        this.alphabet.push(sign);
    }

    addSigns(signs) {
        for (let i = 0; i < signs.length; i++) {
            this.addSign(signs.charAt(i));
        }
    }

    removeSign(sign) {
        if (sign.length != 1) {
            console.error("Sign length must be equal 1! It has to be 1 character.");
            return;
        }

        if (this.alphabet.indexOf(sign) == -1) {
            console.warn("Sign is not in the alphabet.");
            return;
        }

        this.alphabet = this.alphabet.filter(x => x !== sign);
    }

    addRule(sign, rule) {
        if (sign in this.rules) {
            console.error("Axiom already exists! -> " + sign);
            return;
        }

        if (this.alphabet.indexOf(sign) == -1) {
            console.error("Sign: " + sign + " is not in the alphabet. Add it first to alphabet before creating axiom.");
            return;
        }

        this.rules[sign] = rule;
    }

    removeRule(sign) {
        if (!(sign in this.rules)) {
            console.error("There is no axiom! -> " + sign);
            return;
        }

        delete this.rules[sign];
    }

    nextGeneration() {
        let newSystem = '';

        for (let i = 0; i < this.sentence.length; i++) {
            const letter = this.sentence.charAt(i);

            if (!(letter in this.rules)) {
                newSystem += letter;
                continue;
            }

            newSystem += this.rules[letter];
        }

        this.sentence = newSystem;
    }

    #generateAxiom(isRandom = false) {

        if (this.alphabet.length == 0) {
            console.warn('Alphabet is empty! Add letters to it before generating sentence.')
            return null;
        }

        let index = isRandom ? Math.floor(Math.random() * this.alphabet.length) : 0;
        return this.alphabet[index];
    }

    generateSentence(iterations = 10, axiom = '', randomAxiom = false) {

        if (axiom == '') {
            axiom = this.#generateAxiom(randomAxiom);

            if (axiom == null) return;
        }

        this.sentence = axiom;
        for (let i = 0; i < iterations; i++) {
            this.nextGeneration();
        }
    }
}