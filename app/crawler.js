'use strict';

// DEPENDENCIES
const cheerio = require('cheerio');
const request = require('request-promise-native');

// Global Variables
const crawler = {};
const options = {
    uri: 'https://dev.to',
    transform(body) {
        return cheerio.load(body);
    }
};

crawler.fetchTags = () => {
    return request({
        uri: 'https://dev.to/tags',
        transform: options.transform
    })
        .then($ => {
            return $('#articles-list').children().map((i, e) => {
                return {
                    name: $(e).find('.tag-show-link h2').text().trim(),
                    backgroundColor: $(e).attr('style'),
                    color: $(e).find('.tag-show-link').attr('style')
                };
            }).get();
        })
        .catch(console.error);
};


crawler.fetchHome = () => requestFeed(options);
crawler.fetchFeedByTag = tag => {
    return requestFeed({
        uri: `https://dev.to/t/${tag}`,
        transform: options.transform
    });
};

function requestFeed(options) {
    return request(options)
        .then($ => {
            return $('#substories').children().map((i, e) => {
                $(e).find('.index-article-link .content h3').children('span').remove();
                const eachPost = {
                    title: $(e).find('.index-article-link .content h3').text().trim(),
                    author: $(e).find('h4 a').text().trim(),
                    authorImage: $(e).find('.small-pic img').attr('src'),
                    link: `https://dev.to${$(e).children('.index-article-link').attr('href')}`,
                    tags: $(e).find('.tags').children().map((i, e) => {
                        return {
                            name: $(e).find('.tag').text().trim()
                        };
                    }).get(),
                    saved: false
                };
                if (eachPost.title) {
                    if (i === 10) false;
                    return eachPost;
                }
            }).get();
        })
        .catch(console.error);
}

module.exports = crawler;
