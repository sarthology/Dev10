let crawler = require('./crawler');
const handlebars = require('handlebars');
const { ipcRenderer , shell } = require('electron');



ipcRenderer.on('loadNewPosts', (event) => {    
    crawler.fetchHome.then((data)=>{
        const source = document.getElementById("post").innerHTML;
        const template = handlebars.compile(source, { strict: true });
        const result = template({posts:data}); 
        document.getElementById("post-list").innerHTML = result; 
    })
});
ipcRenderer.on('loadTags', (event) => {  
    crawler.fetchTags.then((data)=>{
        const source = document.getElementById("tag").innerHTML;
        const template = handlebars.compile(source, { strict: true });
        const result = template({tags:data}); 
        document.getElementById("tags").innerHTML = result; 
    })
});
function openLink(url) {
    shell.openExternal(url)
  }