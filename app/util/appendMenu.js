'use strict';

// DEPENDENCIES
const { Menu, MenuItem } = remote;

/**
 * This is a wrapper function for the `Menu` module's `append` function.
 * @param {string} options - The information object to create menu 
 * @returns {string} menu
 */

function appendMenu(options){ 
    return menu.append(new MenuItem(options));
}

module.exports = appendMenu;
