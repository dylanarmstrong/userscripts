// ==UserScript==
// @name         xenforo-no-fanwork
// @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
// @version      1
// @description  Block fanwork discussion on sf
// @author       meinhimmel
// @match        https://forums.sufficientvelocity.com/forums/user-fiction.2/*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/xenforo-no-fanwork.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

/**
 * Block fanwork discussions
 */

(function() {
  'use strict';
  const elements = document.querySelectorAll('span.containerName a.forumLink');
  for (let i = 0, len = elements.length; i < len; i++) {
    const element = elements[i];
    if (element.textContent.toLowerCase().indexOf('fanworks discussion') > -1) {
      const p = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
      p.parentNode.removeChild(p);
    }
  }
})();

