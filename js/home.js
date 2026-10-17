// Home page: two toggleable lists — now playing and upcoming (TMDB region=ID).

const TABS = ['now-playing', 'upcoming'];

const TAB_META = {
  'now-playing': {
    title: 'Now Playing',
    note: 'Sedang tayang di Indonesia · data TMDB',
    load: fetchNowPlayingMovies
  },
  'upcoming': {
    title: 'Upcoming',
    note: 'Akan tayang di Indonesia · data TMDB',
    load: fetchUpcomingMovies
  }
};

const tabButtons = TABS.map((tabId) => document.getElementById(`tab-${tabId}`));
const sectionTitle = document.getElementById('now-playing-title');
const sectionNote = document.getElementById('movie-section-note');
const moviePanel = document.getElementById('movie-panel');
const movieList = document.getElementById('movie-list');
const movieStatus = document.getElementById('movie-status');
const movieStatusMessage = document.getElementById('movie-status-message');
const movieRetry = document.getElementById('movie-retry');

const SKELETON_COUNT = 6;
const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

let activeTab = TABS[0];
const listCache = { 'now-playing': null, 'upcoming': null };

initHome();

function initHome() {
  registerServiceWorker();
  initCityUI();

  for (const button of tabButtons) {
    if (!button) continue;
    button.addEventListener('click', () => switchTab(button.dataset.tab));
    button.addEventListener('keydown', onTabKeydown);
  }
  movieRetry.addEventListener('click', () => loadList(activeTab));

  loadList(activeTab);
}

function switchTab(tabId) {
  if (!TABS.includes(tabId) || tabId === activeTab) return;

  activeTab = tabId;
  syncTabUI();
  renderActiveList();
}

function onTabKeydown(event) {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();

  const currentIndex = TABS.indexOf(activeTab);
  const step = event.key === 'ArrowRight' ? 1 : TABS.length - 1;
  const nextIndex = (currentIndex + step) % TABS.length;

  switchTab(TABS[nextIndex]);
  if (tabButtons[nextIndex]) tabButtons[nextIndex].focus();
}

function syncTabUI() {
  const meta = TAB_META[activeTab];

  for (const button of tabButtons) {
    if (!button) continue;
    const isSelected = button.dataset.tab === activeTab;
    button.setAttribute('aria-selected', String(isSelected));
    button.tabIndex = isSelected ? 0 : -1;
  }

  sectionTitle.textContent = meta.title;
  sectionNote.textContent = meta.note;
  document.title = `${meta.title} — Bioskop`;
  moviePanel.setAttribute('aria-labelledby', `tab-${activeTab}`);
}

function renderActiveList() {
  const cached = listCache[activeTab];
  if (cached) {
    renderListResult(activeTab, cached);
    return;
  }
  loadList(activeTab);
}

async function loadList(tabId) {
  renderLoading();

  const result = await TAB_META[tabId].load();
  if (tabId !== activeTab) return; // Tab changed while loading; discard stale result.

  listCache[tabId] = result;
  renderListResult(tabId, result);
}

function renderListResult(tabId, result) {
  if (tabId !== activeTab) return;

  if (!result.ok) {
    renderError();
    return;
  }
  if (result.movies.length === 0) {
    renderEmpty();
    return;
  }
  renderMovies(result.movies, tabId === 'upcoming');
}

function renderLoading() {
  showStatus(null);
  movieList.setAttribute('aria-busy', 'true');
  movieList.textContent = '';

  const fragment = document.createDocumentFragment();
  for (let index = 0; index < SKELETON_COUNT; index += 1) {
    const item = el('li', 'movie-card');
    item.append(el('div', 'skeleton-poster'), el('div', 'skeleton-line'));
    fragment.appendChild(item);
  }
  movieList.appendChild(fragment);
}

function renderMovies(movies, showReleaseDate) {
  movieList.removeAttribute('aria-busy');
  movieList.textContent = '';

  const fragment = document.createDocumentFragment();
  for (const movie of movies) {
    fragment.appendChild(createMovieCard(movie, showReleaseDate));
  }
  movieList.appendChild(fragment);
  showStatus(null);
}

function renderError() {
  movieList.removeAttribute('aria-busy');
  movieList.textContent = '';
  showStatus('Gagal memuat daftar film. Periksa koneksi internet lalu coba lagi.', true);
}

function renderEmpty() {
  movieList.removeAttribute('aria-busy');
  movieList.textContent = '';
  showStatus('Belum ada film yang tersedia saat ini.', false);
}

function showStatus(message, showRetry = false) {
  if (!message) {
    movieStatus.hidden = true;
    movieRetry.hidden = true;
    return;
  }
  movieStatusMessage.textContent = message;
  movieRetry.hidden = !showRetry;
  movieStatus.hidden = false;
}

function createMovieCard(movie, showReleaseDate) {
  const item = el('li', 'movie-card');
  const poster = el('div', 'movie-poster');
  poster.appendChild(createPoster(movie.posterUrl));

  item.append(poster, el('h2', 'movie-title', movie.title));

  if (showReleaseDate && movie.releaseDate) {
    const dateText = formatReleaseDate(movie.releaseDate);
    if (dateText) item.appendChild(el('p', 'movie-date', dateText));
  }

  return item;
}

function formatReleaseDate(isoDate) {
  const [year, month, day] = String(isoDate).split('-').map(Number);
  if (!year || !month || !day) return null;
  return `${day} ${MONTHS_ID[month - 1]} ${year}`;
}

function createPoster(posterUrl) {
  if (!posterUrl) return createPosterFallback();

  const image = document.createElement('img');
  image.src = posterUrl;
  image.alt = '';
  image.loading = 'lazy';
  image.decoding = 'async';
  image.addEventListener('error', () => image.replaceWith(createPosterFallback()));
  return image;
}

function createPosterFallback() {
  const fallback = el('div', 'poster-fallback');
  const icon = el('i', 'fa fa-film');
  icon.setAttribute('aria-hidden', 'true');
  fallback.appendChild(icon);
  return fallback;
}
