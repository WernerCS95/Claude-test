const { app, BrowserWindow, protocol, net } = require('electron');
const path = require('path');
const url = require('url');

/*
 * Same fixed-origin approach as the Master List desktop app: the page is
 * served through a custom app:// protocol instead of file://, so its
 * origin — and therefore its localStorage — never shifts across rebuilds,
 * reinstalls, or updates, no matter where Windows installs this app.
 */
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } }
]);

function createWindow(){
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadURL('app://leaderapp/stores-terminal.html');
}

app.whenReady().then(() => {
  protocol.handle('app', (request) => {
    const filePath = path.join(__dirname, 'stores-terminal.html');
    return net.fetch(url.pathToFileURL(filePath).toString());
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
