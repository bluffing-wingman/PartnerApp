// === State ===
let currentScreen = 'home';
let currentQuestion = 0;
let quizPassed = localStorage.getItem('wiom_quiz_passed') === 'true';
let answered = false;
let redirectTimer = null;

// === DOM refs ===
const screens = {
  home: document.getElementById('screen-home'),
  quiz: document.getElementById('screen-quiz'),
  success: document.getElementById('screen-success')
};
const overlay = document.getElementById('popup-overlay');
const progressFill = document.getElementById('progress-fill');
const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackBox = document.getElementById('feedback-box');
const actionBox = document.getElementById('action-box');
const restartToast = document.getElementById('restart-toast');

// === Navigation ===
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  currentScreen = name;
}

// === Init ===
function init() {
  showScreen('home');
  if (!quizPassed) {
    setTimeout(() => overlay.classList.add('active'), 400);
  }
}

// === Popup actions ===
document.getElementById('btn-agree').addEventListener('click', () => {
  overlay.classList.remove('active');
  startQuiz();
});


// === Quiz ===
function startQuiz() {
  currentQuestion = 0;
  answered = false;
  showScreen('quiz');
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const q = quizData[currentQuestion];
  const total = quizData.length;

  questionCounter.textContent = `${currentQuestion + 1}/${total}`;
  progressFill.style.width = `${((currentQuestion + 1) / total) * 100}%`;
  questionText.textContent = q.question;

  feedbackBox.className = 'quiz-feedback';
  feedbackBox.style.display = 'none';
  actionBox.className = 'quiz-action';
  actionBox.style.display = 'none';

  const letters = ['A', 'B', 'C', 'D'];
  optionsContainer.innerHTML = q.options.map((opt, i) => `
    <div class="option-card" data-index="${i}" onclick="selectOption(${i})">
      <div class="option-letter">${letters[i]}</div>
      <div class="option-text">${opt}</div>
    </div>
  `).join('');
}

function selectOption(index) {
  if (answered) return;
  answered = true;

  const q = quizData[currentQuestion];
  const cards = optionsContainer.querySelectorAll('.option-card');
  const isCorrect = index === q.correct;

  // Disable all cards
  cards.forEach(c => c.classList.add('disabled'));

  // Highlight selected
  if (isCorrect) {
    cards[index].classList.add('correct');
  } else {
    cards[index].classList.add('wrong');
    cards[q.correct].classList.add('correct');
  }

  // Show feedback
  feedbackBox.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'} show`;
  feedbackBox.innerHTML = isCorrect
    ? `<span class="feedback-icon">&#10003;</span> सही जवाब! ${q.explanation}`
    : `<span class="feedback-icon">&#10007;</span> गलत जवाब। ${q.explanation}`;
  feedbackBox.style.display = 'block';

  // Show action button
  actionBox.style.display = 'block';
  actionBox.className = 'quiz-action show';

  if (isCorrect) {
    if (currentQuestion < quizData.length - 1) {
      actionBox.innerHTML = `<button class="btn-next" onclick="nextQuestion()">अगला सवाल &rarr;</button>`;
    } else {
      actionBox.innerHTML = `<button class="btn-next" onclick="quizComplete()">पूरा हुआ &#10003;</button>`;
    }
  } else {
    actionBox.innerHTML = `<button class="btn-restart" onclick="restartQuiz()">फिर से शुरू करें</button>`;
  }
}

function nextQuestion() {
  currentQuestion++;
  renderQuestion();
}

function restartQuiz() {
  currentQuestion = 0;
  renderQuestion();

  // Show toast
  restartToast.classList.add('show');
  setTimeout(() => restartToast.classList.remove('show'), 2500);
}

function quizComplete() {
  quizPassed = true;
  localStorage.setItem('wiom_quiz_passed', 'true');
  showScreen('success');

  // Auto-redirect after 3s
  redirectTimer = setTimeout(() => {
    showScreen('home');
  }, 3000);
}

// === Success tap to go home ===
document.getElementById('success-tap-btn').addEventListener('click', () => {
  if (redirectTimer) clearTimeout(redirectTimer);
  showScreen('home');
});

// === Quiz back button ===
document.getElementById('quiz-back-btn').addEventListener('click', () => {
  showScreen('home');
  if (!quizPassed) {
    setTimeout(() => overlay.classList.add('active'), 300);
  }
});

// === Start ===
init();
