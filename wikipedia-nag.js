// ==UserScript==
// @author       dylanarmstrong
// @description  Remove wikipedia nag
// @grant        none
// @match        https://*.wikipedia.org/*
// @name         wikipedia-nag
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/master/wikipedia-nag.js
// @version      1
// ==/UserScript==

(function() {
  'use strict';
  const el = document.getElementById('siteNotice');
  el.parentNode.removeChild(el);
})();
