const ipc = require('electron').ipcRenderer;

function onClickCloseApp() {
    ipc.send('close');
}

function onClickStartGame() {
    ipc.send('gamePage');
}