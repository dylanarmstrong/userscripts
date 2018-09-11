// ==UserScript==
// @name         xenforo-search
// @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
// @version      1
// @description  Remove posts from search results
// @author       meinhimmel
// @match        https://forums.spacebattles.com/search/*
// @match        https://forums.sufficientvelocity.com/search/*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/xenforo-search.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

/**
 * Remove posts from search results
 */

(function() {
  'use strict';
  const elements = document.querySelectorAll('span.contentType');
  for (let i = 0, len = elements.length; i < len; i++) {
    const element = elements[i];
    if (element.textContent === 'Post') {
      const p = element.parentNode.parentNode.parentNode;
      p.parentNode.removeChild(p);
    }
  }
})();

