// TMDB access layer.
//
// The API key is public because this is an internal weekend project with no
// backend. All TMDB calls go through fetchMovieList(), so moving the key
// behind a proxy later only means changing the values below.

const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
const TMDB_API_KEY = '6870fe6f90363ceac68a9596498c1d9c';
const TMDB_POSTER_SIZE = 'w342';
const TMDB_REGION = 'ID';
const TMDB_LANGUAGE = 'en-US';

// TMDB only exposes Indonesian-wide movie data (region=ID).
// There is no city-level theatrical availability in this API, so the result
// must never be presented as city-specific.
async function fetchMovieList(listPath) {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: TMDB_LANGUAGE,
    page: '1',
    region: TMDB_REGION
  });

  let response;
  try {
    response = await fetch(`${TMDB_API_BASE}/movie/${listPath}?${params.toString()}`);
  } catch (error) {
    return { ok: false, movies: [] };
  }

  if (!response.ok) {
    return { ok: false, movies: [] };
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    return { ok: false, movies: [] };
  }

  const movies = (data.results || []).map((movie) => ({
    id: movie.id,
    title: movie.title || movie.original_title || 'Tanpa judul',
    posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE}/${TMDB_POSTER_SIZE}${movie.poster_path}` : null,
    releaseDate: movie.release_date || null
  }));

  return { ok: true, movies };
}

function fetchNowPlayingMovies() {
  return fetchMovieList('now_playing');
}

function fetchUpcomingMovies() {
  return fetchMovieList('upcoming');
}
