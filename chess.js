// ==UserScript==
// @author       dylanarmstrong
// @description  Add analyze in lichess on chess.com game over screen
// @match        https://www.chess.com/*
// @name         chess
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @run-at       document-body
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/main/chess.js
// @version      2
// ==/UserScript==

/**
 * Add button to analyze games on lichess after games.
 */
(function main() {
  // eslint-disable-next-line prefer-const
  let timer;

  const getLink = async () => {
    const gameId = new URL(location.href).pathname.split('/').at(-1);
    const playerName = document
      .querySelector('#notifications-request')
      .getAttribute('username');

    const gameUrl = await fetch(
      `https://api.chess.com/pub/player/${playerName}/games/archives`,
    )
      .then((r) => r.json())
      .then((index) => index.archives.at(-1));

    const { pgn } = await fetch(gameUrl)
      .then((r) => r.json())
      .then((index) => index.games.find((game) => game.url.endsWith(gameId)));

    const { url } = await fetch('https://lichess.org/api/import', {
      body: `pgn=${encodeURIComponent(pgn)}`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      method: 'post',
    }).then((r) => r.json());

    return url;
  };

  const addLink = async (event) => {
    const { currentTarget } = event;
    currentTarget.removeEventListener('click', addLink);

    currentTarget.textContent = 'Loading...';
    const url = await getLink();
    currentTarget.textContent = 'Lichess Review';
    currentTarget.href = url;
    currentTarget.click();
  };

  const getElement = () => {
    const element = document.querySelector('#__lichess__');
    if (element) {
      element.remove();
    }

    const link = document.createElement('a');
    link.id = '__lichess__';

    link.style['-moz-user-select'] = 'auto';
    link.style['-webkit-user-select'] = 'auto';

    link.style.alignItems = 'center';
    link.style.display = 'flex';
    link.style.height = '100%';
    link.style.justifyContent = 'center';
    link.style.pointerEvents = 'auto';
    link.style.userSelect = 'auto';
    link.style.width = '100%';

    link.classList.add('game-over-review-button-label');
    link.textContent = 'Lichess Review';
    link.rel = 'noopener noreferrer';
    link.target = '_blank';

    return link;
  };

  const loop = async () => {
    const gameOver = document.querySelector(
      '.game-over-review-button-component',
    );
    if (gameOver) {
      globalThis.clearInterval(timer);

      const element = gameOver.cloneNode(true);

      const oldButton = gameOver.querySelector('.cc-button-primary');
      if (oldButton) {
        oldButton.classList.remove('cc-button-primary');
        oldButton.classList.add('cc-button-secondary');
      }

      const link = getElement();

      link.addEventListener('click', addLink);

      element.replaceChild(
        link,
        element.querySelector('.game-over-review-button-label'),
      );

      gameOver.before(element);
    }
  };

  timer = globalThis.setInterval(loop, 500);
})();
