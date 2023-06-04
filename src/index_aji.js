const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("electron-fiddle", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("electron-fiddle");
}

const createWindow = (testLink) => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // kiosk: true,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
      webviewTag: true,
      enableRemoteModule: true,
    },
  });
  console.log("testLink", testLink);

  // and load the index.html of the app.
  mainWindow.loadURL("https://hr.gs/11233");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

app.whenReady().then((e) => {
  // Event handler for the 'open-electron-app' message
  createWindow("https://www.google.com");
});

// app.on("open-url", (event, url) => {
//   event.preventDefault();
//   const parsedUrl = new URL(url);
//   const testLink = parsedUrl.searchParams.get("hackerrank_test_link");
//   createWindow(testLink);
// });

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// app.on("ready", () => {
//   session.defaultSession.setPermissionRequestHandler(
//     (webContents, permission, callback) => {
//       if (permission === "media") {
//         callback(true);
//       } else {
//         callback(false);
//       }
//     }
//   );
// });

app.on("activate", () => {
  // On macOS, re-create a window when the dock icon is clicked and no other windows are open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// This method will be called when Electron has finished initialization and is ready to create browser windows.
app.on("ready", createWindow);
