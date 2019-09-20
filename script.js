const GM_addStyle = (css) => {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = css;
  document.head.insertBefore(style, document.head.firstChild);
};

const GM_info = {
  script: {
    version: 1
  }
};

const { href } = window.location;
const domain = (a, f) => {
  if (a.some(host => new RegExp(host).test(href))) {
    test(() => f());
  }
};

// Boilerplate for possible throwables
const test = (method) => {
  try {
    method();
  } catch (e) { /* Ignore */ }
};

const fanfiction = () => {
  // ==UserScript==
  // @name         fanfiction
  // @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
  // @version      1
  // @description  Additional FF metrics
  // @author       meinhimmel
  // @match        https://*.fanfiction.net/*
  // @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/fanfiction.js
  // @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
  // @grant        none
  // ==/UserScript==

  /**
   * Additional FF metrics
   */

  (function() {
    'use strict';

    const get_detail = (find, text) => {
      let detail = null;
      const { length } = find;
      const index = text.indexOf(find);
      if (index > -1) {
        const end = text.indexOf('-', index + length + 2);
        detail = text.slice(index + length + 1, end - 1);
      }
      return detail;
    };

    const details = document.querySelectorAll('.z-padtop2.xgray');

    const genres = [
      'Adventure',
      'Angst',
      'Comfort',
      'Crime',
      'Drama',
      'Family',
      'Fantasy',
      'Friendship',
      'General',
      'Horror',
      'Humor',
      'Hurt',
      'Mystery',
      'Parody',
      'Poetry',
      'Romance',
      'Sci-Fi',
      'Spiritual',
      'Supernatural',
      'Suspense',
      'Tragedy',
      'Western'
    ];

    const css = `
      .good {
        color: rgb(24, 192, 240);
      }
      .bad {
        color: rgb(237, 20, 90);
      }
    `;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = css;
    document.head.insertAdjacentElement('beforeend', style);

    Array.prototype.forEach.call(details, (element) => {
      const text = element.textContent;
      const nocommas = text.replace(/,/g, '');

      const chapters = get_detail('Chapters:', nocommas);
      const favs = get_detail('Favs:', nocommas);
      const follows = get_detail('Follows:', nocommas);
      const is_complete = text.endsWith('Complete');
      const is_crossover = text.startsWith('Crossover');
      const is_single = text.startsWith('Rated:');
      const rated = get_detail('Rated:', text);
      const reviews = get_detail('Reviews:', nocommas);
      let words = get_detail('Words:', nocommas);

      const dates = element.innerHTML.match(/data-xutime=['"].*?['"]/g);
      let days_since = ''
        , published = ''
        , updated = '';
      if (dates) {
        for (let date of dates) {
          date = date.replace(/.*=['"](.*?)['"]/, '$1');
          const d = Number(date) * 1000;
          date = new Date(d);
          // Never updated
          if (dates.length === 1) {
            days_since = ((Date.now() - date) / 1000 / 60 / 60 / 24).toFixed(2);
            published = date.toLocaleDateString();
          } else if (updated === '') {
            updated = date.toLocaleDateString();
          } else {
            days_since = ((Date.now() - date) / 1000 / 60 / 60 / 24).toFixed(2);
            published = date.toLocaleDateString();
          }
        };
      }

      let wc_ratio = (words / chapters).toFixed(0);
      if (wc_ratio > 5000) {
        wc_ratio = `<span class='good'>${wc_ratio}</span>`;
      } else if (wc_ratio < 3000) {
        wc_ratio = `<span class='bad'>${wc_ratio}</span>`;
      }

      if (is_complete) {
        words = `<span class='good'>${words}</span>`;
      } else {
        if (words > 40000) {
          words = `<span class='good'>${words}</span>`;
        } else {
          words = `<span class='bad'>${words}</span>`;
        }
      }

      let fan = '';
      if (is_crossover) {
        fan = text.slice(12, text.indexOf(' - Rated:', 13));
      } else {
        fan = text.slice(0, text.indexOf(' - Rated:'));
      }

      fan = fan
        .replace(/(A song of Ice and Fire)/g, `<span class='good'>$1</span>`)
        .replace(/(Avengers)/g, `<span class='good'>$1</span>`)
        .replace(/(Batman)/g, `<span class='good'>$1</span>`)
        .replace(/(Buffy: The Vampire Slayer)/g, `<span class='good'>$1</span>`)
        .replace(/(Dresden Files)/g, `<span class='good'>$1</span>`)
        .replace(/(Dungeons and Dragons)/g, `<span class='good'>$1</span>`)
        .replace(/(Game of Thrones)/g, `<span class='good'>$1</span>`)
        .replace(/(Harry Potter)/g, `<span class='good'>$1</span>`)
        .replace(/(Lord of the Rings)/g, `<span class='good'>$1</span>`)
        .replace(/(Marvel)/g, `<span class='good'>$1</span>`)
        .replace(/(Naruto)/g, `<span class='good'>$1</span>`)
        .replace(/(One Piece)/g, `<span class='bad'>$1</span>`)
        .replace(/(RWBY)/g, `<span class='bad'>$1</span>`)
        .replace(/(Youjo Senki: Saga of Tanya the Evil)/g, `<span class='good'>$1</span>`)
        .replace(/(Star Wars)/g, `<span class='good'>$1</span>`)
        .replace(/(Stargate: Atlantis)/g, `<span class='good'>$1</span>`)
        .replace(/(Stargate: SG-1)/g, `<span class='good'>$1</span>`)
        .replace(/(Twilight)/g, `<span class='bad'>$1</span>`)
        .replace(/(Worm)/g, `<span class='good'>$1</span>`);

      let genre = [];
      for (let s of text.replace(/\//g, ' ').split(' ')) {
        if (genres.includes(s)) {
          if (s === 'Hurt' || s === 'Comfort' || s === 'Angst') {
            s = `<span class='bad'>${s}</span>`;
          } else if (s === 'Humor') {
            s = `<span class='good'>${s}</span>`;
          }
          genre.push(s);
        }
      }
      genre = genre.join('/');

      element.innerHTML = '';

      if (!is_single) {
        element.innerHTML += `${is_crossover ? 'Crossover - ' : ''}${fan} - `;
      }
      element.innerHTML += `Rated: ${rated}`;
      if (genre !== '') {
        element.innerHTML += ` - ${genre}`;
      }
      element.innerHTML += ` - Chapters: ${chapters} - Words: ${words}`;
      element.innerHTML += ` - Reviews: ${reviews} - Favs: ${favs} - Follows: ${follows}`;
      if (updated !== '') {
        element.innerHTML += ` - Updated: ${updated}`;
      }
      if (published !== '') {
        element.innerHTML += ` - Published: ${published}`;
      }
      element.innerHTML += ` - W/C: ${wc_ratio}`;
      element.innerHTML += `${is_complete ? ` - <span class='good'>Complete</span>` : ''}`;

      element.parentNode.innerHTML = element.parentNode.innerHTML
        .replace(/(\?)/g, `<span class='bad'>$1</span>`)
        .replace(/(discontinued)/gi, `<span class='bad'>$1</span>`)
        .replace(/(harem)/gi, `<span class='bad'>$1</span>`)
        .replace(/(hiatus)/gi, `<span class='bad'>$1</span>`)
        .replace(/(mpreg)/gi, `<span class='bad'>$1</span>`)
        .replace(/(what\ if)/gi, `<span class='bad'>$1</span>`);
    });
  })();
};

const redditOverride = () => {
  // ==UserScript==
  // @name         reddit-override
  // @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
  // @version      2
  // @description  Override some window.r functionality on reddit
  // @author       meinhimmel
  // @match        https://*.reddit.com/*
  // @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/reddit-override.js
  // @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
  // @grant        none
  // ==/UserScript==

  /**
   * Override some window.r functionality
   * I am not sure what anything other than isMobile is used for
   */

  (function() {
    'use strict';

    if (!window.r || typeof window.r !== 'object') {
      return;
    }

    // Stops videos being pinned at top
    window.r.utils.isMobile = () => true;

    // I do not know what anything beyond here does, and I just
    // edited at things that may increase personal privacy

    // Basic config attributes
    window.r.config.advertiser_category = '';
    window.r.config.anon_eventtracker_url = '';
    window.r.config.clicktracker_url = '';
    window.r.config.facebook_app_id = 0;
    window.r.config.feature_heartbeat_events = false;
    window.r.config.send_logs = false;
    window.r.config.stats_domain = '';

    // Completely remove these keys from window.r
    const overrides = [
      'analytics',
      'analyticsV2',
      'gtm'
    ];

    // Blank function to throw on things
    const blank = function() {};

    // Recursive forEach
    const each = (override, key) => {
      const item = override[key];

      if (!item || typeof item === 'undefined') {
        return;
      }

      if (item instanceof Array) {
        override[key] = [];

      } else if (typeof item === 'function') {
        override[key] = blank;

      } else if (typeof item === 'object') {
        Object.keys(item).forEach(each.bind(this, item));

      } else if (typeof item === 'string') {
        override[key] = '';

      } else if (typeof item === 'boolean') {
        override[key] = false;

      } else if (typeof item === 'number') {
        override[key] = 0;
      }
    };

    for (let i = 0, len = overrides.length; i < len; i++) {
      const override = window.r[overrides[i]];
      Object.keys(override).forEach(each.bind(this, override));
    }

  })();
};

const redditFilter = () => {
  // ==UserScript==
  // @name         reddit-filter
  // @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
  // @version      6
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

    GM_addStyle(css);

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

      block = block.replace(/^((r|u)\/){1}/, '').toLowerCase();

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
};

const redditRedirect = () => {
  // ==UserScript==
  // @name         reddit-redirect
  // @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
  // @version      4
  // @description  Redirect www to old
  // @author       meinhimmel
  // @match        https://www.reddit.com/*
  // @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/reddit-redirect.js
  // @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
  // @run-at       document-start
  // @grant        none
  // ==/UserScript==

  /**
   * Redirects all requests from www to old
   */

  (function() {
    'use strict';
    // iframe detection and redirect to old if on www
    const { href } = document.location;
    if (window.self === window.top && href.slice(0, 12) === 'https://www.') {
      document.location.href = `https://old.${href.slice(12)}`;
    }
  })();
};

const xenforoPopular = () => {
  // ==UserScript==
  // @name         xenforo-popular
  // @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
  // @version      3
  // @description  Hide unpopular stories for easier browsing of recent
  // @author       meinhimmel
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
  // @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/xenforo-popular.js
  // @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
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
    const isVelocity = document.location.host.includes('forums.sufficientvelocity.com');

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
        .querySelectorAll(isVelocity ? '.structItem-cell.structItem-cell--meta dl:nth-child(2) dd' : 'dl.minor dd');
    elements.forEach(viewEach);
    elements =
      document
        .querySelectorAll(isVelocity ? '.structItem-cell.structItem-cell--meta dl:nth-child(1) dd' : 'dl.major dd');
    elements.forEach(replyEach);

    for (let i = 0, len = hidden.length; i < len; i++) {
      const element = hidden[i];
      const p = element.parentNode.parentNode.parentNode;
      if (p && p.parentNode) {
        p.parentNode.removeChild(p);
      }
    }

    // Append reactions
    document
      .querySelectorAll(isVelocity ? '.structItem-cell.structItem-cell--meta' : '.listBlock.stats.pairsJustified')
      .forEach(element => {
        const reactions = element.title.replace(/[^0-9]/g, '');
        const dl = document.createElement('dl');
        if (isVelocity) {
          dl.classList.add('pairs');
          dl.classList.add('pairs--justified');
        } else {
          dl.classList.add('minor');
        }
        const dt = document.createElement('dt');
        dt.textContent = 'Reactions';
        dl.appendChild(dt);
        const dd = document.createElement('dd');
        dd.textContent = reactions;
        dl.appendChild(dd);
        element.appendChild(dl);
      });
  })();
};


const stylize = () => {
  // ==UserScript==
  // @name         stylize
  // @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
  // @version      14
  // @description  Add custom styles to websites
  // @author       meinhimmel
  // @match        *://*/*
  // @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/stylize.js
  // @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
  // @run-at       document-body
  // @grant        GM_addStyle
  // ==/UserScript==

  /**
   * Allows me to write custom styles for websites matching hosts by string or regex
   * Not sure really how to make this one usable by others, so I'd recommend forking this
   * Or just copying it manually to your browser
   *
   * Example:
   *
   * const csses = {
   *  'old.reddit.com': `
   *    .subreddit {
   *      border: 1px solid red;
   *    }
   *  `
   * }
   */

  (function() {
    'use strict';

    const csses = {
      'www.speedrun.com': `
        [data-ad] {
          display: none;
        }
      `,

      'offerup.com': `
        .db-ad-tile {
          display: none;
        }
      `,

      'www.fictionpress.com': `
        #storytextp {
          -webkit-user-select: auto !important;
        }
      `,

      'www.fanfiction.net': `
        #storytextp {
          -webkit-user-select: auto !important;
        }
      `,

      'www.alternatehistory.com': `
        @import url('https://fonts.googleapis.com/css?family=Amiri');
        .messageText span,
        .messageText p,
        .messageText {
          font-family: 'Amiri', serif;
          font-size: 21px !important;
          letter-spacing: 0px;
          font-weight: 400;
          text-rendering: optimizeLegibility;
        }

        #QuoteSelected {
          display: none !important;
        }

        #messageList {
          width: 80%;
          margin: 0 auto;
        }
      `,

      'forums.sufficientvelocity.com': `
        @import url('https://fonts.googleapis.com/css?family=Amiri');

        .p-body {
          background: #131C26;
        }

        .tooltip.tooltip--basic.tooltip--bottom.tooltip--selectToQuote {
          display: none !important;
        }

        .block--messages .message-cell--threadmark-header,
        .block--messages .message-cell--threadmark-footer,
        .message-cell,
        .bbCodeBlock,
        .block-body {
          background-color: rgb(25, 31, 45);
        }

        .bbWrapper,
        .message-body,
        .message-body .bbCodeBlock.bbCodeBlock-content,
        .fr-box.fr-basic textarea.input,
        .fr-box.fr-basic .fr-element,
        .bbCodePreview-content {
          font-family: 'Amiri', serif;
          font-size: 21px;
          letter-spacing: 0px;
          font-weight: 400;
          text-rendering: optimizeLegibility;
        }

        .structItem-title {
          color: rgb(228, 139, 43);
        }

        .AdContainer {
          display: none;
        }

        .p-navSticky {
          position: relative;
        }

        .message-cell--user {
          display: none;
        }
      `,

      'www.wuxiaworld.co': `
        @import url('https://fonts.googleapis.com/css?family=Amiri');

        .box_con #content,
        .box_con #content div,
        .box_con #content a {
          color: #222;
          font-family: 'Amiri', serif;
          font-size: 21px !important;
          letter-spacing: 0px;
          font-weight: 400;
          text-rendering: optimizeLegibility;
        }
      `,

      'www.royalroad.com': `
        .wide,
        .fic-header + .portlet,
        .chapter-content + .bold,
        .chapter-content + .bold + .wide + hr,
        #donate + .bold,
        #donate + .bold + .row {
          display: none;
        }
      `,

      'www.wuxiaworld.com': `
        @import url('https://fonts.googleapis.com/css?family=Amiri');
        #content-container {
          width: 100%;
        }
        #sidebar {
          display: none;
        }
        .fr-view {
          font-family: 'Amiri', serif;
          font-size: 21px !important;
          letter-spacing: 0px;
          font-weight: 400;
          text-rendering: optimizeLegibility;
        }
      `,

      'forums.spacebattles.com': `
        @import url('https://fonts.googleapis.com/css?family=Amiri');

        .messageText span,
        .messageText p,
        .messageText {
          font-family: 'Amiri', serif;
          font-size: 21px !important;
          letter-spacing: 0px;
          font-weight: 400;
          text-rendering: optimizeLegibility;
        }

        #QuoteSelected {
          display: none !important;
        }

        .messageUserInfo {
          display: none;
        }

        .message .messageInfo {
          margin-left: 0;
          padding: 0 30px;
        }

        .pageContent {
          width: 85%;
          margin: 0 auto;
        }

        .node .nodeText .nodeTitle,
        .discussionListItem .title {
          font-size: 18px;
        }

        .node .nodeStats,
        .discussionListItem .secondRow {
          font-size: 12px;
          margin-top: 1px;
        }

        .listBlock.stats.pairsJustified dl:nth-child(2) {
          margin-bottom: 0;
        }

        #QuickSearch {
          top: -29px;
          right: 95px;
          border-right: 1px solid rgb(65, 92, 135);
          border-top-right-radius: 0;
        }
      `,
      '(np|old|www)?\.reddit.com': `
        .premium-banner-outer,
        .premium-banner,
        #redesign-beta-optin-btn,
        .listing-chooser.initialized,
        .entry .buttons .give-gold-button,
        .entry .buttons .share,
        .entry .buttons .crosspost-button {
          display: none !important;
        }
      `
    };

    const { host } = document.location;

    const hostFilter = (key) => {
      const o = csses[key];
      try {
        const r = new RegExp(key);
        return host.match(r) !== null;
      } catch (e) {
        return host === key;
      }
    };

    const keys = Object.keys(csses).filter(hostFilter);

    for (let i = 0, len = keys.length; i < len; i++) {
      const css = csses[keys[i]];
      if (css) {
        GM_addStyle(css);
      }
    }
  })();
};

const medium = () => {
  // ==UserScript==
  // @name         medium
  // @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
  // @version      7
  // @description  Uncrap medium
  // @author       meinhimmel
  // @match        *://*/*
  // @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/medium.js
  // @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
  // @run-at       document-body
  // @grant        GM_addStyle
  // ==/UserScript==

  /**
   * Medium sucks, make it suck less
   *
   * Modified from MMRA (https://github.com/thebaer/MMRA)
   */

  (function() {
    'use strict';
    // Make sure we are on a Medium site
    if (document.querySelector('head meta[property="al:ios:app_name"][content="medium" i]')) {
      const css = `
        * {
          cursor: default !important;
        }

        a,
        a h3,
        button,
        img[src] {
          cursor: pointer !important;
        }

        [data-selectable-paragraph] mark {
          background-color: white;
        }

        [tabindex="-1"],
        [data-test-id="post-sidebar"] {
          display: none;
        }
      `;

      GM_addStyle(css);

      // Delete the cookies
      const expire = new Date().toUTCString();
      test(() => {
        document.cookie.split(';')
          .forEach(c => (
            document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${expire};path=/`)
          ));
      });

      // May not have localStorage
      test(() => localStorage.clear());

      // Only do these once, as otherwise mutations will grab content
      // Remove large blank space after header
      test(() => (document.querySelector('nav').nextElementSibling.style.display = 'none'));

      const readable = () => {
        // Remove fixed header
        test(() => (
          document.querySelector('nav').style.position = 'relative'
        ));

        // Remove iframe for google sign in
        test(() =>
          document.querySelector('iframe[src^="https://smartlock"]').remove()
        );

        // Remove flickering sidebar
        test(() => (document.querySelector('[data-test-id="post-sidebar"]').style.display = 'none'));

        // Remove pardon the interruption bar
        let p;
        document.querySelectorAll('p')
          .forEach(el => el.textContent.includes('To make Medium work, we log user data.') && (p = el));

        if (typeof p !== 'undefined') {
          test(() => {
            const overlay = p.parentNode.parentNode.parentNode.parentNode.parentNode;
            overlay.parentNode.removeChild(overlay);
          });
        }

        let h3;
        document.querySelectorAll('h3')
          .forEach(el => el.textContent.includes('Pardon the interruption') && (h3 = el));

        if (typeof h3 !== 'undefined') {
          test(() => {
            const overlay = h3.parentNode.parentNode.parentNode.parentNode.parentNode;
            overlay.parentNode.removeChild(overlay);
          });
        }

        let h2;
        document.querySelectorAll('h2')
          .forEach(el => el.textContent.includes('Get one more story in your member preview') && (h2 = el));

        if (typeof h2 !== 'undefined') {
          test(() => {
            const overlay = h2.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            overlay.parentNode.removeChild(overlay);
          });
        }

        // Lazy image loading
        document.querySelectorAll('noscript').forEach(hidden => {
          test(() => {
            const prev = hidden.previousElementSibling;
            if (prev.tagName === 'IMG') {
              prev.style.transitionDuration = '0ms';
              prev.style.opacity = '1';
            }
          });
          const img = document.createElement('img');
          const src = hidden.textContent.match(/src="(https:\/\/[^"]+)"/);
          if (src) {
            test(() => {
              img.src = src[1];
              img.className = hidden.textContent.match(/class="([^"]+)"/)[1]
            });
            hidden.parentNode.appendChild(img);
          }
        });

        // Shitty popup on click / mouseover
        test(() => document.querySelector('[tabindex="-1"]').parentNode.remove());
      };

      // Heh.
      const clone = () => {
        test(() => {
          const root = document.getElementById('root');
          const clone = root.cloneNode(true);
          clone.id = '_root';
          root.parentNode.removeChild(root);
          document.body.insertBefore(clone, document.body.firstChild);
        });
      };

      // Run this twice, then clone the root element
      readable();

      setTimeout(() => {
        readable()
        clone();
      }, 250);
    }
  })();
};

const youtube = () => {
  // ==UserScript==
  // @name         youtube
  // @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
  // @version      1
  // @description  Youtube Classic (Disable Polymer)
  // @author       meinhimmel
  // @match        https://www.youtube.com/*
  // @exclude      https://www.youtube.com/embed/*
  // @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/youtube.js
  // @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
  // @run-at       document-start
  // @grant        none
  // ==/UserScript==

  /**
   * Disable polymer on youtube
   */

  (function() {
    'use strict';
    // Redirect initial load to disable_polymer
    const main = () => {
      const { href } = location;
      if (!href.match(/disable_polymer/)) {
        if (href.match(/\?/)) {
          location.href = `${href}&disable_polymer=1`;
        } else {
          location.href = `${href}?disable_polymer=1`;
        }
      }
    };

    // Go through all other links on page and append disable_polymer
    const loop = () => {
      const elements = document.querySelectorAll('.content-link');
      for (let i = 0, len = elements.length; i < len; i++) {
        const element = elements[i];
        const { href } = element;
        if (!href.match(/disable_polymer/)) {
          if (href.match(/\?/)) {
            element.href = `${href}&disable_polymer=1`;
          } else {
            element.href = `${href}?disable_polymer=1`;
          }
        }
      }
    };

    // Append f6=8 (such a new layout, it defaults to classic)
    const cookie = () => {
      document.cookie = document.cookie
        .split(' ')
        .filter(o => o.match(/^(?!PREF=.*f6)PREF=/))[0]
        .replace(';','') + '&f6=8;domain=.youtube.com;path=/';
    };

    main();
    cookie();
    document.addEventListener('DOMContentLoaded', loop);
  })();
};

// Run as soon as possible
domain(['https://www.reddit.com/.*'], redditRedirect);

// Run on DOM load
document.addEventListener("DOMContentLoaded", () => {
  test(() => stylize());
  test(() => medium());

  domain(['https://.*\.?fanfiction.net/.*'], fanfiction);
  domain(['https://.*\.?reddit.com/.*'], redditOverride);
  domain(['https://.*\.?reddit.com/r/all/.*'], redditFilter);
  domain([
    'https://forums.spacebattles.com/forums/creative-writing.18/.*',
    'https://forums.spacebattles.com/forums/worm.115/.*',
    'https://forums.spacebattles.com/forums/original-fiction.48/.*',
    'https://forums.spacebattles.com/forums/roleplaying-quests-story-debates.60/.*',
    'https://forums.spacebattles.com/forums/creative-writing-archives.40/.*',
    'https://forums.spacebattles.com/forums/the-index.63/.*',
    'https://forums.sufficientvelocity.com/forums/worm.94/.*',
    'https://forums.sufficientvelocity.com/forums/user-fiction.2/.*',
    'https://forums.sufficientvelocity.com/forums/weird-history.95/.*',
    'https://forums.sufficientvelocity.com/forums/quests.29/.*',
    'https://forums.sufficientvelocity.com/forums/quests-archive.17/.*',
    'https://forums.sufficientvelocity.com/forums/unlisted-fiction.15/.*',
    'https://forums.sufficientvelocity.com/forums/archive.31/.*'
  ], xenforoPopular);
  domain(['https://www.youtube.com/.*'], youtube);
});
