// ==UserScript==
// @name         stylize
// @namespace    *
// @version      0.1
// @description  Add custom styles to websites
// @author       meinhimmel
// @match        *://*/*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/stylize.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

/**
 * Allows me to write custom styles for websites matching hosts by string or regex
 * Not sure really how to make this one usable by others, so I'd recommend forking this
 * Or just copying it manually to your browser
 *
 * Example:
 *
 * const csses = {
 *  '((old|www)\.)?reddit\.com$': {
 *    type: 'regex',
 *    css: `
 *      .subreddit {
 *        border: 1px solid blue;
 *      }
 *    `
 *  },
 *  'old.reddit.com': {
 *    type: 'string',
 *    css: `
 *      .subreddit {
 *        border: 1px solid red;
 *      }
 *    `
 *  }
 * }
 */

(function() {
  'use strict';

  const { host } = document.location;

  const csses = {
    '((old|www)\.)?reddit\.com$': {
      type: 'regex',
      css: `
        .listing-chooser.initialized,
        .entry .buttons .give-gold-button,
        .entry .buttons .share,
        .entry .buttons .crosspost-button {
          display: none;
        }
      `
    }
  };

  const hostFilter = (key) => {
    const o = csses[key];
    if (o.type === 'regex') {
      try {
        const r = new RegExp(key);
        return host.match(r) !== null;
      } catch (e) {
      }
    } else {
      return host === key;
    }
    return false;
  };

  const keys = Object.keys(csses).filter(hostFilter);

  for (let i = 0, len = keys.length; i < len; i++) {
    const { css } = csses[keys[i]];
    if (css) {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.textContent = css;
      document.head.insertBefore(style, document.head.firstChild);
    }
  }
})();

