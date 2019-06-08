'use strict';

// DEPENDENCIES
const { remote } = require('electron');
const { Menu, MenuItem } = remote;

// Global Variables
const menu = new Menu();

module.exports = {
  /**
   * This is a wrapper function for the `Menu` module's `append` function.
   * @param {object} options - The information to create menu 
   */
  appendMenu(options) {
    menu.append(new MenuItem(options));
  },

  /**
   * This is a wrapper function for the `Menu` module's `popup` function.
   */
  openMenu() {
    menu.popup({ window: remote.getCurrentWindow() });
  }
};
