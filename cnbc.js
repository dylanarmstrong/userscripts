// ==UserScript==
// @name         cnbc
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @version      3
// @description  cnbc is accidentally unloading the article b/c of adblocking
// @author       dylanarmstrong
// @match        https://www.cnbc.com/*
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/main/cnbc.js
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @grant        none
// @run-at       document-end
// ==/UserScript==

/*
 * CNBC keeps breaking their site.
 * I really need to just ditch the whole site and pull out the text for their articles.
 */

(function main() {
  const copy = () => {
    const art = document.querySelector('#MainContent');
    if (art && art.querySelector('.Article.PageBuilder-page')) {
      const clone = art.cloneNode(true);
      clone.id = 'FakeMainContent';
      art.parentNode.replaceChild(clone, art);
    }
  };
  setTimeout(copy, 1000);
})();
