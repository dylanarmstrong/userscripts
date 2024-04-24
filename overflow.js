// ==UserScript==
// @author       dylanarmstrong
// @description  Overflow body / html
// @match        *://*/*
// @name         overflow
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @run-at       document-body
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/master/overflow.js
// @version      1
// ==/UserScript==

/**
 * Force overflow: auto to avoid blocking from modals
 */

(function() {
  'use strict';
  const css = `
    html,
    body {
      overflow: auto !important;
    }
  `;

  // Support Userscripts
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();
