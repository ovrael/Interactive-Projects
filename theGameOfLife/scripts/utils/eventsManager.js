document.addEventListener('keydown', (event) => {
    if (event.key == 'Escape' || event.key == ' ') {

        changePause();
    }
});

document.getElementById('mainCanvas').addEventListener("wheel", (e) => {

    /** @type {HTMLInputElement} */
    const slider = document.getElementById('fieldSizeSlider');

    if (e.deltaY < 0) {
        if (slider.valueAsNumber < slider.max)
            addValue('fieldSize');
    } else if (e.deltaY > 0) {
        if (slider.valueAsNumber > slider.min)
            subtractValue('fieldSize');
    }

}, false);
