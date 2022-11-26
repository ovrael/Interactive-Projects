let loadedSettings = false;

function saveSettings() {
    if (loadedSettings) {
        let jsonSettings = JSON.stringify(Object.entries(ProjectData));
        localStorage.setItem('kaleidoscopeSettings', jsonSettings);
    }
}

function loadSettings() {

    if (localStorage.getItem("kaleidoscopeSettings") == null) {
        loadedSettings = true;
        return;
    }

    let jsonSettings = localStorage.getItem('kaleidoscopeSettings');
    let loadJson = JSON.parse(jsonSettings);
    ProjectData = Object.fromEntries(loadJson);

    setControlsValues();
    loadedSettings = true;
}

function setControlsValues() {
    let entries = Object.entries(ProjectData);

    for (let i = 0; i < entries.length; i++) {

        const name = entries[i][0];
        const value = entries[i][1];

        let controlNode = document.getElementById(toLowerFirstLetter(name) + 'Slider');
        let type = 'slider';

        if (!controlNode) {
            controlNode = document.getElementById(toLowerFirstLetter(name) + 'Select');
            type = 'select';
        }
        if (!controlNode) {
            controlNode = document.getElementById(toLowerFirstLetter(name) + 'Input');
            type = 'input';
        }
        if (!controlNode) {
            controlNode = document.getElementById(toLowerFirstLetter(name) + 'Checkbox');
            type = 'checkbox';
        }

        if (!controlNode) {
            console.warn("NO CONTROL NODE FOR: " + name);
            continue;
        }

        switch (type) {
            case 'slider':
                controlNode.value = Number(value);
                sliderChange(controlNode);
                break;

            case 'select':
                controlNode.value = value;
                selectChange(controlNode);
                break;

            case 'input':
                controlNode.value = value;
                colorChange(controlNode);
                break;

            case 'checkbox':
                controlNode.checked = value;
                break;
        }
    }
}