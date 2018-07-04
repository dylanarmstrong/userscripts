// ==UserScript==
// @name         reddit-filter
// @namespace    https://old.reddit.com
// @namespace    https://www.reddit.com
// @version      0.6
// @description  Filter subreddits on r/all
// @author       meinhimmel
// @match        https://old.reddit.com/r/all/*
// @match        https://www.reddit.com/r/all/*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/reddit-filter.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

/**
 * Adds a little (x) button next to subreddits on r/all so you can filter them
 * They're stored in localStorage key 'filter.subreddits'
 *
 * TODO: Add filtering of words, users, and domains
 */

(function() {
  'use strict';

  const css = `
    .reddit-filter-block {
      background-color: rgb(250, 241, 241);
      color: #333;
      border: 1px solid rgb(244, 219, 220);
      padding: 0px 4px 2px;
      font-size: 10px;
      margin-left: 3px;
      margin-top: -1px;
      border-radius: 50%;
    }
  `;

  const style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = css;
  document.head.insertBefore(style, document.head.firstChild);

  // Can I just use the @version from above?
  const version = '0.5';
  const keys = {
    domains: 'filter.domains',
    subreddits: 'filter.subreddits',
    users: 'filter.users',
    words: 'filter.words',
    version: 'filter.version'
  };

  // Make sure all keys are initialized
  Object.keys(keys).forEach((key) => {
    const value = keys[key];
    const item = localStorage.getItem(value);
    if (item === null) {
      let def = '';
      if (key === 'version') {
        def = version;
      }
      localStorage.setItem(value, def);
    }
  });

  // Make a (x) button next to subreddit
  let button = document.createElement('button');
  button.classList.add('reddit-filter-block');

  const nodes = document.getElementsByClassName('subreddit');

  // Remove all blocked subreddits
  const hide = () => {
    let blocked = localStorage.getItem(keys.subreddits).split(',');
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      if (!node || typeof node === 'undefined') {
        continue;
      }

      // Remove r/ from the subreddit
      const subreddit = node.textContent.slice(2).toLowerCase();
      if (blocked.includes(subreddit)) {
        const p = node.parentNode.parentNode.parentNode.parentNode;
        if (p && p.parentNode) {
          p.parentNode.removeChild(p);
        }
      }
    }
  };

  const blockClick = (e) => {
    const { previousElementSibling } = e.target;
    if (!previousElementSibling) {
      return;
    }

    const { textContent } = previousElementSibling;

    let type = textContent.slice(0, 2)
      , key = ''
      , block = '';

    if (type === 'r/') {
      // Blocking subreddit
      block = textContent.slice(2).toLowerCase();
      key = keys.subreddits;

    } else if (type === 'u/') {
      // Blocking user subreddit
      block = textContent.slice(2).toLowerCase();
      key = keys.users;

    } else {
      block = textContent.slice(0).toLowerCase();
      type = 'u/';
      key = keys.users;
    }

    if (confirm(`Are you sure you want to block ${type}${block}?`)) {
      let blocked = localStorage.getItem(key);
      if (blocked.split(',').includes(block)) {
        return;
      }

      blocked += `,${block}`;
      blocked = blocked.replace(/^,/, '');
      localStorage.setItem(key, blocked);

      hide();
    }
  };

  for (let i = 0, len = nodes.length; i < len; i++) {
    button = button.cloneNode();
    button.textContent = 'x';
    button.addEventListener('click', blockClick);
    const node = nodes[i];
    node.insertAdjacentElement('afterend', button);
  }

  hide();
})();

