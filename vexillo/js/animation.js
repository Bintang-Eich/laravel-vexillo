// ============================================================
// VEXILLO — animation.js
// Scroll-driven animations menggunakan GSAP + ScrollTrigger
// ============================================================

export function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // ---------- Hero Text Animations ----------
  gsap.to('.hero-title', {
    scale: 0.6,
    opacity: 0,
    y: -50,
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: '80% top',
      scrub: true,
    },
  });

  gsap.to('.hero-subtitle', {
    opacity: 0,
    y: -20,
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: '60% top',
      scrub: true,
    },
  });

  gsap.to('.scroll-indicator', {
    opacity: 0,
    y: 20,
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: '50% top',
      scrub: true,
    },
  });

  // ---------- Storytelling Layer 1: Unsur-unsur Negara ----------
  gsap.timeline({
    scrollTrigger: {
      trigger: '#storytelling',
      start: 'top top',
      end: '20% top',
      scrub: true,
    },
  })
    .fromTo('#layer-unsur', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
    .from('.story-item', { opacity: 0, x: -30, stagger: 0.15, duration: 0.5, ease: 'power2.out' }, '-=0.5')
    .to('#layer-unsur', { opacity: 0, y: -50, duration: 0.5 }, '+=0.5');

  // ---------- Storytelling Layer 2: Quotes ----------
  gsap.timeline({
    scrollTrigger: {
      trigger: '#storytelling',
      start: '20% top',
      end: '45% top',
      scrub: true,
    },
  })
    .fromTo('#layer-quotes', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
    .from('.quote-item', { opacity: 0, y: 30, stagger: 0.15, duration: 0.5, ease: 'power2.out' }, '-=0.5')
    .to('#layer-quotes', { opacity: 0, y: -50, duration: 0.5 }, '+=0.5');

  // ---------- Storytelling Layer 3: Definisi + 195 ----------
  gsap.timeline({
    scrollTrigger: {
      trigger: '#storytelling',
      start: '45% top',
      end: '70% top',
      scrub: true,
    },
  })
    .fromTo('#layer-definisi', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' })
    .to('#layer-definisi', { opacity: 0, scale: 1.2, duration: 0.5 }, '+=0.5');

  // ---------- Storytelling Layer 4: Video ----------
  const videoTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#storytelling',
      start: '65% top',
      end: '85% top',
      scrub: true,
      onUpdate: (self) => {
        const videoLayer = document.getElementById('layer-video');
        if (videoLayer) {
          const opacity = gsap.getProperty(videoLayer, 'opacity');
          if (opacity > 0.3) {
            videoLayer.style.pointerEvents = 'auto';
          } else {
            videoLayer.style.pointerEvents = 'none';
          }
        }
      },
    },
  });

  videoTimeline
    .fromTo('#layer-video', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
    .to('#layer-video', { opacity: 0, scale: 1.05, duration: 0.5 }, '+=0.5');

  // ---------- Explore section animations ----------
  gsap.from('.atlas-header', {
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.atlas-header',
      start: 'top 85%',
      end: 'top 40%',
      toggleActions: 'play none none none',
    },
  });

  gsap.from('.stats-bar', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.15,
    scrollTrigger: {
      trigger: '.stats-bar',
      start: 'top 85%',
      end: 'top 40%',
      toggleActions: 'play none none none',
    },
  });

  gsap.from('.filter-container', {
    opacity: 0,
    y: 25,
    duration: 0.7,
    ease: 'power3.out',
    delay: 0.25,
    scrollTrigger: {
      trigger: '.filter-container',
      start: 'top 85%',
      end: 'top 40%',
      toggleActions: 'play none none none',
    },
  });

  // ---------- Detail view animations ----------
  window.animateDetailView = function () {
    gsap.from('.detail-hero', {
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: 'power3.out',
    });
    gsap.from('.detail-section', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
      delay: 0.2,
    });
  };
}