// Modules to control application life and create native browser window
const {app, Menu, Tray, BrowserWindow} = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('./js/store.js');
// const CronJob = require('cron').CronJob;

// Pre-define main objects
let mainWindow;
let tray;

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
    auto: 'true'
  }
});
global.sharedObj.store = store;

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
      return
    }
    global.sharedObj.fileLocation = fileLocation;
    if (auto != 'false') {
      StartWatcher(fileLocation);
    }
  });

  tray = new Tray('images/icon256x256.png')
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

/**
 * File watching method
 *
 * @param path
 * @constructor
 */
function StartWatcher(path) {
  let chokidar = require("chokidar");

  let watcher = chokidar.watch(path, {
    ignored: /[\/\\]\./,
    persistent: true
  });

  function onWatcherReady() {
    console.info('From here can you check for real changes, the initial scan has been completed.');
  }

  // Declare the listeners of the watcher
  watcher
    // .on('add', function (path) {
    //   // console.log('File', path, 'has been added');
    // })
    // .on('addDir', function (path) {
    //   // console.log('Directory', path, 'has been added');
    // })
    .on('change', function (path) {
      console.log('File', path, 'has been changed');
    })
    // .on('unlink', function (path) {
    //   // console.log('File', path, 'has been removed');
    // })
    // .on('unlinkDir', function (path) {
    //   // console.log('Directory', path, 'has been removed');
    // })
    // .on('error', function (error) {
    //   console.log('Error happened', error);
    // })
    .on('ready', onWatcherReady);
    // .on('raw', function (event, path, details) {
    //   // This event should be triggered everytime something happens.
    //   // console.log('Raw event info:', event, path, details);
    // });
}

/**
 * Create the browser window.
 */
function createWindow() {
  // Set main window options
  mainWindow = new BrowserWindow({
    width: 600,
    height: 450,
    resizable: false,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'images/icon256x256.png'),
  });

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
  })

  // // Add cron for file changes and submits
  // new CronJob(' */1 * * * *', function () {
  //   // Add events here
  // }, null, true, 'America/Los_Angeles');
}

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
