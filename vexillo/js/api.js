// ============================================================
// VEXILLO — api.js
// Komunikasi dengan backend Laravel REST API
// ============================================================

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // ubah port sesuai server

const TOKEN_KEY = 'vexillo_token';
const USER_KEY = 'vexillo_current_user';

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function setUserInfo(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUserInfo() {
  const json = localStorage.getItem(USER_KEY);
  return json ? JSON.parse(json) : null;
}

export function removeUserInfo() {
  localStorage.removeItem(USER_KEY);
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server.');
  }

  return data;
}

export async function registerUser(name, country, email, password) {
  const data = await apiFetch('/register', {
    method: 'POST',
    body: JSON.stringify({ name, country, email, password }),
  });

  setToken(data.token);
  setUserInfo(data.user);
  return data.user;
}

export async function loginUser(email, password) {
  const data = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setToken(data.token);
  setUserInfo(data.user);
  return data.user;
}

export async function logoutUser() {
  try {
    await apiFetch('/logout', { method: 'POST' });
  } catch (e) {
    console.warn('Logout API gagal, token dihapus lokal:', e.message);
  }
  removeToken();
  removeUserInfo();
}

export async function getProfile() {
  const data = await apiFetch('/profile');
  setUserInfo({
    id: data.id,
    name: data.name,
    country: data.country,
    email: data.email,
  });
  return data;
}

export async function getBestScore() {
  const data = await apiFetch('/best-score');
  return data.bestScore;
}

export async function saveBestScore(score) {
  const data = await apiFetch('/best-score', {
    method: 'POST',
    body: JSON.stringify({ score }),
  });
  return data.bestScore;
}

export async function getSavedCountries() {
  const data = await apiFetch('/saved-countries');
  return data.savedCountries; // array objek {id, country_code}
}

export async function addSavedCountry(countryCode) {
  const data = await apiFetch('/saved-countries', {
    method: 'POST',
    body: JSON.stringify({ country_code: countryCode }),
  });
  return data;
}

export async function deleteSavedCountry(id) {
  const data = await apiFetch(`/saved-countries/${id}`, {
    method: 'DELETE',
  });
  return data;
}