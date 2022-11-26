function openSettings() {
    document.getElementById('settingsPanel').style.contentVisibility = "visible";
    document.getElementById('settingsPanel').style.width = "30%";
    document.getElementById('settingsPanel').style.minWidth = "500px";

}

function tabClick(tab) {
    const targetTab = document.getElementById(tab.dataset.tabname + 'Tab');
    if (!targetTab || !targetTab.hidden)
        return;

    const activeTab = document.getElementsByClassName('activeTab')[0];
    const activeTabPanel = document.getElementById(activeTab.dataset.tabname + 'Tab');
    activeTab.classList.remove('activeTab');
    tab.classList.add('activeTab');

    activeTabPanel.hidden = true;
    targetTab.hidden = false;
}

function closeSettings() {
    document.getElementById('settingsPanel').style.width = "0";
    document.getElementById('settingsPanel').style.minWidth = "0";

    setTimeout(() => {
        document.getElementById('settingsPanel').style.contentVisibility = "hidden";
    }, 800);
}

function moveCanvas() {
    document.querySelector("canvas").style.left = "30%";
}

function moveCanvasBack() {
    document.querySelector("canvas").style.left = "50%";
}

function backToMainWebsite() {
    window.location.href = "/projects/interactive";
}
