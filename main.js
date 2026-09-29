const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// WebGPU (needed for the on-device coach) requires a recent Chromium.
// Electron >= 28 ships one, but the flag below makes sure it's on.
app.commandLine.appendSwitch('enable-unsafe-webgpu');
app.commandLine.appendSwitch('enable-features', 'Vulkan,UseSkiaRenderer');

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 800,
    minWidth: 720,
    minHeight: 560,
    icon: path.join(__dirname, 'app', 'icon.svg'),
    autoHideMenuBar: true,
    backgroundColor: '#F7F6F2',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Open any external link (e.g. someone clicking out) in the OS browser
  // instead of navigating the app window away from the diary.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
