let crawler = require('./crawler');
const handlebars = require('handlebars');
const { ipcRenderer, shell } = require('electron');
const home = require('./views/home');
const piggyList = require('./views/piggyList');
const Store = require('electron-store');
const { remote } = require('electron')
const { Menu, MenuItem } = remote;

let tags, currentPosts, currentPage;

const store = new Store();
const menu = new Menu()

// Add menu items
menu.append(new MenuItem({
    label: 'Check for updates(v1.0.0)',
    click() {
        shell.openExternal("https://github.com/sarthology/Dev10/releases")
    }
}))
menu.append(new MenuItem({
    label: 'Tweet ❤️ @Sarthology',
    click() {
        shell.openExternal("https://twitter.com/sarthology")
    }
}))
menu.append(new MenuItem({
    label: 'Contribute',
    click() {
        shell.openExternal("https://github.com/sarthology/Dev10")
    }
}))
menu.append(new MenuItem({
    type: 'separator'
}))
menu.append(new MenuItem({
    label: 'Quit',
    click() {
        ipcRenderer.send('quit')
    }
}))

// Routes 
function goHome() {
    currentPage = "home";
    currentPosts = null
    document.getElementById("view").innerHTML = home.body; 

    crawler.fetchTags()
        .then((data) => {
            tags = data;
            fillTags(data);
            return
        })
        .then(() => {    
            fillLoader();
            crawler.fetchHome()
                .then((data) => {
                    fillPosts(data);
                })
        })
}

function goPiggyList(){
    currentPage = "piggy-list";
    currentPosts = null;
    document.getElementById("view").innerHTML = piggyList.body; 
    fillSavedTags()
}

// Main porgram calls
ipcRenderer.on('loadNewPosts', (event) => {
    checkNotification();
    goHome();
});

// Event handlers
function openLink(url) {
    shell.openExternal(url)
}
function getTag(e, tag) {
    e.stopPropagation();
    fillLoader()
    if (currentPage === "home") {
        crawler.fetchFeedByTag(tag.replace(/#/g, ''))
            .then((data) => {
                fillPosts(data);
            })
    } else {
        fillPosts(filterByTags(tag));
    }
}
function savePost(e,i) {
    e.stopPropagation();

    //Check Page type
    if (currentPage === "home") {
        // Check if already saved
        if (currentPosts[i].saved) {
            let posts = store.get('posts');
            posts = posts.filter(post => post.link !== currentPosts[i].link)
            store.set("posts",posts);
            sendToast("removed");
            updatePosts(e, i);
        } else {
            //If other post exists
            if (store.get('posts')) {
                let posts = store.get('posts');
                posts.push(currentPosts[i]);
                store.set("posts",posts)
                sendToast("saved");
                updatePosts(e,i)
            } else {
                let posts = [];
                posts.push(currentPosts[i]);
                store.set("posts",posts)
                sendToast("saved");
                updatePosts(e,i)
            }
        }
    } else {
        let posts = store.get('posts');
        posts = posts.filter(post => post.link !== currentPosts[i].link)
        store.set("posts", posts);
        sendToast("removed");
        e.target.closest(".post").remove(); 
        fillSavedTags();
        checkNotification();
    }
}
function openPiggyList() {
    goPiggyList()
    if (store.get('posts')) {
        fillPosts(store.get('posts'));
    }
}
function sendToast(type) {
    document.getElementsByClassName("toast")[0].classList.remove("toast-enter");
    void document.getElementsByClassName("toast")[0].offsetWidth;

    if (type === "saved") {
        document.getElementById("toastType").innerText = "Added to";
        document.getElementsByClassName("toast")[0].className += " toast-enter" 
    } else if(type === "removed") {
        document.getElementById("toastType").innerText = "Removed from";
        document.getElementsByClassName("toast")[0].className += " toast-enter" 
    }
}
function settings(e) {
    e.preventDefault()
    menu.popup({ window: remote.getCurrentWindow() })
}

// Internal View Changer
function fillLoader() {
    document.getElementById("post-list").innerHTML = home.loader;
    window.scrollTo(0,0);
}
function fillPosts(data) {
    currentPosts = data;
    const template = handlebars.compile(home.post, { strict: true });
    const result = template({ posts: fillColor(data) }); 
    document.getElementById("post-list").innerHTML = result; 
    window.scrollTo(0,0);
}
function fillTags(data) {
    const template = handlebars.compile(home.tag, { strict: true });
    const result = template({ tags: data }); 
    document.getElementById("tags").innerHTML = result; 
}
function fillSavedTags() {
    tags = []
    let posts = store.get('posts');
    posts.forEach(post => {
        tags = tags.concat(post.tags);
        tags = [...new Set(tags.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
    })    
    fillTags(tags);
}
function hidePiggyList() {
    if (document.getElementsByClassName("piggy-list")[0]) {
        document.getElementById("tags").setAttribute("style","margin-top:60px");
        document.getElementsByClassName("piggy-list")[0].remove();
    }
}
function checkNotification() {
    if (store.get('posts')) {
        if (store.get('posts').length > 0 ) {
            document.getElementsByClassName("notification")[0].className += " circle";
        } else {
            document.getElementsByClassName("notification")[0].classList.remove("circle");
        }
    } else{
        store.set('posts',[])
    }
}
function updatePosts(e,i) {
    currentPosts[i].saved = !currentPosts[i].saved;
    e.target.classList.remove("pig-" + !currentPosts[i].saved);
    e.target.classList.add("pig-" + currentPosts[i].saved);
    checkNotification();
}

// Data Manipulators
function fillColor(posts) {
    return filterSaved(posts.map((post) => {
        post.tags = post.tags.map((tag) => {
           coloredTag = tags.filter(colorTag => colorTag.name === tag.name);
           if(coloredTag.length > 0) return coloredTag[0]
           else return tag
        })    
        return post
    }));
}
function filterSaved(posts) {    
    let savedPosts = store.get("posts");
    return posts.map((post) => {
        savedPosts.forEach(savedPost => {
            if(post.link === savedPost.link){
                post.saved = true;
            }
        });
        return post;
    })
}
function filterByTags(selectedTag){    
    let posts = store.get("posts");
    return posts.filter(post => !post.tags.map(tag => tag.name === selectedTag).every(e => !e))
}
