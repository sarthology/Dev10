let crawler = require('./crawler');
const handlebars = require('handlebars');
const { ipcRenderer , shell } = require('electron');
const view = require('./views/view');
const Store = require('electron-store');
const store = new Store();
let tags;
let currentPosts;

if(store.get('posts')){
    document.getElementsByClassName("notification")[0].className += " circle";
}

// Main porgram calls
ipcRenderer.on('loadNewPosts', (event) => {
    fillLoader();
    hidePiggyList();    
    crawler.fetchHome.then((data)=>{
        fillPosts(data);
    })
});
ipcRenderer.on('loadTags', (event) => {  
    crawler.fetchTags.then((data)=>{
        tags = data;
        fillTags(data);
    })
});

// Event handlers
function openLink(url) {
    shell.openExternal(url)
}
function getTag(e,tag){
    e.stopPropagation();
    fillLoader()
    hidePiggyList();
    tag = tag.replace(/#/g,'');
    crawler.fetchFeedByTag(tag).then((data)=>{
        fillPosts(data);
    })
}
function savePost(e,i){
    e.stopPropagation();
    if(store.get('posts')){
        let posts = store.get('posts');
        posts.push(currentPosts[i]);
        store.set("posts",posts)
    }
    else{
        let posts = [];
        posts.push(currentPosts[i]);
        store.set("posts",posts)
    }
}
function openPiggyList(){
    document.getElementById("tags").insertAdjacentHTML("beforebegin", view.piggyList);
    document.getElementById("tags").setAttribute("style","margin-top:0");
    if(store.get('posts')){
        fillPosts(store.get('posts'));
    }
}

// View Changer
function fillLoader(){
    document.getElementById("post-list").innerHTML = view.loader;
    window.scrollTo(0,0);
}
function fillPosts(data){
    currentPosts = data;
    const template = handlebars.compile(view.post, { strict: true });
    const result = template({posts:fillColor(data)}); 
    document.getElementById("post-list").innerHTML = result; 
    window.scrollTo(0,0);
}
function fillTags(data){
    const template = handlebars.compile(view.tag, { strict: true });
    const result = template({tags:data}); 
    document.getElementById("tags").innerHTML = result; 
}
function hidePiggyList(){
    if(document.getElementsByClassName("piggy-list")[0]) {
        document.getElementById("tags").setAttribute("style","margin-top:60px");
        document.getElementsByClassName("piggy-list")[0].remove();
    }
}

// Data Manipulators
function fillColor(posts){
    return filterSaved(posts.map((post)=>{
        post.tags = post.tags.map((tag)=>{
           coloredTag = tags.filter(colorTag =>colorTag.name === tag.name);
           if(coloredTag.length>0) return coloredTag[0]
           else return tag
        })    
        return post  
    }));
}
function filterSaved(posts){    
    let savedPosts = store.get("posts");
    return posts.map((post)=>{
        savedPosts.forEach(savedPost => {
            if(post.link === savedPost.link){
                console.log("here");
                post.saved = true;
            }
        });
        return post;
    })
}