// src/main/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectImages: () => ipcRenderer.invoke('select-images'),
  cropImages: (files, cropOptions) => ipcRenderer.invoke('crop-images', files, cropOptions),
});
