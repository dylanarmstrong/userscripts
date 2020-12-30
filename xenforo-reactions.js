// ==UserScript==
// @author       dylanarmstrong
// @description  Add first message reaction count
// @grant        none
// @match        https://forums.spacebattles.com/forums/creative-writing-archives.40/*
// @match        https://forums.spacebattles.com/forums/creative-writing.18/*
// @match        https://forums.spacebattles.com/forums/original-fiction.48/*
// @match        https://forums.spacebattles.com/forums/roleplaying-quests-story-debates.60/*
// @match        https://forums.spacebattles.com/forums/the-index.63/*
// @match        https://forums.spacebattles.com/forums/worm.115/*
// @match        https://forums.sufficientvelocity.com/forums/archive.31/*
// @match        https://forums.sufficientvelocity.com/forums/quests-archive.17/*
// @match        https://forums.sufficientvelocity.com/forums/quests.29/*
// @match        https://forums.sufficientvelocity.com/forums/unlisted-fiction.15/*
// @match        https://forums.sufficientvelocity.com/forums/user-fiction.2/*
// @match        https://forums.sufficientvelocity.com/forums/weird-history.95/*
// @match        https://forums.sufficientvelocity.com/forums/worm.94/*
// @match        https://www.alternatehistory.com/forum/forums/*
// @name         xenforo-reactions
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/master/xenforo-reactions.js
// @version      3
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

