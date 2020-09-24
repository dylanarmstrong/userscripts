// ==UserScript==
// @name         xenforo-reactions
// @namespace    https://github.com/dylanarmstrong/tampermonkey-scripts/
// @version      2
// @description  Add first message reaction count
// @author       dylanarmstrong
// @match        https://www.alternatehistory.com/forum/forums/*
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
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/tampermonkey-scripts/master/xenforo-reactions.js
// @supportURL   https://github.com/dylanarmstrong/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

/**
 * Add first message reaction count
 */

(function() {
  'use strict';
  // Append reactions
  document
    .querySelectorAll('.structItem-cell.structItem-cell--meta')
    .forEach(element => {
      const reactions = element.title.replace(/[^0-9]/g, '');
      const dl = document.createElement('dl');
      dl.classList.add('pairs');
      dl.classList.add('pairs--justified');
      dl.classList.add('structItem-minor');
      const dt = document.createElement('dt');
      dt.textContent = 'Reactions';
      dl.appendChild(dt);
      const dd = document.createElement('dd');
      dd.textContent = reactions;
      dl.appendChild(dd);
      element.appendChild(dl);
    });
})();

