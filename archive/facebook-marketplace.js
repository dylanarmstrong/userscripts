// ==UserScript==
// @name         facebook-marketplace
// @namespace    https://github.com/meinhimmel/tampermonkey-scripts/
// @version      1
// @description  Sort facebook marketplace by date
// @author       meinhimmel
// @match        https://www.facebook.com/marketplace/*/search?*
// @updateURL    https://raw.githubusercontent.com/meinhimmel/tampermonkey-scripts/master/facebook-marketplace.js
// @supportURL   https://github.com/meinhimmel/tampermonkey-scripts/issues
// @grant        none
// ==/UserScript==

/**
 * Sort facebook marketplace by date
 */

(function() {
  'use strict';

  const order = [
    '1 hour ago',
    '2 hours ago',
    '3 hours ago',
    '4 hours ago',
    '5 hours ago',
    '6 hours ago',
    '7 hours ago',
    '8 hours ago',
    '9 hours ago',
    '10 hours ago',
    '11 hours ago',
    '12 hours ago',
    '13 hours ago',
    '14 hours ago',
    '15 hours ago',
    '16 hours ago',
    '17 hours ago',
    '18 hours ago',
    '19 hours ago',
    '20 hours ago',
    '21 hours ago',
    '22 hours ago',
    '23 hours ago',
    'about a day ago',
    '2 days ago',
    '3 days ago',
    '4 days ago',
    '5 days ago',
    '6 days ago',
    'about a week ago',
    'over a week ago'
  ];

  const sort = () => {
    const ar =
      Array.from(document.querySelectorAll('[data-testid="marketplace_feed_item"] span[location]'))
        .sort((a, b) => {
          // Sort by date
          let a_s = a.previousSibling.previousSibling.textContent
            , b_s = b.previousSibling.previousSibling.textContent
            , a_index = order.indexOf(a_s)
            , b_index = order.indexOf(b_s);
          if (a_index < b_index) {
            return 1;
          } else if (a_index > b_index) {
            return -1;
          }

          // Sort by location
          a_s = a.textContent;
          b_s = b.textContent;

          let ret = a_s.localeCompare(b_s);
          if (ret === 0) {
            // Sort by description
            a_s = a.parentNode.previousElementSibling.querySelector('p').textContent;
            b_s = b.parentNode.previousElementSibling.querySelector('p').textContent;
            return a_s.localeCompare(b_s);
          }

          return ret;
        })
        .map(element => element.parentNode.parentNode.parentNode.parentNode);

    if (ar) {
      const len = ar.length;
      if (len > 0) {
        const parent = ar[0].parentNode;

        for (let i = 0; i < len; i++) {
          const a = ar.shift();
          parent.removeChild(a);
          parent.insertBefore(a, parent.firstChild);
        }
      }
    }

  };

  sort();

  document.addEventListener('scroll', sort);

})();

