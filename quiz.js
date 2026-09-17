window.XSSLab = window.XSSLab || {};

(function (Lab) {
  Lab.initQuiz = () => {
    const box = document.querySelector("#quizbox");

    box.innerHTML = Lab.quiz.map((item, index) => `
      <article class="quiz-question">
        <h3>${index + 1}. ${Lab.ui.escapeHTML(item.question)}</h3>
        ${item.options.map((option, optionIndex) => `
          <label class="quiz-option">
            <input type="radio" name="question-${index}" value="${optionIndex}">
            ${Lab.ui.escapeHTML(option)}
          </label>
        `).join("")}
      </article>
    `).join("") + `
      <button class="quiz-submit" id="quiz-submit">Check answers</button>
      <div id="quiz-result" class="quiz-result" hidden></div>
    `;

    document.querySelector("#quiz-submit").addEventListener("click", () => {
      let score = 0;

      Lab.quiz.forEach((item, questionIndex) => {
        const selected = document.querySelector(
          `input[name="question-${questionIndex}"]:checked`
        );

        if (selected && Number(selected.value) === item.answer) {
          score += 1;
        }
      });

      const result = document.querySelector("#quiz-result");
      result.hidden = false;
      result.textContent = `Score: ${score}/${Lab.quiz.length}. ` +
        (score === Lab.quiz.length
          ? "Excellent — you nailed the defender basics."
          : "Review the modules and try again.");
    });
  };
})(XSSLab);
