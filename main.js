'use strict';

// DEPENDENCIES
const { ipcMain } = require('electron');
const menubar = require('menubar');

// NATIVE IMPORTS
const os = require('os');
const path = require('path');

// Global Variables
let mb;
let options = {
    index: `file://${path.join(__dirname, '/app/index.html')}`,
    width: 360,
    height: 500,
    tooltip: 'Dev 10',
    preloadWindow: true
}

if (os.platform() === 'win32') {
    options.icon = path.join(__dirname, '/icons/logowin.png');
    mb = menubar(options);
} else {
    options.icon = path.join(__dirname, '/icons/logoTemplate.png')
    mb = menubar(options);
}

mb.on('ready', () => {
    console.log('app is ready');
});

mb.on('after-show', () => {
    mb.window.webContents.send('loadNewPosts');
});

ipcMain.on('quit', () => {
    mb.app.quit();
});
