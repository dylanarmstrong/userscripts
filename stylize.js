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
    'www.fanfiction.net': {
      type: 'string',
      css: `
        #storytextp {
          -webkit-user-select: auto !important;
        }
      `
    },

    'forums.spacebattles.com': {
      type: 'string',
      css: `
        @import url('https://fonts.googleapis.com/css?family=Amiri');
        .messageText {
          font-family: 'Amiri', serif;
          font-size: 20px;
          letter-spacing: -0.1px;
          line-height: 1.1;
          font-weight: 400;
          text-rendering: optimizeLegibility;
        }

        .messageUserInfo {
          display: none;
        }

        .message .messageInfo {
          margin-left: 0;
          padding: 0 30px;
        }

        .pageContent {
          width: 85%;
          margin: 0 auto;
        }

        .node .nodeText .nodeTitle,
        .discussionListItem .title {
          font-size: 18px;
        }

        .node .nodeStats,
        .discussionListItem .secondRow {
          font-size: 12px;
          margin-top: 1px;
        }

        #QuickSearch {
          top: -29px;
          right: 95px;
          border-right: 1px solid rgb(65, 92, 135);
          border-top-right-radius: 0;
        }
      `
    },

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
      document.head.insertAdjacentElement('beforeend', style);
    }
  }
})();
