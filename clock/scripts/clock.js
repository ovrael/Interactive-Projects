class Clock {
    constructor() {
        const today = new Date();
        this.hours = today.getHours();
        this.minutes = today.getMinutes();
        this.seconds = today.getSeconds();
        this.miliseconds = today.getMilliseconds();

        this.twelveHours = this.hours <= 12 ? this.hours : this.hours - 12;

        this.textColor = [0, 0, 0];
        this.timeText = addZerosAtBeggining(this.hours) + ':' + addZerosAtBeggining(this.minutes) + ':' + addZerosAtBeggining(this.seconds);
        this.twelveTimeText = this.twelveHours + ':' + this.minutes + ':' + this.seconds;

        setInterval(() => {
            this.#updateTime();
        }, 50);
    }

    #updateTime() {
        this.miliseconds += 50;

        if (this.miliseconds >= 1000) {
            this.seconds++;
            this.miliseconds = 0;
            this.#updateText();

            this.textColor = this.#randColor();
        }

        if (this.seconds >= 60) {
            this.minutes++;
            this.seconds = 0;
            this.#updateText();
        }

        if (this.minutes >= 60) {
            this.hours++;
            this.minutes = 0;
            this.#updateText();
        }

        if (this.hours >= 24) {
            this.hours = 0;
            this.#updateText();
        }
    }

    #updateText() {
        this.twelveHours = this.hours <= 12 ? this.hours : this.hours - 12;

        this.timeText = addZerosAtBeggining(this.hours) + ':' + addZerosAtBeggining(this.minutes) + ':' + addZerosAtBeggining(this.seconds);
        this.twelveTimeText = this.twelveHours + ':' + this.minutes + ':' + this.seconds;
    }

    #randColor() {
        return [
            Mathematics.randIntMinMax(120, 245),
            Mathematics.randIntMinMax(120, 245),
            Mathematics.randIntMinMax(120, 245)
        ]
    }

    getTime(mode = '24') {
        return mode == 24 ? this.timeText : this.twelveTimeText;
    }

    getSecondsAngle() {
        return (this.seconds - 30 + this.miliseconds / 1000) / 60;
    }

    getMinutesAngle() {
        return ((this.minutes - 30 + this.seconds / 60) / 60);
    }

    getHoursAngle() {
        return ((this.hours + this.minutes / 60) / 24);
    }
}