// Modules to control application life and create native browser window
const {app, Menu, Tray, BrowserWindow} = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('./js/Store.js');
const CronJob = require('cron').CronJob;
var FormData = require('form-data');

// Pre-define main objects
let mainWindow;
let tray;
let fileChange;

// Include environment variables
require('dotenv').config();
global.sharedObj = {
  environment: process.env.ENVIRONMENT,
  auto: process.env.AUTO,
  version: process.env.ESOUIAPIVERSION,
  site: process.env.ESOARMORY_SITE,
  token: process.env.ESOARMORY_KEY,
};

// First instantiate the class
const store = new Store({
  configName: 'user-preferences',
  defaults: {
    fileLocation: 'Documents\\Elder Scrolls Online\\live\\SavedVariables\\Armory.lua',
    auto: 'true',
    lastUpdate: 0
  }
});
global.sharedObj.store = store;

/**
 * Create the browser window.
 */
function createWindow() {
  // Set main window options
  mainWindow = new BrowserWindow({
    width: 600,
    height: 450,
    resizable: false,
    fullscreen: false,
    darkTheme: true,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'images/icon256x256.png'),
    backgroundColor: '#000000',
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setFullScreen(false);

  // Basic entry point
  mainWindow.loadFile('index.html');

  // Minimize
  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  // Close (works as minimized for us)
  mainWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }

    return false;
  });

  // Destroy
  mainWindow.on('closed', function () {
    mainWindow = null
  });
}

// Add cron for file changes and submits
new CronJob(' */5 * * * *', function () {
  let file = global.sharedObj.store.data.fileLocation;
  let token = global.sharedObj.token;
  let auto = global.sharedObj.store.data.auto;

  if (auto == 'true') {
    fs.stat(file, function (err, stats) {
      let mtime = stats.mtime;
      let oldDate = new Date(fileChange).valueOf();
      let newDate = new Date(mtime).valueOf();
      if (oldDate != newDate) {
        fileChange = mtime;

        let form = new FormData();
        form.append("file", fs.createReadStream(file));
        form.append("token", token);

        form.submit(process.env.ESOARMORY_SITE, function (err, res) {
          if (res.statusCode == 200) {
            global.sharedObj.lastUpdate = fileChange.valueOf();
            store.set('lastUpdate', fileChange.valueOf());
            // console.log('SUCCESS!');
          } else {
            // console.log('FAILED');
          }
        });
      }
    });
  }

}, null, true, 'America/Los_Angeles');

// Define tray and minimize behavior
app.on('ready', () => {
  let fileLocation = store.get('fileLocation');
  let auto = store.get('auto');
  if (auto != 'undefined') {
    global.sharedObj.auto = auto;
  }

  fs.access(fileLocation, fs.F_OK, (err) => {
    if (err) {
      global.sharedObj.fileLocation = null;
      return;
    }
  });

  tray = new Tray(path.join(__dirname, 'images/icon256x256.png'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show uploader', click: function () {
        mainWindow.show();
      }
    },
    {
      label: 'Exit', click: function () {
        app.isQuiting = true;
        app.quit();
      }
    },
  ]);
  tray.on('double-click', function (e) {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  });
  tray.setToolTip('ESO Armory File uploader')
  tray.setContextMenu(contextMenu)
});

// This method will be called when App has finished initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

// On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
app.on('activate', function () {
  if (mainWindow === null) createWindow()
});
