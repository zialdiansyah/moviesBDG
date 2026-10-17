// Cinema page: Leaflet map of cinemas for the selected city.
// Cinema data comes from js/data.js; markers only reference a cinema id.

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const mapElement = document.getElementById('map');
const hintElement = document.getElementById('map-hint');
const emptyElement = document.getElementById('map-empty');
const emptyMessage = document.getElementById('map-empty-message');
const pageTitle = document.getElementById('cinema-page-title');
const previewElement = document.getElementById('cinema-preview');
const previewImage = document.getElementById('cinema-preview-image');
const previewFallback = document.getElementById('cinema-preview-fallback');
const previewName = document.getElementById('cinema-preview-name');
const previewAddress = document.getElementById('cinema-preview-address');
const previewClose = document.getElementById('cinema-preview-close');

const markersById = new Map();
let map;
let selectedCinemaId = null;

initCinemaPage();

function initCinemaPage() {
  registerServiceWorker();
  initCityUI();
  initMap();

  previewClose.addEventListener('click', clearSelection);
  previewImage.addEventListener('error', () => {
    previewImage.hidden = true;
    previewFallback.hidden = false;
  });

  onCityChange(showCity);
  showCity(getSelectedCity());
}

function initMap() {
  map = L.map(mapElement);

  L.tileLayer(TILE_URL, {
    maxZoom: 19,
    attribution: TILE_ATTRIBUTION
  }).addTo(map);

  window.addEventListener('resize', () => map.invalidateSize());
}

function showCity(city) {
  pageTitle.textContent = `Bioskop di ${city.name}`;
  document.title = `${city.name} — Bioskop`;

  clearSelection();
  removeMarkers();

  if (city.cinemas.length === 0) {
    hintElement.hidden = true;
    emptyMessage.textContent = `Belum ada data bioskop di ${city.name}.`;
    emptyElement.hidden = false;
    map.setView([city.center.lat, city.center.lng], 12);
    return;
  }

  emptyElement.hidden = true;
  hintElement.hidden = false;

  for (const cinema of city.cinemas) {
    markersById.set(cinema.id, createMarker(cinema));
  }

  const bounds = L.latLngBounds(
    city.cinemas.map((cinema) => [cinema.coordinates.lat, cinema.coordinates.lng])
  );
  map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
}

function createMarker(cinema) {
  const marker = L.marker([cinema.coordinates.lat, cinema.coordinates.lng], {
    icon: L.divIcon({
      className: 'cinema-marker',
      html: '<span class="cinema-marker-dot"></span>',
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    }),
    title: cinema.name,
    alt: cinema.name
  });

  marker.on('click', () => selectCinema(cinema.id));
  marker.addTo(map);
  return marker;
}

function removeMarkers() {
  for (const marker of markersById.values()) {
    marker.remove();
  }
  markersById.clear();
}

function selectCinema(cinemaId) {
  const city = getSelectedCity();
  const cinema = city.cinemas.find((item) => item.id === cinemaId);
  if (!cinema) return;

  if (selectedCinemaId) {
    const previous = markersById.get(selectedCinemaId);
    const element = previous && previous.getElement();
    if (element) element.classList.remove('is-selected');
  }

  selectedCinemaId = cinemaId;
  const selected = markersById.get(cinemaId);
  const selectedElement = selected && selected.getElement();
  if (selectedElement) selectedElement.classList.add('is-selected');

  showPreview(cinema);
  hintElement.hidden = true;

  map.panInside([cinema.coordinates.lat, cinema.coordinates.lng], {
    paddingTopLeft: [32, 72],
    paddingBottomRight: [32, 200]
  });
}

function showPreview(cinema) {
  previewImage.hidden = false;
  previewFallback.hidden = true;
  previewImage.src = cinema.image;
  previewImage.alt = '';
  previewName.textContent = cinema.name;
  previewAddress.textContent = cinema.address;
  previewElement.hidden = false;
}

function clearSelection() {
  previewElement.hidden = true;
  previewImage.removeAttribute('src');
  previewImage.hidden = false;
  previewFallback.hidden = true;

  if (selectedCinemaId) {
    const marker = markersById.get(selectedCinemaId);
    const element = marker && marker.getElement();
    if (element) element.classList.remove('is-selected');
  }
  selectedCinemaId = null;
}
