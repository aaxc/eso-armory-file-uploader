// C:\Users\sdkca\Desktop\electron-workspace\build.js
var electronInstaller = require('electron-winstaller');

// In this case, we can use relative paths
var settings = {
  // Specify the folder where the built app is located
  title: 'ESO Armory File uploader',
  appDirectory: './eso-afu-win32-x64',
  outputDirectory: './installers',
  authors: 'Dainis Abols (Aaxc)',
  owner: 'Dainis Abols (Aaxc)',
  description: 'Create your own character armory and let others see your fame!',
  version: '1.1.9',
  iconUrl: path.resolve(__dirname, 'images/icon256x256.ico'),
  setupIcon: './images/icon256x256.ico',
  setupExe: 'eso_afu_setup.exe',
  exe: './eso-afu.exe'
};

resultPromise = electronInstaller.createWindowsInstaller(settings);

resultPromise.then(() => {
  console.log("The installers of your application were succesfully created !");
}, (e) => {
  console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});

/*
// C:\Users\sdkca\Desktop\electron-workspace\build.js
var electronInstaller = require('electron-winstaller');

// In this case, we can use relative paths
var settings = {
  title: 'ESO Armory File uploader',
  appDirectory: './eso-armory-file-uploader-source-built-win32-x64/',
  outputDirectory: './installers',
  authors: 'Dainis Abols (aaxc)',
  exe: './myapp-source-built.exe'
  description: 'Create your own character armory and let others see your fame!',
  version: '1.1.9',
  iconUrl: 'file:///D:/data/eso-armory-file-uploader/images/icon256x256.ico',
  setupIcon: './images/icon256x256.ico'
};

resultPromise = electronInstaller.createWindowsInstaller(settings);

resultPromise.then(() => {
  console.log("The installers of your application were succesfully created !");
}, (e) => {
  console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});*/