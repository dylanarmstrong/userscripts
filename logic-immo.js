// ==UserScript==
// @author       dylanarmstrong
// @description  Fix logic-immo so submit works with adblock
// @grant        none
// @match        https://www.logic-immo.com/*
// @name         logic-immo
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/master/logic-immo.js
// @version      1
// ==/UserScript==

(function(w) {
    w.Didomi = { shouldConsentBeCollected: () => false };
})(window);