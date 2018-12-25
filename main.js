var menubar = require('menubar');
var path = require('path');
const {ipcMain} = require('electron');
const os = require('os')

if(os.platform()==="win32"){
    var mb = menubar({
        index: "file://" + path.join(__dirname, '/app/index.html'),
        icon: path.join(__dirname, '/icons/logowin.png'),
        width: 360,
        height: 500,
        tooltip: "Dev 10",
        preloadWindow: true
    })
}
else{
    var mb = menubar({
        index: "file://" + path.join(__dirname, '/app/index.html'),
        icon: path.join(__dirname, '/icons/logoTemplate.png'),
        width: 360,
        height: 500,
        tooltip: "Dev 10",
        preloadWindow: true
    })
}

mb.on('ready', function ready() {
    console.log('app is ready');
})

mb.on('after-create-window', function () {
    mb.window.webContents.on('did-finish-load', () => {
        mb.window.webContents.send("loadNewPosts")
    })
})
mb.on('after-show', function () {
    mb.window.webContents.send("loadNewPosts")
})

ipcMain.on('quit', (event, arg) => {
    mb.app.quit()
  })