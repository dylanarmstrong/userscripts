// ==UserScript==
// @author       dylanarmstrong
// @description  Royalroad stuff
// @grant        none
// @match        https://*.royalroad.com/*
// @name         royalroad
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/master/royalroad.js
// @version      3
// ==/UserScript==

/**
 * Just some royalroad stuff
 */

(function() {
  'use strict';
  const colors = {
    bad: 'font-default',
    eh: 'font-red-sunglo',
    ok: 'font-blue-dark',
    good: 'font-blue'
  };

  // Convert star rating to text
  let els = document.querySelectorAll('span.star');
  for (let i = 0, len = els.length; i < len; i++) {
    const el = els[i];
    const rate = document.createElement('span');
    let num;
    if (el.hasAttribute('aria-label')) {
      num = Number.parseFloat(el.getAttribute('aria-label').replace(/[^\.0-9]*/g, ''));
    } else if (el.hasAttribute('title')) {
      num = Number.parseFloat(el.getAttribute('title'));
    }
    if (num) {
      let color;
      if (num > 4.5) {
        color = colors.good;
      } else if (num > 4.1) {
        color = colors.ok;
      } else if (num > 3.8) {
        color = colors.eh;
      } else {
        color = colors.bad;
      }
      rate.textContent = num;
      rate.classList.add(color);
      el.parentNode.replaceChild(rate, el);
    }
  }

  // Add number of words
  els = document.querySelectorAll('.row.stats > .col-sm-6 > .fa-book + span');
  for (let i = 0, len = els.length; i < len; i++) {
    const el = els[i];
    const newEl = el.parentNode.cloneNode(true);
    const pages = Number(el.textContent.replace(/[^0-9]*/g, ''));
    const words = pages * 275;

    newEl.querySelector('span').textContent = `${words} Words`;
    el.parentNode.insertAdjacentElement('afterend', newEl);
  }

  Array.from(document.querySelectorAll('div.bold.uppercase, span.bold.uppercase')).forEach((element) => {
    if (element.textContent.toLowerCase() === 'advertisement') {
      element.parentNode.parentNode.removeChild(element.parentNode);
    }
  });
})();
