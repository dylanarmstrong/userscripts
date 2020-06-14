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

    element.parentNode.parentNode.setAttribute('data-favorites', favs);

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

  // If on profile page
  if (location.pathname.startsWith('/u/')) {
    const sortByFavorites = () => {
      const sort = (_a, _b) => {
        const a = Number.parseInt(_a.getAttribute('data-favorites'));
        const b = Number.parseInt(_b.getAttribute('data-favorites'));
        if (a > b) {
          return -1;
        }
        if (a < b) {
          return 1;
        }
        return 0;
      };
      const id = document.querySelector('.tab-pane.active').id;
      const inside = document.getElementById(`${id}_inside`);
      const stories = Array.from(inside.querySelectorAll('[data-favorites]')).sort(sort);
      inside.innerHTML = '';
      stories.forEach(story => inside.appendChild(story));
    };
    const createSpan = (el) => {
      if (el) {
        const span = document.createElement('span');
        span.textContent = 'Favorites';
        span.addEventListener('click', sortByFavorites);
        span.classList.add('gray');
        const div = el.querySelector('div');
        if (div && div.textContent.startsWith('Sort: Category')) {
          div.appendChild(span);
          // Favorite Stories tab has incorrect number of spaces
          span.previousSibling.textContent = ' . ';
        }
      }
    };
    ['fs','st','fa','cc']
      .map(id => document.getElementById(id))
      .forEach(createSpan);
  }
})();

