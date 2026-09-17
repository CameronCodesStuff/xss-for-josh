window.XSSLab = window.XSSLab || {};

(function (Lab) {
  const state = {
    current: localStorage.getItem("xssCurrent") || "home",
    learned: JSON.parse(localStorage.getItem("xssLearned") || "[]"),
    adhd: localStorage.getItem("xssADHD") === "1",
    reducedMotion: localStorage.getItem("xssMotion") === "1"
  };

  const $ = (selector) => document.querySelector(selector);

  const pages = {
    home: () => `
      <div class="eyebrow">01 · HOME</div>
      <h1>WELCOME TO <span>XSS LAB</span></h1>
      <p class="lead">Learn. Practice. Protect.</p>
      <p>XSS is a web security bug where untrusted data is interpreted by a browser as active markup or code. This course teaches the browser model, common XSS types, defensive coding, and responsible testing.</p>

      <div class="panel flow-panel">
        <div class="panel-heading">THE XSS FLOW</div>
        <div class="flow">
          ${[
            ["01", "User Input", "Untrusted data enters."],
            ["02", "Web Application", "Data is processed."],
            ["03", "HTML / DOM", "Data reaches a page."],
            ["04", "Browser", "The document is parsed."],
            ["05", "Unexpected Code", "Unsafe interpretation occurs."]
          ].map(([number, title, description], index) => `
            ${index ? "<i>→</i>" : ""}
            <div class="flow-node ${index === 4 ? "danger" : ""}">
              <b>${number}</b>
              <strong>${title}</strong>
              <small>${description}</small>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="code-grid">
        ${codeCard("unsafe", "❌ VULNERABLE CODE", "bad", `const output = document.querySelector('#output');
output.innerHTML = userInput;

// HTML is parsed here.`)}
        ${codeCard("safe", "✅ SECURE CODE", "good", `const output = document.querySelector('#output');
output.textContent = userInput;

// The value stays text.`)}
      </div>

      <div class="callout tldr">
        <b>TL;DR</b>
        <span>If you need text, use <code>textContent</code>. Treat external data as untrusted.</span>
      </div>

      <div class="feature-grid">
        ${feature("⌁", "Interactive Lab", "Safe, local challenges.", "practice", "purple")}
        ${feature("◉", "Visual Learning", "See the browser flow.", "works", "cyan")}
        ${feature("🏆", "Practice Quiz", "Check your understanding.", "quiz", "yellow")}
        ${feature("🛡", "Think Like a Defender", "Find, fix, verify.", "defender", "green")}
      </div>
    `,

    what: () => simpleLesson("02 · WHAT IS XSS?", "Cross-Site Scripting", `
      <p>The core problem is a broken boundary between <b>data</b> and <b>code</b>. A browser follows the grammar of the context it receives.</p>
      <div class="info-grid">
        ${info("SOURCE", "Where data begins", "Forms, URLs, APIs, databases, messages and other users.", "cyan")}
        ${info("TRANSFORM", "What the app does", "Templating, storage, string building and client-side processing.", "purple")}
        ${info("SINK", "Where data lands", "The point where data is consumed; some sinks interpret HTML or code.", "red")}
        ${info("CONTEXT", "The surrounding grammar", "HTML, attributes, URLs, CSS, JavaScript and DOM APIs.", "green")}
      </div>
      ${details("Wait, what?", "If someone types a name, the app should treat it as a name. Problems occur when the browser is accidentally asked to treat that data as instructions.")}
    `),

    works: () => simpleLesson("03 · HOW XSS WORKS", "How browsers process HTML and JavaScript", `
      <div class="timeline">
        ${[
          ["1", "Receive HTML", "The browser gets a response."],
          ["2", "Parse HTML", "Markup becomes a DOM tree."],
          ["3", "Load resources", "Allowed resources can load."],
          ["4", "Run permitted script", "Browser policy and script rules apply."],
          ["5", "Update DOM", "JavaScript can modify the document."]
        ].map(([n, title, text]) => `<article><b>${n}</b><strong>${title}</strong><small>${text}</small></article>`).join("")}
      </div>
      <div class="callout tldr"><b>SAFE PATH</b><span>User input → <code>textContent</code> → text node → visible text.</span></div>
      ${details("Technical explanation", "Browsers use multiple parsers and contexts. An encoding suitable for HTML text is not automatically suitable inside JavaScript, CSS, URL, or attribute syntax. Choose the control for the output context.")}
    `),

    reflected: () => simpleLesson("04 · REFLECTED XSS", "Reflected XSS", `
      <p>Request data is immediately included in a response. If the output context is unsafe, the browser may interpret it as active content.</p>
      ${codeCard("reflected-bad", "❌ UNSAFE SERVER OUTPUT", "bad", `<h1>Results for: <%= query %></h1>`)}
      ${codeCard("reflected-good", "✅ DEFENSIVE PATTERN", "good", `<h1>Results for: <%= htmlEncode(query) %></h1>
<!-- Prefer framework auto-escaping. -->`)}
      ${details("Why?", "Use context-aware output encoding or a framework's safe auto-escaping. HTML encoding is not a universal encoder for every context.")}
    `),

    stored: () => simpleLesson("05 · STORED XSS", "Stored XSS", `
      <p>Untrusted content is persisted and later rendered to users. Storing something does not make it trusted.</p>
      <div class="attack-map"><span>Untrusted post</span><b>→</b><span>Storage</span><b>→</b><span>Later page view</span><b>→</b><span class="danger">Unsafe sink</span></div>
      <ul class="checklist"><li>Validate expected types and lengths.</li><li>Keep stored content as data.</li><li>Encode for the output context.</li><li>If rich HTML is required, sanitize with a maintained narrow allowlist.</li></ul>
    `),

    dom: () => simpleLesson("06 · DOM-BASED XSS", "Client-side data flow", `
      <p>DOM-based XSS occurs when client-side code reads untrusted data and sends it to an unsafe DOM sink.</p>
      <div class="code-grid">
        ${codeCard("dom-bad", "❌ UNSAFE SINK", "bad", `const q = new URLSearchParams(location.search).get('q');
document.querySelector('#results').innerHTML = q;`)}
        ${codeCard("dom-good", "✅ SAFE SINK", "good", `const q = new URLSearchParams(location.search).get('q');
document.querySelector('#results').textContent = q;`)}
      </div>
      <div class="data-table"><div><b>DANGEROUS SINKS</b><span><code>innerHTML</code>, <code>outerHTML</code>, <code>insertAdjacentHTML()</code>.</span></div><div><b>SAFER ALTERNATIVES</b><span><code>textContent</code>, <code>createElement()</code>, explicit DOM properties.</span></div></div>
    `),

    contexts: () => simpleLesson("07 · XSS CONTEXTS", "Context changes the defense", `
      <p>There is no universal escape function. Pick the control for the exact place where data lands.</p>
      <div class="context-grid">
        ${[
          ["HTML text", "Use HTML-text encoding or auto-escaping."],
          ["HTML attribute", "Use attribute-aware encoding and controlled attribute names."],
          ["URL", "Validate scheme/URL and encode where required."],
          ["JavaScript", "Avoid injecting untrusted strings into executable JS."],
          ["CSS", "Avoid injecting untrusted CSS; use typed properties."],
          ["DOM", "Prefer safe DOM APIs or a maintained sanitizer when HTML is required."]
        ].map(([title, text]) => `<article><b>${title}</b><span>${text}</span></article>`).join("")}
      </div>
    `),

    detect: () => simpleLesson("08 · DETECTION", "Trace sources to sinks", `
      <p>Responsible testing starts with an application you own or have explicit permission to assess.</p>
      <div class="detect-grid">${["Inventory inputs", "Trace data flow", "Identify sinks", "Confirm safely", "Fix and retest"].map((title, i) => `<article><b>0${i + 1}</b><strong>${title}</strong><small>Document the data path.</small></article>`).join("")}</div>
      ${details("Developer review checklist", "Is templating auto-escaped? Are HTML parsing sinks necessary? Are rich-text requirements sanitized? Are URL schemes validated? Does CSP provide defense in depth?")}
    `),

    prevent: () => simpleLesson("09 · PREVENTION", "Layered defense", `
      <div class="layer-stack">${[
        ["1", "Safe APIs", "Keep strings as strings."],
        ["2", "Contextual encoding", "Encode for the exact output grammar."],
        ["3", "Sanitization", "Use only when limited rich HTML is required."],
        ["4", "CSP", "Reduce the impact of injection mistakes."],
        ["5", "Secure process", "Review, test, patch and monitor."]
      ].map(([n, title, text]) => `<div><b>${n}</b><strong>${title}</strong><span>${text}</span></div>`).join("")}</div>
      <div class="callout warning"><b>IMPORTANT</b><span>CSP is defense in depth, not a replacement for fixing unsafe output.</span></div>
    `),

    csp: () => simpleLesson("10 · CSP", "Content Security Policy", `
      <p>CSP is a browser-enforced defense-in-depth control that can restrict script sources and inline behavior.</p>
      ${codeCard("csp", "EXAMPLE POLICY", "good", `Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-RANDOM_PER_RESPONSE';
  object-src 'none';
  base-uri 'none';
  frame-ancestors 'none';`)}
      <div class="callout warning"><b>NONCE NOTE</b><span>Generate unpredictable nonces freshly for each response. Avoid <code>unsafe-inline</code> where practical.</span></div>
    `),

    encode: () => simpleLesson("11 · ENCODING", "Encoding vs sanitization", `
      <div class="info-grid">${
        info("ENCODING", "Represent data safely", "Changes characters so they are represented safely for a specific output context.", "green") +
        info("SANITIZATION", "Filter permitted HTML", "Parses HTML and removes or changes content outside an allowed policy.", "purple")
      }</div>
      <div class="callout tldr"><b>RULE</b><span>Match the control to the context and the product requirement.</span></div>
    `),

    secure: () => simpleLesson("12 · SECURE CODING", "Common developer mistakes", `
      <div class="mistake-grid">${[
        ["innerHTML by default", "Use textContent when you need text."],
        ["String-built HTML", "Use createElement and explicit properties."],
        ["Wrong encoder", "Encoding must match context."],
        ["Trusting stored data", "Storage is not proof of safety."],
        ["Over-relying on CSP", "Fix the root cause too."],
        ["Outdated sanitizer", "Keep security-sensitive dependencies updated."]
      ].map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>
      ${codeCard("construction", "DOM CONSTRUCTION", "good", `const item = document.createElement('li');
item.textContent = userName;
list.append(item);`)}
    `),

    practice: () => `
      <div class="eyebrow">13 · PRACTICE LAB</div>
      <h2>Safe XSS Sandbox</h2>
      <p>This fictional Lab is local-only. It does not accept arbitrary external URLs, make network requests, or access the parent page's cookies, storage, authentication or DOM.</p>
      <div class="lab-safety"><b>🛡 ISOLATION</b><span>sandbox="allow-scripts" without allow-same-origin. The preview is intentionally separated from XSS Lab.</span></div>
      <div class="lab-controls">
        <label>Challenge<select id="challenge"><option value="reflect">01 — Reflected output</option><option value="dom">02 — DOM sink</option><option value="fix">03 — Choose the fix</option></select></label>
        <button id="run-lab" class="primary-button">Run in isolated sandbox</button>
        <button id="reset-lab" class="secondary-button">Reset</button>
      </div>
      <div id="lab-brief" class="scenario"></div>
      <div class="lab-grid">
        <article class="code-card"><div class="code-toolbar"><span>YOUR LOCAL INPUT</span><button id="lab-copy">Copy</button></div><textarea id="input" spellcheck="false" aria-label="Lab input"></textarea></article>
        <article class="sandbox-card"><div class="code-toolbar"><span>ISOLATED PREVIEW</span><span class="status">● LOCAL ONLY</span></div><iframe id="frame" sandbox="allow-scripts" title="Isolated XSS lab"></iframe></article>
      </div>
      <div id="labresult" class="feedback"></div>
      <details class="details-card"><summary>What is the lesson?</summary><p id="lablesson"></p></details>
    `,

    glossary: () => `
      <div class="eyebrow">14 · GLOSSARY</div>
      <h2>Searchable glossary</h2>
      <input id="gsearch" class="wide-input" type="search" placeholder="Search terms…" aria-label="Search glossary">
      <div id="terms" class="glossary-grid"></div>
    `,

    quiz: () => `
      <div class="eyebrow">15 · QUIZ</div>
      <h2>Defender quiz</h2>
      <div id="quizbox"></div>
    `,

    defender: () => simpleLesson("BONUS · DEFENDER MINDSET", "Think Like a Defender 🛡️", `
      <div class="defender-flow"><span>FIND</span><b>→</b><span>UNDERSTAND</span><b>→</b><span>FIX</span><b>→</b><span>VERIFY</span></div>
      <p>Understanding XSS helps defenders recognize where data crosses into executable contexts. Identify unsafe flows responsibly, communicate risk clearly, fix the root cause, and verify the fix in an authorized environment.</p>
      <div class="feature-grid">
        ${feature("🔎", "Find", "Trace untrusted sources to sinks.", null, "cyan")}
        ${feature("🧠", "Understand", "Identify the browser context.", null, "purple")}
        ${feature("🛠", "Fix", "Use safe APIs and context-aware controls.", null, "green")}
        ${feature("🛡", "Verify", "Retest in an authorized environment.", null, "yellow")}
      </div>
      <div class="callout warning"><b>ETHICAL USE</b><span>Only test systems you own or have explicit permission to assess.</span></div>
    `)
  };

  function simpleLesson(eyebrow, title, body) {
    return `<div class="eyebrow">${eyebrow}</div><h2>${title}</h2>${body}`;
  }

  function info(label, title, text, tone) {
    return `<article class="info-card"><span class="card-label ${tone}">${label}</span><h3>${title}</h3><p>${text}</p></article>`;
  }

  function details(title, text) {
    return `<details class="details-card"><summary>${title}</summary><p>${text}</p></details>`;
  }

  function feature(icon, title, text, section, tone) {
    const tag = section
      ? `<button class="feature-card" data-section="${section}">`
      : `<article class="feature-card">`;
    const end = section ? "</button>" : "</article>";
    return `${tag}<span class="feature-icon ${tone}">${icon}</span><strong>${title}</strong><small>${text}</small>${end}`;
  }

  function codeCard(id, title, tone, source) {
    return `
      <article class="code-card ${tone}" data-code-card="${id}">
        <div class="code-toolbar">
          <span>${title}</span>
          <div class="code-actions">
            <button data-copy-code="${id}">Copy</button>
            <button data-reset-code="${id}">Reset</button>
            <button data-expand-code="${id}">Expand</button>
          </div>
        </div>
        <div class="code-window">
          <div class="line-numbers" data-lines-for="${id}"></div>
          <pre id="${id}" data-code="${Lab.ui.escapeHTML(source)}"></pre>
        </div>
      </article>`;
  }

  const renderCodeBlocks = () => {
    document.querySelectorAll("pre[data-code]").forEach(Lab.ui.renderCode);
  };

  const save = () => {
    localStorage.setItem("xssCurrent", state.current);
    localStorage.setItem("xssLearned", JSON.stringify(state.learned));
    localStorage.setItem("xssADHD", state.adhd ? "1" : "0");
    localStorage.setItem("xssMotion", state.reducedMotion ? "1" : "0");
  };

  const updateProgress = () => {
    const completed = state.learned.length;
    $("#progress-bar").style.width = `${(completed / Lab.modules.length) * 100}%`;
    $("#progress-text").textContent = `${completed} / ${Lab.modules.length} modules completed`;
    $("#progress-message").textContent = completed === 0
      ? "Start with the basics."
      : completed === Lab.modules.length
        ? "Course complete — defender mindset unlocked."
        : "Keep going — build the data/code boundary habit.";

    const learned = state.learned.includes(state.current);
    $("#mark-learned").classList.toggle("learned", learned);
    $("#mark-learned").textContent = learned
      ? "✓ Learned"
      : "✓ Mark current module learned";
  };

  const updateRecent = () => {
    $("#recent-list").innerHTML = Lab.modules.slice(0, 8).map(([id, title]) => `
      <div class="recent-item ${id === state.current ? "active" : ""}">
        ${state.learned.includes(id) ? "✓" : "•"} ${Lab.ui.escapeHTML(title)}
      </div>
    `).join("");
  };

  const show = (id) => {
    if (!pages[id]) id = "home";

    state.current = id;
    save();
    $("#main").innerHTML = pages[id]();

    document.querySelectorAll(".course-btn").forEach((button) => {
      const active = button.dataset.id === id;
      const done = state.learned.includes(button.dataset.id);
      button.classList.toggle("active", active);
      button.classList.toggle("done", done);
      button.querySelector(".check").textContent = done ? "✓" : "";
    });

    renderCodeBlocks();
    updateProgress();
    updateRecent();

    if (id === "practice") Lab.initLab();
    if (id === "glossary") initGlossary();
    if (id === "quiz") Lab.initQuiz();

    window.scrollTo({
      top: 0,
      behavior: state.reducedMotion ? "auto" : "smooth"
    });

    $("#main").focus({ preventScroll: true });
    $("#sidebar").classList.remove("open");
  };

  const renderNavigation = () => {
    $("#course-nav").innerHTML = Lab.modules.map(([id, title], index) => `
      <button class="course-btn" data-id="${id}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <span>${Lab.ui.escapeHTML(title)}</span>
        <span class="check" aria-hidden="true"></span>
      </button>
    `).join("");
  };

  const initGlossary = () => {
    const input = $("#gsearch");
    const list = $("#terms");

    const render = (query = "") => {
      const value = query.toLowerCase();
      const matches = Lab.glossary.filter(([term, definition]) =>
        `${term} ${definition}`.toLowerCase().includes(value)
      );

      list.innerHTML = matches.length
        ? matches.map(([term, definition]) => `
            <article>
              <b>${Lab.ui.escapeHTML(term)}</b>
              <p>${Lab.ui.escapeHTML(definition)}</p>
            </article>
          `).join("")
        : "<p>No matches.</p>";
    };

    render();
    input.addEventListener("input", () => render(input.value));
  };

  const initSearch = () => {
    const input = $("#search-input");
    const results = $("#search-results");
    const items = [
      ...Lab.modules.map(([id, title]) => ({ id, title, text: title })),
      { id: "defender", title: "Think Like a Defender", text: "responsible security" },
      ...Lab.glossary.map(([term, definition]) => ({ id: "glossary", title: term, text: definition }))
    ];

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();

      if (!query) {
        results.hidden = true;
        return;
      }

      const matches = items.filter((item) =>
        `${item.title} ${item.text}`.toLowerCase().includes(query)
      ).slice(0, 8);

      results.innerHTML = matches.length
        ? matches.map((item) => `
            <button class="search-result" data-section="${item.id}">
              <b>${Lab.ui.escapeHTML(item.title)}</b><br>
              <small>${Lab.ui.escapeHTML(item.text.slice(0, 100))}</small>
            </button>
          `).join("")
        : `<div class="search-result">No matches.</div>`;

      results.hidden = false;
    });

    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const first = results.querySelector("[data-section]");
      if (!first) return;
      show(first.dataset.section);
      results.hidden = true;
      input.blur();
    });
  };

  const toggleADHD = () => {
    state.adhd = !state.adhd;
    document.body.classList.toggle("adhd-mode", state.adhd);
    $("#adhd-toggle").setAttribute("aria-pressed", String(state.adhd));
    $("#adhd-sidebar-toggle").textContent = state.adhd
      ? "Return to normal technical mode"
      : "Enable ADHD Mode";
    save();
  };

  const initSettings = () => {
    document.body.classList.toggle("adhd-mode", state.adhd);
    document.body.classList.toggle("reduced-motion", state.reducedMotion);
    $("#adhd-toggle").setAttribute("aria-pressed", String(state.adhd));
    $("#adhd-sidebar-toggle").textContent = state.adhd
      ? "Return to normal technical mode"
      : "Enable ADHD Mode";

    $("#adhd-toggle").addEventListener("click", toggleADHD);
    $("#adhd-sidebar-toggle").addEventListener("click", toggleADHD);

    $("#motion-toggle").addEventListener("click", () => {
      state.reducedMotion = !state.reducedMotion;
      document.body.classList.toggle("reduced-motion", state.reducedMotion);
      save();
      Lab.ui.toast(state.reducedMotion ? "Reduced motion enabled." : "Reduced motion disabled.");
    });

    $("#menu-toggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
    $("#modal-close").addEventListener("click", () => $("#modal").hidden = true);

    $("#mark-learned").addEventListener("click", () => {
      if (state.learned.includes(state.current)) {
        state.learned = state.learned.filter((id) => id !== state.current);
      } else {
        state.learned.push(state.current);
      }
      save();
      updateProgress();
      updateRecent();
      Lab.ui.toast("Progress updated.");
    });
  };

  const initEvents = () => {
    document.addEventListener("click", (event) => {
      const section = event.target.closest("[data-section]");
      if (section) {
        show(section.dataset.section);
        return;
      }

      const navButton = event.target.closest(".course-btn");
      if (navButton) {
        show(navButton.dataset.id);
        return;
      }

      const copy = event.target.closest("[data-copy-code]");
      if (copy) {
        const pre = document.getElementById(copy.dataset.copyCode);
        navigator.clipboard?.writeText(pre.dataset.code || "");
        Lab.ui.toast("Copied to clipboard.");
        return;
      }

      const reset = event.target.closest("[data-reset-code]");
      if (reset) {
        const pre = document.getElementById(reset.dataset.resetCode);
        Lab.ui.renderCode(pre);
        Lab.ui.toast("Code reset.");
        return;
      }

      const expand = event.target.closest("[data-expand-code]");
      if (expand) {
        const pre = document.getElementById(expand.dataset.expandCode);
        pre.closest(".code-card").classList.toggle("expanded");
      }
    });

    document.addEventListener("keydown", (event) => {
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        $("#search-input").focus();
        return;
      }

      if (typing) return;
      if (event.key === "/") { event.preventDefault(); $("#search-input").focus(); }
      if (event.key.toLowerCase() === "l") show("practice");
      if (event.key.toLowerCase() === "m") toggleADHD();
      if (event.key === "?") $("#modal").hidden = false;
      if (event.key === "Escape") {
        $("#modal").hidden = true;
        $("#search-results").hidden = true;
        $("#sidebar").classList.remove("open");
      }
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    renderNavigation();
    initSearch();
    initSettings();
    initEvents();
    show(state.current);
  });
})(XSSLab);
