// ============================================================
// VEXILLO — explore.js
// Logika Explore: load data, render, search, filter, sort
// ============================================================

let countriesData = [];
let activeContinent = 'all';
let searchQuery = '';
let currentSort = 'name-asc';

export async function initExplore() {
  const searchInput = document.getElementById('search-input');
  const filterContainer = document.getElementById('filter-container');
  const sortSelect = document.getElementById('sort-select');

  try {
    const response = await fetch('data/countries.json');
    if (!response.ok) throw new Error('Gagal memuat data negara');
    countriesData = await response.json();
    console.log('Data negara dimuat:', countriesData.length);
  } catch (error) {
    console.error('Error:', error);
    showEmptyState('Gagal memuat data negara.');
    return;
  }

  renderCountries();

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderCountries();
  });

  filterContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeContinent = btn.dataset.continent;
    renderCountries();
  });

  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderCountries();
  });
}

function renderCountries() {
  const grid = document.getElementById('country-grid');
  const emptyState = document.getElementById('empty-state');
  const filterCount = document.getElementById('filter-count');
  if (!grid || !emptyState) return;

  let filtered = [...countriesData];

  if (activeContinent !== 'all') {
    filtered = filtered.filter(c => normalizeContinent(c.continent) === activeContinent);
  }

  if (searchQuery) {
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(searchQuery) ||
      c.capital.toLowerCase().includes(searchQuery) ||
      c.officialName.toLowerCase().includes(searchQuery)
    );
  }

  // Terapkan sortir
  filtered = sortCountries(filtered, currentSort);

  if (filterCount) {
    filterCount.textContent = `${filtered.length} negara`;
  }

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  emptyState.style.display = 'none';

  filtered.forEach(country => {
    const card = createCountryCard(country);
    grid.appendChild(card);
  });
}

function sortCountries(countries, sortBy) {
  const sorted = [...countries];
  switch (sortBy) {
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'capital-asc':
      sorted.sort((a, b) => a.capital.localeCompare(b.capital));
      break;
    case 'capital-desc':
      sorted.sort((a, b) => b.capital.localeCompare(a.capital));
      break;
    case 'population-desc':
      sorted.sort((a, b) => (b.population || 0) - (a.population || 0));
      break;
    case 'population-asc':
      sorted.sort((a, b) => (a.population || 0) - (b.population || 0));
      break;
    case 'area-desc':
      sorted.sort((a, b) => (b.area || 0) - (a.area || 0));
      break;
    case 'area-asc':
      sorted.sort((a, b) => (a.area || 0) - (b.area || 0));
      break;
    default:
      // default: pertahankan urutan asli dari JSON
      break;
  }
  return sorted;
}

function createCountryCard(country) {
  const card = document.createElement('div');
  card.className = 'country-card';
  card.dataset.countryId = country.id;

  const population = formatPopulation(country.population);
  const area = formatArea(country.area);

  card.innerHTML = `
    <div class="country-card-top">
      <img src="https://flagcdn.com/w640/${country.id}.png" alt="${country.name}" class="country-flag" loading="lazy">
      <div class="country-card-title">
        <h3>${country.name}</h3>
        <span class="country-continent">${country.continent}</span>
      </div>
    </div>
    <div class="country-card-stats">
      <div>
        <span>Ibukota</span>
        <strong>${country.capital}</strong>
      </div>
      <div>
        <span>Populasi</span>
        <strong>${population}</strong>
      </div>
      <div>
        <span>Wilayah</span>
        <strong>${area}</strong>
      </div>
    </div>
  `;

  card.addEventListener('click', () => {
    showCountryDetail(country.id);
  });

  return card;
}

function formatPopulation(value) {
  if (!value && value !== 0) return '—';
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (value >= 1_000) {
    return Math.round(value / 1_000) + 'K';
  }
  return value.toString();
}

function formatArea(value) {
  if (!value && value !== 0) return '—';
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M km²';
  }
  return value.toLocaleString('id-ID') + ' km²';
}

function normalizeContinent(continent) {
  const map = {
    'Asia': 'asia',
    'Eropa': 'eropa',
    'Afrika': 'afrika',
    'Amerika Utara': 'amerika-utara',
    'Amerika Selatan': 'amerika-selatan',
    'Oseania': 'oseania',
    'Antartika': 'antartika'
  };
  return map[continent] || continent.toLowerCase().replace(/\s+/g, '-');
}

function showEmptyState(message) {
  const grid = document.getElementById('country-grid');
  const emptyState = document.getElementById('empty-state');
  if (grid) grid.style.display = 'none';
  if (emptyState) {
    emptyState.style.display = 'block';
    emptyState.innerHTML = `<p>${message}</p>`;
  }
}

function showCountryDetail(countryId) {
  if (typeof window.showDetail === 'function') {
    window.showDetail(countryId);
  } else {
    console.error('Fungsi detail tidak tersedia');
  }
}