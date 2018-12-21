var menubar = require('menubar');
var path = require('path');
const {ipcMain} = require('electron');

var mb = menubar({
    index: "file://" + path.join(__dirname, '/app/index.html'),
    icon: path.join(__dirname, '/icons/logoTemplate.png'),
    width: 360,
    height: 500,
    tooltip: "dev 10",
    preloadWindow: true
})

mb.on('ready', function ready() {
    console.log('app is ready');
})

mb.on('after-create-window', function () {
    mb.window.openDevTools();
    mb.window.webContents.on('did-finish-load', () => {
        mb.window.webContents.send("loadTags")
    })
})
mb.on('after-show', function () {
    mb.window.webContents.send("loadNewPosts")

})