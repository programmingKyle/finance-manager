const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { autoUpdater } = require('electron-updater');

const sqlite3 = require('sqlite3').verbose();
const appDataPath = app.getPath('userData');
const db = new sqlite3.Database(`${appDataPath}/database.db`);

db.run(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY,
    name TEXT,
    currency TEXT,
    type TEXT,
    dateCreated TIMESTAMP,
    dateModified TIMESTAMP,
    UNIQUE(name, type)
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY,
    projectID INTEGER,
    description TEXT,
    value DECIMAL,
    type TEXT,
    date TIMESTAMP
  );
`);

let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 500,
    minWidth: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.once('ready-to-show', () => {
    if (app.isPackaged) {
      autoUpdater.setFeedURL({
        provider: 'github',
        owner: 'programmingKyle',
        repo: 'finance-manager',
      });
      autoUpdater.checkForUpdatesAndNotify();
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

let isMaximized;
ipcMain.handle('frame-handler', (req, data) => {
  if (!data || !data.request) return;
  switch(data.request){
    case 'Minimize':
      mainWindow.minimize();
      break;
    case 'Maximize':
      toggleMaximize();
      break;
    case 'Exit':
      mainWindow.close();
      break;
    }
});

function toggleMaximize(){
  if (isMaximized){
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
  isMaximized = !isMaximized;
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('auto-updater-callback', 'Checking for Update');
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('auto-updater-callback', 'Update Available');
});

autoUpdater.on('update-not-available', () => {
  mainWindow.webContents.send('auto-updater-callback', 'No Updates Available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('auto-updater-callback', 'Update Downloaded');
});

ipcMain.handle('restart-and-update', () => {
  ensureSafeQuitAndInstall();
});

function ensureSafeQuitAndInstall() {
  setImmediate(() => {
    app.removeAllListeners("window-all-closed")
    if (mainWindow != null) {
      mainWindow.close()
    }
    autoUpdater.quitAndInstall(false)
  })
}

ipcMain.handle('close-app', () => {
  app.quit();
});

function databaseHandler(request, query, params) {
  if (request === 'run') {
      return new Promise((resolve, reject) => {
        db.run(query, params, (err) => {
          if (err) {
              if (err.message.includes('UNIQUE constraint failed')) {
                  resolve('duplicate');
              } else {
                  resolve(false); // Or reject(err) if you want to propagate the error
              }
          } else {
              resolve(true); // Operation successful
          }
      });
    });
  } else if (request === 'all') {
      return new Promise((resolve, reject) => {
          db.all(query, params, (err, rows) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(rows);
              }
          });  
      });
  } else {
      console.error('Invalid Database Request');
  }
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle('project-handler', async (req, data) => {
  let result;
  if (!data || !data.request) return;
  switch (data.request){
    case 'Add':
      result = await addProject(data.name, data.currency, data.type);
      break;
    case 'View':
      result = await viewProjects(data.type);
      break;
  }
  return result;
});

async function addProject(name, currency, type){
  const sqlStatement = `INSERT INTO projects (name, currency, type, dateCreated, dateModified) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
  const params = [name, currency, type];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}

async function viewProjects(type){
  const sqlStatement = `SELECT * FROM projects WHERE type = ?`;
  const params = [type];
  const result = databaseHandler('all', sqlStatement, params);
  return result;
}

ipcMain.handle('log-handler', async (req, data) => {
  if (!data || !data.request) return;
  switch (data.request){
    case 'view':
      break;
    case 'log':
      const result = await inputLog(data.log);
      console.log(result);
      break;
  }
});

async function inputLog(log){
  const sqlStatement = `INSERT INTO logs (projectID, description, value, type, date) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`;
  const params = [log.projectID, log.description, log.value, log.type];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}