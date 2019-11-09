import { app, BrowserWindow, ipcMain } from 'electron';
const isDev = require('electron-is-dev');
declare var __dirname: string;
let mainWindow: Electron.BrowserWindow;

function onReady() {
  mainWindow = new BrowserWindow({
    frame: false, width: 960, height: 680, resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const fileName = isDev ? 'http://localhost:8080' : `file://${__dirname}/index.html`;
  mainWindow.loadURL(fileName).then().catch();
  mainWindow.on('close', () => app.quit());
}

app.on('ready', () => onReady());
app.on('window-all-closed', () => app.quit());
