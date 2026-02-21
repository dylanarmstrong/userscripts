// ==UserScript==
// @author       dylanarmstrong
// @description  Additional FF metrics
// @grant        none
// @match        https://*.fanfiction.net/*
// @name         fanfiction
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/master/fanfiction.js
// @version      6
// ==/UserScript==

/**
 * Additional FF metrics
 */

(function () {
  // TODO: start mobile load at the 500+ mark, so first 500 stories don't change

  const is_profile_page = location.pathname.startsWith("/u/");
  // If this is changed to false, it won't try and convert mobile pages with cors
  let enable_cors = true;
  // Only run on pages with 500 favorites (due to 500 bug)
  let badge_count = 0;
  try {
    badge_count = Number.parseInt(
      document.querySelector("#l_fs > span").textContent,
    );
  } catch {
    /* Ignore */
  }

  if (enable_cors && (!is_profile_page || badge_count !== 500)) {
    enable_cors = false;
  }

  const parse_normal = () => {
    const details = document.querySelectorAll(".z-padtop2.xgray");

    const genres = new Set([
      "Adventure",
      "Angst",
      "Comfort",
      "Crime",
      "Drama",
      "Family",
      "Fantasy",
      "Friendship",
      "General",
      "Horror",
      "Humor",
      "Hurt",
      "Mystery",
      "Parody",
      "Poetry",
      "Romance",
      "Sci-Fi",
      "Spiritual",
      "Supernatural",
      "Suspense",
      "Tragedy",
      "Western",
    ]);

    const css = `
      .good {
        color: rgb(24, 192, 240);
      }
      .bad {
        color: rgb(237, 20, 90);
      }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.insertAdjacentElement("beforeend", style);

    Array.prototype.forEach.call(details, (element) => {
      const text = element.textContent;
      const nocommas = text.replaceAll(",", "");

      const chapters = get_detail("Chapters:", nocommas);
      const favs = get_detail("Favs:", nocommas);
      const follows = get_detail("Follows:", nocommas);
      const is_complete = text.endsWith("Complete");
      const is_crossover = text.startsWith("Crossover");
      const is_single = text.startsWith("Rated:");
      const rated = get_detail("Rated:", text);
      const reviews = get_detail("Reviews:", nocommas);
      let words = get_detail("Words:", nocommas);

      const parent = element.parentNode.parentNode;
      parent.dataset.favorites = favs;

      let updated = new Date(
        Number.parseInt(parent.dataset.dateupdate) * 1000,
      ).toLocaleDateString();
      let published = new Date(
        Number.parseInt(parent.dataset.datesubmit) * 1000,
      ).toLocaleDateString();

      if (String(published) === "Invalid Date") {
        const dates = element.innerHTML.match(/data-xutime=['"].*?['"]/g);
        if (dates) {
          for (let date of dates) {
            date = date.replace(/.*=['"](.*?)['"]/, "$1");
            const d = Number(date) * 1000;
            date = new Date(d);
            // Never updated
            if (dates.length === 1) {
              published = date.toLocaleDateString();
            } else if (updated === "" || String(updated) === "Invalid Date") {
              updated = date.toLocaleDateString();
            } else {
              published = date.toLocaleDateString();
            }
          }
        }
      }

      let wc_ratio = (words / chapters).toFixed(0);
      if (wc_ratio > 5000) {
        wc_ratio = `<span class='good'>${wc_ratio}</span>`;
      } else if (wc_ratio < 3000) {
        wc_ratio = `<span class='bad'>${wc_ratio}</span>`;
      }

      if (is_complete) {
        words = `<span class='good'>${words}</span>`;
      } else if (words > 40_000) {
        words = `<span class='good'>${words}</span>`;
      } else {
        words = `<span class='bad'>${words}</span>`;
      }

      let fan = "";
      fan = is_crossover
        ? text.slice(12, text.indexOf(" - Rated:", 13))
        : text.slice(0, text.indexOf(" - Rated:"));

      fan = fan
        .replaceAll(/(A song of Ice and Fire)/g, `<span class='good'>$1</span>`)
        .replaceAll(/(Avengers)/g, `<span class='good'>$1</span>`)
        .replaceAll(/(Batman)/g, `<span class='good'>$1</span>`)
        .replaceAll(
          /(Buffy: The Vampire Slayer)/g,
          `<span class='good'>$1</span>`,
        )
        .replaceAll(/(Dresden Files)/g, `<span class='good'>$1</span>`)
        .replaceAll(/(Dungeons and Dragons)/g, `<span class='good'>$1</span>`)
        .replaceAll(/(Game of Thrones)/g, `<span class='good'>$1</span>`)
        .replaceAll(/(Harry Potter)/g, `<span class='good'>$1</span>`)
        .replaceAll(/(Lord of the Rings)/g, `<span class='good'>$1</span>`)
        .replaceAll(/(Marvel)/g, `<span class='good'>$1</span>`)
        .replaceAll(/(Naruto)/g, `<span class='good'>$1</span>`)
        .replaceAll(/(One Piece)/g, `<span class='bad'>$1</span>`)
        .replaceAll(/(RWBY)/g, `<span class='bad'>$1</span>`)
        .replaceAll(
          /(Youjo Senki: Saga of Tanya the Evil)/g,
          `<span class='good'>$1</span>`,
        )
        .replaceAll(/(Star Wars)/g, `<span class='good'>$1</span>`)
        .replaceAll(/(Stargate: Atlantis)/g, `<span class='good'>$1</span>`)
        .replaceAll(/(Stargate: SG-1)/g, `<span class='good'>$1</span>`)
        .replaceAll(/(Twilight)/g, `<span class='bad'>$1</span>`)
        .replaceAll(/(Worm)/g, `<span class='good'>$1</span>`);

      let genre = [];
      for (let s of text.replaceAll("/", " ").split(" ")) {
        if (genres.has(s)) {
          if (s === "Hurt" || s === "Comfort" || s === "Angst") {
            s = `<span class='bad'>${s}</span>`;
          } else if (s === "Humor") {
            s = `<span class='good'>${s}</span>`;
          }
          genre.push(s);
        }
      }
      genre = genre.join("/");

      element.innerHTML = "";

      if (!is_single) {
        element.innerHTML += `${is_crossover ? "Crossover - " : ""}${fan} - `;
      }
      element.innerHTML += `Rated: ${rated}`;
      if (genre !== "") {
        element.innerHTML += ` - ${genre}`;
      }
      element.innerHTML += ` - Chapters: ${chapters} - Words: ${words}`;
      element.innerHTML += ` - Reviews: ${reviews} - Favs: ${favs} - Follows: ${follows}`;
      if (updated !== "" && String(updated) !== "Invalid Date") {
        element.innerHTML += ` - Updated: ${updated}`;
      }
      if (published !== "" && String(published) !== "Invalid Date") {
        element.innerHTML += ` - Published: ${published}`;
      }
      element.innerHTML += ` - W/C: ${wc_ratio}`;
      element.innerHTML += `${is_complete ? ` - <span class='good'>Complete</span>` : ""}`;

      element.parentNode.innerHTML = element.parentNode.innerHTML
        .replaceAll(/(\?)/g, `<span class='bad'>$1</span>`)
        .replaceAll(/(discontinued)/gi, `<span class='bad'>$1</span>`)
        .replaceAll(/(harem)/gi, `<span class='bad'>$1</span>`)
        .replaceAll(/(hiatus)/gi, `<span class='bad'>$1</span>`)
        .replaceAll(/(mpreg)/gi, `<span class='bad'>$1</span>`)
        .replaceAll(/(what\ if)/gi, `<span class='bad'>$1</span>`);
    });

    if (is_profile_page) {
      const sortByFavorites = () => {
        const sort = (_a, _b) => {
          const a = Number.parseInt(_a.dataset.favorites);
          const b = Number.parseInt(_b.dataset.favorites);
          if (a > b) {
            return -1;
          }
          if (a < b) {
            return 1;
          }
          return 0;
        };
        const { id } = document.querySelector(".tab-pane.active");
        const inside = document.getElementById(`${id}_inside`);
        const stories = [...inside.querySelectorAll("[data-favorites]")].sort(
          sort,
        );
        inside.innerHTML = "";
        for (const story of stories) inside.append(story);
      };
      let created = false;
      const createSpan = (element) => {
        created = true;
        if (element) {
          const span = document.createElement("span");
          span.textContent = "Favorites";
          span.addEventListener("click", sortByFavorites);
          span.classList.add("gray");
          const div = element.querySelector("div");
          if (div && div.textContent.startsWith("Sort: Category")) {
            div.append(span);
            // Favorite Stories tab has incorrect number of spaces
            span.previousSibling.textContent = " . ";
          }
        }
      };

      if (!created) {
        ["fs", "st", "fa", "cc"]
          .map((id) => document.getElementById(id))
          .forEach(createSpan);
      }

      const fandoms = [...document.querySelectorAll("[data-category]")]
        .map((element) => element.dataset.category)
        .filter(Boolean)
        .sort();

      if (fandoms.length > 0) {
        const element = document.querySelector(".tab-content");
        if (element) {
          const it = new Set(fandoms).values();

          let select = document.querySelector("#custom-fandom-select");
          let add_select = false;
          if (select) {
            select.options.length = 0;
          } else {
            add_select = true;
            select = document.createElement("select");
          }
          select.id = "custom-fandom-select";
          let option = document.createElement("option");
          option.value = "";
          option.textContent = "";
          select.append(option);

          let done = false;
          let value;
          while (!done) {
            ({ done, value } = it.next());
            if (value) {
              option = document.createElement("option");
              option.value = value;
              option.textContent = value;
              select.append(option);
            }
          }
          const filterFiction = ({ target }) => {
            const { value } = target;
            const toggleElement = (element) => {
              element.style.display =
                value === "" || element.dataset.category.includes(value)
                  ? "block"
                  : "none";
            };
            [...document.querySelectorAll("[data-category]")].forEach(
              toggleElement,
            );
          };
          if (add_select) {
            select.addEventListener("change", filterFiction);
            element.prepend(select);
          }
        }
      }
    }
  };

  const get_html = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div;
  };

  const get_detail = (find, text) => {
    let detail = null;
    const { length } = find;
    const index = text.indexOf(find);
    if (index !== -1) {
      let end = text.indexOf("-", index + length + 2);
      if (end === -1) {
        end = text.length + 1;
      }
      detail = text.slice(index + length + 1, end - 1);
    }
    return detail || "";
  };

  if (is_profile_page && enable_cors) {
    const load_mobile = () => {
      // 1. Call cors url for 1st page on favorites
      // 2. Get number of pages from response
      // 3. Call rest of pages
      // 4. Remove favorite stories from DOM
      // 5. Parse
      // 6. Sort
      // 7. Format stories like normally done

      // Mobile URL
      const mobile = location.href.replace(/www\./, "m.");
      // Replace stories with m.
      const cors = `https://dylan.is/proxy?url=${mobile}?a=fs`;
      const contents = [];

      const parse_mobile_details = (div, reviews, complete) => {
        const get_date = (span) => new Date(span.dataset.xutime * 1000);
        const spans = [...div.querySelectorAll("span[data-xutime]")];
        const published = get_date(spans.pop());
        let updated;
        if (spans.length === 1) {
          // Has been updated
          updated = get_date(spans.pop());
        } else {
          updated = published;
        }
        const trim = (s) => s.trim();
        const split = div.textContent.split(",").map(trim);
        const fandom = split.shift();
        const rating = split.shift();
        const language = split.shift();
        const genre = split.shift();
        const maybe_chapters = split.shift();
        let chapters = get_detail("chapters:", maybe_chapters);
        let words;
        if (chapters) {
          words = get_detail("words:", split.shift());
        } else {
          chapters = 1;
          words = get_detail("words:", maybe_chapters);
        }
        const favs = get_detail("favs:", split.shift());
        const follows = get_detail("follows:", split.shift());
        const element = document.createElement("div");
        // TODO: This can be changed into a method, it's duplicated with above
        element.append(fandom);
        element.append(" - ");
        element.append("Rated: ");
        element.append(rating.toUpperCase());
        element.append(" - ");
        element.append(language);
        element.append(" - ");
        element.append(genre);
        element.append(" - ");
        element.append("Chapters: ");
        element.append(chapters);
        element.append(" - ");
        element.append("Words: ");
        element.append(words.replace("k+", "000"));
        element.append(" - ");
        element.append("Reviews: ");
        element.append(reviews.replace("k+", "000"));
        element.append(" - ");
        element.append("Favs: ");
        element.append(favs.replace("k+", "000"));
        element.append(" - ");
        element.append("Follows: ");
        element.append(follows.replace("k+", "000"));
        if (updated !== published) {
          element.append(" - ");
          element.append("Updated: ");
          element.append(updated.toLocaleDateString());
        }
        element.append(" - ");
        element.append("Published: ");
        element.append(published.toLocaleDateString());
        if (complete) {
          element.append(" - ");
          element.append("Complete");
        }

        return {
          element,
          "data-category": fandom,
          "data-dateupdate": published.getTime() / 1000,
          "data-datesubmit": updated.getTime() / 1000,
          "data-title": "",
          "data-storyid": "",
          "data-wordcount": words,
          "data-favorites": favs,
          "data-chapters": chapters,
        };
      };

      const parse_mobile = (content) => {
        let complete = false;
        const filter_node = (node) => {
          const { nodeName, nodeValue } = node;
          if (
            nodeName === "#text" &&
            (nodeValue === "  by " || nodeValue === " ")
          ) {
            return false;
          }
          if (nodeName === "IMG") {
            if (node.classList.contains("pull-right")) {
              // Mobile has a complete image
              complete = true;
            }
            return false;
          }
          if (
            nodeName === "A" && // code point of >> is 187
            node.textContent.length > 0 &&
            node.textContent.codePointAt(0) === 187
          ) {
            return false;
          }
          return true;
        };

        const promise = (resolve) => {
          const stories = [...content.querySelectorAll("div.bs.brb")];
          const frag = document.createDocumentFragment();

          const parse = (story) => {
            try {
              const nodes = [...story.childNodes].filter(filter_node);
              if (nodes.length === 5) {
                const reviews = nodes[0].textContent.trim();
                const { href: storyUrl, textContent: title } = nodes[1];
                const { href: authorUrl, textContent: author } = nodes[2];
                const summary = nodes[3].textContent.trim();
                const details = nodes[4];

                const parent = document.createElement("div");
                parent.classList.add("z-list", "favstories");
                parent.style.minHeight = "77px";
                parent.style.borderBottom = "1px #cdcdcd solid";

                let a = document.createElement("a");
                a.classList.add("stitle");
                a.href = storyUrl;
                a.textContent = title;
                parent.append(a);

                a = document.createElement("a");
                a.href = storyUrl;
                const span = document.createElement("span");
                span.classList.add("icon-chevron-right", "xicon-section-arrow");
                a.append(span);
                parent.append(a);

                parent.append(" by ");

                a = document.createElement("a");
                a.href = authorUrl;
                a.textContent = author;
                parent.append(a);

                const div = document.createElement("div");
                div.classList.add("z-padtop");
                div.textContent = summary;

                const detailDiv = document.createElement("div");
                detailDiv.innerHTML = details.innerHTML;

                // Parse details
                const { element, ...attributes } = parse_mobile_details(
                  detailDiv,
                  reviews,
                  complete,
                );
                const add_attribute = (key) => {
                  parent.setAttribute(key, attributes[key]);
                };
                element.classList.add("z-padtop2", "xgray");
                div.append(element);

                parent.append(div);
                Object.keys(attributes).forEach(add_attribute);
                frag.append(parent);
              }
            } catch {
              /* Ignore */
            }
          };

          stories.forEach(parse);
          resolve(frag);
        };
        return new Promise(promise);
      };

      const parse_mobiles = () => {
        const ps = [];
        for (
          let index = 0, length_ = contents.length;
          index < length_;
          index++
        ) {
          ps.push(parse_mobile(contents[index]));
        }
        return Promise.all(ps);
      };

      // TODO: Placeholder
      const sort_mobile = (frag) => {
        const children = [...frag.childNodes];
        return frag;
      };

      const place = (frag) => {
        const inside = document.querySelector("#fs_inside");
        inside.innerHTML = "";
        inside.append(frag);
      };

      const frag_combine = (frags) => {
        const frag = document.createDocumentFragment();
        const each = (dom) => frag.appendChild(dom);
        frags.forEach(each);
        return frag;
      };

      const update_badge = () => {
        document.querySelector("#l_fs > span").textContent =
          document.querySelectorAll(".favstories").length;
      };

      // Try and fetch cors proxy
      fetch(cors)
        .then((r) => r.json())
        .then((body) => {
          const get_favorite_count = () =>
            get_html(body)
              .querySelector("#content .bs.brb + [align] > span.gray")
              .textContent.replaceAll(",", "");
          // Now we need to get number of pages (20 per page)
          const pages = Math.ceil(get_favorite_count() / 20);
          const ps = [];
          const get_content = (json) => {
            const content = get_html(json).querySelector("#content");
            contents.push(content);
            return;
          };
          get_content(body);
          for (let index = 2, length_ = pages + 1; index < length_; index++) {
            ps.push(
              // Encode the &
              fetch(`${cors}%26p=${index}`)
                .then((r) => r.json())
                .then(get_content)
                .catch((_) => {}),
            );
          }
          return Promise.all(ps);
        })
        // Parse mobile stories, and format like desktop
        .then(parse_mobiles)
        // Combine all the frags into single
        .then(frag_combine)
        // Setup sort, need to resort stories
        .then(sort_mobile)
        // Place on page
        .then(place)
        .then(update_badge)
        .catch((_) => {})
        .then(parse_normal);
    };

    const li = document.createElement("li");
    const a = document.createElement("a");
    li.addEventListener("click", load_mobile);
    a.textContent = "Load Mobile Favorites";
    a.style.cursor = "pointer";
    li.append(a);
    document.querySelector("#mytab").append(li);
  }

  parse_normal();
})();
