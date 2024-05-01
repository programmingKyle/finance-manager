const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    frameHandler: (data) => ipcRenderer.invoke('frame-handler', data),
    projectHandler: (data) => ipcRenderer.invoke('project-handler', data),
    logHandler: (data) => ipcRenderer.invoke('log-handler', data),
    getCurrencies: () => ipcRenderer.invoke('get-currencies'),
    projectListFromCurrency: (data) => ipcRenderer.invoke('project-list-from-currency', data),
    currencyOptionsHandler: (data) => ipcRenderer.invoke('currency-options-handler', data),
    getGraphData: (data) => ipcRenderer.invoke('get-graph-data', data),
    graphSettingsHandler: (data) => ipcRenderer.invoke('graph-settings-handler', data),
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