// ==UserScript==
// @name         imgur
// @namespace    https://github.com/dylanarmstrong/tampermonkey-scripts/
// @version      1
// @description  Imgur Login Bypass
// @author       dylanarmstrong
// @match        https://imgur.com/*
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/tampermonkey-scripts/master/imgur.js
// @supportURL   https://github.com/dylanarmstrong/tampermonkey-scripts/issues
// @run-at       document-body
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  const { location } = document;
  if (document.querySelector('.wall-choices') && !location.pathname.includes('/embed')) {
    location.href = `${location.href}/embed?pub=true`;
  }
})();
