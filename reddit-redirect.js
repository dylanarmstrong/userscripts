// ==UserScript==
// @name         reddit-redirect
// @namespace    https://www.reddit.com
// @version      0.1
// @description  Redirect www to old
// @author       meinhimmel
// @match        https://www.reddit.com/*
// @grant        none
// ==/UserScript==

/**
 * Redirects all requests from www to old
 */

(function() {
  'use strict';
  // Redirect to old
  const { href } = document.location;
  if (href.slice(0, 12) === 'https://www.') {
    document.location.href = `https://old.${href.slice(12)}`;
  }
})();

