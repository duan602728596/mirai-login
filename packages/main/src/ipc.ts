import { ipcMain, BrowserWindow, IpcMainEvent } from 'electron';

/* ipc通信 */
function ipc(win: BrowserWindow): void {
  ipcMain.on('developer-tools', function(event: IpcMainEvent): void {
    win.webContents.openDevTools();
  });
}

export default ipc;