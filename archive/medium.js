// ==UserScript==
// @author       dylanarmstrong
// @description  Uncrap medium
// @grant        GM_addStyle
// @match        *://*/*
// @name         medium
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @run-at       document-body
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/master/medium.js
// @version      11
// ==/UserScript==

/**
 * Medium sucks, make it suck less
 *
 * Modified from MMRA (https://github.com/thebaer/MMRA)
 */

(function () {
  // Make sure we are on a Medium site
  if (
    document.querySelector(
      'head meta[property="al:ios:app_name"][content="medium" i]',
    )
  ) {
    // Boilerplate for possible throwables
    const test = (method) => {
      try {
        method();
      } catch {
        /* Ignore */
      }
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

    if (typeof GM_addStyle === "function") {
      GM_addStyle(css);
    } else {
      // Support Userscripts
      const style = document.createElement("style");
      style.textContent = css;
      document.head.append(style);
    }

    // Delete the cookies, that I have access to
    const expire = new Date("2000-01-01").toUTCString();
    test(() => {
      for (const c of document.cookie.split(";"))
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${expire};path=/`);
    });

    // Shadow the HttpOnly uid cookie
    test(
      () =>
        (document.cookie = `uid=lo_476e7083110${Math.round(Math.random() * 9)};path=/`),
    );

    // May not have localStorage
    test(() => localStorage.clear());
    test(() => sessionStorage.clear());

    // Only do these once, as otherwise mutations will grab content
    // Remove large blank space after header
    test(
      () =>
        (document.querySelector("nav").nextElementSibling.style.display =
          "none"),
    );

    const readable = () => {
      // Remove fixed header
      test(() => (document.querySelector("nav").style.position = "relative"));

      // Remove iframe for google sign in
      test(() =>
        document.querySelector('iframe[src^="https://smartlock"]').remove(),
      );

      // Don't care how many free stories I have left
      test(() => {
        const element = document.querySelector("section");
        if (
          /You have [0-9]*? free( member-only)? stor.*? left this month/.test(
            element.textContent,
          )
        ) {
          element.remove();
        }
      });

      test(() => {
        const element = document.querySelector("section");
        if (
          /This is your last free story this month/.test(element.textContent)
        ) {
          element.remove();
        }
      });

      // Remove asides for top highlight
      test(() =>
        Array.prototype.forEach.call(
          document.querySelectorAll("aside"),
          (ass) => ass.remove(),
        ),
      );

      // Remove flickering sidebar
      test(
        () =>
          (document.querySelector(
            '[data-test-id="post-sidebar"]',
          ).style.display = "none"),
      );

      // Remove pardon the interruption bar
      let line;
      for (const element of document.querySelectorAll("p"))
        element.textContent.includes(
          "To make Medium work, we log user data.",
        ) && (line = element);

      if (line) {
        test(() => {
          const overlay =
            line.parentNode.parentNode.parentNode.parentNode.parentNode;
          overlay.remove();
        });
      }

      // I don't agree to your terms of service
      for (const element of document.querySelectorAll("h4"))
        element.textContent.includes("We’ve made changes to our") &&
          (line = element);

      if (line) {
        test(() => {
          const overlay =
            line.parentNode.parentNode.parentNode.parentNode.parentNode;
          overlay.remove();
        });
      }

      // No thanks
      for (const element of document.querySelectorAll("h3"))
        element.textContent.includes("Pardon the interruption") &&
          (line = element);

      if (line) {
        test(() => {
          const overlay =
            line.parentNode.parentNode.parentNode.parentNode.parentNode;
          overlay.remove();
        });
      }

      // I don't want to be a member
      for (const element of document.querySelectorAll("h2"))
        element.textContent.includes(
          "Get one more story in your member preview",
        ) && (line = element);

      if (line) {
        test(() => {
          const overlay =
            h2.parentNode.parentNode.parentNode.parentNode.parentNode
              .parentNode;
          overlay.remove();
        });
      }

      // Lazy image loading
      const unhide = (hidden) => {
        test(() => {
          let previous = hidden.previousElementSibling;
          if (previous.tagName === "IMG" || previous.tagName === "DIV") {
            previous.remove();
          }

          previous = hidden.previousElementSibling.previousElementSibling;
          if (previous.tagName === "DIV") {
            previous.remove();
          }
        });

        const text = hidden.textContent;
        const source = text.match(/src="(https:\/\/[^"]+)"/);
        if (source && source.length > 1) {
          const img = document.createElement("img");
          img.src = source[1];
          test(() => (img.alt = text.match(/alt="([^"]+)"/)[1]));
          test(() => (img.className = text.match(/class="([^"]+)"/)[1]));
          test(() => (img.height = text.match(/height="([^"]+)"/)[1]));
          test(() => (img.width = text.match(/width="([^"]+)"/)[1]));

          const a = document.createElement("a");
          a.href = source[1];
          a.rel = "noopener noreferrer";
          a.target = "_blank";
          a.append(img);

          test(() => {
            const parent = hidden.parentNode;
            parent.innerHTML = "";
            parent.append(a);
          });
        }
      };
      document.querySelectorAll("noscript").forEach(unhide);

      // Shitty popup on click / mouseover
      test(() => document.querySelector('[tabindex="-1"]').remove());
    };

    // Heh.
    const clone = () => {
      test(() => {
        const root = document.querySelector("#root");
        const clone = root.cloneNode(true);
        clone.id = "_root";
        root.remove();
        document.body.insertBefore(clone, document.body.firstChild);
      });
    };

    // Run this twice, then clone the root element
    readable();

    setTimeout(() => {
      readable();
      clone();
    }, 250);
  }
})();
