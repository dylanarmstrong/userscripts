// ==UserScript==
// @name         reddit-filter
// @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
// @version      5
// @description  Filter subreddits on r/all
// @author       meinhimmel
// @match        https://*.reddit.com/r/all/*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/reddit-filter.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

/**
 * Adds a filter at end of tagline that has a popup to filter on subreddit, domain, or user.
 * They're stored in the localStorage keys 'filter.*'
 *
 * TODO: Add filtering of words, not sure on how to do UI for this one
 */

(function() {
  'use strict';

  const css = `
    .reddit-filter-popup {
      position: absolute;
      z-index: 999;
      background-color: #eee;
      border: 1px solid #bbb;
      padding: 5px 0px 2px 5px;
      border-radius: 3px;
      height: 20px;
    }

    .reddit-filter-popup button {
      font-size: 10px;
      font-weight: bold;
      color: white;
      background-image: linear-gradient(rgb(123, 184, 80), rgb(117, 168, 73));
      cursor: pointer;
      margin: 0px 5px 5px 0px;
      padding: 1px 6px;
      border: 1px solid rgb(68, 68, 68);
      border-image: initial;
      border-radius: 3px;
    }
  `;

  const style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = css;
  document.head.insertBefore(style, document.head.firstChild);

  // Store the version # in localStorage
  // this will be useful for possible breaking changes
  const version = GM_info.script.version;
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
      localStorage.setItem(value, '');
    }
  });

  // This is in case changes are ever breaking
  localStorage.setItem(keys.version, version);

  // Make a (x) button next to subreddit
  let button = document.createElement('button');
  button.classList.add('reddit-filter-block');

  let nodes = null;

  const updateNodes = () => {
    nodes = Array.from(document.getElementsByClassName('entry'));
    nodes = nodes.filter(node => node !== null && typeof node !== 'undefined');
  };

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

  const click = (key, e) => {
    const { target } = e;
    let selector = ''
      , type = '';
    if (key === keys.subreddits) {
      selector = '.subreddit';
      type = 'r/';
    } else if (key === keys.users) {
      selector = '.author';
      type = 'u/';
    } else if (key === keys.domains) {
      selector = '.domain a';
      type = 'domain ';
    } else {
      return;
    }

    let block =
      target.parentNode.parentNode.parentNode.parentNode.querySelector(selector).textContent;

    block = block.replace(/^((r|u)\/){1}/, '');

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

  let hasPopups = false;

  const closePopups = (e = null) => {
    if (hasPopups) {
      if (!e || !e.target.classList.contains('reddit-filter-popup')) {
        const popups = document.getElementsByClassName('reddit-filter-popup');
        for (let i = 0, len = popups.length; i < len; i++) {
          const p = popups[i];
          if (p && typeof p !== 'undefined' && p.parentNode) {
            p.parentNode.removeChild(p);
          }
        }
        hasPopups = false;
      }
    }
  };

  // Hide any popups on click anywhere on page
  document.body.addEventListener('click', closePopups);

  const popup = (ul, x, y) => {
    hasPopups = true;

    const div = document.createElement('div');
    div.classList.add('reddit-filter-popup');
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;

    let button = document.createElement('button');
    button.textContent = 'subreddit';
    button.addEventListener('click', click.bind(this, keys.subreddits));
    div.appendChild(button);

    button = document.createElement('button');
    button.textContent = 'user';
    button.addEventListener('click', click.bind(this, keys.users));
    div.appendChild(button);

    button = document.createElement('button');
    button.textContent = 'domain';
    button.addEventListener('click', click.bind(this, keys.domains));
    div.appendChild(button);

    ul.appendChild(div);
  };

  const aClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {
      pageX,
      pageY,
      target
    } = e;
    const ul = target.parentNode.parentNode;
    closePopups();
    popup(ul, pageX, pageY);
  };

  const addButtons = () => {
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      const buttons = node.querySelector('ul.flat-list.buttons');
      if (buttons) {
        if (!buttons.querySelector('.reddit-filter-li')) {
          const li = document.createElement('li');
          li.classList.add('reddit-filter-li');
          const a = document.createElement('a');
          a.textContent = 'filter';
          a.href = '';
          a.addEventListener('click', aClick);
          li.appendChild(a);
          buttons.appendChild(li);
        }
      }
    }
  };

  const run = () => {
    updateNodes();
    hide();
    addButtons();
  };

  // Infinite loading scroll script has loaded more items
  document.addEventListener('reddit-load', run);

  run();
})();

