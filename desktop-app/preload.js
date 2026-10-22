// Laptop (Electron) only. Windows bug: after a native alert()/confirm() box
// closes, the window looks focused but typed keys no longer reach the page
// (copy-paste with the mouse still works). The pages call refocus() after
// every such box, and the main process hands keyboard focus back.
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('leaderDesktop', {
  refocus: ()=> ipcRenderer.send('leader-refocus')
});
