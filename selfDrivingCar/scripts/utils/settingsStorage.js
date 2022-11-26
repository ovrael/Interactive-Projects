function saveSettings() {
    let jsonSettings = JSON.stringify(Object.entries(ProjectData));
    localStorage.setItem('settings', jsonSettings);

    let saveAlert = document.getElementById("successSaveAlert");
    saveAlert.hidden = false;
    saveAlert.classList.remove("alertHide");

    setTimeout(() => {
        saveAlert.classList.add("alertHide");
    }, 2000);
}

function loadSettings() {
    let jsonSettings = localStorage.getItem('settings');
    let loadJson = JSON.parse(jsonSettings);
    ProjectData = Object.fromEntries(loadJson);
    setControlsValues();

    let loadAlert = document.getElementById("successLoadAlert");
    loadAlert.hidden = false;
    loadAlert.classList.remove("alertHide");

    setTimeout(() => {
        loadAlert.classList.add("alertHide");
    }, 2000);
}

function setControlsValues() {
    let entries = Object.entries(ProjectData);

    for (let i = 0; i < entries.length; i++) {
        let name = entries[i][0];
        let value = entries[i][1];

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

                if (name == 'RoadWidth') {
                    continue;
                }

                if (name == 'RoadLanes') {
                    let roadWidthNode = document.getElementById('roadWidthSlider');
                    roadWidthNode.value = Number(ProjectData.RoadWidth);
                    sliderChange(roadWidthNode);
                }

                if (name == 'SensorRaysSpread') {
                    value = Math.round((value / (2 * Math.PI)) * 360);
                }

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