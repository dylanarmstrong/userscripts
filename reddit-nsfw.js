// ==UserScript==
// @name         reddit-nsfw
// @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
// @version      1
// @description  Filter all NSFW content
// @author       meinhimmel
// @match        https://*.reddit.com/*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/reddit-nsfw.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

/**
 * Filters NSFW content
 */

(function() {
  'use strict';
  const items = document.querySelectorAll('[data-nsfw="true"]');
  for (let i = 0, len = items.length; i < len; i++) {
    const item = items[i];
    if (item && item.parentNode) {
      item.parentNode.removeChild(item);
    }
  }
})();
