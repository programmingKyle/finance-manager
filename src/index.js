const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { autoUpdater } = require('electron-updater');
const fs = require('fs');

const Store = require('electron-store');
const store = new Store();

const sqlite3 = require('sqlite3').verbose();
const appDataPath = app.getPath('userData');
const db = new sqlite3.Database(`${appDataPath}/database.db`);

const currencyOptions = `${appDataPath}/currency.json`;

const graphSettings = `${appDataPath}/graphSettings.json`;

db.run(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY,
    name TEXT,
    currency TEXT,
    type TEXT,
    homeGraph INT,
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
    value TEXT,
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
  const { width, height, x, y, isMaximized } = store.get('windowBounds', { width: 800, height: 600, x: undefined, y: undefined, isMaximized: false });  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: x,
    y: y,
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

  if (isMaximized) {
    maximized = true;
    mainWindow.maximize();
  }

  mainWindow.on('resize', () => {
    if (!mainWindow.isMaximized()) {
      const { width: newWidth, height: newHeight } = mainWindow.getBounds();
      store.set('windowBounds', { width: newWidth, height: newHeight, x: mainWindow.getPosition()[0], y: mainWindow.getPosition()[1], isMaximized: false });
    } else {
      store.set('windowBounds', { width, height, x, y, isMaximized: true });
    }
  });
  
  mainWindow.on('move', () => {
    if (!mainWindow.isMaximized()) {
      const [newX, newY] = mainWindow.getPosition();
      store.set('windowBounds', { width, height, x: newX, y: newY, isMaximized: false });
    }
  });

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

let maximized;
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
  if (maximized){
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
  maximized = !maximized;
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
    case 'Edit':
      result = await editProject(data.id, data.newName, data.newCurrency);
      break;
    case 'Delete':
      result = await deleteProject(data.id);
      break;
    case 'HomeGraph':
      result = await homeGraphProject(data.id, data.isHomeGraphed);
      break;
  }
  return result;
});

async function homeGraphProject(id, isHomeGraphed){
  const sqlStatement = `UPDATE projects SET homeGraph = ? WHERE id = ?`;
  const params = [isHomeGraphed, id];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}

async function editProject(id, newName, newCurrency){
  const sqlStatement = `UPDATE projects SET name = ?, currency = ? WHERE id = ?`;
  const params = [newName, newCurrency, id];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}

async function addProject(name, currency, type){
  if (!fs.existsSync(currencyOptions)){
    await saveCurrencyOptions(currency)
  }  
  const sqlStatement = `INSERT INTO projects (name, currency, type, homeGraph, dateCreated, dateModified) VALUES (?, ?, ?, ?, datetime("now", "localtime"), datetime("now", "localtime"))`;
  const params = [name, currency, type, 1];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}

async function viewProjects(type){
  const sqlStatement = `SELECT * FROM projects WHERE type = ?`;
  const params = [type];
  const result = databaseHandler('all', sqlStatement, params);
  return result;
}

async function deleteProject(id){
  let result;

  const projectSql = `DELETE FROM projects WHERE id = ?`;
  const logSql = `DELETE FROM logs WHERE projectID = ?`;
  const params = [id];
  
  try {
    await databaseHandler('run', projectSql, params);
    await databaseHandler('run', logSql, params);
    result = true;
  } catch (err){
    result = false;
  }
  return result;
}

ipcMain.handle('log-handler', async (req, data) => {
  if (!data || !data.request) return;
  let result;
  switch (data.request){
    case 'view':
      result = await viewLog(data.projectID);
      break;
    case 'log':
      result = await inputLog(data.log);
      break;
    case 'edit':
      result = await editLog(data.id, data.newDescription, data.newValue, data.newType);
      break;
    case 'delete':
      result = await deleteLog(data.id);
      break;
  }
  return result;
});

async function deleteLog(id){
  const sqlStatement = `DELETE FROM logs WHERE id = ?`;
  const params = [id];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}


async function editLog(id, newDescription, newValue, newType){
  const sqlStatement = `UPDATE logs SET description = ?, value = ?, type = ? WHERE id = ?`;
  const params = [newDescription, newValue, newType, id];
  const result = databaseHandler('run', sqlStatement, params);
  return result;
}

async function inputLog(log){
  const sqlStatement = `INSERT INTO logs (projectID, description, value, type, date) VALUES (?, ?, ?, ?, datetime("now", "localtime"))`;
  const logParams = [log.projectID, log.description, log.value.toString(), log.type];

  const projectStatement = `UPDATE projects SET dateModified = datetime("now", "localtime") WHERE id = ?`;
  const projectParams = [log.projectID];
  
  try {
    await databaseHandler('run', sqlStatement, logParams);
    await databaseHandler('run', projectStatement, projectParams);
    return true;
  } catch (err){
    return false;
  }
}

async function viewLog(projectID){
  const sqlStatement = `SELECT * FROM logs WHERE projectID = ? ORDER BY date DESC LIMIT 100`;
  const params = [projectID];
  const result = databaseHandler('all', sqlStatement, params);
  return result;
}

