// === State ===
let currentQuestion = 0;
let quizPassed = localStorage.getItem('wiom_quiz_passed') === 'true';
let answered = false;

// === DOM refs ===
const modalOverlay = document.getElementById('modal-overlay');
const stepIntro = document.getElementById('step-intro');
const stepQuiz = document.getElementById('step-quiz');
const stepSuccess = document.getElementById('step-success');
const progressFill = document.getElementById('progress-fill');
const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackBox = document.getElementById('feedback-box');
const actionBox = document.getElementById('action-box');
const restartToast = document.getElementById('restart-toast');

// === Modal step switching ===
function showStep(step) {
  stepIntro.style.display = 'none';
  stepQuiz.style.display = 'none';
  stepSuccess.style.display = 'none';
  step.style.display = 'flex';
}

// === Init ===
function init() {
  if (!quizPassed) {
    modalOverlay.classList.add('active');
    showStep(stepIntro);
  }
}

// === Start quiz from intro ===
document.getElementById('btn-start-quiz').addEventListener('click', () => {
  currentQuestion = 0;
  answered = false;
  showStep(stepQuiz);
  renderQuestion();
});

// === Quiz rendering ===
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

  // Scroll quiz content to top
  stepQuiz.querySelector('.quiz-content').scrollTop = 0;
}

function selectOption(index) {
  if (answered) return;
  answered = true;

  const q = quizData[currentQuestion];
  const cards = optionsContainer.querySelectorAll('.option-card');
  const isCorrect = index === q.correct;

  // Disable all cards
  cards.forEach(c => c.classList.add('disabled'));

  // Highlight selected card only
  if (isCorrect) {
    cards[index].classList.add('correct');
  } else {
    // Only highlight the wrong selection — do NOT reveal the correct one
    cards[index].classList.add('wrong');
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
  showStep(stepSuccess);
}

// === Close modal from success screen ===
document.getElementById('btn-close-modal').addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

// === Start ===
init();
