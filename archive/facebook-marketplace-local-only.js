// ==UserScript==
// @author       dylanarmstrong
// @description  remove ship to you from fb marketplace
// @grant        none
// @match        *://www.facebook.com/marketplace/*
// @name         facebook-marketplace-local-only
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @run-at       document-body
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/master/facebook-marketplace-local-only.js
// @version      1
// ==/UserScript==

(function() {
  'use strict';
  const shoo = () => {
    const els = document.querySelectorAll('a[role="link"] > div div:last-child div:last-child');
    const map = ({ textContent }, i) => ({
      i,
      textContent,
    });
    const filter = ({ textContent }) => textContent === 'Ships to you';
    const hide = ({ i }) =>
      els[i]
        .parentNode
        .parentNode
        .parentNode
        .parentNode
        .parentNode
        .parentNode
        .parentNode
        .parentNode
        .style
        .display = 'none';
    Array.prototype.forEach.call(
      Array.prototype.map.call(els, map).filter(filter),
      hide
    );
  };
  setInterval(shoo, 2000);
  shoo();
})();
