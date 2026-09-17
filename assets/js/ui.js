window.XSSLab = window.XSSLab || {};

(function (Lab) {
  const escapeHTML = (value) => value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

  const highlight = (source) => {
    let html = escapeHTML(source);

    html = html.replace(
      /(\/\/.*$|<!--.*?-->)/gm,
      '<span class="syntax-comment">$1</span>'
    );

    html = html.replace(
      /(["'`])(?:\\.|(?!\1).)*\1/g,
      '<span class="syntax-string">$&</span>'
    );

    html = html.replace(
      /\b(const|let|var|function|return|new|if|else|true|false)\b/g,
      '<span class="syntax-keyword">$1</span>'
    );

    html = html.replace(
      /\b(document|location|URLSearchParams|innerHTML|textContent|createElement|append|querySelector|setAttribute)\b/g,
      '<span class="syntax-function">$1</span>'
    );

    return html;
  };

  const renderCode = (pre) => {
    const source = pre.dataset.code || "";
    pre.innerHTML = highlight(source);

    const lineNumbers = document.querySelector(
      `[data-lines-for="${pre.id}"]`
    );

    if (!lineNumbers) return;

    lineNumbers.innerHTML = Array.from(
      { length: source.split("\n").length },
      (_, index) => index + 1
    ).join("<br>");
  };

  const toast = (message) => {
    const element = document.createElement("div");
    element.textContent = message;
    element.className = "toast";
    element.style.cssText =
      "position:fixed;right:18px;bottom:18px;z-index:80;" +
      "padding:10px 14px;border:1px solid #53ff88;border-radius:7px;" +
      "background:#0b1712;color:#bfffd0;";

    document.body.append(element);
    window.setTimeout(() => element.remove(), 1500);
  };

  Lab.ui = {
    escapeHTML,
    highlight,
    renderCode,
    toast
  };
})(XSSLab);
