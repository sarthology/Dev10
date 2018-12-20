var request = require('request-promise-native');
var cheerio = require('cheerio');

var options = {
    uri: 'https://dev.to',
    transform: function (body) {
        return cheerio.load(body);
    }
};

var crawler = request(options)
    .then(function ($) {
        let topPosts = []
        $("#substories").children().each((i, e) => {
            let eachPost = {
                title: $(e).find(".index-article-link .content h3").text().trim(),
                author: $(e).find("h4 a").text().trim(),
                authorImage:$(e).find(".small-pic img").attr("src"),
                link: "https://dev.to" + $(e).children(".index-article-link").attr("href")
            }
            topPosts.push(eachPost);
        });
        return topPosts
    })
    .catch(function (err) {
        // Crawling failed or Cheerio choked...
    })

module.exports = crawler;