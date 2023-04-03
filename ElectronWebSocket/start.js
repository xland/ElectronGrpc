let { spawn } = require("child_process");
require("esbuild").buildSync({
  entryPoints: ["./main.ts"],
  bundle: true,
  platform: "node",
  outfile: "./main.js",
  external: ["electron"],
});
let electronProcess = spawn(require("electron").toString(), ["./main.js"], {
  cwd: process.cwd(),
  stdio: "inherit",
});
electronProcess.on("close", () => {
  process.exit();
});
