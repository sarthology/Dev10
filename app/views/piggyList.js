'use strict';

// NATIVE IMPORTS
const path = require('path');

// MODULE IMPORTS
const readFileSync = require('../util/readFileSync');

module.exports = readFileSync(
    path.resolve(__dirname, './piggyList.hbs')
);
