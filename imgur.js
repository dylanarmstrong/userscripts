// ==UserScript==
// @author       dylanarmstrong
// @description  Imgur Login Bypass
// @grant        none
// @match        https://imgur.com/*
// @name         imgur
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @run-at       document-body
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/master/imgur.js
// @version      2
// ==/UserScript==

(function() {
  'use strict';
  const { location } = document;
  if (document.querySelector('.wall-choices') && !location.pathname.includes('/embed')) {
    location.href = `${location.href}/embed?pub=true`;
  }
})();
