'use strict';

// NATIVE IMPORTS
const path = require('path');

// MODULE IMPORTS
const readFileSync = require('../util/readFileSync');

module.exports = {
    body: readFileSync(
        path.resolve(__dirname, './home-body.hbs')
    ),
    post: readFileSync(
        path.resolve(__dirname, './home-post.hbs')
    ),
    tag: readFileSync(
        path.resolve(__dirname, './home-tag.hbs')
    ),
    loader: readFileSync(
        path.resolve(__dirname, './home-loader.hbs')
    )
};
