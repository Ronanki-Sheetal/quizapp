const questions = [
  {
    topic: "Basics",
    prompt: "What does this program print?",
    code: 'int score = 4;\nscore += 3;\nSystem.out.println(score);',
    options: ["3", "4", "7", "43"],
    answer: 2,
    explanation: "The += operator adds 3 to score, so the value printed is 7."
  },
  {
    topic: "Strings",
    prompt: "Which method tells you how many characters a String contains?",
    options: ["size()", "length()", "count()", "chars()"],
    answer: 1,
    explanation: "String's length() method returns the number of characters in the string."
  },
  {
    topic: "Types",
    prompt: "Which type is best suited for a true-or-false value?",
    options: ["int", "String", "boolean", "char"],
    answer: 2,
    explanation: "A boolean stores one of two values: true or false."
  },
  {
    topic: "Loops",
    prompt: "How many times does this loop run?",
    code: "for (int i = 0; i < 3; i++) {\n    System.out.println(i);\n}",
    options: ["2 times", "3 times", "4 times", "Forever"],
    answer: 1,
    explanation: "The loop runs for i = 0, 1, and 2. It stops when i reaches 3."
  },
  {
    topic: "Arrays",
    prompt: "What is the index of the first item in a Java array?",
    options: ["0", "1", "-1", "It depends"],
    answer: 0,
    explanation: "Java arrays are zero-indexed, so the first element is at index 0."
  },
  {
    topic: "Methods",
    prompt: "Which keyword sends a value back from a method?",
    options: ["break", "yield", "return", "static"],
    answer: 2,
    explanation: "A return statement ends the method and can pass a value back to its caller."
  },
  {
    topic: "Objects",
    prompt: "Which keyword creates a new object from a class?",
    options: ["this", "new", "class", "make"],
    answer: 1,
    explanation: "Use new with a constructor to create an object, for example: new Book()."
  },
  {
    topic: "Operators",
    prompt: "What is the result of 10 % 3 in Java?",
    options: ["1", "3", "3.33", "0"],
    answer: 0,
    explanation: "The % operator gives the remainder after division. 10 divided by 3 leaves 1."
  }
];

const questionCount = document.querySelector("#question-count");
const topicTag = document.querySelector("#topic-tag");
const quizProgressHeader = document.querySelector("#quiz-progress-header");
const progressTrack = document.querySelector("[role='progressbar']");
const progressFill = document.querySelector("#progress-fill");
const questionText = document.querySelector("#question-text");
const codeBlock = document.querySelector("#code-block");
const answers = document.querySelector("#answers");
const nextButton = document.querySelector("#next-button");
const nextLabel = document.querySelector("#next-label");
const questionView = document.querySelector("#question-view");
const resultsView = document.querySelector("#results-view");
const reviewView = document.querySelector("#review-view");
const scoreValue = document.querySelector("#score");
const answeredCount = document.querySelector("#answered-count");
const reviewCount = document.querySelector("#review-count");
const reviewQuestion = document.querySelector("#review-question");
const reviewCode = document.querySelector("#review-code");
const reviewAnswers = document.querySelector("#review-answers");
const reviewExplanation = document.querySelector("#review-explanation");
const reviewPrevious = document.querySelector("#review-previous");
const reviewNext = document.querySelector("#review-next");
const reviewNextLabel = document.querySelector("#review-next-label");

let currentIndex = 0;
let currentReviewIndex = 0;
let score = 0;
let selectedAnswers = Array(questions.length).fill(null);

function updateProgress() {
  const answered = selectedAnswers.filter((answer) => answer !== null).length;
  answeredCount.textContent = `${answered} / ${questions.length}`;
  progressTrack.setAttribute("aria-valuenow", String(answered));
  progressFill.style.width = `${(answered / questions.length) * 100}%`;
}

