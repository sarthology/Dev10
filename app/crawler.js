'use strict';

const request = require('request-promise-native');
const cheerio = require('cheerio');

const crawler = {};
const options = {
    uri: 'https://dev.to',
    transform (body) {
        return cheerio.load(body);
    }
};

crawler.fetchTags = () => {
    return request({ uri: "https://dev.to/tags", transform: options.transform })
        .then(function($) {
            const tags = [];
            $("#articles-list").children().each((i, e) => {
                const eachTag = {
                    name: $(e).find(".tag-show-link h2").text().trim(),
                    backgroundColor: $(e).attr("style"),
                    color: $(e).find(".tag-show-link").attr("style")
                };
                tags.push(eachTag);
            });
            return tags;
        })
        .catch(function (err) {
            console.log(err);
        });
};

    
crawler.fetchHome = () => requestFeed(options);
crawler.fetchFeedByTag = (tag) => {
    return requestFeed({ uri:"https://dev.to/t/" + tag, transform: options.transform });
};

function requestFeed(options) {
    return request(options)
        .then(function ($) {
            const topPosts = [];
            $("#substories").children().each((i, e) => {
                const tagsArray = [];
                
                $(e).find(".tags").children().each((i,e) => {
                    tagsArray.push({ name: $(e).find('.tag').text().trim() });
                });
                
                $(e).find(".index-article-link .content h3").children("span").remove();
                
                const eachPost = {
                    title: $(e).find(".index-article-link .content h3").text().trim(),
                    author: $(e).find("h4 a").text().trim(),
                    authorImage: $(e).find(".small-pic img").attr("src"),
                    link: "https://dev.to" + $(e).children(".index-article-link").attr("href"),
                    tags: tagsArray,
                    saved: false
                };
                
                if (eachPost.title) topPosts.push(eachPost);
            });
            return topPosts.slice(0,10);
        })
        .catch(function (err) {
            console.log(err);
        });
}     

module.exports = crawler;
