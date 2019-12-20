const convertToWindowsStore = require('electron-windows-store');

convertToWindowsStore({
  containerVirtualization: false,
  inputDirectory: 'C:\\data\\PRIVATE\\eso-armory-file-uploader\\app',
  outputDirectory: 'C:\\data\\PRIVATE\\eso-armory-file-uploader-APPX',
  packageVersion: '1.3.0.0',
  identityName: '50874DainisAbols.ESOArmoryFileuploader',
  packageName: 'ESOArmoryFileuploader130',
  packageDisplayName: 'ESO Armory File uploader',
  packageExecutable: 'app/eso-armory-file-uploader-130.exe',
  publisherDisplayName: "Dainis Abols",
  deploy: false,
  publisher: 'CN=7A7E1A63-4AD0-4BDA-A3DE-488274220EDB',
  windowsKit: 'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.18362.0\\x64',
  devCert: 'C:\\data\\certs\\devcert.pfx',
  certPass: 'Admin2zilonis',
  makeappxParams: ['/l'],
  makePri: true,
  // createConfigParams: ['/a'],
  // createPriParams: ['/b'],
  finalSay: function () {
    return new Promise((resolve, reject) => resolve())
  }
});

/*
convertToWindowsStore({
  containerVirtualization: false,
  inputDirectory: 'C:\\input\\',
  outputDirectory: 'C:\\output\\',
  packageVersion: '1.0.0.0',
  packageName: 'Ghost',
  packageDisplayName: 'Ghost Desktop',
  packageDescription: 'Ghost for Desktops',
  packageExecutable: 'app/Ghost.exe',
  assets: 'C:\\assets\\',
  manifest: 'C:\\AppXManifest.xml',
  deploy: false,
  publisher: 'CN=developmentca',
  windowsKit: 'C:\\windowskit',
  devCert: 'C:\\devcert.pfx',
  certPass: 'abcd',
  desktopConverter: 'C:\\desktop-converter-tools',
  expandedBaseImage: 'C:\\base-image.wim',
  makeappxParams: ['/l'],
  signtoolParams: ['/p'],
  makePri: true,
  createConfigParams: ['/a'],
  createPriParams: ['/b'],
  finalSay: function () {
    return new Promise((resolve, reject) => resolve())
  }
})
*/
