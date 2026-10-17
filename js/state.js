// Global application state: the selected city, persisted in localStorage.

const CITY_STORAGE_KEY = 'bioskop.city';
const cityChangeListeners = [];

function getSelectedCity() {
  let storedId = null;
  try {
    storedId = localStorage.getItem(CITY_STORAGE_KEY);
  } catch (error) {
    // Storage may be unavailable (private mode); fall back to the default city.
  }
  return getCityById(storedId) || getCityById(DEFAULT_CITY_ID);
}

function setSelectedCity(cityId) {
  const city = getCityById(cityId);
  if (!city) return;

  try {
    localStorage.setItem(CITY_STORAGE_KEY, city.id);
  } catch (error) {
    // Persisting is best-effort; the in-memory selection still applies.
  }

  for (const listener of cityChangeListeners) {
    listener(city);
  }
}

function onCityChange(listener) {
  cityChangeListeners.push(listener);
}
