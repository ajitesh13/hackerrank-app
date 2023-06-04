// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

// Expose a subset of the Electron and Node.js APIs to the renderer process
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer,
  getMediaDevices: async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    return stream;
  },
});
