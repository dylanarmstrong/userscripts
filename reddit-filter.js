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
 * TODO: Add filtering of words, not sure on how to do UI for this one
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

    .entry a.author {
      margin-right: 0;
    }
  `;

  const style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = css;
  document.head.insertBefore(style, document.head.firstChild);

  // Can I just use the @version from above?
  const version = '0.6';
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

  let nodes = Array.from(document.getElementsByClassName('entry'));
  nodes = nodes.filter(node => node !== null && typeof node !== 'undefined');

  // Remove all blocked subreddits
  const hide = () => {
    const subreddits = localStorage.getItem(keys.subreddits).split(',');
    const users = localStorage.getItem(keys.users).split(',');
    const domains = localStorage.getItem(keys.domains).split(',');
    const words = localStorage.getItem(keys.words).split(',');
    const removed = [];

    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];

      // Remove r/ from the subreddit
      let [ subreddit ] = node.getElementsByClassName('subreddit')
        , [ user ] = node.getElementsByClassName('author')
        , [ domain ] = node.getElementsByClassName('domain');

      if (subreddit) {
        subreddit = subreddit.textContent.slice(2).toLowerCase();
      }

      if (user) {
        user = user.textContent.toLowerCase();
        if (user.slice(0, 2) === 'u/') {
          user = user.slice(2);
        }
      }

      if (domain) {
        [ domain ] = domain.getElementsByTagName('a');
        if (domain) {
          domain = domain.textContent.toLowerCase();
        }
      }

      if (subreddits.includes(subreddit) || users.includes(user) || domains.includes(domain)) {
        const p = node.parentNode;
        if (p && p.parentNode) {
          p.parentNode.removeChild(p);
        }
        // Remove from nodes
        removed.push(i);
      }
    }

    // Do not act on removed nodes anymore
    nodes = nodes.filter((node, index) => {
      return !removed.includes(index);
    });
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
      type = 'r/';
      key = keys.subreddits;

    } else if (type === 'u/') {
      // Blocking user subreddit
      block = textContent.slice(2).toLowerCase();
      type = 'u/';
      key = keys.users;

    } else if (type.slice(0, 1) === '(') {
      // Domain
      const [ a ] = previousElementSibling.getElementsByTagName('a');
      if (a) {
        block = a.textContent;
        type = 'domain ';
        key = keys.domains;
      } else {
        return;
      }

    } else {
      block = textContent.slice(0).toLowerCase();
      type = 'u/';
      key = keys.users;
    }

    if (confirm(`Are you sure you want to block ${type}${block}?`)) {
      let blocked = localStorage.getItem(key);
      // Already in here, how'd the user block it twice?
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
    const node = nodes[i];

    const [ subreddit ] = node.getElementsByClassName('subreddit')
    if (subreddit) {
      button = button.cloneNode();
      button.textContent = 'x';
      button.addEventListener('click', blockClick);

      subreddit.insertAdjacentElement('afterend', button);
    }

    const [ author ] = node.getElementsByClassName('author')
    if (author) {
      button = button.cloneNode();
      button.textContent = 'x';
      button.addEventListener('click', blockClick);

      author.insertAdjacentElement('afterend', button);
    }

    const [ domain ] = node.getElementsByClassName('domain')
    if (domain) {
      button = button.cloneNode();
      button.textContent = 'x';
      button.addEventListener('click', blockClick);

      domain.insertAdjacentElement('afterend', button);
    }
  }

  hide();
})();

