let request = require('request-promise-native');
let cheerio = require('cheerio');

let crawler = {}
let options = {
    uri: 'https://dev.to',
    transform: function (body) {
        return cheerio.load(body);
    }
};

crawler.fetchTags = request({uri:"https://dev.to/tags",transform:options.transform})
    .then(function($){
        let tags = []
        $("#articles-list").children().each((i, e) => {
            let eachTag = {
                name:$(e).find(".tag-show-link h2").text().trim(),
                backgroundColor: $(e).attr("style"),
                color: $(e).find(".tag-show-link").attr("style")
            }
            tags.push(eachTag);            
        })
        return tags;
    })
    .catch(function (err) {
        console.log(err);
    })

    
crawler.fetchHome = requestFeed(options)
crawler.fetchFeedByTag = (tag)=>{
    return requestFeed({uri:"https://dev.to/t/"+tag,transform:options.transform})
};

function requestFeed(options) {
    return request(options)
            .then(function ($) {
                let topPosts = []
                $("#substories").children().each((i, e) => {
                    let tagsArray = []
                    
                    $(e).find(".tags").children().each((i,e)=>{
                    tagsArray.push({name:$(e).find('.tag').text().trim()});
                    });

                    let eachPost = {
                        title: $(e).find(".index-article-link .content h3").text().trim(),
                        author: $(e).find("h4 a").text().trim(),
                        authorImage: $(e).find(".small-pic img").attr("src"),
                        link: "https://dev.to" + $(e).children(".index-article-link").attr("href"),
                        tags:tagsArray
                    }
                    if(eachPost.title) topPosts.push(eachPost);
                });
                return topPosts
            })
            .catch(function (err) {
                console.log(err);
            })
}     

module.exports = crawler;