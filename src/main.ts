import { app, BrowserWindow } from 'electron';
import request from 'request';
import isDev from 'electron-is-dev';
import Store from 'electron-store';
declare var __dirname: string;
let mainWindow: Electron.BrowserWindow;

function onReady() {
  mainWindow = new BrowserWindow({
    frame: false, width: 960, height: 680, resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  const configUrl = 'https://noscore-legend-launcher.s3.eu-west-3.amazonaws.com/launcher.json';
  const store = new Store();
  request.get(configUrl).on('response', (response: any) => {
    let body = '';
    response.on('data', function (d: any) {
      body += d;
    });
    response.on('end', function () {
      store.set('configuration', JSON.parse(body));
    });
  });

  const fileName = isDev ? 'http://localhost:8080' : `file://${__dirname}/index.html`;
  mainWindow.loadURL(fileName).then().catch();
  mainWindow.on('close', () => app.quit());
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

app.on('ready', () => onReady());
app.on('window-all-closed', () => app.quit());
