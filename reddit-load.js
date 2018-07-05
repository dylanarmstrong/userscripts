// ==UserScript==
// @name         reddit-load
// @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
// @version      0.3
// @description  Infinite loading on scroll
// @author       meinhimmel
// @match        https://*.reddit.com/*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/reddit-load.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

/**
 * Automatically load next page on scroll
 *
 * TODO: I should add a spinning icon..
 */

(function() {
  'use strict';

  const css = `
    .nextprev {
      display: none;
    }
  `;

  const style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = css;
  document.head.insertBefore(style, document.head.firstChild);

  const siteTable = document.getElementById('siteTable');

  let loading = false;
  const scroll = (e) => {
    if (loading) {
      return;
    }

    const {
      offsetHeight,
      scrollTop
    } = document.body;

    // 90% cutoff
    if (scrollTop / offsetHeight > 0.90) {
      const a = document.querySelector('.nextprev a[rel*="next"]');
      if (a) {
        const { href } = a;
        // Make sure this one is not called again
        a.parentNode.removeChild(a);

        loading = true;
        fetch(href, { credentials: 'include' })
          .then(res => res.text())
          .then((text) => {
            const d = document.createElement('div');
            d.innerHTML = text;
            return [
              d.querySelectorAll('#siteTable .thing'),
              d.querySelector('.nextprev')
            ];
          })
          .then(([ things, next ]) => {
            for (let i = 0, len = things.length; i < len; i++) {
              siteTable.appendChild(things[i]);
            }
            siteTable.appendChild(next);
          })
          .then(() => {
            // If reddit-filter is enabled, this is caught in that
            const e = new Event('reddit-load', { cancelable: false });
            document.dispatchEvent(e);
          })
          .catch(() => {})
          .then(() => { loading = false });
      }
    }
  };

  window.addEventListener('scroll', scroll);
})();

