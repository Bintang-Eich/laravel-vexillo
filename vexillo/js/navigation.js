// ============================================================
// VEXILLO — navigation.js
// Navigasi navbar: scrolled state, aktif link, smooth scroll
// ============================================================

export function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveNav(viewName) {
    navLinks.forEach(link => {
      if (link.dataset.view === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // --- Navbar background berdasarkan posisi Explore ---
  function updateNavbarOnScroll() {
    // Hanya tampilkan background navbar saat view Explore
    if (window.__lastView && window.__lastView !== 'explore') {
      navbar.classList.remove('scrolled');
      return;
    }

    const exploreView = document.getElementById('explore-view');
    if (!exploreView) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      return;
    }

    const exploreTop = exploreView.offsetTop;
    const triggerPoint = exploreTop - 80;
    if (window.scrollY >= triggerPoint) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbarOnScroll);
  updateNavbarOnScroll();

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewName = link.getAttribute('data-view');
      if (viewName === 'explore') {
        navigateTo('explore');
      } else if (viewName === 'quiz') {
        navigateTo('quiz');
      } else if (viewName === 'profile') {
        navigateTo('profile');
      }
      setActiveNav(viewName);
    });
  });

  function getAllSections() {
    return [
      document.getElementById('hero'),
      document.getElementById('storytelling'),
      document.getElementById('explore-view'),
      document.getElementById('country-detail-view'),
      document.getElementById('quiz-view'),
      document.getElementById('profile-view'),
    ].filter(Boolean);
  }

  function getGlobeCanvases() {
    return [
      document.getElementById('globe-canvas'),
      document.getElementById('quiz-globe-canvas'),
      document.getElementById('profile-globe-canvas'),
    ].filter(Boolean);
  }

  function navigateTo(viewName, scrollToGrid = false) {
    const sections = getAllSections();
    const canvases = getGlobeCanvases();

    // Fade out semua elemen
    gsap.to([...sections, ...canvases], {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        // Tampilkan/sembunyikan section sesuai tujuan
        showView(viewName);

        // Set lastView SEBELUM updateNavbarOnScroll
        window.__lastView = viewName;

        // Posisi scroll
        if (viewName === 'explore' && scrollToGrid) {
          const exploreView = document.getElementById('explore-view');
          if (exploreView) {
            // Scroll instan ke explore view, tanpa smooth
            window.scrollTo(0, exploreView.offsetTop);
          }
        } else {
          window.scrollTo(0, 0);
        }

        updateNavbarOnScroll();

        // Fade in elemen yang aktif
        const visibleSections = getVisibleSections(viewName);
        const visibleCanvases = getVisibleCanvases(viewName);
        gsap.to([...visibleSections, ...visibleCanvases], {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });

        document.body.style.overflow = '';
        setActiveNav(viewName);
      },
    });
  }

  function showView(viewName) {
    const hero = document.getElementById('hero');
    const storytelling = document.getElementById('storytelling');
    const explore = document.getElementById('explore-view');
    const detail = document.getElementById('country-detail-view');
    const quiz = document.getElementById('quiz-view');
    const profile = document.getElementById('profile-view');

    const globeExplore = document.getElementById('globe-canvas');
    const globeQuiz = document.getElementById('quiz-globe-canvas');
    const globeProfile = document.getElementById('profile-globe-canvas');

    if (viewName === 'explore') {
      hero.classList.remove('hidden');
      storytelling.classList.remove('hidden');
      explore.classList.remove('hidden');
      detail.classList.add('hidden');
      quiz.classList.add('hidden');
      profile.classList.add('hidden');

      if (globeExplore) {
        globeExplore.style.display = 'block';
        globeExplore.style.visibility = 'visible';
        globeExplore.style.opacity = '1';
      }
      if (globeQuiz) {
        globeQuiz.style.display = 'none';
        globeQuiz.style.visibility = 'hidden';
        globeQuiz.style.opacity = '0';
      }
      if (globeProfile) {
        globeProfile.style.display = 'none';
        globeProfile.style.visibility = 'hidden';
        globeProfile.style.opacity = '0';
      }
    } else if (viewName === 'quiz') {
      hero.classList.add('hidden');
      storytelling.classList.add('hidden');
      explore.classList.add('hidden');
      detail.classList.add('hidden');
      quiz.classList.remove('hidden');
      profile.classList.add('hidden');

      if (globeExplore) {
        globeExplore.style.display = 'none';
        globeExplore.style.visibility = 'hidden';
        globeExplore.style.opacity = '0';
      }
      if (globeQuiz) {
        globeQuiz.style.display = 'block';
        globeQuiz.style.visibility = 'visible';
        globeQuiz.style.opacity = '1';
      }
      if (globeProfile) {
        globeProfile.style.display = 'none';
        globeProfile.style.visibility = 'hidden';
        globeProfile.style.opacity = '0';
      }

      const landing = document.getElementById('quiz-landing');
      const playing = document.getElementById('quiz-playing');
      const gameover = document.getElementById('quiz-gameover');
      if (landing) landing.classList.remove('hidden');
      if (playing) playing.classList.add('hidden');
      if (gameover) gameover.classList.add('hidden');

      if (typeof window.setQuizGlobeMode === 'function') {
        window.setQuizGlobeMode('landing');
      }
    } else if (viewName === 'profile') {
      hero.classList.add('hidden');
      storytelling.classList.add('hidden');
      explore.classList.add('hidden');
      detail.classList.add('hidden');
      quiz.classList.add('hidden');
      profile.classList.remove('hidden');

      if (globeExplore) {
        globeExplore.style.display = 'none';
        globeExplore.style.visibility = 'hidden';
        globeExplore.style.opacity = '0';
      }
      if (globeQuiz) {
        globeQuiz.style.display = 'none';
        globeQuiz.style.visibility = 'hidden';
        globeQuiz.style.opacity = '0';
      }
      if (globeProfile) {
        globeProfile.style.display = 'block';
        globeProfile.style.visibility = 'visible';
        globeProfile.style.opacity = '1';
      }

      if (typeof window.renderProfile === 'function') {
        window.renderProfile();
      }
    }
  }

  function getVisibleSections(viewName) {
    const hero = document.getElementById('hero');
    const storytelling = document.getElementById('storytelling');
    const explore = document.getElementById('explore-view');
    const detail = document.getElementById('country-detail-view');
    const quiz = document.getElementById('quiz-view');
    const profile = document.getElementById('profile-view');

    if (viewName === 'explore') return [hero, storytelling, explore].filter(Boolean);
    if (viewName === 'quiz') return [quiz].filter(Boolean);
    if (viewName === 'profile') return [profile].filter(Boolean);
    return [];
  }

  function getVisibleCanvases(viewName) {
    const globeExplore = document.getElementById('globe-canvas');
    const globeQuiz = document.getElementById('quiz-globe-canvas');
    const globeProfile = document.getElementById('profile-globe-canvas');
    if (viewName === 'explore') return [globeExplore].filter(Boolean);
    if (viewName === 'quiz') return [globeQuiz].filter(Boolean);
    if (viewName === 'profile') return [globeProfile].filter(Boolean);
    return [];
  }

  window.scrollToExploreGrid = function () {
    const exploreView = document.getElementById('explore-view');
    if (exploreView) {
      exploreView.scrollIntoView({ behavior: 'smooth' });
    }
  };

  window.showExploreView = function (scrollToGrid = false) {
    navigateTo('explore', scrollToGrid);
  };
  window.showQuizView = function () {
    navigateTo('quiz');
  };
  window.showProfileView = function () {
    navigateTo('profile');
  };
  window.setActiveNav = setActiveNav;
}