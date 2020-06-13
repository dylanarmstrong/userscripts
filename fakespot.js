// ==UserScript==
// @name         fakespot
// @namespace    https://github.com/dylanarmstrong/tampermonkey-scripts/
// @version      1
// @description  Fakespot links on Amazon
// @author       dylanarmstrong
// @match        https://*.amazon.com/*
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/tampermonkey-scripts/master/fakespot.js
// @supportURL   https://github.com/dylanarmstrong/tampermonkey-scripts/issues
// @grant        none
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
