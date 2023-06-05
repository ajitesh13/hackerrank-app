const { app, BrowserWindow, systemPreferences } = require("electron");
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
    kiosk: true,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
      webviewTag: true,
      enableRemoteModule: true,
    },
  });

  // const videoApi = navigator.getUserMedia(
  //   { video: true, audio: false },
  //   (localMediaStream) => {
  //     var video = document.querySelector("video");
  //     video.srcObject = localMediaStream;
  //     video.autoplay = true;
  //   },
  //   (e) => {}
  // );

  mainWindow.loadURL(testLink || "https://hr.gs/11233");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  const askForCameraPermission = async () => {
    const mediaType = "camera";
    const response = await systemPreferences.askForMediaAccess(mediaType);
    console.log("Camera permission response:", response);
  };

  mainWindow.webContents.once("did-finish-load", () => {
    // Call the function to ask for camera permission after the web page has loaded
    askForCameraPermission();
  });
};

app.whenReady().then((e) => {
  // Event handler for the 'open-electron-app' message
  createWindow();
});

app.on("open-url", (event, url) => {
  event.preventDefault();
  const parsedUrl = new URL(url);
  const testLink = parsedUrl.searchParams.get("testLink");
  createWindow(testLink);
});

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// const mainSession = mainWindow.webContents.session;
// // and load the index.html of the app.
// console.log("sessions >>> ", mainSession);

// mainSession.setPermissionRequestHandler(
//   (webContents, permission, callback) => {
//     console.log("setPerm>>>>");
//     let allowedPermissions = ["media"]; // Full list here: https://developer.chrome.com/extensions/declare_permissions#manifest

//     if (allowedPermissions.includes(permission)) {
//       console.log("permission>>>", permission);
//       callback(true, (e) => console.log("Caught error", e)); // Approve permission request
//     } else {
//       console.error(
//         `The application tried to request permission for '${permission}'. This permission was not whitelisted and has been blocked.`
//       );

//       callback(false); // Deny
//     }
//     // if (webContents.getURL() === 'some-host' && permission === 'notifications') {
//     //   return callback(false) // denied.
//     // }

//     // callback(true)
//   }
// );

// mainSession.setPermissionCheckHandler((webContents, permission, callback) => {
//   console.log("check>>>>");
//   let allowedPermissions = ["media"]; // Full list here: https://developer.chrome.com/extensions/declare_permissions#manifest

//   if (allowedPermissions.includes(permission)) {
//     // callback(true); // Approve permission request
//     console.log("Permission approved>>>");
//   } else {
//     console.error(
//       `The application tried to request permission for '${permission}'. This permission was not whitelisted and has been blocked.`
//     );

//     // callback(false); // Deny
//   }
// });
// };

// app.on("activate", () => {
//   // On macOS, re-create a window when the dock icon is clicked and no other windows are open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });

// This method will be called when Electron has finished initialization and is ready to create browser windows.
// app.on("ready", createWindow);
