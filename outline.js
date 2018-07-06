// ==UserScript==
// @name         outline
// @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
// @version      1
// @description  Open some links on HN / Reddit in outline
// @author       meinhimmel
// @match        https://news.ycombinator.com/*
// @match        https://*.reddit.com/*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/outline.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

/**
 * Open some links on Reddit / HN in outline
 *
 * TODO: Add all the news sites I guess
 */

(function() {
  'use strict';
  const as = document.getElementsByTagName('a');
  const domains = [
    'arstechnica.com',
    'bbc.com',
    'bloomberg.com',
    'businessinsider.com',
    'cnbc.com',
    'medium.com',
    'nytimes.com',
    'techdirt.com',
    'techcrunch.com',
    'theatlantic.com',
    'theguardian.com',
    'theverge.com',
    'washingtonpost.com',
    'wired.com',
    'wsj.com'
  ];

  for (let i = 0, len = as.length; i < len; i++) {
    let set = false;
    const a = as[i];
    const { href } = a;
    // If it's already set move on
    if (!href.match(/https:\/\/outline.com.*$/)) {
      for (let j = 0, _len = domains.length; j < len && !set; j++) {
        // Could change to regex, but then it's more annoying to add domains
        if (href.indexOf(domains[j]) > -1) {
          a.href = `https://outline.com/${href}`;
          set = true;
        }
      }
    }
  }
})();

