// ==UserScript==
// @author       dylanarmstrong
// @description  Fakespot links on Amazon
// @grant        none
// @match        https://*.amazon.com/*
// @name         fakespot
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/master/fakespot.js
// @version      3
// ==/UserScript==

/**
 * Add fakespot links on Amazon
 */

(function() {
  const url = `https://www.fakespot.com/analyze?utf8=%E2%9C%93&form_type=home_page&url=${document.location.href}`;
  const el = document.createElement('a');
  el.href = url;
  el.textContent = 'Fakespot';
  el.target = '_blank';
  el.rel = 'noopener noreferrer';
  const box = document.getElementById('desktop_buybox');
  box.insertBefore(el, box.firstElementChild);
})();
