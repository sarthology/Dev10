let crawler = require('./crawler');
const handlebars = require('handlebars');
const shell = require("electron").shell;

crawler.then((data)=>{
    const source = document.getElementById("list").innerHTML;
    const template = handlebars.compile(source, { strict: true });
    const result = template({posts:data}); 
    document.getElementById("post-list").insertAdjacentHTML('afterbegin', result); 
})

function openLink(url) {
    shell.openExternal(url)
  }