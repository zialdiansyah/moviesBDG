if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js')
    .then(() => { console.log('Service Worker Registered'); });
}

const movieContainer = document.getElementById('movie-container')

loadMovies()

async function loadMovies() {
  await fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=6870fe6f90363ceac68a9596498c1d9c&language=en-US&page=1&region=ID')
    .then(response => response.json())
    .then(json =>{
      let movies = json.results;
      let listMovies = "";

      for(const movie of movies) {
        listMovies += `
                      <div class="movie">
                        <div class="movie-poster">
                          <img src = "http://image.tmdb.org/t/p/w185/${movie.poster_path}" />
                        </div>
                        <div class="judul">
                          <span>${movie.title}</span>
                        </div>
                      </div>
                    `
      };
      movieContainer.innerHTML = listMovies;
    });
}
