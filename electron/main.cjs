const { app, BrowserWindow, ipcMain } = require("electron");
const { execFile } = require("node:child_process");
const path = require("node:path");

const CONNECTED_CLASSIC_DEVICES_CHANNEL =
  "bluetooth:get-connected-classic-devices";

let mainWindow = null;

function getBluetoothHelperPath() {
  if (app.isPackaged) {
    return path.join(
      process.resourcesPath,
      "native",
      "BluetoothStatus.exe",
    );
  }

  return path.join(
    __dirname,
    "..",
    "native",
    "BluetoothStatus",
    "publish",
    "BluetoothStatus.exe",
  );
}

function runBluetoothHelper() {
  if (process.platform !== "win32") {
    return Promise.reject(
      new Error("Windows Bluetooth device status is only available on Windows."),
    );
  }

  const helperPath = getBluetoothHelperPath();

  return new Promise((resolve, reject) => {
    execFile(
      helperPath,
      [],
      {
        windowsHide: true,
        timeout: 8000,
        maxBuffer: 256 * 1024,
        encoding: "utf8",
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(
            new Error(
              (stderr || "").trim() ||
                `Bluetooth helper failed: ${error.message}`,
            ),
          );
          return;
        }

        try {
          const result = JSON.parse(stdout);

          if (
            !Array.isArray(result) ||
            !result.every(
              (device) =>
                device &&
                typeof device.name === "string" &&
                device.name.trim().length > 0,
            )
          ) {
            throw new Error("Bluetooth helper returned an invalid response.");
          }

          resolve(
            result.map((device) => ({
              name: device.name.trim(),
            })),
          );
        } catch (parseError) {
          reject(
            new Error(
              parseError instanceof Error
                ? parseError.message
                : "Could not read Bluetooth helper response.",
            ),
          );
        }
      },
    );
  });
}

function registerIpcHandlers() {
  ipcMain.handle(
    CONNECTED_CLASSIC_DEVICES_CHANNEL,
    async (event, ...args) => {
      if (args.length !== 0) {
        throw new Error("This Bluetooth request does not accept arguments.");
      }

      if (
        !mainWindow ||
        event.sender !== mainWindow.webContents ||
        (event.senderFrame &&
          event.senderFrame !== mainWindow.webContents.mainFrame)
      ) {
        throw new Error("Untrusted Bluetooth IPC request.");
      }

      return runBluetoothHelper();
    },
  );
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
