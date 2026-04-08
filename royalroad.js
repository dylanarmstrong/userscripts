// ==UserScript==
// @author       dylanarmstrong
// @description  Royalroad stuff
// @grant        none
// @match        https://*.royalroad.com/*
// @name         royalroad
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/main/royalroad.js
// @version      5
// ==/UserScript==

/**
 * Just some royalroad stuff
 */

(function main() {
  const colors = {
    bad: "text-gray-400",
    eh: "text-warning",
    good: "text-blue-500",
    ok: "text-black",
  };

  let els = document.querySelectorAll("[data-rr-initial-rating]");
  for (let index = 0, length_ = els.length; index < length_; index++) {
    const element = els[index];
    const rate = document.createElement("span");
    const number_ = Number.parseFloat(
      element.getAttribute("data-rr-initial-rating"),
    );
    if (!Number.isNaN(number_)) {
      let color;
      if (number_ > 4.5) {
        color = colors.good;
      } else if (number_ > 4.1) {
        color = colors.ok;
      } else if (number_ > 3.8) {
        color = colors.eh;
      } else {
        color = colors.bad;
      }
      rate.textContent = number_;
      rate.classList.add(color, "font-bold");
      element.parentNode.replaceChild(rate, element);
    }
  }

  for (const element of document.querySelectorAll(
    "div.bold.uppercase, span.bold.uppercase",
  )) {
    if (element.textContent.toLowerCase() === "advertisement") {
      element.parentNode.remove();
    }
  }
})();
