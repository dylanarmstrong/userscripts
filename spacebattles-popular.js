// ==UserScript==
// @name         spacebattles-popular
// @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
// @version      0.3
// @description  Hide unpopular stories for easier browsing of recent
// @author       meinhimmel
// @match        https://forums.spacebattles.com/forums/creative-writing.18/*
// @match        https://forums.spacebattles.com/forums/worm.115/*
// @match        https://forums.spacebattles.com/forums/original-fiction.48/*
// @match        https://forums.spacebattles.com/forums/roleplaying-quests-story-debates.60/*
// @match        https://forums.spacebattles.com/forums/creative-writing-archives.40/*
// @match        https://forums.spacebattles.com/forums/the-index.63/*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/spacebattles-popular.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

/**
 * Hides unpopular stories on spacebattles
 */

(function() {
  'use strict';
  const viewLimit = 50000;
  const replyLimit = 100;
  const hidden = [];

  const viewEach = (element) => {
    const viewCount = Number(element.textContent.replace(',', ''));
    if (viewCount < viewLimit) {
      hidden.push(element);
    }
  };

  const replyEach = (element) => {
    const replyCount = Number(element.textContent.replace(',', ''));
    if (replyCount > replyLimit) {
      if (hidden.includes(element)) {
        hidden.remove(element);
      }
    }
  };

  let elements = document.querySelectorAll('dl.minor dd');
  elements.forEach(viewEach);
  elements = document.querySelectorAll('dl.major dd');
  elements.forEach(replyEach);

  for (let i = 0, len = hidden.length; i < len; i++) {
    const element = hidden[i];
    const p = element.parentNode.parentNode.parentNode;
    if (p && p.parentNode) {
      p.parentNode.removeChild(p);
    }
  }
})();

