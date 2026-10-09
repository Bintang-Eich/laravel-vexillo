// ============================================================
// VEXILLO — profile.js
// Profile, Authentication, Best Score (API Laravel)
// ============================================================

import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  saveBestScore,
  getToken,
} from './api.js';
import { initProfileGlobe2D } from './profileGlobe2d.js';

const MAX_SAVED = 10;
let countriesList = []; // akan diisi dari countries.json

export function initProfile() {
  console.log('profile.js: initProfile dipanggil');

  initProfileGlobe2D();

  window.renderProfile = renderProfile;
  window.saveBestScore = saveBestScoreToApi;

  // Muat daftar negara untuk dropdown
  loadCountriesList();

  renderProfile();
}

async function loadCountriesList() {
  try {
    const response = await fetch('data/countries.json');
    if (!response.ok) throw new Error('Gagal memuat data negara');
    countriesList = await response.json();
    console.log('profile.js: daftar negara dimuat:', countriesList.length);
  } catch (error) {
    console.error('profile.js: gagal memuat daftar negara', error);
    countriesList = [];
  }
}

function isLoggedIn() {
  return !!getToken();
}

async function renderProfile() {
  const container = document.getElementById('profile-content');
  if (!container) return;

  container.innerHTML = '<p style="color: var(--color-light-gray);">Memuat profil...</p>';

  if (isLoggedIn()) {
    await renderLoggedInProfile(container);
  } else {
    renderAuthForms(container);
  }
}

async function renderLoggedInProfile(container) {
  try {
    const profile = await getProfile();

    const savedCountries = profile.savedCountries || [];
    const filledSlots = savedCountries.slice(0, MAX_SAVED);

    let slotsHtml = '';
    for (let i = 0; i < MAX_SAVED; i++) {
      const item = filledSlots[i];
      if (item) {
        const code = (item.country_code || item).toUpperCase();
        slotsHtml += `
          <div class="saved-slot">
            <img src="https://flagcdn.com/w640/${code.toLowerCase()}.png" alt="${code}" class="saved-slot-flag">
            <span class="saved-slot-code">${code}</span>
          </div>
        `;
      } else {
        slotsHtml += `<div class="saved-slot empty">+</div>`;
      }
    }

    container.innerHTML = `
      <div class="profile-modern">
        <h2 class="profile-username">${profile.name}</h2>

        <div class="profile-meta">
          <div class="profile-region">
            <span class="meta-label">Region</span>
            <span class="meta-value">${profile.country || '—'}</span>
          </div>
          <div class="profile-best-score">
            <span class="meta-label">Best Score</span>
            <span class="meta-value">${profile.bestScore || 0}</span>
          </div>
        </div>

        <div class="profile-saved-section">
          <h3 class="profile-saved-title">Negara Tersimpan</h3>
          <div class="saved-slot-grid">${slotsHtml}</div>
        </div>

        <div class="profile-actions">
          <button class="profile-btn" id="logout-btn">Logout</button>
        </div>
      </div>
    `;

    document.getElementById('logout-btn').addEventListener('click', handleLogout);
  } catch (error) {
    console.error('profile.js: error renderLoggedInProfile', error);
    if (error.message.includes('Unauthenticated')) {
      await logoutUser();
      renderAuthForms(container);
    } else if (error.message.includes('Timeout') || error.message.includes('Failed to fetch')) {
      container.innerHTML = `<p style="color: #FCA5A5;">Tidak dapat terhubung ke server. Pastikan backend Laravel berjalan.</p>`;
    } else {
      container.innerHTML = `<p style="color: var(--color-light-gray);">Gagal memuat profil: ${error.message}</p>`;
    }
  }
}

function renderAuthForms(container) {
  const countryOptions = countriesList.map(country => {
    return `<option value="${country.name}">${country.name}</option>`;
  }).join('');

  container.innerHTML = `
    <div class="auth-form">
      <div class="auth-tabs">
        <button class="auth-tab active" data-tab="login">Login</button>
        <button class="auth-tab" data-tab="register">Register</button>
      </div>
      <div id="login-form">
        <div class="auth-form-group">
          <label for="login-email">Email</label>
          <input type="email" id="login-email" autocomplete="email">
        </div>
        <div class="auth-form-group">
          <label for="login-password">Password</label>
          <input type="password" id="login-password" autocomplete="current-password">
        </div>
        <button class="auth-submit-btn" id="login-submit">Login</button>
        <p class="auth-error" id="login-error" style="display: none;"></p>
      </div>
      <div id="register-form" style="display: none;">
        <div class="auth-form-group">
          <label for="register-name">Nama</label>
          <input type="text" id="register-name" autocomplete="name">
        </div>
        <div class="auth-form-group">
          <label for="register-country">Negara</label>
          <select id="register-country" autocomplete="country-name">
            <option value="">Pilih Negara</option>
            ${countryOptions}
          </select>
        </div>
        <div class="auth-form-group">
          <label for="register-email">Email</label>
          <input type="email" id="register-email" autocomplete="email">
        </div>
        <div class="auth-form-group">
          <label for="register-password">Password</label>
          <input type="password" id="register-password" autocomplete="new-password">
        </div>
        <button class="auth-submit-btn" id="register-submit">Register</button>
        <p class="auth-error" id="register-error" style="display: none;"></p>
      </div>
    </div>
  `;

  const tabs = container.querySelectorAll('.auth-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.getElementById('login-form').style.display = target === 'login' ? 'block' : 'none';
      document.getElementById('register-form').style.display = target === 'register' ? 'block' : 'none';
    });
  });

  document.getElementById('login-submit').addEventListener('click', handleLogin);
  document.getElementById('register-submit').addEventListener('click', handleRegister);
}

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  errorEl.style.display = 'none';

  if (!email || !password) {
    showError(errorEl, 'Email dan password wajib diisi.');
    return;
  }

  try {
    await loginUser(email, password);
    await renderProfile();
  } catch (error) {
    showError(errorEl, error.message);
  }
}

async function handleRegister() {
  const name = document.getElementById('register-name').value.trim();
  const country = document.getElementById('register-country').value;
  const email = document.getElementById('register-email').value.trim().toLowerCase();
  const password = document.getElementById('register-password').value;
  const errorEl = document.getElementById('register-error');
  errorEl.style.display = 'none';

  if (!name || !country || !email || !password) {
    showError(errorEl, 'Semua kolom wajib diisi.');
    return;
  }

  if (password.length < 6) {
    showError(errorEl, 'Password minimal 6 karakter.');
    return;
  }

  try {
    await registerUser(name, country, email, password);
    await renderProfile();
  } catch (error) {
    showError(errorEl, error.message);
  }
}

async function handleLogout() {
  try {
    await logoutUser();
    renderProfile();
  } catch (error) {
    console.error('Logout error:', error);
    renderProfile();
  }
}

async function saveBestScoreToApi(score) {
  if (!isLoggedIn()) {
    console.warn('Tidak login, best score tidak disimpan');
    return;
  }
  try {
    const result = await saveBestScore(score);
    console.log('Best score response:', result);
  } catch (error) {
    console.error('Gagal menyimpan best score:', error);
  }
}

function showError(element, message) {
  element.textContent = message;
  element.style.display = 'block';
}