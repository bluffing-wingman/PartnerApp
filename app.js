// === Try loading admin overrides from localStorage ===
var adminConfig = null;
try {
  var raw = localStorage.getItem('wiom_config');
  if (raw) {
    var parsed = JSON.parse(raw);
    if (parsed && parsed.intro && Array.isArray(parsed.quiz) && parsed.quiz.length > 0 && parsed.success) {
      adminConfig = parsed;
    }
  }
} catch (e) { /* ignore */ }

// Quiz data: use admin override if available, otherwise use quizData from quiz-data.js
var activeQuizData = (adminConfig && adminConfig.quiz) || quizData;

// === Apply admin overrides to DOM (intro + success text) ===
if (adminConfig) {
  if (adminConfig.intro) {
    document.getElementById('intro-title').innerHTML = adminConfig.intro.title;
    document.getElementById('intro-body').innerHTML = adminConfig.intro.body;
    document.getElementById('btn-start-quiz').textContent = adminConfig.intro.cta;
  }
  if (adminConfig.success) {
    document.getElementById('success-title').innerHTML = adminConfig.success.title;
    document.getElementById('success-subtitle').innerHTML = adminConfig.success.subtitle;
    document.getElementById('success-payout').innerHTML = adminConfig.success.payout;
    document.getElementById('success-note').innerHTML = adminConfig.success.note;
    document.getElementById('btn-close-modal').textContent = adminConfig.success.cta;
  }
}

// === State ===
var currentQuestion = 0;
var quizPassed = localStorage.getItem('wiom_quiz_passed') === 'true';
var answered = false;

// === DOM refs ===
var modalOverlay = document.getElementById('modal-overlay');
var stepIntro = document.getElementById('step-intro');
var stepQuiz = document.getElementById('step-quiz');
var stepSuccess = document.getElementById('step-success');
var progressFill = document.getElementById('progress-fill');
var questionCounter = document.getElementById('question-counter');
var questionText = document.getElementById('question-text');
var optionsContainer = document.getElementById('options-container');
var feedbackBox = document.getElementById('feedback-box');
var actionBox = document.getElementById('action-box');
var restartToast = document.getElementById('restart-toast');

// === Modal step switching ===
function showStep(step) {
  stepIntro.style.display = 'none';
  stepQuiz.style.display = 'none';
  stepSuccess.style.display = 'none';
  step.style.display = 'flex';
}

// === Init ===
if (!quizPassed) {
  modalOverlay.classList.add('active');
  showStep(stepIntro);
}

// === Start quiz from intro ===
document.getElementById('btn-start-quiz').addEventListener('click', function() {
  currentQuestion = 0;
  answered = false;
  showStep(stepQuiz);
  renderQuestion();
});

// === Quiz rendering ===
function renderQuestion() {
  answered = false;
  var q = activeQuizData[currentQuestion];
  var total = activeQuizData.length;

  questionCounter.textContent = (currentQuestion + 1) + '/' + total;
  progressFill.style.width = (((currentQuestion + 1) / total) * 100) + '%';
  questionText.textContent = q.question;

  feedbackBox.className = 'quiz-feedback';
  feedbackBox.style.display = 'none';
  actionBox.className = 'quiz-action';
  actionBox.style.display = 'none';

  var letters = ['A', 'B', 'C', 'D'];
  optionsContainer.innerHTML = q.options.map(function(opt, i) {
    return '<div class="option-card" data-index="' + i + '" onclick="selectOption(' + i + ')">' +
      '<div class="option-letter">' + letters[i] + '</div>' +
      '<div class="option-text">' + opt + '</div>' +
    '</div>';
  }).join('');

  stepQuiz.querySelector('.quiz-content').scrollTop = 0;
}

function selectOption(index) {
  if (answered) return;
  answered = true;

  var q = activeQuizData[currentQuestion];
  var cards = optionsContainer.querySelectorAll('.option-card');
  var isCorrect = index === q.correct;

  cards.forEach(function(c) { c.classList.add('disabled'); });

  if (isCorrect) {
    cards[index].classList.add('correct');
  } else {
    cards[index].classList.add('wrong');
  }

  feedbackBox.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'wrong') + ' show';
  feedbackBox.innerHTML = isCorrect
    ? '<span class="feedback-icon">&#10003;</span> सही जवाब! ' + q.explanation
    : '<span class="feedback-icon">&#10007;</span> गलत जवाब। ' + q.explanation;
  feedbackBox.style.display = 'block';

  actionBox.style.display = 'block';
  actionBox.className = 'quiz-action show';

  if (isCorrect) {
    if (currentQuestion < activeQuizData.length - 1) {
      actionBox.innerHTML = '<button class="btn-next" onclick="nextQuestion()">अगला सवाल &rarr;</button>';
    } else {
      actionBox.innerHTML = '<button class="btn-next" onclick="quizComplete()">पूरा हुआ &#10003;</button>';
    }
  } else {
    actionBox.innerHTML = '<button class="btn-restart" onclick="restartQuiz()">फिर से शुरू करें</button>';
  }
}

function nextQuestion() {
  currentQuestion++;
  renderQuestion();
}

function restartQuiz() {
  currentQuestion = 0;
  renderQuestion();

  restartToast.classList.add('show');
  setTimeout(function() { restartToast.classList.remove('show'); }, 2500);
}

function quizComplete() {
  quizPassed = true;
  localStorage.setItem('wiom_quiz_passed', 'true');
  showStep(stepSuccess);
}

// === Close modal from success screen ===
document.getElementById('btn-close-modal').addEventListener('click', function() {
  modalOverlay.classList.remove('active');
});
