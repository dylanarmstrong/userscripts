// ==UserScript==
// @name         xenforo-no-worm
// @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
// @version      1
// @description  Block worm stories except from worm subforum
// @author       meinhimmel
// @match        https://forums.spacebattles.com/forums/creative-writing.18/*
// @match        https://forums.spacebattles.com/forums/original-fiction.48/*
// @match        https://forums.spacebattles.com/forums/the-index.63/*
// @match        https://forums.sufficientvelocity.com/forums/user-fiction.2/*
// @match        https://forums.sufficientvelocity.com/forums/weird-history.95/*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/xenforo-no-worm.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

/**
 * Block worm stories except from work subforum
 */

(function() {
  'use strict';
  console.log(`Removing stories that match /[Ww]orm/ because of xenforo-no-worm.js.`);
  const elements = document.querySelectorAll('h3.title');
  for (let i = 0, len = elements.length; i < len; i++) {
    const element = elements[i];
    if (element.textContent.match(/[Ww]orm/)) {
      const p = element.parentNode.parentNode.parentNode;
      p.parentNode.removeChild(p);
    }
  }
})();

