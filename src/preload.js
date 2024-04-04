const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    frameHandler: (data) => ipcRenderer.invoke('frame-handler', data),
    projectHandler: (data) => ipcRenderer.invoke('project-handler', data),
});

contextBridge.exposeInMainWorld('autoUpdater', {
    autoUpdaterCallback: (callback) => {
        ipcRenderer.on('auto-updater-callback', (_, status) => {
            callback(status);
        });
    },
    restartAndUpdate: () => ipcRenderer.invoke('restart-and-update'),
    closeApp: () => ipcRenderer.invoke('close-app'),
});