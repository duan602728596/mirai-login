import process from 'process';
import path from 'path';
import url from 'url';
import { app, BrowserWindow, Menu } from 'electron';
import ipc from './ipc';

const isDevelopment = process.env.NODE_ENV === 'development';
let win = null;

/* 初始化 */
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: false
    },
    icon: isDevelopment ? undefined : path.join(__dirname, '../../titleBarIcon.png')
  });

  if (isDevelopment) {
    win.webContents.openDevTools();
  }

  win.loadURL(isDevelopment ? 'http://127.0.0.1:5050' : url.format({
    pathname: path.join(__dirname, '../../dist/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // 去掉顶层菜单
  Menu.setApplicationMenu(null);

  ipc(win);

  win.on('closed', function() {
    win = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (win === null) {
    createWindow();
  }
});