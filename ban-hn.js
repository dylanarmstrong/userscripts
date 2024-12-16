// ==UserScript==
// @author       dylanarmstrong
// @description  Ban people I dislike on HN
// @grant        none
// @match        https://news.ycombinator.com/*
// @name         ban-hn
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/main/ban-hn.js
// @version      2
// ==/UserScript==

/**
 * HN has really bad moderation, so it's easier to just block the people who are cancer.
 */

(function () {
  'use strict';

  // Store the version # in localStorage
  // this will be useful for possible breaking changes
  // How many ? can you fit on one line?
  const version = 1;
  const keys = {
    users: 'filter.users',
    version: 'filter.version',
  };

  const currentVersion = Number.parseInt(localStorage.getItem(keys.version));

  // Migrate from 0 -> 1
  if (currentVersion === 0 && version === 1) {
    const bannedUsers =
      localStorage.getItem(keys.users)?.split(',').filter(Boolean) || [];
    const data = {};
    for (const user of bannedUsers) {
      data[user] = 'Unknown';
    }
    localStorage.setItem(keys.users, JSON.stringify(data));
  }

  const _users = localStorage.getItem(keys.users);
  if (_users === null) {
    localStorage.setItem(keys.users, '{}');
  }

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

  const getData = () => JSON.parse(localStorage.getItem(keys.users));

  const isBanned = (user) => getData()[user] !== undefined;

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
    const title =
      target.parentNode.parentNode.parentNode.parentNode.querySelector(
        '.commtext',
      )?.textContent || '';

    const key = keys.users;
    const user = getUser(target);
    const banned = isBanned(user);
    const data = getData();

    if (
      confirm(
        `Are you sure you want to ${banned ? 'unblock' : 'block'} '${user}'?`,
      )
    ) {
      if (banned) {
        delete data[user];
      } else {
        data[user] = title;
      }

      localStorage.setItem(key, JSON.stringify(data));
      hide();
      updateButtons();
    }
  };

  const updateButtons = () => {
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      const a = node.querySelector('.hn-filter-span a');
      const user = getUser(node);
      const reason = getData()[user];
      if (reason !== undefined) {
        a.title = reason;
      }
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
        const reason = getData()[user];
        if (reason !== undefined) {
          a.title = reason;
        }
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
