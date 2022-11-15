"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const actorRes = await fetchCredits(movie.id);
  renderMovie(movieRes, actorRes.cast);
};

const actorDetails = async (actor) => {
  const actorRes = await fetchActor(actor.id);
  renderActor(actorRes);
  console.log(actorRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};
// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

const fetchCredits = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
};

const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  return res.json();
};

const fetchActor = async (actorId) => {
  const url = constructUrl(`person/${actorId}`);
  const res = await fetch(url);
  return res.json();
};

/* Filter starts here */
/* Popular movies */
const fetchPopular = async () => {
  const url = constructUrl(`movie/popular`);
  const res = await fetch(url);
  return res.json();
}
const popularNav = document.getElementById('popular');
popularNav.addEventListener('click', async() =>{
  const popular = await fetchPopular();
  renderPopularMovies(popular.results);
  /* console.log(popular.results); */
})

/* Top Rated */
const fetchTopRated = async () => {
  const url = constructUrl(`movie/top_rated`);
  const res = await fetch(url);
  return res.json();
}
const topRatedNav = document.getElementById('top-rated');
popularNav.addEventListener('click', async() =>{
  const topRated = await fetchTopRated();
  renderMovies(topRated);
})

/* Now Playing */
const fetchNowPlaying = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
}

/* Up Coming */
const fetchUpComing = async () => {
  const url = constructUrl(`movie/upcoming`);
  const res = await fetch(url);
  return res.json();
}
const upComingNav = document.getElementById('up-coming');
upComingNav.addEventListener('click', async() =>{
  const upComing = await fetchUpComing();
  renderMovies(upComing);
})
/* Filter ends here */

const fetchGenres = async () => {
  const url = constructUrl(`genre/movie/list`);
  const res = await fetch(url);
  return res.json();
};

const actorsNav = document.querySelector(".actors-nav");
actorsNav.addEventListener("click", async () => {
  const actors = await fetchActors();
  renderActors(actors.results);
});

/* Rendering all actors */
const renderActors = (actors) => {
  CONTAINER.innerHTML = "";
  actors.map((actor) => {
    const actorCard = document.createElement("div");
    actorCard.className = "movie-container ";
    actorCard.innerHTML = `
    <div class="actor-card">
      <img src="${PROFILE_BASE_URL}${actor.profile_path}" alt="${actor.name}" />
      <div class="actor-card-info">
        <h3>${actor.name}</h3>
        <p>${actor.known_for_department}</p>
        </div>
    </div>
    `;
    actorCard.addEventListener("click", () => {
      //here we are calling the actorDetails function with the actor as an argument
      actorDetails(actor);
    });
    CONTAINER.appendChild(actorCard);
  });
};

const genres = [];

fetch("./genres.json")
  .then((response) => response.json())
  .then((data) => {
    genres.push(...data.genres);
  });

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const genreNames = movie.genre_ids.map((id) => {
      const genre = genres.find((genre) => genre.id === id);
      return genre.name;
    });

    const movieDiv = document.createElement("div");
    movieDiv.className = "movie-container ";
    movieDiv.innerHTML = `
    <div class=" movieCard">
    <div class="face face1">
        <div class="content">
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>
          </div>
        </div>
        <div class="dropdown-info face2">
        <div class="content">
        <i class="fa-solid fa-star star">
        <span class="rating">${movie.vote_average}</span>
        </i>  
        <p class="genre">${genreNames.join(", ")}</p>
        <p>${
          movie.overview.length > 100
            ? movie.overview.substring(0, 100) + "..."
            : movie.overview
        }</p>
        <button type="button" class="btn btn-info btn-rounded">Click here for more details...</button>
        </div>
    </div>
    </div>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });

    CONTAINER.appendChild(movieDiv);
  });
};

/* Popular movies */
const renderPopularMovies = (popular) => {
  popular.map((movie) => {
    const genreNames = movie.genre_ids.map((id) => {
      const genre = genres.find((genre) => genre.id === id);
      return genre.name;
    });

    const movieDiv = document.createElement("div");
    movieDiv.className = "movie-container ";
    movieDiv.innerHTML = `
    <div class=" movieCard">
    <div class="face face1">
        <div class="content">
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>
          </div>
        </div>
        <div class="dropdown-info face2">
        <div class="content">
        <i class="fa-solid fa-star star">
        <span class="rating">${movie.vote_average}</span>
        </i>  
        <p class="genre">${genreNames.join(", ")}</p>
        <p>${
          movie.overview.length > 100
            ? movie.overview.substring(0, 100) + "..."
            : movie.overview
        }</p>
        <button type="button" class="btn btn-info btn-rounded">Click here for more details...</button>
        </div>
    </div>
    </div>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });

    CONTAINER.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, movieCredits) => {
  const credits = movieCredits.slice(0, 5);
  const nullImage =
    "https://www.sackettwaconia.com/wp-content/uploads/default-profile.png";
  CONTAINER.innerHTML = `
    <div class="col text-white single-movie">
   <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
        <div class="row">
        <div class="col-md-12">
            <h3>Actors:</h3>
            <div class="row">
              ${credits
                .map((actor) => {
                  return `
                  <div class="col-lg  justify-content-between">
                  <img class="img-thumbnail" src="${
                    actor.profile_path !== null
                      ? PROFILE_BASE_URL + actor.profile_path
                      : nullImage
                  }" alt="${actor.name}"/>
          
               <p class="text-center text-white pt-5">${actor.name}</p>
                  </div>
 `;
                })
                .join("")}
              </div>
    </div>
    `;
};

/* THIS FUNCTION HAS SOME BUGS PLEASE FIX IT */

const renderActor = (actor) => {
  const nullImage =
    "https://www.sackettwaconia.com/wp-content/uploads/default-profile.png";
  CONTAINER.innerHTML = `
    <div class="col text-white single-movie">
   <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               actor.profile_path !== null
                 ? PROFILE_BASE_URL + actor.profile_path
                 : nullImage
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${actor.name}</h2>
            <p id="movie-release-date"><b>Known For:</b> ${
              actor.known_for_department
            }</p>
            <p id="movie-runtime"><b>Popularity:</b> ${actor.popularity}</p>
            <h3>Biography:</h3>
            <p id="movie-overview">${actor.biography}</p>
        </div>
        </div>
        <div class="row">
        <div class="col-md-12">
            <h3>Known For:</h3>
            <div class="row">
              ${actor.known_for.map((movie) => {
                return `
                  <div class="col-lg  justify-content-between">
                  <img class="img-thumbnail" src="${
                    movie.poster_path !== null
                      ? POSTER_BASE_URL + movie.poster_path
                      : nullImage
                  }" alt="${movie.title}"/>
                                    <p class="text-center text-white pt-5">${
                                      movie.title
                                    }</p>
                       </div> 
  `;
              })}
              </div>
    </div>
    `;
};

document.addEventListener("DOMContentLoaded", autorun);

//!ToggleButton display

function toggleNav() {
  const navLinks = document.getElementsByClassName("links");
  if (navLinks[0].style.display === "block") {
    navLinks[0].style.display = "none";
  } else {
    navLinks[0].style.display = "block";
  }
}

function toggleSearch() {
  let search = document.querySelector(".search-icon");
  let close = document.querySelector(".cancel-icon");
  let searchBar = document.querySelector(".search-box");
  if (searchBar.style.opacity === "0") {
    searchBar.style.opacity = "1";
    search.style.display = "none";
    close.style.display = "block";
  } else {
    searchBar.style.opacity = "0";
    search.style.display = "block";
    close.style.display = "none";
  }
}
