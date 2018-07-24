// ==UserScript==
// @name         youtube
// @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
// @version      1
// @description  Youtube Classic (Disable Polymer)
// @author       meinhimmel
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/embed/*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/youtube.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @run-at       document-start
// @grant        none
// ==/UserScript==

/**
 * Disable polymer on youtube
 */

(function() {
  'use strict';
  // Redirect initial load to disable_polymer
  const main = () => {
    const { href } = location;
    if (!href.match(/disable_polymer/)) {
      if (href.match(/\?/)) {
        location.href = `${href}&disable_polymer=1`;
      } else {
        location.href = `${href}?disable_polymer=1`;
      }
    }
  };

  // Go through all other links on page and append disable_polymer
  const loop = () => {
    const elements = document.querySelectorAll('.content-link');
    for (let i = 0, len = elements.length; i < len; i++) {
      const element = elements[i];
      const { href } = element;
      if (!href.match(/disable_polymer/)) {
        if (href.match(/\?/)) {
          element.href = `${href}&disable_polymer=1`;
        } else {
          element.href = `${href}?disable_polymer=1`;
        }
      }
    }
  };

  // Append f6=8 (such a new layout, it defaults to classic)
  const cookie = () => {
    document.cookie = document.cookie
      .split(' ')
      .filter(o => o.match(/^(?!PREF=.*f6)PREF=/))[0]
      .replace(';','') + '&f6=8;domain=.youtube.com;path=/';
  };

  main();
  cookie();
  document.addEventListener('DOMContentLoaded', loop);
})();

