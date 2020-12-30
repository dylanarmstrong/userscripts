// ==UserScript==
// @author       dylanarmstrong
// @description  Filter all NSFW content
// @grant        none
// @match        https://*.reddit.com/*
// @name         reddit-nsfw
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/master/reddit-nsfw.js
// @version      5
// ==/UserScript==

/**
 * Filters NSFW content
 */

(function() {
  'use strict';

  const hide = () => {
    const items = document.querySelectorAll('[data-nsfw="true"]');
    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i];
      if (item && item.parentNode) {
        item.parentNode.removeChild(item);
      }
    }
  };

  hide();

  // reddit-load.js compatibility
  document.addEventListener('reddit-load', hide);
})();