function renderQuestion() {
  const question = questions[currentIndex];
  const selectedAnswer = selectedAnswers[currentIndex];
  questionCount.innerHTML = `QUESTION ${String(currentIndex + 1).padStart(2, "0")} <span>/ ${String(questions.length).padStart(2, "0")}</span>`;
  topicTag.textContent = question.topic;
  questionText.textContent = question.prompt;
  codeBlock.hidden = !question.code;
  codeBlock.querySelector("code").textContent = question.code ?? "";
  answers.replaceChildren();
  nextButton.disabled = selectedAnswer === null;
  nextLabel.textContent = currentIndex === questions.length - 1 ? "Finish quiz" : "Next question";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    if (selectedAnswer === index) button.classList.add("is-selected");
    button.innerHTML = `<span class="answer-key">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.lastElementChild.textContent = option;
    button.addEventListener("click", () => selectAnswer(index));
    answers.append(button);
  });
}

function selectAnswer(selectedIndex) {
  selectedAnswers[currentIndex] = selectedIndex;
  answers.querySelectorAll("button").forEach((button, index) => {
    button.classList.toggle("is-selected", index === selectedIndex);
  });
  nextButton.disabled = false;
  updateProgress();
}

function showResults() {
  score = selectedAnswers.reduce((total, answer, index) => total + Number(answer === questions[index].answer), 0);
  const percentage = score / questions.length;
  const resultTitle = document.querySelector("#result-title");
  const resultCopy = document.querySelector("#result-copy");
  const resultIcon = document.querySelector("#result-icon");

  scoreValue.textContent = String(score);
  resultTitle.textContent = percentage === 1 ? "Flawless run." : percentage >= 0.5 ? "Nice work." : "Good start.";
  resultCopy.textContent = `You got ${score} out of ${questions.length} questions right. Your answers and explanations are ready to review.`;
  resultIcon.textContent = percentage >= 0.5 ? "✓" : "↗";
  questionView.hidden = true;
  reviewView.hidden = true;
  resultsView.hidden = false;
  quizProgressHeader.hidden = true;
  progressTrack.setAttribute("aria-valuenow", String(questions.length));
  progressFill.style.width = "100%";
}

function renderReviewQuestion() {
  const question = questions[currentReviewIndex];
  const selectedAnswer = selectedAnswers[currentReviewIndex];
  reviewCount.textContent = `${String(currentReviewIndex + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")} · ${question.topic}`;
  reviewQuestion.textContent = question.prompt;
  reviewCode.hidden = !question.code;
  reviewCode.querySelector("code").textContent = question.code ?? "";
  reviewAnswers.replaceChildren();

  question.options.forEach((option, index) => {
    const row = document.createElement("div");
    row.className = "review-answer";
    const key = document.createElement("span");
    key.className = "review-key";
    key.textContent = String.fromCharCode(65 + index);
    const label = document.createElement("span");
    label.className = "review-option-text";
    label.textContent = option;
    const status = document.createElement("span");
    status.className = "review-status";

    if (index === question.answer) {
      row.classList.add("is-correct");
      status.textContent = selectedAnswer === index ? "Your answer · Correct" : "Correct answer";
    } else if (index === selectedAnswer) {
      row.classList.add("is-wrong");
      status.textContent = "Your answer";
    }

    row.append(key, label, status);
    reviewAnswers.append(row);
  });

  reviewExplanation.innerHTML = `<strong>Why:</strong> ${question.explanation}`;
  reviewPrevious.disabled = currentReviewIndex === 0;
  reviewNextLabel.textContent = currentReviewIndex === questions.length - 1 ? "Back to results" : "Next question";
  reviewNext.setAttribute("aria-label", currentReviewIndex === questions.length - 1 ? "Back to results" : "Next question");
}

function showReview() {
  currentReviewIndex = 0;
  questionView.hidden = true;
  resultsView.hidden = true;
  reviewView.hidden = false;
  quizProgressHeader.hidden = true;
  renderReviewQuestion();
}

nextButton.addEventListener("click", () => {
  if (selectedAnswers[currentIndex] === null) return;
  if (currentIndex === questions.length - 1) {
    showResults();
    return;
  }

  currentIndex += 1;
  renderQuestion();
});

document.querySelector("#review-button").addEventListener("click", showReview);
reviewPrevious.addEventListener("click", () => {
  if (currentReviewIndex === 0) return;
  currentReviewIndex -= 1;
  renderReviewQuestion();
});
reviewNext.addEventListener("click", () => {
  if (currentReviewIndex === questions.length - 1) {
    resultsView.hidden = false;
    reviewView.hidden = true;
    return;
  }
  currentReviewIndex += 1;
  renderReviewQuestion();
});
document.querySelector("#review-back").addEventListener("click", () => {
  reviewView.hidden = true;
  resultsView.hidden = false;
});

document.querySelector("#restart-button").addEventListener("click", () => {
  currentIndex = 0;
  currentReviewIndex = 0;
  score = 0;
  selectedAnswers = Array(questions.length).fill(null);
  scoreValue.textContent = "—";
  questionView.hidden = false;
  resultsView.hidden = true;
  reviewView.hidden = true;
  quizProgressHeader.hidden = false;
  updateProgress();
  renderQuestion();
});

renderQuestion();