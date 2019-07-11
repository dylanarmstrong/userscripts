// ==UserScript==
// @name         stylize
// @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
// @version      12
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

      header,
      .pageContent {
        width: 94%;
        margin: 0 auto;
      }

      .sectionMain,
      .messageInfo.primaryContent {
        border: 0;
        box-shadow: none;
      }

      .nodeList .categoryForumNodeInfo,
      .nodeList .forumNodeInfo,
      .nodeList .pageNodeInfo,
      .nodeList .linkNodeInfo,
      .discussionListItem,
      .sectionMain,
      .breadBoxTop,
      .breadBoxBottom,
      .navTabs .navTab.selected .tabLinks,
      .message .messageInfo,
      .mainContent,
      .sandwichContents {
        background-color: rgb(25, 31, 45);
        border-color: rgb(65, 92, 135);
      }

      body,
      #headerMover {
        background-color: #000;
      }

      #header {
        background-color: transparent;
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

      .AdContainer {
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


