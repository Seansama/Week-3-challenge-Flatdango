let films = [];
const filmList = document.getElementById('films');
const image = document.getElementById('poster');
const movieTitle = document.getElementById('title');
const runtime = document.getElementById('runtime');
const description = document.getElementById('film-info');
const showTime = document.getElementById('showtime');
const tickets = document.getElementById('ticket-num');
const button = document.getElementById('buy-ticket');

const getFilms = async () => {
    const response = await fetch('http://localhost:3000/films');
    const responseData = await response.json();
    return responseData;
}

const changeDom = (title) => {
    const foundMovie = films.find(each => each.title === title);
    image.src = foundMovie.poster;
    movieTitle.innerHTML = foundMovie.title;
    runtime.innerHTML = `${foundMovie.runtime} minutes`;
    description.innerHTML = foundMovie.description;
    showTime.innerHTML = foundMovie.showtime;
    tickets.innerHTML = `${foundMovie.capacity - foundMovie.tickets_sold}`;
}

const sellTicketHandler = async () => {
    const currentMovieTitle = document.getElementById('title').innerHTML;
    const foundMovie = films.find(each => each.title === currentMovieTitle);
    const movieId = foundMovie.id;
    if(foundMovie.capacity === foundMovie.tickets_sold){
        button.classList.add('sold-out');
        button.classList.remove('orange');
        return;
    }
    const moreSold = foundMovie.tickets_sold + 1;
    const response = await fetch(`http://localhost:3000/films/${movieId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'accept': 'application/json' }, body: JSON.stringify({ tickets_sold: moreSold }) });
    const responseData = await response.json();
    tickets.innerHTML = `${responseData.capacity - moreSold}`;
    for (const a of films) {
        if(a.id === movieId){
            a.tickets_sold = moreSold;
        }
    }
}

const initialization = async () => {
    films = await getFilms();
    filmList.innerHTML = '';
    for (const a of films) {
        filmList.innerHTML += `<li onclick="changeDom('${a.title}')">${a.title}</li>`;
    }
    changeDom(films[0].title)
}

button.addEventListener('click', sellTicketHandler);

document.addEventListener('DOMContentLoaded', initialization)