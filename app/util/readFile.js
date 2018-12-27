'use strict';

// NATIVE IMPORTS
const fs = require('fs');

/**
 * This is a wrapper function that promisifies the `fs` module's `readFile` function.
 * @param {string} file - The path to the file to be read 
 * @returns {Promise<string>} The data read from the file
 */
function readFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, { encoding: 'utf8' }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}

module.exports = readFile;
