const { app, BrowserWindow, protocol, net, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

// Dev mode — started via "npm run dev" (passes --dev). Opens DevTools
// automatically and watches master-list.html on disk, reloading the window
// the instant it's saved — no rebuild, no reinstall. Uses Node's built-in
// fs.watch rather than a new dependency, since it's only ever watching one
// file. See docs/DEV-MODE.md for what is and isn't identical to the real
// packaged app in this mode.
const DEV_MODE = process.argv.includes('--dev');

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
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // One app since the merge: app.html is the shell, with stores-terminal.html
  // (Input) and master-list.html (Admin) inside it. Same app://leaderapp
  // origin as before, so the existing Master List data is exactly where it was.
  win.loadURL('app://leaderapp/app.html');

  if(DEV_MODE){
    win.webContents.openDevTools();
    ['app.html', 'stores-terminal.html', 'master-list.html'].forEach(name=>{
      const watchedFile = path.join(__dirname, name);
      fs.watch(watchedFile, { persistent: true }, (eventType)=>{
        if(eventType === 'change') win.webContents.reloadIgnoringCache();
      });
      console.log('[DEV MODE] Watching for changes: ' + watchedFile);
    });
  }
}

// After an alert()/confirm() box, give the keyboard back to the page
// (Windows: otherwise typing stops working until the window is reopened).
ipcMain.on('leader-refocus', (event)=>{
  const win = BrowserWindow.fromWebContents(event.sender);
  if(!win || win.isDestroyed()) return;
  win.blur();
  win.focus();
  win.webContents.focus();
});

app.whenReady().then(() => {
  protocol.handle('app', (request) => {
    const reqUrl = new URL(request.url);
    // Used to always serve master-list.html regardless of the requested
    // path — fine while it really was the only file, but a <script
    // src="vendor/..."> request would get master-list.html's own HTML
    // back instead of the actual script and silently fail to parse.
    // Now resolves the real file under __dirname when it exists (e.g.
    // vendor/jspdf.umd.min.js), and only falls back to master-list.html
    // for the root path or anything that doesn't resolve to a real file —
    // same safety net as before, still always served from app://leaderapp
    // so the storage origin stays exactly as fixed as it always was.
    let relPath = decodeURIComponent(reqUrl.pathname);
    if(!relPath || relPath === '/') relPath = '/app.html';
    const resolved = path.normalize(path.join(__dirname, relPath));
    const filePath = (resolved.startsWith(__dirname) && fs.existsSync(resolved) && fs.statSync(resolved).isFile())
      ? resolved
      : path.join(__dirname, 'app.html');
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
