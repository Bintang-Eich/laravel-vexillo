// ============================================================
// VEXILLO — quiz.js
// Quick World Challenge (Endless Quiz + Audio)
// ============================================================

import { playSound } from './audio.js';

let questionsData = [];
let remainingQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval = null;
let timeLeft = 0;
let isAnswered = false;
let quizActive = false;

const TIME_PER_QUESTION = 5; // detik
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export async function initQuiz() {
  document.getElementById('quiz-start-btn').addEventListener('click', startQuiz);
  document.getElementById('quiz-retry-btn').addEventListener('click', startQuiz);
  document.getElementById('quiz-back-btn').addEventListener('click', backToExplore);

  try {
    const response = await fetch('data/questions.json');
    if (!response.ok) throw new Error('Gagal memuat data soal');
    questionsData = await response.json();
    console.log('Data soal berhasil dimuat:', questionsData.length, 'soal');
  } catch (error) {
    console.error('Error:', error);
    alert('Gagal memuat data soal. Periksa koneksi atau file questions.json.');
  }
}

function showLanding() {
  document.getElementById('quiz-landing').classList.remove('hidden');
  document.getElementById('quiz-playing').classList.add('hidden');
  document.getElementById('quiz-gameover').classList.add('hidden');
  if (typeof window.setQuizGlobeMode === 'function') window.setQuizGlobeMode('landing');
}

function showPlaying() {
  document.getElementById('quiz-landing').classList.add('hidden');
  document.getElementById('quiz-playing').classList.remove('hidden');
  document.getElementById('quiz-gameover').classList.add('hidden');
  if (typeof window.setQuizGlobeMode === 'function') window.setQuizGlobeMode('playing');
}

function showGameOver() {
  document.getElementById('quiz-landing').classList.add('hidden');
  document.getElementById('quiz-playing').classList.add('hidden');
  document.getElementById('quiz-gameover').classList.remove('hidden');
}

function backToExplore() {
  quizActive = false;
  clearInterval(timerInterval);
  playSound('click');
  if (typeof window.showExploreView === 'function') {
    window.showExploreView(true); // langsung ke grid
  }
}

function startQuiz() {
  playSound('click');
  // Reset daftar soal tersisa (acak)
  remainingQuestions = shuffleArray([...questionsData]);
  currentQuestionIndex = 0;
  score = 0;
  quizActive = true;
  isAnswered = false;

  showPlaying();
  updateScoreDisplay();
  showNextQuestion();
}

function showNextQuestion() {
  if (!quizActive) return;

  // Jika soal tersisa habis, reset ulang daftar
  if (remainingQuestions.length === 0) {
    remainingQuestions = shuffleArray([...questionsData]);
  }

  isAnswered = false;
  // Ambil satu soal dari daftar tersisa (hapus dari array)
  const question = remainingQuestions.shift();
  currentQuestionIndex++;

  // Update nomor soal (tidak penting untuk logika, hanya tampilan)
  const progressLabel = document.getElementById('quiz-progress-label');
  if (progressLabel) {
    progressLabel.textContent = `Soal ${currentQuestionIndex}`;
  }

  // Set teks pertanyaan
  const questionText = document.getElementById('quiz-question-text');
  if (questionText) questionText.textContent = question.question;

  // Tampilkan gambar bendera jika ada
  const imageContainer = document.getElementById('quiz-question-image');
  if (imageContainer) {
    if (question.flag) {
      imageContainer.innerHTML = `<img src="${question.flag}" alt="Bendera">`;
    } else {
      imageContainer.innerHTML = '';
    }
  }

  // Render opsi
  const optionsContainer = document.getElementById('quiz-options');
  if (optionsContainer) {
    optionsContainer.innerHTML = '';
    const shuffledOptions = shuffleArray([...question.options]);
    shuffledOptions.forEach((option, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.style.opacity = '1';
      btn.style.background = '#0A1B2E';
      btn.innerHTML = `
        <span class="quiz-option-label">${OPTION_LABELS[idx]}</span>
        <span>${option}</span>
      `;
      btn.addEventListener('click', () => handleAnswer(option, question.answer, btn));
      optionsContainer.appendChild(btn);
    });
  }

  // Reset feedback
  const feedback = document.getElementById('quiz-feedback');
  if (feedback) feedback.innerHTML = '';

  // Reset timer
  resetTimer();

  // Animasi pertanyaan
  animateQuestionIn();
}

function handleAnswer(selected, correct, selectedBtn) {
  if (!quizActive || isAnswered) return;
  isAnswered = true;

  clearInterval(timerInterval);

  const allOptions = document.querySelectorAll('.quiz-option-btn');
  allOptions.forEach(btn => {
    btn.classList.add('disabled');
    const optionText = btn.querySelector('span:last-child')?.textContent || '';
    if (optionText === correct) {
      btn.classList.add('correct');
    } else if (btn === selectedBtn) {
      btn.classList.add('wrong');
    }
  });

  const feedback = document.getElementById('quiz-feedback');
  if (selected === correct) {
    playSound('correct');
    if (feedback) feedback.innerHTML = '<span class="quiz-feedback-correct">BENAR</span>';
    score++;
    updateScoreDisplay();
    setTimeout(() => {
      if (quizActive) {
        showNextQuestion();
      }
    }, 800);
  } else {
    playSound('wrong');
    if (feedback) feedback.innerHTML = '<span class="quiz-feedback-wrong">SALAH</span>';
    setTimeout(() => {
      endQuiz(false);
    }, 800);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = TIME_PER_QUESTION;
  const timerBar = document.getElementById('quiz-timer-bar');
  if (timerBar) {
    timerBar.style.width = '100%';
    timerBar.style.background = 'var(--color-cerulean)';
  }

  timerInterval = setInterval(() => {
    timeLeft--;
    const percentage = (timeLeft / TIME_PER_QUESTION) * 100;
    if (timerBar) timerBar.style.width = `${percentage}%`;

    if (timeLeft <= 2) {
      if (timerBar) timerBar.style.background = '#EF4444';
    } else if (timeLeft <= 4) {
      if (timerBar) timerBar.style.background = '#F59E0B';
    } else {
      if (timerBar) timerBar.style.background = 'var(--color-cerulean)';
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (quizActive && !isAnswered) {
        endQuiz(false);
      }
    }
  }, 1000);
}

function endQuiz(completedAll) {
  quizActive = false;
  clearInterval(timerInterval);

  showGameOver();
  const finalScore = document.getElementById('quiz-final-score');
  if (finalScore) finalScore.textContent = score;

  // Simpan best score jika user login
  if (typeof window.saveBestScore === 'function') {
    window.saveBestScore(score);
  }

  if (finalScore) animateScore(finalScore);
}

function updateScoreDisplay() {
  const scoreEl = document.getElementById('quiz-score');
  if (scoreEl) scoreEl.textContent = score;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function animateQuestionIn() {
  if (typeof gsap !== 'undefined') {
    gsap.from('.quiz-question-text', {
      opacity: 0,
      y: 30,
      duration: 0.5,
      ease: 'power3.out'
    });
    gsap.from('.quiz-question-image', {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'power3.out'
    });
  }
}

function animateScore(element) {
  if (typeof gsap !== 'undefined') {
    gsap.from(element, {
      textContent: 0,
      duration: 1,
      snap: { textContent: 1 },
      ease: 'power2.out'
    });
  }
}