// ==UserScript==
// @name         stylize
// @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
// @version      14
// @description  Add custom styles to websites
// @author       meinhimmel
// @match        *://*/*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/stylize.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @run-at       document-body
// @grant        GM_addStyle
// ==/UserScript==

/**
 * Allows me to write custom styles for websites matching hosts by string or regex
 * Not sure really how to make this one usable by others, so I'd recommend forking this
 * Or just copying it manually to your browser
 *
 * Example:
 *
 * const csses = {
 *  'old.reddit.com': `
 *    .subreddit {
 *      border: 1px solid red;
 *    }
 *  `
 * }
 */

(function() {
  'use strict';

  const csses = {
    'www.speedrun.com': `
      [data-ad] {
        display: none;
      }
    `,

    'offerup.com': `
      .db-ad-tile {
        display: none;
      }
    `,

    'www.fictionpress.com': `
      #storytextp {
        -webkit-user-select: auto !important;
      }
    `,

    'www.fanfiction.net': `
      #storytextp {
        -webkit-user-select: auto !important;
      }
    `,

    'www.alternatehistory.com': `
      @import url('https://fonts.googleapis.com/css?family=Amiri');
      .messageText span,
      .messageText p,
      .messageText {
        font-family: 'Amiri', serif;
        font-size: 21px !important;
        letter-spacing: 0px;
        font-weight: 400;
        text-rendering: optimizeLegibility;
      }

      #QuoteSelected {
        display: none !important;
      }

      #messageList {
        width: 80%;
        margin: 0 auto;
      }
    `,

    'forums.sufficientvelocity.com': `
      @import url('https://fonts.googleapis.com/css?family=Amiri');

      .p-body {
        background: #131C26;
      }

      .tooltip.tooltip--basic.tooltip--bottom.tooltip--selectToQuote {
        display: none !important;
      }

      .block--messages .message-cell--threadmark-header,
      .block--messages .message-cell--threadmark-footer,
      .message-cell,
      .bbCodeBlock,
      .block-body {
        background-color: rgb(25, 31, 45);
      }

      .bbWrapper,
      .message-body,
      .message-body .bbCodeBlock.bbCodeBlock-content,
      .fr-box.fr-basic textarea.input,
      .fr-box.fr-basic .fr-element,
      .bbCodePreview-content {
        font-family: 'Amiri', serif;
        font-size: 21px;
        letter-spacing: 0px;
        font-weight: 400;
        text-rendering: optimizeLegibility;
      }

      .structItem-title {
        color: rgb(228, 139, 43);
      }

      .AdContainer {
        display: none;
      }

      .p-navSticky {
        position: relative;
      }

      .message-cell--user {
        display: none;
      }
    `,

    'www.wuxiaworld.co': `
      @import url('https://fonts.googleapis.com/css?family=Amiri');

      .box_con #content,
      .box_con #content div,
      .box_con #content a {
        color: #222;
        font-family: 'Amiri', serif;
        font-size: 21px !important;
        letter-spacing: 0px;
        font-weight: 400;
        text-rendering: optimizeLegibility;
      }
    `,

    'www.royalroad.com': `
      .wide,
      .fic-header + .portlet,
      .chapter-content + .bold,
      .chapter-content + .bold + .wide + hr,
      #donate + .bold,
      #donate + .bold + .row {
        display: none;
      }
    `,

    'www.wuxiaworld.com': `
      @import url('https://fonts.googleapis.com/css?family=Amiri');
      #content-container {
        width: 100%;
      }
      #sidebar {
        display: none;
      }
      .fr-view {
        font-family: 'Amiri', serif;
        font-size: 21px !important;
        letter-spacing: 0px;
        font-weight: 400;
        text-rendering: optimizeLegibility;
      }
    `,

    'forums.spacebattles.com': `
      @import url('https://fonts.googleapis.com/css?family=Amiri');

      .messageText span,
      .messageText p,
      .messageText {
        font-family: 'Amiri', serif;
        font-size: 21px !important;
        letter-spacing: 0px;
        font-weight: 400;
        text-rendering: optimizeLegibility;
      }

      #QuoteSelected {
        display: none !important;
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

      .listBlock.stats.pairsJustified dl:nth-child(2) {
        margin-bottom: 0;
      }

      #QuickSearch {
        top: -29px;
        right: 95px;
        border-right: 1px solid rgb(65, 92, 135);
        border-top-right-radius: 0;
      }
    `,
    '(np|old|www)?\.reddit.com': `
      .premium-banner-outer,
      #redesign-beta-optin-btn,
      .listing-chooser.initialized,
      .entry .buttons .give-gold-button,
      .entry .buttons .share,
      .entry .buttons .crosspost-button {
        display: none;
      }
    `
  };

  const { host } = document.location;

  const hostFilter = (key) => {
    const o = csses[key];
    try {
      const r = new RegExp(key);
      return host.match(r) !== null;
    } catch (e) {
      return host === key;
    }
  };

  const keys = Object.keys(csses).filter(hostFilter);

  for (let i = 0, len = keys.length; i < len; i++) {
    const css = csses[keys[i]];
    if (css) {
      GM_addStyle(css);
    }
  }
})();
