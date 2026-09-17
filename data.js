window.XSSLab = window.XSSLab || {};

XSSLab.modules = [
  ["home", "Home"],
  ["what", "What Is XSS?"],
  ["works", "How XSS Works"],
  ["reflected", "Reflected XSS"],
  ["stored", "Stored XSS"],
  ["dom", "DOM-Based XSS"],
  ["contexts", "XSS Contexts"],
  ["detect", "Detection"],
  ["prevent", "Prevention"],
  ["csp", "CSP"],
  ["encode", "Encoding"],
  ["secure", "Secure Coding"],
  ["practice", "Practice Lab"],
  ["glossary", "Glossary"],
  ["quiz", "Quiz"]
];

XSSLab.glossary = [
  ["XSS", "Cross-Site Scripting: untrusted data reaches a browser in an active context."],
  ["DOM", "The browser's structured representation of a document."],
  ["Source", "Where untrusted data originates."],
  ["Sink", "Where data is consumed; some sinks interpret HTML or code."],
  ["Context", "The exact grammar where data lands: HTML, attribute, URL, CSS, JavaScript, or DOM."],
  ["Encoding", "Representing characters safely for a specific output context."],
  ["Sanitization", "Parsing HTML and removing content outside an allowed policy."],
  ["CSP", "Content Security Policy: a browser-enforced defense-in-depth control."],
  ["textContent", "A DOM API that treats assigned content as text."],
  ["innerHTML", "An HTML-parsing DOM API that needs careful handling."],
  ["Reflected XSS", "Request data is immediately reflected into a response."],
  ["Stored XSS", "Untrusted content is persisted and later rendered unsafely."],
  ["DOM-Based XSS", "Client-side data reaches an unsafe DOM sink."],
  ["Output encoding", "Encoding performed for the context where data is rendered."]
];

XSSLab.quiz = [
  {
    question: "Which API keeps a string as text?",
    options: ["innerHTML", "textContent", "outerHTML", "insertAdjacentHTML"],
    answer: 1
  },
  {
    question: "What determines the encoding approach?",
    options: ["The exact output context", "The database", "The browser theme", "Nothing"],
    answer: 0
  },
  {
    question: "What is CSP?",
    options: ["A replacement for secure coding", "Defense in depth", "A sanitizer", "A password control"],
    answer: 1
  },
  {
    question: "When is sanitization especially useful?",
    options: ["When limited rich HTML is required", "For every text field", "For passwords", "Never"],
    answer: 0
  }
];
