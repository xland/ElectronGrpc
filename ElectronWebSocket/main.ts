import { app, BrowserWindow, crashReporter } from "electron";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import path from "path";
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
let mainWindow: BrowserWindow;

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

  // mainWindow.once('ready-to-show', () => {
  //   let addon = require('D:\\project\\ElectronGrpc\\SubWindowAddon\\build\\Release\\native.node')
  //   addon.createSubWindow(mainWindow.getNativeWindowHandle())
  // })
};

let startServer = () => {
  let server = createServer();
  let wss = new WebSocketServer({ server });
  wss.on("connection", (ws) => {
    ws.on("error", console.error);
    ws.on("message", function message(data) {
      console.log("received: %s", data);
    });
    ws.send("something");
  });
  server.listen(0, "localhost").on("listening", () => {
    let addressInfo = server.address();
    let httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;
    console.log(httpAddress);
  });
};

app.whenReady().then(() => {
  //https://doc.qt.io/qt-6/qtwebsockets-index.html
  //https://code.qt.io/cgit/qt/qtwebsockets.git/tree/examples/websockets/echoclient?h=6.4
  startMainWindow();
  startServer();
});
