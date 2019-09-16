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
    // Boilerplate for possible throwables
    const test = (method) => {
      try {
        method();
      } catch (e) { /* Ignore */ }
    };

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

