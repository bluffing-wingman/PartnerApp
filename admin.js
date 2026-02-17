// === Load config (from localStorage or defaults) ===
function loadConfig() {
  try {
    const stored = localStorage.getItem('wiom_config');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate: must have intro, quiz array, and success
      if (parsed.intro && Array.isArray(parsed.quiz) && parsed.quiz.length > 0 && parsed.success) {
        return parsed;
      }
    }
  } catch (e) { /* fall through */ }
  // Seed localStorage with a deep copy of defaults
  const fresh = JSON.parse(JSON.stringify(defaultConfig));
  localStorage.setItem('wiom_config', JSON.stringify(fresh));
  return fresh;
}

let config = loadConfig();

// === Toast ===
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// === Populate form from config ===
function populateForm() {
  const intro = config.intro || defaultConfig.intro;
  document.getElementById('intro-title').value = intro.title;
  document.getElementById('intro-body').value = intro.body;
  document.getElementById('intro-cta').value = intro.cta;

  const success = config.success || defaultConfig.success;
  document.getElementById('success-title').value = success.title;
  document.getElementById('success-subtitle').value = success.subtitle;
  document.getElementById('success-payout').value = success.payout;
  document.getElementById('success-note').value = success.note;
  document.getElementById('success-cta').value = success.cta;

  renderQuizList();
}

// === Quiz question list ===
function renderQuizList() {
  const list = document.getElementById('quiz-list');
  const questions = config.quiz || defaultConfig.quiz;
  list.innerHTML = '';

  questions.forEach((q, i) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML = `
      <div class="question-card-header" onclick="toggleCard(${i})">
        <span class="question-card-num">Q${i + 1}</span>
        <span class="question-card-preview">${escapeHtml(q.question)}</span>
        <div class="question-card-actions">
          ${i > 0 ? `<button class="btn-icon" onclick="event.stopPropagation(); moveQuestion(${i}, -1)" title="Move up">&uarr;</button>` : ''}
          ${i < questions.length - 1 ? `<button class="btn-icon" onclick="event.stopPropagation(); moveQuestion(${i}, 1)" title="Move down">&darr;</button>` : ''}
          <button class="btn-icon delete" onclick="event.stopPropagation(); deleteQuestion(${i})" title="Delete">&times;</button>
        </div>
      </div>
      <div class="question-card-body">
        <div class="form-group">
          <label>Question</label>
          <textarea class="form-textarea" rows="2" data-field="question" data-index="${i}">${escapeHtml(q.question)}</textarea>
        </div>
        <div class="options-grid">
          ${q.options.map((opt, oi) => `
            <div class="option-field">
              <label>Option ${String.fromCharCode(65 + oi)}</label>
              <input type="text" class="form-input" data-field="option" data-index="${i}" data-option="${oi}" value="${escapeAttr(opt)}">
            </div>
          `).join('')}
        </div>
        <div class="correct-answer-row">
          <label>Correct Answer:</label>
          <select class="form-select" data-field="correct" data-index="${i}">
            <option value="0" ${q.correct === 0 ? 'selected' : ''}>A</option>
            <option value="1" ${q.correct === 1 ? 'selected' : ''}>B</option>
            <option value="2" ${q.correct === 2 ? 'selected' : ''}>C</option>
            <option value="3" ${q.correct === 3 ? 'selected' : ''}>D</option>
          </select>
        </div>
        <div class="form-group">
          <label>Explanation</label>
          <textarea class="form-textarea" rows="2" data-field="explanation" data-index="${i}">${escapeHtml(q.explanation)}</textarea>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// === Card toggle ===
function toggleCard(index) {
  const cards = document.querySelectorAll('.question-card');
  cards[index].classList.toggle('open');
}

// === Read form values into config ===
function readFormIntoConfig() {
  config.intro = {
    title: document.getElementById('intro-title').value,
    body: document.getElementById('intro-body').value,
    cta: document.getElementById('intro-cta').value
  };

  config.success = {
    title: document.getElementById('success-title').value,
    subtitle: document.getElementById('success-subtitle').value,
    payout: document.getElementById('success-payout').value,
    note: document.getElementById('success-note').value,
    cta: document.getElementById('success-cta').value
  };

  // Read quiz questions from DOM
  const questions = config.quiz || [];
  document.querySelectorAll('[data-field="question"]').forEach(el => {
    const i = parseInt(el.dataset.index);
    if (questions[i]) questions[i].question = el.value;
  });
  document.querySelectorAll('[data-field="option"]').forEach(el => {
    const i = parseInt(el.dataset.index);
    const oi = parseInt(el.dataset.option);
    if (questions[i]) questions[i].options[oi] = el.value;
  });
  document.querySelectorAll('[data-field="correct"]').forEach(el => {
    const i = parseInt(el.dataset.index);
    if (questions[i]) questions[i].correct = parseInt(el.value);
  });
  document.querySelectorAll('[data-field="explanation"]').forEach(el => {
    const i = parseInt(el.dataset.index);
    if (questions[i]) questions[i].explanation = el.value;
  });

  config.quiz = questions;
}

// === Question operations ===
function moveQuestion(index, direction) {
  readFormIntoConfig();
  const q = config.quiz;
  const target = index + direction;
  if (target < 0 || target >= q.length) return;
  [q[index], q[target]] = [q[target], q[index]];
  renderQuizList();
}

function deleteQuestion(index) {
  if (config.quiz.length <= 1) {
    showToast('Must have at least one question');
    return;
  }
  readFormIntoConfig();
  config.quiz.splice(index, 1);
  renderQuizList();
}

function addQuestion() {
  readFormIntoConfig();
  config.quiz.push({
    question: "",
    options: ["", "", "", ""],
    correct: 0,
    explanation: ""
  });
  renderQuizList();
  // Open the new card
  const cards = document.querySelectorAll('.question-card');
  cards[cards.length - 1].classList.add('open');
}

// === Save ===
function saveConfig() {
  readFormIntoConfig();
  localStorage.setItem('wiom_config', JSON.stringify(config));
  showToast('Config saved successfully!');
}

// === Reset ===
function resetToDefaults() {
  if (!confirm('Reset all content to defaults? This will clear your saved changes.')) return;
  localStorage.removeItem('wiom_config');
  config = JSON.parse(JSON.stringify(defaultConfig));
  populateForm();
  showToast('Reset to defaults');
}

// === Preview ===
function previewPartnerApp() {
  // Clear quiz passed state so modal shows
  localStorage.removeItem('wiom_quiz_passed');
  window.open('index.html', '_blank');
}

// === Event listeners ===
document.getElementById('btn-save').addEventListener('click', saveConfig);
document.getElementById('btn-reset').addEventListener('click', resetToDefaults);
document.getElementById('btn-preview').addEventListener('click', previewPartnerApp);
document.getElementById('btn-add-question').addEventListener('click', addQuestion);

// === Init ===
populateForm();
