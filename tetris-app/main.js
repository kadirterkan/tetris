// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 575,
        height: 800,
        fullscreenable: false,
        fullscreen: false,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        show: false
    });
    // and load the mainpage.html of the app.
    mainWindow.loadFile('./src/main_page/mainpage.html');
    // mainWindow.loadFile("./src/game_page/gamepage.html");

    mainWindow.show();
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('close', () => {
    app.quit();
});

ipcMain.on('gamePage', () => {
    mainWindow.loadFile("./src/game_page/gamepage.html");
});

ipcMain.on('mainPage', () => {
    mainWindow.loadFile("./src/main_page/mainpage.html");
});