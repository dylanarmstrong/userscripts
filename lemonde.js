// ==UserScript==
// @author       dylanarmstrong
// @description  Extract Le Monde article content
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @inject-into  content
// @match        https://www.lemonde.fr/*/article/*
// @name         lemonde
// @namespace    https://github.com/dylanarmstrong/userscripts/
// @run-at       document-end
// @supportURL   https://github.com/dylanarmstrong/userscripts/issues
// @updateURL    https://raw.githubusercontent.com/dylanarmstrong/userscripts/main/lemonde.js
// @version      1
// ==/UserScript==

/**
 * Le Monde to LingQ
 */

(function main() {
  const buttonStyle = {
    background: "#133dc8",
    border: "none",
    borderRadius: "4px",
    color: "#fafafa",
    cursor: "pointer",
    fontSize: "14px",
    padding: "8px 16px",
  };

  const disabledStyle = {
    background: "#999",
    cursor: "default",
  };

  const extractArticle = () => {
    const article = document.querySelector("article.article__content");
    if (!article) {
      return false;
    }

    const title = document.querySelector("h1.ds-title")?.textContent || "";
    const description =
      document.querySelector("span.ds-chapo")?.textContent || "";
    const authors =
      document.querySelector(".meta__author")?.textContent?.trim() || "";
    const date =
      document.querySelector(".meta__date")?.textContent?.trim() || "";
    const originalUrl = globalThis.location.href;

    const content = [];
    for (const child of article.children) {
      if (child.matches("p.article__paragraph")) {
        content.push(child.outerHTML);
      } else if (child.matches("h2.article__sub-title")) {
        content.push(child.outerHTML);
      } else if (child.matches("figure.article__media")) {
        content.push(child.outerHTML);
      }
    }

    return {
      authors,
      content,
      date,
      description,
      originalUrl,
      title,
    };
  };

  const replacePageWithClean = ({
    title,
    description,
    authors,
    date,
    content,
  }) => {
    document.head.innerHTML = `
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${title}</title>
      <style>
        body {
          font-family: Georgia, 'Times New Roman', serif;
          max-width: 700px;
          margin: 40px auto;
          padding: 0 20px;
          line-height: 1.7;
          color: #151515;
          background: #fafafa;
        }
        h1 {
          font-size: 2em;
          line-height: 1.2;
          margin-bottom: 0.5em;
        }
        .description {
          font-size: 1.15em;
          color: #444;
          margin-bottom: 1em;
          font-style: italic;
        }
        .meta {
          color: #666;
          font-size: 0.9em;
          margin-bottom: 2em;
          border-bottom: 1px solid #ddd;
          padding-bottom: 1em;
        }
        .article__paragraph {
          margin-bottom: 1em;
          font-size: 1.05em;
        }
        .article__sub-title {
          font-size: 1.4em;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        figure {
          margin: 1.5em 0;
        }
        figure img {
          max-width: 100%;
          height: auto;
        }
        figcaption {
          font-size: 0.85em;
          color: #666;
          margin-top: 0.5em;
        }
        a {
          color: #0056b3;
        }
      </style>
    `;

    document.body.innerHTML = `
      <h1>${title}</h1>
      <div class="description">${description}</div>
      <div class="meta">${authors} — ${date}</div>
      ${content.join("\n")}
    `;
  };

  const container = document.createElement("div");
  Object.assign(container.style, {
    alignItems: "center",
    display: "flex",
    gap: "8px",
    left: "10px",
    position: "fixed",
    top: "10px",
    zIndex: "99999",
  });
  document.body.append(container);

  // Button 1: Clean
  const cleanButton = document.createElement("button");
  cleanButton.textContent = "Clean";
  Object.assign(cleanButton.style, buttonStyle);
  container.append(cleanButton);

  // Button 2: LingQ
  const lingqButton = document.createElement("button");
  lingqButton.textContent = "LingQ";
  Object.assign(lingqButton.style, buttonStyle);
  container.append(lingqButton);

  // Button 3: Open LingQ (hidden until successful send)
  const openButton = document.createElement("button");
  openButton.textContent = "Open LingQ";
  Object.assign(openButton.style, { ...buttonStyle, display: "none" });
  container.append(openButton);

  // Token input (hidden until needed)
  const tokenInput = document.createElement("input");
  tokenInput.type = "text";
  tokenInput.placeholder = "LingQ API token";
  Object.assign(tokenInput.style, {
    border: "1px solid #ccc",
    borderRadius: "4px",
    display: "none",
    fontSize: "14px",
    padding: "8px",
    width: "240px",
  });
  container.append(tokenInput);

  const tokenSave = document.createElement("button");
  tokenSave.textContent = "Save";
  Object.assign(tokenSave.style, { ...buttonStyle, display: "none" });
  container.append(tokenSave);

  const disableButton = (button) => {
    button.disabled = true;
    Object.assign(button.style, disabledStyle);
  };

  let articleData;

  cleanButton.addEventListener("click", () => {
    articleData = extractArticle();
    if (!articleData) {
      return;
    }
    replacePageWithClean(articleData);
    document.body.append(container);
    disableButton(cleanButton);
  });

  const sendToLingQ = async (token) => {
    if (!articleData) {
      articleData = extractArticle();
    }
    if (!articleData) {
      return;
    }

    const { title, content, originalUrl } = articleData;
    // Extract plain text from the HTML content
    const temporary = document.createElement("div");
    temporary.innerHTML = content
      .filter((html) => html.startsWith("<p") || html.startsWith("<h2"))
      .join("");
    const text = [...temporary.querySelectorAll("p, h2")]
      .map((element) => element.textContent)
      .join("\n");

    lingqButton.textContent = "Sending…";

    try {
      const json = JSON.stringify({
        level: 3,
        // eslint-disable-next-line camelcase
        original_url: originalUrl,
        status: "private",
        text,
        title,
      });
      const ascii = json.replaceAll(
        /[\u0080-\uFFFF]/g,
        (c) => String.raw`\u${c.codePointAt(0).toString(16).padStart(4, "0")}`,
      );
      const response = await GM.xmlHttpRequest({
        data: ascii,
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        url: "https://www.lingq.com/api/v3/fr/lessons/",
      });

      if (response.status >= 200 && response.status < 300) {
        const { id } = JSON.parse(response.responseText);
        lingqButton.textContent = "Sent";
        disableButton(lingqButton);
        openButton.style.display = "";
        openButton.addEventListener("click", () => {
          window.open(
            `https://www.lingq.com/en/learn/fr/web/reader/${id}`,
            "_blank",
          );
        });
      } else if (response.status === 401) {
        await GM.setValue("lingq_token", "");
        lingqButton.textContent = "Bad token (cleared)";
      } else {
        lingqButton.textContent = "Error";
      }
    } catch {
      lingqButton.textContent = "Network error";
    }
  };

  lingqButton.addEventListener("click", async () => {
    const token = await GM.getValue("lingq_token", "");
    if (!token) {
      tokenInput.style.display = "";
      tokenSave.style.display = "";
      tokenInput.focus();
      return;
    }
    await sendToLingQ(token);
  });

  tokenSave.addEventListener("click", async () => {
    const token = tokenInput.value.trim();
    if (!token) {
      return;
    }
    tokenInput.style.display = "none";
    tokenSave.style.display = "none";
    await GM.setValue("lingq_token", token);
    await sendToLingQ(token);
  });

  tokenInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      tokenSave.click();
    }
  });
})();
