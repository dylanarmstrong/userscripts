// ==UserScript==
// @name         paradoxwikis
// @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
// @version      1
// @description  Just no style works best I guess.
// @author       meinhimmel
// @match        https://eu4.paradoxwikis.com/*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/paradoxwikis.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

/**
 * Delete old style, use new one
 */

(function() {
  'use strict';
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  Array.prototype.forEach.call(links, element => element.parentNode.removeChild(element));
  document.head.innerHTML += `
    <style>
      table tr:nth-child(2n + 1) {
        background-color: rgb(248, 245, 250);
      }
    </style>
  `;
})();

