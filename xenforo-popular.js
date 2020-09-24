// ==UserScript==
// @name         xenforo-popular
// @namespace    https://github.com/dylanarmstrong/tampermonkey-scripts/
// @version      5
// @description  Hide unpopular stories for easier browsing of recent
// @author       dylanarmstrong
// @match        https://forums.spacebattles.com/forums/creative-writing.18/*
// @match        https://forums.spacebattles.com/forums/worm.115/*
// @match        https://forums.spacebattles.com/forums/original-fiction.48/*
// @match        https://forums.spacebattles.com/forums/roleplaying-quests-story-debates.60/*
// @match        https://forums.spacebattles.com/forums/creative-writing-archives.40/*
// @match        https://forums.spacebattles.com/forums/the-index.63/*
// @match        https://forums.sufficientvelocity.com/forums/worm.94/*
// @match        https://forums.sufficientvelocity.com/forums/user-fiction.2/*
// @match        https://forums.sufficientvelocity.com/forums/weird-history.95/*
// @match        https://forums.sufficientvelocity.com/forums/quests.29/*
// @match        https://forums.sufficientvelocity.com/forums/quests-archive.17/*
// @match        https://forums.sufficientvelocity.com/forums/unlisted-fiction.15/*
// @match        https://forums.sufficientvelocity.com/forums/archive.31/*
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/tampermonkey-scripts/master/xenforo-popular.js
// @supportURL   https://github.com/dylanarmstrong/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

/**
 * Hides unpopular stories on spacebattles / sufficient velocity
 *
 * TODO: It says xenforo.. but it only works for 2 sites, add alternatehistory
 */

(function() {
  'use strict';
  const viewLimit = 50000;
  const replyLimit = 100;
  const hidden = [];

  const viewEach = (element) => {
    const textContent = element.textContent.trim().toLowerCase();
    const k = textContent.endsWith('k') ? 1000 : 1;
    const m = textContent.endsWith('m') ? 1000 * 1000 : 1;
    const viewCount = Number(textContent.replace(/[,km]/g, '')) * k * m;
    if (viewCount < viewLimit) {
      hidden.push(element);
    }
  };

  const replyEach = (element) => {
    const textContent = element.textContent.trim().toLowerCase();
    const k = textContent.endsWith('k') ? 1000 : 1;
    const m = textContent.endsWith('m') ? 1000 * 1000 : 1;
    const replyCount = Number(textContent.replace(/[,km]/g, '')) * k * m;
    if (replyCount > replyLimit) {
      if (hidden.includes(element)) {
        hidden.remove(element);
      }
    }
  };

  let elements =
    document
      .querySelectorAll('.structItem-cell.structItem-cell--meta dl:nth-child(2) dd');
  elements.forEach(viewEach);
  elements =
    document
      .querySelectorAll('.structItem-cell.structItem-cell--meta dl:nth-child(1) dd');
  elements.forEach(replyEach);

  for (let i = 0, len = hidden.length; i < len; i++) {
    const element = hidden[i];
    const p = element.parentNode.parentNode.parentNode;
    if (p && p.parentNode) {
      p.parentNode.removeChild(p);
    }
  }
})();

