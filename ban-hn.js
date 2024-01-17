// ==UserScript==
// @author       dylanarmstrong
// @description  Ban people I dislike on HN
// @grant        none
// @match        https://news.ycombinator.com/*
// @name         ban-hn
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/main/ban-hn.js
// @version      1
// ==/UserScript==

/**
 * HN has really bad moderation, so it's easier to just block the people who are cancer.
 */

(function () {
  'use strict';

  // Store the version # in localStorage
  // this will be useful for possible breaking changes
  // How many ? can you fit on one line?
  const version =
    typeof GM_info === 'object' ? GM_info?.script?.version ?? 0 : 0;
  const keys = {
    users: 'filter.users',
    version: 'filter.version',
  };

  // Make sure all keys are initialized
  Object.keys(keys).forEach((key) => {
    const value = keys[key];
    const item = localStorage.getItem(value);
    if (item === null) {
      localStorage.setItem(value, '');
    }
  });

  // This is in case changes are ever breaking
  localStorage.setItem(keys.version, version);

  // Make a (x) button next to subhn
  let button = document.createElement('button');
  button.classList.add('hn-filter-block');

  let nodes = null;

  const updateNodes = () => {
    nodes = Array.from(
      document.querySelectorAll('.comment-tree .comhead'),
    ).filter((node) => node !== null && typeof node !== 'undefined');
  };

  const getUser = (node) =>
    node.parentNode.parentNode
      .querySelector('.hnuser')
      .textContent.toLowerCase();

  const isBanned = (user) =>
    localStorage.getItem(keys.users).split(',').includes(user);

  // Remove all blocked subhns
  const hide = () => {
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      const user = getUser(node);
      if (isBanned(user)) {
        // Check if already hidden
        if (
          !node.parentNode.parentNode.parentNode.parentNode.querySelector(
            '.noshow',
          )
        ) {
          node.parentNode.parentNode.querySelector('a.togg.clicky').click();
        }
      }
    }
  };

  const click = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { target } = e;

    const key = keys.users;
    const user = getUser(target);
    const banned = isBanned(user);

    if (
      confirm(
        `Are you sure you want to ${banned ? 'unblock' : 'block'} '${user}'?`,
      )
    ) {
      let blocked = localStorage.getItem(key).split(',');
      // Already in here, how'd the user block it twice?
      if (blocked.includes(user)) {
        blocked.splice(blocked.indexOf(user), 1);
      } else {
        blocked.push(user);
      }

      localStorage.setItem(key, blocked.join(','));
      hide();
      updateButtons();
    }
  };

  const updateButtons = () => {
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      const a = node.querySelector('.hn-filter-span a');
      const user = getUser(node);
      a.textContent = isBanned(user) ? 'unban' : 'ban';
    }
  };

  const addButtons = () => {
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      if (!node.querySelector('.hn-filter-span')) {
        const span = document.createElement('span');
        span.classList.add('hn-filter-span');
        const a = document.createElement('a');
        const user = getUser(node);
        a.textContent = isBanned(user) ? 'unban' : 'ban';
        a.addEventListener('click', click);
        span.insertAdjacentText('afterbegin', ' | ');
        span.appendChild(a);
        node.appendChild(span);
      }
    }
  };

  const run = () => {
    updateNodes();
    hide();
    addButtons();
  };

  run();
})();
