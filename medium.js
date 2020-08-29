// ==UserScript==
// @name         medium
// @namespace    https://github.com/dylanarmstrong/tampermonkey-scripts/
// @version      8
// @description  Uncrap medium
// @author       dylanarmstrong
// @match        *://*/*
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/tampermonkey-scripts/master/medium.js
// @supportURL   https://github.com/dylanarmstrong/tampermonkey-scripts/issues
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

    if (typeof GM_addStyle === 'function') {
      GM_addStyle(css);
    } else {
      // Support Userscripts
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    }

    // Delete the cookies
    const expire = new Date('2000-01-01').toUTCString();
    test(() => {
      document.cookie.split(';')
        .forEach(c => (
          document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${expire};path=/`)
        ));
    });

    // Shadow the HttpOnly uid cookie
    test(() => document.cookie = `uid=${Math.round(Math.random() * 100)};`);

    // May not have localStorage
    test(() => localStorage.clear());
    test(() => sessionStorage.clear());

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

      // Don't care how many free stories I have left
      test(() => {
        const el = document.querySelector('section');
        if (el.textContent.match(/You have [0-9]*? free stor.*? left this month/)) {
          el.remove()
        }
      });

      test(() => {
        const el = document.querySelector('section');
        if (el.textContent.match(/This is your last free story this month/)) {
          el.remove()
        }
      });

      // Remove asides for top highlight
      test(() =>
        Array.prototype.forEach.call(document.querySelectorAll('aside'), ass => ass.remove())
      );

      // Remove flickering sidebar
      test(() => (document.querySelector('[data-test-id="post-sidebar"]').style.display = 'none'));

      // Remove pardon the interruption bar
      let line;
      document.querySelectorAll('p')
        .forEach(el => el.textContent.includes('To make Medium work, we log user data.') && (line = el));

      if (line) {
        test(() => {
          const overlay = line.parentNode.parentNode.parentNode.parentNode.parentNode;
          overlay.parentNode.removeChild(overlay);
        });
      }

      // I don't agree to your terms of service
      document.querySelectorAll('h4')
        .forEach(el => el.textContent.includes('We’ve made changes to our') && (line = el));

      if (line) {
        test(() => {
          const overlay = line.parentNode.parentNode.parentNode.parentNode.parentNode;
          overlay.parentNode.removeChild(overlay);
        });
      }

      // No thanks
      document.querySelectorAll('h3')
        .forEach(el => el.textContent.includes('Pardon the interruption') && (line = el));

      if (line) {
        test(() => {
          const overlay = line.parentNode.parentNode.parentNode.parentNode.parentNode;
          overlay.parentNode.removeChild(overlay);
        });
      }

      // I don't want to be a member
      document.querySelectorAll('h2')
        .forEach(el => el.textContent.includes('Get one more story in your member preview') && (line = el));

      if (line) {
        test(() => {
          const overlay = h2.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
          overlay.parentNode.removeChild(overlay);
        });
      }

      // Lazy image loading
      const unhide = hidden => {
        test(() => {
          let prev = hidden.previousElementSibling;
          if (prev.tagName === 'IMG' || prev.tagName === 'DIV') {
            prev.parentNode.removeChild(prev);
          }

          prev = hidden.previousElementSibling.previousElementSibling;
          if (prev.tagName === 'DIV') {
            prev.parentNode.removeChild(prev);
          }
        });

        const text = hidden.textContent;
        const src = text.match(/src="(https:\/\/[^"]+)"/);
        if (src && src.length > 1) {
          const img = document.createElement('img');
          img.src = src[1];
          test(() => img.alt = text.match(/alt="([^"]+)"/)[1]);
          test(() => img.className = text.match(/class="([^"]+)"/)[1]);
          test(() => img.height = text.match(/height="([^"]+)"/)[1]);
          test(() => img.width = text.match(/width="([^"]+)"/)[1]);

          const a = document.createElement('a');
          a.href = src[1];
          a.rel = 'noopener noreferrer';
          a.target = '_blank';
          a.appendChild(img);

          test(() => {
            const parent = hidden.parentNode;
            parent.innerHTML = '';
            parent.appendChild(a);
          });
        }
      };
      document.querySelectorAll('noscript').forEach(unhide);

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
