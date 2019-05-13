import * as electron from 'electron';

function createWindow () {
    // Create the browser window.
    let win = new electron.BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    });
  
    // and load the index.html of the app.
    win.loadFile('index.html');

    // Open the DevTools.
    win.webContents.openDevTools();
  
  }
  
  electron.app.on('ready', createWindow);