// ==UserScript==
// @name         reddit-override
// @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
// @version      1
// @description  Override some window.r functionality on reddit
// @author       meinhimmel
// @match        https://*.reddit.com/*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/reddit-override.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

/**
 * Override some window.r functionality that I dislike
 */

(function() {
  'use strict';

  if (!window.r || typeof window.r !== 'object') {
    return;
  }

  // Stops videos being pinned at top
  window.r.utils.isMobile = () => true;

  window.r.config.advertiser_category = '';
  window.r.config.anon_eventtracker_url = '';
  window.r.config.clicktracker_url = '';
  window.r.config.facebook_app_id = 0;
  window.r.config.feature_heartbeat_events = false;
  window.r.config.send_logs = false;
  window.r.config.stats_domain = '';

  const overrides = [
    'analytics',
    'analyticsV2',
    'gtm'
  ];

  const blank = function(...args) {
    console.log(this, 'called with', args);
  };

  const each = (override, key) => {
    const item = override[key];

    if (item instanceof Array) {
      console.log('item is array', item);
      for (let i = 0, len = item.length; i < len; i++) {
        console.log('sending ', item[i], key);
        each(item[i], key);
      }

    } else if (typeof item === 'function') {
      override[key] = blank.bind(key);

    } else if (typeof item === 'object') {
      console.log('o', item, key);
      Object.keys(item).forEach(each.bind(this, item));

    } else if (typeof item === 'string') {
      console.log('s', item, key);
      override[key] = '';
    }
  };

  for (let i = 0, len = overrides.length; i < len; i++) {
    const override = window.r[overrides[i]];
    Object.keys(override).forEach(each.bind(this, override));
  }

})();

