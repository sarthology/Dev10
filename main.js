var menubar = require('menubar');
var path = require('path');


var mb = menubar({
    index: "file://" + path.join(__dirname, '/app/index.html'),
    icon: path.join(__dirname, '/icons/logo.png'),
    width:360,
    height: 500,
    tooltip:"dev 10"
})

mb.on('ready', function ready () {
  console.log('app is ready');
})
mb.on('after-create-window', function(){
    mb.window.openDevTools()
})