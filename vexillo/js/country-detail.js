// ============================================================
// VEXILLO — country-detail.js
// Menampilkan detail negara + tombol simpan (max 10 saved)
// ============================================================

import { getToken, getProfile, addSavedCountry, deleteSavedCountry } from './api.js';

const MAX_SAVED = 10;

let countriesData = [];
let savedCountries = [];

export async function initCountryDetail() {
  try {
    const response = await fetch('data/countries.json');
    if (!response.ok) throw new Error('Gagal memuat data negara');
    countriesData = await response.json();
    console.log('country-detail.js: data negara dimuat, jumlah:', countriesData.length);
  } catch (error) {
    console.error('country-detail.js: gagal memuat data', error);
    return;
  }

  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (typeof window.showExploreView === 'function') {
        window.showExploreView(true);
      }
    });
  }

  window.showDetail = function (countryId) {
    const country = countriesData.find((c) => c.id === countryId);
    if (!country) {
      console.error('country-detail.js: negara tidak ditemukan');
      return;
    }

    const hero = document.getElementById('hero');
    const storytelling = document.getElementById('storytelling');
    const exploreView = document.getElementById('explore-view');
    const detailView = document.getElementById('country-detail-view');
    const quizView = document.getElementById('quiz-view');
    const profileView = document.getElementById('profile-view');

    if (hero) hero.classList.add('hidden');
    if (storytelling) storytelling.classList.add('hidden');
    if (exploreView) exploreView.classList.add('hidden');
    if (quizView) quizView.classList.add('hidden');
    if (profileView) profileView.classList.add('hidden');

    if (detailView) {
      detailView.classList.remove('hidden');
      detailView.style.display = 'block';
      detailView.style.visibility = 'visible';
      detailView.style.opacity = '1';
    }

    const globeExplore = document.getElementById('globe-canvas');
    const globeQuiz = document.getElementById('quiz-globe-canvas');
    const globeProfile = document.getElementById('profile-globe-canvas');
    if (globeExplore) { globeExplore.style.display = 'none'; globeExplore.style.visibility = 'hidden'; globeExplore.style.opacity = '0'; }
    if (globeQuiz) { globeQuiz.style.display = 'none'; globeQuiz.style.visibility = 'hidden'; globeQuiz.style.opacity = '0'; }
    if (globeProfile) { globeProfile.style.display = 'none'; globeProfile.style.visibility = 'hidden'; globeProfile.style.opacity = '0'; }

    document.body.style.overflow = '';
    window.scrollTo(0, 0);
    window.__lastView = 'detail';

    loadSavedCountries().then(() => renderDetail(country, countryId));
  };
}

async function loadSavedCountries() {
  if (!getToken()) {
    savedCountries = [];
    return;
  }
  try {
    const profile = await getProfile();
    savedCountries = profile.savedCountries || [];
  } catch (error) {
    console.error('Gagal memuat saved countries:', error);
    savedCountries = [];
  }
}

function isCountrySaved(countryCode) {
  return savedCountries.some(item => (item.country_code || item) === countryCode);
}

function getSavedId(countryCode) {
  const found = savedCountries.find(item => (item.country_code || item) === countryCode);
  return found ? found.id : null;
}

function renderDetail(country, countryId) {
  const content = document.getElementById('country-detail-content');
  if (!content) return;

  const saved = isCountrySaved(country.id);
  const savedButtonClass = saved ? 'saved-btn active' : 'saved-btn';
  const savedIcon = saved ? '★' : '☆';

  const heroImage = country.images?.[0] || 'https://picsum.photos/800/500?random=' + Math.floor(Math.random() * 100);

  content.innerHTML = `
    <div class="detail-hero">
      <img src="${heroImage}" alt="${country.name}">
      <div class="detail-hero-overlay">
        <button class="${savedButtonClass}" id="saved-btn">${savedIcon} ${saved ? 'Tersimpan' : 'Simpan'}</button>
      </div>
    </div>

    <div class="detail-title-row">
      <img src="https://flagcdn.com/w640/${country.id}.png" alt="${country.name}" class="detail-flag">
      <div class="detail-title-text">
        <h2 class="detail-name">${country.name}</h2>
        <p class="detail-capital">${country.capital}</p>
      </div>
    </div>

    <div class="detail-section">
      <h3>Tentang ${country.name}</h3>
      <p>${country.description || 'Deskripsi belum tersedia.'}</p>
    </div>

    <div class="detail-section">
      <h3>Fakta Menarik</h3>
      <ul class="facts-list">
        ${(country.facts || []).map((fact) => `<li>${fact}</li>`).join('')}
      </ul>
    </div>

    <div class="detail-section">
      <h3>Sejarah</h3>
      <div class="history-timeline">
        ${(country.history || []).map((item) => {
          const [year, ...textParts] = item.split(':');
          const text = textParts.join(':').trim();
          return `
            <div class="timeline-item">
              <span class="timeline-year">${year.trim()}</span>
              <span class="timeline-text">${text}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="detail-section">
      <h3>Informasi Umum</h3>
      <p><strong>Nama Resmi:</strong> ${country.officialName || country.name}</p>
      <p><strong>Benua:</strong> ${country.continent}</p>
      <p><strong>Bahasa:</strong> ${(country.languages || []).join(', ')}</p>
      <p><strong>Mata Uang:</strong> ${country.currency || '—'}</p>
      <p><strong>Populasi:</strong> ${country.population ? formatNumber(country.population) : '—'}</p>
      <p><strong>Luas Wilayah:</strong> ${country.area ? formatArea(country.area) : '—'}</p>
    </div>
  `;

  const savedBtn = document.getElementById('saved-btn');
  if (savedBtn) {
    savedBtn.addEventListener('click', () => toggleSaved(country.id, savedBtn));
  }

  if (typeof window.animateDetailView === 'function') {
    window.animateDetailView();
  }
}

async function toggleSaved(countryCode, btn) {
  if (!getToken()) {
    alert('Silakan login terlebih dahulu untuk menyimpan negara.');
    return;
  }

  const saved = isCountrySaved(countryCode);
  try {
    if (saved) {
      const id = getSavedId(countryCode);
      if (id) {
        await deleteSavedCountry(id);
        savedCountries = savedCountries.filter(item => (item.country_code || item) !== countryCode);
      }
    } else {
      if (savedCountries.length >= MAX_SAVED) {
        alert(`Maksimal menyimpan ${MAX_SAVED} negara.`);
        return;
      }
      const result = await addSavedCountry(countryCode);
      savedCountries.push(result.savedCountry);
    }
    updateSavedButton(btn, countryCode);
  } catch (error) {
    console.error('Gagal toggle saved country:', error);
    alert('Terjadi kesalahan saat menyimpan negara.');
  }
}

function updateSavedButton(btn, countryCode) {
  const saved = isCountrySaved(countryCode);
  btn.classList.toggle('active', saved);
  btn.innerHTML = saved ? '★ Tersimpan' : '☆ Simpan';
}

// Helper format angka
function formatNumber(value) {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (value >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return value.toString();
}

function formatArea(value) {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M km²';
  return value.toLocaleString('id-ID') + ' km²';
}