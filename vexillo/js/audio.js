// ============================================================
// VEXILLO — audio.js
// Manajemen audio (click, transition, correct, wrong, backsound)
// ============================================================

const audioFiles = {
  click: 'assets/audio/click.mp3',
  transition: 'assets/audio/transition.mp3',
  correct: 'assets/audio/correct.mp3',
  wrong: 'assets/audio/wrong.mp3',
  backsound: 'assets/audio/backsound.mp3',
};

const audioCache = {};
let backsoundAudio = null;
let isBacksoundPlaying = false;
let backsoundVolume = 0.3;

function loadAudio(key) {
  if (!audioCache[key]) {
    const audio = new Audio(audioFiles[key]);
    audio.preload = 'auto';
    audioCache[key] = audio;
  }
  return audioCache[key];
}

export function playSound(key) {
  const audio = loadAudio(key);
  if (!audio) return;

  audio.currentTime = 0;
  audio.play().catch((error) => {
    console.warn(`Gagal memutar audio ${key}:`, error);
  });
}

export function initAudio() {
  Object.keys(audioFiles).forEach((key) => loadAudio(key));
  console.log('audio.js: init sukses');
}

// Backsound
export function toggleBacksound() {
  if (isBacksoundPlaying) {
    stopBacksound();
  } else {
    startBacksound();
  }
}

function startBacksound() {
  if (!backsoundAudio) {
    backsoundAudio = loadAudio('backsound');
    backsoundAudio.loop = true;
    backsoundAudio.volume = backsoundVolume;
  }

  backsoundAudio.play().then(() => {
    isBacksoundPlaying = true;
    updateBacksoundButton();
  }).catch((error) => {
    console.warn('Gagal memutar backsound:', error);
  });
}

function stopBacksound() {
  if (!backsoundAudio) return;
  backsoundAudio.pause();
  isBacksoundPlaying = false;
  updateBacksoundButton();
}

function updateBacksoundButton() {
  const btn = document.getElementById('backsound-toggle');
  if (!btn) return;

  if (isBacksoundPlaying) {
    btn.classList.add('active');
    btn.title = 'Matikan backsound';
  } else {
    btn.classList.remove('active');
    btn.title = 'Nyalakan backsound';
  }
}

export function isBacksoundOn() {
  return isBacksoundPlaying;
}