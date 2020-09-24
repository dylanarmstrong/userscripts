// ==UserScript==
// @name         reddit-override
// @namespace    https://github.com/dylanarmstrong/tampermonkey-scripts/
// @version      3
// @description  Override some window.r functionality on reddit
// @author       dylanarmstrong
// @match        https://*.reddit.com/*
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/tampermonkey-scripts/master/reddit-override.js
// @supportURL   https://github.com/dylanarmstrong/tampermonkey-scripts/issues
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
