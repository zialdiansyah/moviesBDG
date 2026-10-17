// Local reference data. Movies come from TMDB; cities and cinemas live here.
// Add a city by appending one entry to CITIES.

const DEFAULT_CITY_ID = 'bandung';

const CITIES = [
  {
    id: 'bandung',
    name: 'Bandung',
    center: { lat: -6.9175, lng: 107.6191 },
    cinemas: [
      {
        id: 'empire-xxi-bip',
        name: 'Empire XXI BIP',
        coordinates: { lat: -6.9085809, lng: 107.610938 },
        address: 'Bandung Indah Plaza, Jl. Merdeka No. 56, Kota Bandung',
        image: 'img/empire.jpg'
      },
      {
        id: 'cinema-xxi-ciwalk',
        name: 'Cinema XXI Ciwalk',
        coordinates: { lat: -6.8931907, lng: 107.6023293 },
        address: 'Cihampelas Walk, Jl. Cihampelas No. 160, Kota Bandung',
        image: 'img/ciwalk.jpg'
      },
      {
        id: 'btc-cinema-xxi',
        name: 'BTC Cinema XXI',
        coordinates: { lat: -6.8929973, lng: 107.5827022 },
        address: 'Bandung Trade Center P2 Lt. 3, Jl. Dr. Djunjunan No. 143-149, Kota Bandung',
        image: 'img/btc.jpg'
      },
      {
        id: 'braga-xxi',
        name: 'Braga XXI',
        coordinates: { lat: -6.9171388, lng: 107.6066858 },
        address: 'Braga City Walk Lt. 2, Jl. Braga No. 99-101, Kota Bandung',
        image: 'img/braga.jpg'
      },
      {
        id: 'festival-citylink-xxi',
        name: 'Festival Citylink XXI',
        coordinates: { lat: -6.9295834, lng: 107.5836468 },
        address: 'Festival Citylink Lt. 3A, Jl. Peta No. 241, Kota Bandung',
        image: 'img/fcl.jpg'
      }
    ]
  },
  { id: 'jakarta', name: 'Jakarta', center: { lat: -6.2088, lng: 106.8456 }, cinemas: [] },
  { id: 'surabaya', name: 'Surabaya', center: { lat: -7.2575, lng: 112.7521 }, cinemas: [] },
  { id: 'medan', name: 'Medan', center: { lat: 3.5952, lng: 98.6722 }, cinemas: [] },
  { id: 'semarang', name: 'Semarang', center: { lat: -6.9667, lng: 110.4167 }, cinemas: [] },
  { id: 'yogyakarta', name: 'Yogyakarta', center: { lat: -7.7956, lng: 110.3695 }, cinemas: [] },
  { id: 'makassar', name: 'Makassar', center: { lat: -5.1477, lng: 119.4327 }, cinemas: [] }
];

function getCityById(cityId) {
  return CITIES.find((city) => city.id === cityId) || null;
}
