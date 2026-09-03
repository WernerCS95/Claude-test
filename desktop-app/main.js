const { app, BrowserWindow, protocol, net } = require('electron');
const path = require('path');
const url = require('url');

/*
 * Storage-origin stability (this is the one thing that must never break):
 * localStorage is scoped per-origin. If we just loaded master-list.html via a
 * plain file:// path, the exact origin Chromium assigns can shift with the
 * install location/packaging, and a shift means "empty storage" on next
 * launch with zero warning. To rule that out entirely, this app serves the
 * page through a custom, fixed app:// protocol instead of file://, so the
 * origin is always exactly "app://leaderapp" no matter where Windows installs
 * or updates the app to. Same origin every launch = same localStorage every
 * launch, permanently.
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

  win.loadURL('app://leaderapp/master-list.html');
}

app.whenReady().then(() => {
  protocol.handle('app', (request) => {
    const reqUrl = new URL(request.url);
    // Only one file is ever served — anything under app://leaderapp/ maps to master-list.html.
    const filePath = path.join(__dirname, 'master-list.html');
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
