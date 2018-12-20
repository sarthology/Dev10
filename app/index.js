let crawler = require('./crawler');
const handlebars = require('handlebars');
const { ipcRenderer , shell } = require('electron');
let tags;

ipcRenderer.on('loadNewPosts', (event) => {    
    crawler.fetchHome.then((data)=>{
        const source = document.getElementById("post").innerHTML;
        const template = handlebars.compile(source, { strict: true });
        const result = template({posts:fillColor(data)}); 
        document.getElementById("post-list").innerHTML = result; 
    })
});
ipcRenderer.on('loadTags', (event) => {  
    crawler.fetchTags.then((data)=>{
        tags = data;
        const source = document.getElementById("tag").innerHTML;
        const template = handlebars.compile(source, { strict: true });
        const result = template({tags:data}); 
        document.getElementById("tags").innerHTML = result; 
    })
});

function openLink(url) {
    shell.openExternal(url)
}
function getTag(e,tag){
    e.stopPropagation();
    tag = tag.replace(/#/g,'');
    crawler.fetchFeedByTag(tag).then((data)=>{
        const source = document.getElementById("post").innerHTML;
        const template = handlebars.compile(source, { strict: true });
        const result = template({posts:fillColor(data)}); 
        document.getElementById("post-list").innerHTML = result;
    })
}

function fillColor(posts){
    return posts.map((post)=>{
        post.tags = post.tags.map((tag)=>{
           coloredTag = tags.filter(colorTag =>colorTag.name === tag.name);
           if(coloredTag.length>0) return coloredTag[0]
           else return tag
        })    
        return post  
    })
}
  