function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('sw.js').catch(() => {
    // Offline caching is a progressive enhancement; the app works without it.
  });
}
