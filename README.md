#ESO Armory file uploader
Create your own character armory and let others see your fame!

- Name: `eso-armory-file-uploader`
- Version: `1.1.14`

## TODO

- About
- Help
- Nerd stats (all application stats + system stats)
- Link to website!

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/aaxc/eso-armory-file-uploader
# Go into the repository
cd eso-armory-file-uploader
# Install dependencies
npm install
# Run the app
npm start
```

## Building installer

```bash
electron-packager . --platform=win32 --arch=x64 --overwrite eso-afu
node .\build.js
```
