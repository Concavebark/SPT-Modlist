const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { getPages } = require('./getModList.js');

const createWindow = () => {
    
    const preloadScriptPath = path.join(__dirname, 'preload.js');
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true, preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')

    ipcMain.handle('toMain', async function toMain(_event, data) {
        
    })

    }

app.whenReady().then(() => {
    createWindow()
    getPages();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    }) //failsafe for MacOS window opening
    })

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})