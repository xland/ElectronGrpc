import { app, BrowserWindow, crashReporter } from "electron";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
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
};

let sayHello = (call, callback) => {
  callback(null, { message: "Hello " + call.request.name });
};

let startGrpcServer = () => {
  let server = new grpc.Server();
  let protoPath = path.join(process.cwd(), "helloworld.proto");
  let packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  let hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;
  server.addService(hello_proto.Greeter.service, { sayHello: sayHello });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
};

app.whenReady().then(() => {
  startMainWindow();
  startGrpcServer();
});
