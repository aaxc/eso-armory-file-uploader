// Modules to control application life and create native browser window
const {app, Menu, Tray, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const Store = require('./js/Store.js');
const CronJob = require('cron').CronJob;
const FormData = require('form-data');

// Auto updater
const server = 'https://your-deployment-url.com';
const feed = `${server}/update/${process.platform}/${app.getVersion()}`;
console.log(feed);
autoUpdater.setFeedURL(feed);

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

// Include global variables
global.sharedObj = {
  auto: 'true',
  site: 'https://www.eso-armory.com/app-savefile',
  token: 'bD6s68BhrudnHLFD5JbjQtBsPeATZBrN6mQM5hF6nvjF6A9ZaWVQenSEc4a4wrtcn8A327XZs7wpjwYjhKK8JdpL8pEeqHgntGejq49tLgsUCfPwCqubeGMcG4gGB9UE',
  version: app.getVersion(),
};

// Pre-define main objects
let mainWindow;
let tray;
let fileChange;
let site = global.sharedObj.site;
let token = global.sharedObj.token;


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
  let auto = global.sharedObj.store.data.auto;
  if (auto == 'true' && fs.existsSync(file)) {
    fs.stat(file, function (err, stats) {
      let mtime = stats.mtime;
      let oldDate = new Date(fileChange).valueOf();
      let newDate = new Date(mtime).valueOf();
      if (oldDate != newDate) {
        fileChange = mtime;

        let form = new FormData();
        form.append("file", fs.createReadStream(file));
        form.append("token", token);

        form.submit(site, function (err, res) {
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
  let fileLocation;
  if (!fs.existsSync(store.get('fileLocation'))) {
    fileLocation = null;
    store.set('fileLocation', null);
  }

  let auto = store.get('auto');
  if (auto != 'undefined') {
    global.sharedObj.auto = auto;
  }

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

  // Check updtes
  autoUpdater.checkForUpdatesAndNotify();
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

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});
ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

// Installer events
function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function (command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {
        detached: true
      });
    } catch (error) {
    }

    return spawnedProcess;
  };

  const spawnUpdate = function (args) {
    return spawn(updateDotExe, args);
  };

  // ------------------------------------ //

  const server = 'https://hazel-h59indnhf.now.sh';
  const feed = `${server}/update/${process.platform}/${app.getVersion()}`;
  autoUpdater.setFeedURL(feed);
  var updateIsReady = false;

  ipcMain.on("app:install-update", function () {
    if (updateIsReady) {
      autoUpdater.quitAndInstall();
    } else {
      app.relaunch();
      app.quit();
    }
  });

  autoUpdater.on("update-downloaded", function () {
    updateIsReady = true;
    mainWindow.webContents.send("app:update-ready");
  });

  // check for updates after 2 minutes
  setTimeout(autoUpdater.checkForUpdates, 2 * 60 * 1000);
  // ------------------------------------ //

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(application.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(application.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      application.quit();
      return true;
  }
};
