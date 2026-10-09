// ============================================================
// VEXILLO — globe2d.js
// Canvas 2D globe untuk Explore (gunakan renderer Profile)
// ============================================================

import { drawProfileStyleGlobe } from './globeRenderer2d.js';

export function initGlobe2D() {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) {
    console.error('globe2d: canvas #globe-canvas TIDAK DITEMUKAN');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('globe2d: tidak bisa mendapatkan context 2d');
    return;
  }

  console.log('globe2d: init sukses');

  const STARS = Array.from({ length: 260 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.random() * 1.1 + 0.25,
    o: Math.random() * 0.45 + 0.1,
    twinkle: Math.random() * Math.PI * 2,
  }));

  let rot = 0;
  let tick = 0;
  let lastTime = 0;
  let frameCount = 0;

  const VH = () => {
    const h = window.innerHeight;
    return Number.isFinite(h) && h > 0 ? h : 600;
  };

  const getWidth = () => {
    const w = window.innerWidth;
    return Number.isFinite(w) && w > 0 ? w : 800;
  };

  const getHeight = () => {
    const h = window.innerHeight;
    return Number.isFinite(h) && h > 0 ? h : 600;
  };

  // Posisi globe berdasarkan scrollY (sama seperti sebelumnya)
  function globePos(sy, vh) {
    const HOLD = 0.6 * vh;

    if (sy < 0.5 * vh) {
      return { x: 0.5, y: 0.5, s: 1.0, o: 1.0 };
    }
    if (sy < 1.5 * vh) {
      const start = 0.5 * vh + HOLD;
      const end = 1.5 * vh;
      if (sy < start) return { x: 0.5, y: 0.5, s: 1.0, o: 1.0 };
      const t = epr(sy, start, end);
      return { x: lp(0.5, 1.1, t), y: lp(0.5, 0.75, t), s: lp(1.0, 3.2, t), o: 1.0 };
    }
    if (sy < 2.8 * vh) {
      const start = 1.5 * vh + HOLD;
      const end = 2.8 * vh;
      if (sy < start) return { x: 1.1, y: 0.75, s: 3.2, o: 1.0 };
      const t = epr(sy, start, end);
      return { x: lp(1.1, 0.5, t), y: lp(0.75, 0.6, t), s: lp(3.2, 1.4, t), o: 1.0 };
    }
    if (sy < 3.8 * vh) {
      const start = 2.8 * vh + HOLD;
      const end = 3.8 * vh;
      if (sy < start) return { x: 0.5, y: 0.6, s: 1.4, o: 1.0 };
      const t = epr(sy, start, end);
      return { x: 0.5, y: lp(0.6, 0.95, t), s: lp(1.4, 2.8, t), o: 1.0 };
    }
    if (sy < 4.8 * vh) {
      const start = 3.8 * vh + HOLD;
      const end = 4.8 * vh;
      if (sy < start) return { x: 0.5, y: 0.95, s: 2.8, o: 1.0 };
      const t = epr(sy, start, end);
      return { x: 0.5, y: lp(0.95, 1.4, t), s: lp(2.8, 0.6, t), o: lp(1, 0, t) };
    }
    return { x: 0.5, y: 1.4, s: 0.6, o: 0 };
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function pr(sy, a, b) { return clamp((sy - a) / (b - a), 0, 1); }
  function eas(t) { return t * t * (3 - 2 * t); }
  function epr(sy, a, b) { return eas(pr(sy, a, b)); }
  function lp(a, b, t) { return a + (b - a) * t; }

  function drawGlobe2D(ctx, W, H, rot, tick, gx, gy, gscale, gop) {
    if (!Number.isFinite(W) || !Number.isFinite(H) || W <= 0 || H <= 0) return;

    const R = Math.min(W, H) * 0.28 * gscale;
    const cx = gx * W;
    const cy = gy * H;

    // Jika opacity hampir nol, tetap gambar background? Prototype selalu gambar bg.
    // Untuk performa, jika gop < 0.01, kita bisa clear saja.
    if (gop < 0.01) {
      ctx.clearRect(0, 0, W, H);
      return;
    }

    // Panggil renderer
    drawProfileStyleGlobe(ctx, W, H, rot, tick, cx, cy, R, STARS);
  }

  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    rot += 0.1 * dt;
    tick += dt;

    const W = getWidth();
    const H = getHeight();

    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }

    const sy = window.scrollY || 0;
    const vh = VH();
    const { x, y, s, o } = globePos(sy, vh);

    drawGlobe2D(ctx, W, H, rot, tick, x, y, s, o);

    if (frameCount < 5) {
      console.log('globe2d: frame', frameCount, 'opacity', o, 'pos', x, y, s);
      frameCount++;
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}