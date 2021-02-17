// ==UserScript==
// @name         cnbc
// @namespace    https://github.com/dylanarmstrong/tampermonkey-scripts/
// @version      1
// @description  cnbc is unloading the article b/c of adblocking
// @author       dylanarmstrong
// @match        https://www.cnbc.com/*
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/tampermonkey-scripts/master/cnbc.js
// @supportURL   https://github.com/dylanarmstrong/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

'use strict';

(function() {
  const art = document.querySelector('[data-module="ArticleBody"]');
  if (art) {
    const clone = art.cloneNode(true);
    clone.setAttribute('data-module', 'FakeArticleBody');
    art.parentNode.appendChild(clone);
  }
})();
