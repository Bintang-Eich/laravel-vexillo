// ============================================================
// VEXILLO — quizGlobe2d.js
// Canvas 2D globe untuk Quiz (gunakan renderer Profile)
// ============================================================

import { drawProfileStyleGlobe } from './globeRenderer2d.js';

export function initQuizGlobe2D() {
  const canvas = document.getElementById('quiz-globe-canvas');
  if (!canvas) {
    console.error('quizGlobe2d: canvas #quiz-globe-canvas tidak ditemukan');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('quizGlobe2d: tidak bisa mendapatkan context 2d');
    return;
  }

  console.log('quizGlobe2d: init sukses');

  const STARS = Array.from({ length: 260 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.random() * 1.1 + 0.25,
    o: Math.random() * 0.45 + 0.1,
    twinkle: Math.random() * Math.PI * 2,
  }));

  let mode = 'landing';
  const globeState = {
    x: 0.5,
    y: 0.5,
    scale: 1.0,
  };

  let rot = 0;
  let tick = 0;
  let lastTime = 0;

  window.setQuizGlobeMode = function (newMode) {
    mode = newMode;
    if (window.gsap) gsap.killTweensOf(globeState);

    if (mode === 'landing') {
      if (window.gsap) {
        gsap.to(globeState, { x: 0.5, y: 0.5, scale: 1.0, duration: 1.2, ease: 'power3.inOut' });
      } else {
        globeState.x = 0.5; globeState.y = 0.5; globeState.scale = 1.0;
      }
    } else if (mode === 'playing') {
      if (window.gsap) {
        gsap.to(globeState, { x: -0.15, y: 0.5, scale: 2.8, duration: 1.2, ease: 'power3.inOut' });
      } else {
        globeState.x = -0.15; globeState.y = 0.5; globeState.scale = 2.8;
      }
    }
  };

  function draw(W, H) {
    const R = Math.min(W, H) * 0.28 * globeState.scale;
    const cx = globeState.x * W;
    const cy = globeState.y * H;
    drawProfileStyleGlobe(ctx, W, H, rot, tick, cx, cy, R, STARS);
  }

  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    rot += 0.1 * dt;
    tick += dt;

    const W = window.innerWidth;
    const H = window.innerHeight;
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }

    draw(W, H);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}