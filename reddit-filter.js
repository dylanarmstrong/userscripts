// ==UserScript==
// @name         reddit-filter
// @namespace    https://old.reddit.com
// @namespace    https://www.reddit.com
// @version      0.2
// @description  Filter subreddits on r/all
// @author       meinhimmel
// @match        https://old.reddit.com/r/all/*
// @match        https://www.reddit.com/r/all/*
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

  // Can I just use the @version from above?
  const version = '0.2';
  const keys = {
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
  button.style.backgroundColor = 'rgb(250, 241, 241)';
  button.style.color = '#333';
  button.style.border = '1px solid rgb(244, 219, 220)';
  button.style.padding = '0px 4px 2px';
  button.style.fontSize = '10px';
  button.style.marginLeft = '3px';
  button.style.marginTop = '-1px';
  button.style.borderRadius = '50%';

  const nodes = document.querySelectorAll('.subreddit');

  // Remove all blocked subreddits
  const hide = () => {
    let blocked = localStorage.getItem(keys.subreddits);
    if (blocked === null) {
      localStorage.setItem(keys.subreddits, '');
      return;
    }

    blocked = blocked.split(',');
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      // Remove r/ from the subreddit
      const subreddit = node.textContent.slice(2).toLowerCase();
      if (blocked.includes(subreddit)) {
        const p = node.parentNode.parentNode.parentNode.parentNode;
        p.parentNode.removeChild(p);
      }
    }
  };

  const blockClick = (e) => {
    const { previousElementSibling } = e.target;
    if (!previousElementSibling) {
      return;
    }

    const subreddit = previousElementSibling.textContent.slice(2).toLowerCase();
    if (confirm(`Are you sure you want to block r/${subreddit}?`)) {
      let blocked = localStorage.getItem(keys.subreddits);
      if (blocked === null) {
        blocked = subreddit;
      } else {
        blocked = `${blocked},${subreddit}`;
      }
      localStorage.setItem(keys.subreddits, blocked);
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

