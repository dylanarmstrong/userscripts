// ==UserScript==
// @author       dylanarmstrong
// @description  Fakespot links on Amazon
// @grant        none
// @match        https://*.amazon.com/*
// @name         fakespot
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/main/fakespot.js
// @version      4
// ==/UserScript==

/**
 * Add fakespot links on Amazon
 */

(function main() {
  const url = `https://www.fakespot.com/analyze?utf8=%E2%9C%93&form_type=home_page&url=${document.location.href}`;
  const element = document.createElement('a');
  element.href = url;
  element.textContent = 'Fakespot';
  element.target = '_blank';
  element.rel = 'noopener noreferrer';
  const box = document.querySelector('#desktop_buybox');
  box.insertBefore(element, box.firstElementChild);
})();