ipcMain.handle('get-currencies', async () => {
  const sqlStatement = `SELECT DISTINCT currency FROM projects`;
  const params = [];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
});

ipcMain.handle('project-list-from-currency', async (req, data) => {
  if (!data || !data.currency) return;
  const sqlStatement = `SELECT * FROM projects WHERE currency = ?`
  const params = [data.currency];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
});

ipcMain.handle('currency-options-handler', async (req, data) => {
  if (!data || !data.request) return;
  let results;
  switch (data.request) {
    case 'View':
      results = await viewCurrencyOptions();
      break;
    case 'Save':
      await saveCurrencyOptions(data.currency);
      break;
  }
  return results;
});

async function saveCurrencyOptions(currency){
  const settings = {
    currency: currency
  }

  const jsonSettings = JSON.stringify(settings, null, 2);

  fs.writeFile(currencyOptions, jsonSettings, (err) => {
    if (err){
      console.error(err);
    }
  });
}

async function viewCurrencyOptions(){
  return new Promise((resolve, reject) => {
    fs.readFile(currencyOptions, 'utf-8', (err,data) => {
      if (err){
        reject(err);
      } else {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      }
    });
  });
}

ipcMain.handle('get-graph-data', async (req, data) => {
  if (!data || !data.request) return;
  let result;
  switch (data.request){
    case 'GetProjects':
      result = await getSelectedProjects(data.currency);
      break;
    case 'ProjectsCount':
      result = await getProjectInteractionCount(data.projectID, data.select, data.number);
      break;
    case 'ProjectInteractions':
      result = await getProjectInteraction(data.projectID, data.type, data.select, data.number);
      break;
    case 'PreviousProfits':
      result = await getProjectPreviousProfits(data.projectID, data.type, data.select, data.number);
      break;
  }
  return result;
});

async function getSelectedProjects(currency){
  const sqlStatement = `SELECT * FROM projects WHERE currency = ? and homeGraph = 1`;
  const params = [currency];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
}

async function getProjectInteractionCount(id, select, number) {
  const sqlStatement = `
    SELECT 
      strftime('%Y-%m${select === 'Annual' ? '' : '-%d'}', date) AS month,
      COUNT(*) AS interactionCount
    FROM 
      logs 
    WHERE 
      projectID = ?
      AND date >= DATE('now', '${select === 'Annual' ? `-12 months` : `-${number} days`}')
    GROUP BY 
      strftime('%Y-%m${select === 'Annual' ? '' : '-%d'}', date)
    ORDER BY 
      month;
  `;
  const params = [id];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
}

async function getProjectInteraction(id, type, select, number) {
  const sqlStatement = `
    SELECT 
      strftime('%Y-%m${select === 'Annual' ? '' : '-%d'}', date) AS month,
      SUM(value) AS total
    FROM 
      logs 
    WHERE 
      projectID = ? 
      AND type = ? 
      AND date >= DATE('now', '${select === 'Annual' ? `-12 months` : `-${number} days`}')
    GROUP BY 
      strftime('%Y-%m${select === 'Annual' ? '' : '-%d'}', date)
    ORDER BY 
      month;
  `;
  const params = [id, type];
  const result = await databaseHandler('all', sqlStatement, params);
  return result;
}

async function getProjectPreviousProfits(id, type, select, number) {
  const valueSelect = `-${number} ${select === 'Annual' ? 'months' : 'days'}`;
  const sqlStatement = `
    SELECT 
      SUM(value) AS total
    FROM 
      logs 
    WHERE 
      projectID = ? 
      AND type = ? 
      AND date < DATE('now', ?)
  `;
  const params = [id, type, valueSelect];
  const [ { total } ] = await databaseHandler('all', sqlStatement, params);
  return total || 0;
}

ipcMain.handle('graph-settings-handler', async (req, data) => {
  if (!data || !data.request) return;
  let result;
  switch(data.request){
    case 'Get':
      result = await checkGraphSettings();
      break;
    case 'Update':
      await updateGraphSettings(data.graphSelect, data.timeOption);
      break;
  }
  return result;
});

async function updateGraphSettings(graphSelect, timeOption){
  const jsonData = JSON.parse(fs.readFileSync(graphSettings, 'utf-8'));
  jsonData[graphSelect] = timeOption;
  fs.writeFileSync(graphSettings, JSON.stringify(jsonData, null, 2));
}

async function checkGraphSettings(){
  let result;
  if (!fs.existsSync(graphSettings)){
    result = createDefaultGraphSettings();
  } else {
    result = getGraphSettings();
  }
  return result;
}

function createDefaultGraphSettings(){
  const settings = {
    homeComp: 'Annual',
    homeInter: 'Annual',
    projectComp: 'Annual',
    projectGrowth: 'Annual',
  }

  const jsonSettings = JSON.stringify(settings, null, 2);

  fs.writeFile(graphSettings, jsonSettings, (err) => {
    if (err){
      console.error(err);
    }
  });

  return JSON.parse(jsonSettings);
}

async function getGraphSettings(){
  const jsonData = await fs.promises.readFile(graphSettings, 'utf-8');
  return JSON.parse(jsonData);
}