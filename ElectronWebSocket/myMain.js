let { app, BrowserWindow, crashReporter,ipcMain } = require("electron");
let path = require("path")
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
let mainWindow;

let startMainWindow = () => {
    let config = {
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        allowRunningInsecureContent: true,
        contextIsolation: false,
        webviewTag: true,
        spellcheck: false,
        disableHtmlFullscreenWindowResize: true,
      },
    };
    mainWindow = new BrowserWindow(config);
    mainWindow.webContents.openDevTools({ mode: "undocked" });
    mainWindow.loadURL(path.join(process.cwd(), "./index.html"));
    ipcMain.handle('createChildWindow', async (event, someArgument) => {
        let addon = require('D:\\project\\ElectronGrpc\\SubWindowAddon\\build\\Debug\\native.node')
        addon.createChildWindow(mainWindow.getNativeWindowHandle())
    })
  };

app.whenReady().then(() => {
    startMainWindow();
});