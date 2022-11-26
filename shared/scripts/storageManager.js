let loadedSettings = false;

function saveSettings(settingsName = "settings") {

    // console.log("Save settings to: " + settingsName);

    if (loadedSettings) {
        let jsonSettings = JSON.stringify(Object.entries(ProjectData));
        localStorage.setItem(settingsName, jsonSettings);
        console.log("Saved settings to: " + settingsName);
    }
}

function loadSettings(settingsName = "settings") {

    console.log("Load settings from: " + settingsName);

    if (localStorage.getItem(settingsName) == null) {
        console.warn('Setttings: ' + settingsName + ' is null!');
        loadedSettings = true;
        return;
    }

    let jsonSettings = localStorage.getItem(settingsName);
    let loadJson = JSON.parse(jsonSettings);
    ProjectData = Object.fromEntries(loadJson);

    setControlsValues();
    loadedSettings = true;
}

function setControlsValues() {
    let entries = Object.entries(ProjectData);

    for (let i = 0; i < entries.length; i++) {

        const name = firstLetterToLower(entries[i][0]);
        const value = entries[i][1];

        if (value == null) {
            console.warn(name + 'is null!');
            continue;
        }

        let controlNode = document.getElementById(name + 'Slider');
        let type = 'slider';

        if (!controlNode) {
            controlNode = document.getElementById(name + 'Select');
            type = 'select';
        }
        if (!controlNode) {
            controlNode = document.getElementById(name + 'Input');
            type = 'input';
        }
        if (!controlNode) {
            controlNode = document.getElementById(name + 'Checkbox');
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