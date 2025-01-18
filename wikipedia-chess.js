// ==UserScript==
// @author       dylanarmstrong
// @description  Fix for chessboard images not working on Safari
// @grant        none
// @match        https://*.wikipedia.org/*
// @name         wikipedia-chess
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/main/wikipedia-chess.js
// @version      2
// ==/UserScript==

(function main() {
  const els = document.querySelectorAll('.chess-board');
  const svg =
    'https://upload.wikimedia.org/wikipedia/commons/d/d7/Chessboard480.svg';
  const each = (element) => {
    const old = element.querySelector('img');
    const img = document.createElement('img');
    img.src = svg;
    img.alt = old.alt;
    img.width = old.width;
    img.height = old.height;
    old.parentNode.replaceChild(img, old);
  };
  Array.prototype.forEach.call(els, each);
})();
