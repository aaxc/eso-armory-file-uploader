// C:\Users\sdkca\Desktop\electron-workspace\build.js
var electronInstaller = require('electron-winstaller');

// In this case, we can use relative paths
var settings = {
  // Specify the folder where the built app is located
  title: 'ESO Armory File uploader',
  appDirectory: './release-builds/eso-afu-win32-x64',
  outputDirectory: './installers/win',
  authors: 'ESO Armory',
  owner: 'ESO Armory',
  productName: 'ESO Armory File uploader',
  copyright: '2019 (c) ESO Armory',
  description: 'Create your own character armory and let others see your fame!',
  version: '1.1.17',
  iconUrl: 'file:///C:/data/PRIVATE/eso-armory-file-uploader/images/icon256x256.ico',
  setupIcon: './images/icon256x256.ico',
  setupMsi: 'eso_afu_setup.msi',
  setupExe: 'eso_afu_setup.exe',
  exe: './eso-afu.exe'
};

resultPromise = electronInstaller.createWindowsInstaller(settings);

resultPromise.then(() => {
  console.log("The installers of your application were successfully created !");
}, (e) => {
  console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});
