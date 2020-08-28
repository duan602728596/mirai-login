import { ipcMain } from 'electron';

/* ipc通信 */
function ipc(win) {
  ipcMain.on('developer-tools', function(event, ...args) {
    win.webContents.openDevTools();
  });
}

export default ipc;