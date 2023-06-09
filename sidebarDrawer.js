var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
let lastUrl = '';
var totalPages = 100;

const collapsedClass = "sidebar--collapsed";

const lsKey = "sidebarcollapsed";

const API_KEY = "api_key=56f6e28247ce8b75fe049535300b004d";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL+ '/search/movie?' + API_KEY;

const movie_cards = document.querySelector(".movie_cards");
const form = document.getElementById("form");
const search = document.getElementById("search");

const genres = [
  { "id": 28, "name": "Action" },
  { "id": 12, "name": "Adventure" },
  { "id": 16, "name": "Animation" },
  { "id": 35, "name": "Comedy" },
  { "id": 80, "name": "Crime" },
  { "id": 99, "name": "Documentary" },
  { "id": 18, "name": "Drama" },
  { "id": 10751, "name": "Family" },
  { "id": 14, "name": "Fantasy" },
  { "id": 36, "name": "History" },
  { "id": 27, "name": "Horror" },
  { "id": 10402, "name": "Music" },
  { "id": 9648, "name": "Mystery" },
  { "id": 10749, "name": "Romance" },
  { "id": 878, "name": "Science Fiction" },
  { "id": 10770, "name": "TV Movie" },
  { "id": 53, "name": "Thriller" },
  { "id": 10752, "name": "War" },
  { "id": 37, "name": "Western" }
];

sidebarDrawer();
function sidebarDrawer(){

    const sidebar = document.querySelector(".sidebar");
    
    const nav = document.querySelector(".nav");
    const logo = document.querySelector(".logo");
    
    if(localStorage.getItem(lsKey) === "true"){
        sidebar.classList.add(collapsedClass);
    };
    
    logo.addEventListener("click", () => {
        sidebar.classList.toggle(collapsedClass);
        localStorage.setItem(lsKey, sidebar.classList.contains(collapsedClass));
    });
}

getMovies(API_URL);
lastUrl=API_URL
function getMovies(url){
    console.log(url)
    fetch(url).then(res => res.json()).then(data => {
        console.log(data);
        if(data.results.length !== 0){
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if(currentPage <= 1){
              prev.classList.add('disabled');
              next.classList.remove('disabled')
            }else if(currentPage>= totalPages){
              prev.classList.remove('disabled');
              next.classList.add('disabled')
            }else{
              prev.classList.remove('disabled');
              next.classList.remove('disabled')
            }

        }else{
            main.innerHTML= `<h1 class="no-results">No Results Found</h1>`
        }
    });
}

function showMovies(data){
    movie_cards.innerHTML = "";

    data.forEach(movie =>{
        const {poster_path
, genre_ids,title,vote_average
} = movie;
        
const genreNames = genre_ids.map(genreId => {
  const genre = genres.find(genre => genre.id === genreId);
  return genre ? genre.name : "";
});

        const movieEl = document.createElement("div");

        movieEl.classList.add("movie");

        movieEl.innerHTML = `
        <img src = "${IMG_URL+poster_path}", alt = ${title} width="300">
                    
                    <div class="movie-info">
                        <div class ="genre"> <span>${genreNames.join(", ")}</span></div>
                        <div class = "stars"> ${vote_average}</div>
                        <div class = "title">${title}</div>
                        
                    </div>
                </div>`
        movie_cards.appendChild(movieEl);
    })
}

form.addEventListener('submit',(e) =>{
    e.preventDefault();

    const searchterm = search.value;

    if(searchterm){
        getMovies(searchURL + '&query='+ searchterm);
    }
})

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')



prev.addEventListener('click', () => {
    if(prevPage > 0){
      pageCall(prevPage);
    }
  })
  
  next.addEventListener('click', () => {
    if(nextPage <= totalPages){
      pageCall(nextPage);
    }
  })
  
  function pageCall(page){
    console.log('a')
    let urlSplit = lastUrl.split('?');
    console.log(urlSplit);
    let queryParams = urlSplit[1].split('&');
    console.log(queryParams);
    let key = queryParams[queryParams.length -1].split('=');
    if(key[0] != 'page'){
      let url = lastUrl + '&page='+page
      getMovies(url);
    }else{
      key[1] = page.toString();
      let a = key.join('=');
      queryParams[queryParams.length -1] = a;
      let b = queryParams.join('&');
      let url = urlSplit[0] +'?'+ b
      getMovies(url);
    }
  }


