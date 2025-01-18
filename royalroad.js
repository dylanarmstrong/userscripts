// ==UserScript==
// @author       dylanarmstrong
// @description  Royalroad stuff
// @grant        none
// @match        https://*.royalroad.com/*
// @name         royalroad
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/main/royalroad.js
// @version      4
// ==/UserScript==

/**
 * Just some royalroad stuff
 */

(function main() {
  const colors = {
    bad: 'font-default',
    eh: 'font-red-sunglo',
    good: 'font-blue',
    ok: 'font-blue-dark',
  };

  // Convert star rating to text
  let els = document.querySelectorAll('span.star');
  for (let index = 0, length_ = els.length; index < length_; index++) {
    const element = els[index];
    const rate = document.createElement('span');
    let number_;
    if (element.hasAttribute('aria-label')) {
      number_ = Number.parseFloat(
        element.getAttribute('aria-label').replaceAll(/[^.0-9]*/g, ''),
      );
    } else if (element.hasAttribute('title')) {
      number_ = Number.parseFloat(element.getAttribute('title'));
    }
    if (number_) {
      let color;
      if (number_ > 4.5) {
        color = colors.good;
      } else if (number_ > 4.1) {
        color = colors.ok;
      } else if (number_ > 3.8) {
        color = colors.eh;
      } else {
        color = colors.bad;
      }
      rate.textContent = number_;
      rate.classList.add(color);
      element.parentNode.replaceChild(rate, element);
    }
  }

  // Add number of words
  els = document.querySelectorAll('.row.stats > .col-sm-6 > .fa-book + span');
  for (let index = 0, length_ = els.length; index < length_; index++) {
    const element = els[index];
    const newElement = element.parentNode.cloneNode(true);
    const pages = Number(element.textContent.replaceAll(/[^0-9]*/g, ''));
    const words = pages * 275;

    newElement.querySelector('span').textContent = `${words} Words`;
    element.parentNode.insertAdjacentElement('afterend', newElement);
  }

  for (const element of document.querySelectorAll(
    'div.bold.uppercase, span.bold.uppercase',
  )) {
    if (element.textContent.toLowerCase() === 'advertisement') {
      element.parentNode.remove();
    }
  }
})();
