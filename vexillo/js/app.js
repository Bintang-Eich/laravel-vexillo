// ============================================================
// VEXILLO — app.js
// Entry point utama
// ============================================================

import { initGlobe2D } from './globe2d.js';
import { initQuizGlobe2D } from './quizGlobe2d.js';
import { initScrollAnimations } from './animation.js';
import { initNavigation } from './navigation.js';
import { initExplore } from './explore.js';
import { initCountryDetail } from './country-detail.js';
import { initQuiz } from './quiz.js';
import { initProfile } from './profile.js';
import { initAudio, playSound, toggleBacksound } from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inisialisasi audio
  initAudio();

  const backsoundBtn = document.getElementById('backsound-toggle');
if (backsoundBtn) {
  backsoundBtn.addEventListener('click', () => {
    toggleBacksound();
  });
}

  // Inisialisasi globe 2D Explore
  initGlobe2D();

  // Inisialisasi globe 2D Quiz
  initQuizGlobe2D();

  // Inisialisasi animasi scroll
  initScrollAnimations();

  // Inisialisasi navigasi navbar
  initNavigation();

  // Set tampilan awal ke Explore
  if (typeof window.showExploreView === 'function') {
    window.showExploreView();
  }

  // Inisialisasi custom cursor
  initCustomCursor();

  // Inisialisasi Explore dan Country Detail
  initExplore();
  initCountryDetail();

  // Inisialisasi Quiz
  initQuiz();

  // Inisialisasi Profile
  initProfile();

  // Inisialisasi quote selector (kutipan interaktif)
  initQuoteSelector();

  // Event listener untuk subtitle hero "Jelajahi Dunia"
  initHeroSubtitleTrigger();

  // Event listener global untuk suara klik umum
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('button, a, .country-card, .filter-btn, .quiz-option-btn, .nav-link, .quote-selector-btn')) {
      playSound('click');
    }
  });
});

// ============================================================
// Custom Cursor (desktop only)
// ============================================================
function initCustomCursor() {
  const dot = document.getElementById('custom-cursor');
  const ring = document.getElementById('custom-cursor-ring');
  if (!dot || !ring) return;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.body.classList.add('has-custom-cursor');

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      setTimeout(() => {
        ring.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }, 50);
    });

    const interactiveElements = document.querySelectorAll(
      'a, button, input, .country-card, .nav-link, .filter-btn, .quiz-option-btn, .quiz-start-btn, .quiz-retry-btn, .quiz-back-btn, .quote-selector-btn'
    );
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
  } else {
    dot.style.display = 'none';
    ring.style.display = 'none';
  }
}

// ============================================================
// Quote Selector (interaktif untuk bagian storytelling)
// ============================================================
const quotesData = {
  1: {
    name: 'Miriam Budiardjo',
    quote: '"Negara adalah suatu daerah teritorial yang rakyatnya diperintah oleh sejumlah pejabat dan berhasil menuntut ketaatan dari warganya melalui penguasaan monopolistis terhadap kekuasaan yang sah."',
  },
  2: {
    name: 'Max Weber',
    quote: '"Negara adalah satu-satunya lembaga yang memiliki legitimasi untuk melakukan monopoli penggunaan kekuatan fisik secara sah (monopoly of the legitimate use of physical force) dalam wilayah tertentu."',
  },
  3: {
    name: 'Aristoteles',
    quote: '"Negara (polis) adalah persekutuan dari keluarga dan desa untuk mencapai kehidupan yang sebaik-baiknya — suatu bentuk tertinggi komunitas manusia."',
  },
};

function initQuoteSelector() {
  const container = document.getElementById('layer-quotes');
  if (!container) return;

  const buttons = container.querySelectorAll('.quote-selector-btn');
  const display = document.getElementById('quote-display');
  if (!display) return;

  function showQuote(id) {
    const data = quotesData[id];
    if (data) {
      display.innerHTML = `
        <div class="quote-display-name">${data.name}</div>
        <p class="quote-display-text">${data.quote}</p>
      `;
    }
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.quote === id);
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      showQuote(btn.dataset.quote);
    });
  });

  // Tampilkan kutipan pertama secara default
  showQuote('1');
}

// ============================================================
// Hero Subtitle Trigger — "Jelajahi Dunia" menuju grid Explore
// ============================================================
function initHeroSubtitleTrigger() {
  const heroTrigger = document.getElementById('hero-explore-trigger');
  if (!heroTrigger) return;

  heroTrigger.addEventListener('click', () => {
    if (typeof window.scrollToExploreGrid === 'function') {
      window.scrollToExploreGrid();
    } else {
      const exploreView = document.getElementById('explore-view');
      if (exploreView) {
        exploreView.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}