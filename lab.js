window.XSSLab = window.XSSLab || {};

(function (Lab) {
  const challenges = {
    reflect: {
      brief: "Challenge 01: A fictional search page displays user input. Compare an HTML-parsing sink with a text-only sink.",
      input: "Hello, defender!",
      lesson: "If the value is plain text, keep it as text. If HTML is genuinely required, use the correct context-aware controls.",
      render(value) {
        return `<!doctype html>
<body style="font:16px sans-serif;padding:20px">
  <h2>Fictional Search</h2>
  <p id="out"></p>
  <script>
    document.getElementById("out").textContent = ${JSON.stringify(value)};
  <\/script>
</body>`;
      }
    },

    dom: {
      brief: "Challenge 02: Trace a fictional URL value to a DOM sink. The defensive pattern keeps the value as text.",
      input: "search term",
      lesson: "DOM-based XSS is about client-side data flow. Prefer textContent or DOM construction when the value is text.",
      render(value) {
        return `<!doctype html>
<body style="font:16px sans-serif;padding:20px">
  <h2>Fictional DOM Lab</h2>
  <div id="out"></div>
  <script>
    const q = ${JSON.stringify(value)};
    document.getElementById("out").textContent = q;
  <\/script>
</body>`;
      }
    },

    fix: {
      brief: "Challenge 03: Choose a fix for a fictional comment box. Match the control to the product requirement.",
      input: "A user comment",
      lesson: "For plain-text comments, textContent is appropriate. For genuine rich HTML, use a maintained sanitizer with a narrow allowlist.",
      render(value) {
        return `<!doctype html>
<body style="font:16px sans-serif;padding:20px">
  <h2>Fix Selection</h2>
  <p>Comment:</p>
  <div id="out"></div>
  <p>Chosen defense: <b>textContent</b></p>
  <script>
    document.getElementById("out").textContent = ${JSON.stringify(value)};
  <\/script>
</body>`;
      }
    }
  };

  let elements = {};

  const loadChallenge = () => {
    const challenge = challenges[elements.select.value];

    elements.brief.textContent = challenge.brief;
    elements.input.value = challenge.input;
    elements.lesson.textContent = challenge.lesson;
    elements.feedback.textContent = "Ready. Nothing leaves this browser.";
    elements.feedback.className = "feedback";
    elements.frame.srcdoc = "";
  };

  const run = () => {
    const challenge = challenges[elements.select.value];

    // Deliberately no allow-same-origin, allow-forms, popups, or external URL input.
    elements.frame.srcdoc = challenge.render(elements.input.value);
    elements.feedback.textContent =
      "Rendered only inside the isolated educational frame. No external request was made.";
    elements.feedback.className = "feedback success";
  };

  Lab.initLab = () => {
    elements = {
      select: document.querySelector("#challenge"),
      input: document.querySelector("#input"),
      brief: document.querySelector("#lab-brief"),
      lesson: document.querySelector("#lab-lesson"),
      feedback: document.querySelector("#labresult"),
      frame: document.querySelector("#frame")
    };

    elements.select.addEventListener("change", loadChallenge);
    document.querySelector("#run-lab").addEventListener("click", run);
    document.querySelector("#reset-lab").addEventListener("click", loadChallenge);

    loadChallenge();
  };
})(XSSLab);
