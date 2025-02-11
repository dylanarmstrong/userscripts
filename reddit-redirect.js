// ==UserScript==
// @author       dylanarmstrong
// @description  Redirect www to old
// @grant        none
// @match        https://www.reddit.com/*
// @exclude      https://www.reddit.com/media*
// @exclude      https://www.reddit.com/gallery*
// @name         reddit-redirect
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @run-at       document-start
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/main/reddit-redirect.js
// @version      7
// ==/UserScript==

/**
 * Redirects all requests from www to old
 */

(function main() {
  // iframe detection and redirect to old if on www
  const { href } = document.location;
  if (globalThis.self === window.top && href.slice(0, 12) === 'https://www.') {
    document.location.href = `https://old.${href.slice(12)}`;
  }
})();
