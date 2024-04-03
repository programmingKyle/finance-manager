const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {

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