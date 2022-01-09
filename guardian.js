// ==UserScript==
// @author       dylanarmstrong
// @description  guardian register stuff
// @grant        none
// @match        https://www.theguardian.com/*
// @name         guardian
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @run-at       document-start
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/master/guardian.js
// @version      1
// ==/UserScript==

/**
 * Naive fix for theguardian, doesn't work yet.
 */

(function() {
  'use strict';
  const loop = (selectors, root) => {
    for (const selector of selectors) {
      Array.from(root.querySelectorAll(selector))
        .forEach((evil) => evil.parentNode.removeChild(evil));
    }
  };

  const destroy = () => {
    loop([
      'iframe',
      'script',
    ], document.head);

    const body = document.body.cloneNode(true);
    document.body.innerHTML = '';
    body.id = 'destroyed';
    loop([
      'style[type="text/css"]',
      'iframe',
      'script',
      '#sign-in-gate',
      '.contributions__adblock',
      '.top-banner-ad-container.js-top-banner',
      '.ad-slot',
      '.adBlock',
      '[id^=sp_message_container]',
    ], body);

    document.body = body;
  };
  destroy();
  setTimeout(destroy, 1000);
})();
