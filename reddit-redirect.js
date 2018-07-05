// ==UserScript==
// @name         reddit-redirect
// @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
// @version      4
// @description  Redirect www to old
// @author       meinhimmel
// @match        https://www.reddit.com/*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/reddit-redirect.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @run-at       document-start
// @grant        none
// ==/UserScript==

/**
 * Redirects all requests from www to old
 */

(function() {
  'use strict';
  // iframe detection and redirect to old if on www
  const { href } = document.location;
  if (window.self === window.top && href.slice(0, 12) === 'https://www.') {
    document.location.href = `https://old.${href.slice(12)}`;
  }
})();

