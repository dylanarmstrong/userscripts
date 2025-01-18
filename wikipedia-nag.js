// ==UserScript==
// @author       dylanarmstrong
// @description  Remove wikipedia nag
// @grant        none
// @match        https://*.wikipedia.org/*
// @name         wikipedia-nag
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/main/wikipedia-nag.js
// @version      2
// ==/UserScript==

(function main() {
  const element = document.querySelector('#siteNotice');
  element.remove();
})();
