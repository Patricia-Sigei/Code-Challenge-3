// Select DOM elements
const filmList = document.getElementById('films');
const title = document.getElementById('title');
const runtime = document.getElementById('runtime');
const filmInfo = document.getElementById('film-info');
const poster = document.getElementById('poster');
const showtime = document.getElementById('showtime');
const ticketNum = document.getElementById('ticket-num');
const buyTicketButton = document.getElementById('buy-ticket');

// Base URL for the API
const BASE_URL = 'http://localhost:3000/films';

// Function to fetch films from the API
const fetchFilms = async () => {
  const response = await fetch(BASE_URL);
  const films = await response.json();
  return films;
};

// Function to fetch a specific film by ID
const fetchFilmById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  const film = await response.json();
  return film;
};

// Function to display the films in the sidebar
const displayFilms = async () => {
  const films = await fetchFilms();
  filmList.innerHTML = ''; // Clear existing films

  films.forEach(film => {
    const filmItem = document.createElement('li');
    filmItem.className = 'film item';
    filmItem.innerText = film.title;

    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'ui red button';
    deleteButton.onclick = () => deleteFilm(film.id);

    filmItem.appendChild(deleteButton);
    filmItem.onclick = () => displayFilmDetails(film.id);
    filmList.appendChild(filmItem);
  });

  // Automatically display the first film's details
  if (films.length > 0) {
    displayFilmDetails(films[0].id);
  }
};

// Function to display details of the selected film
const displayFilmDetails = async (id) => {
  const film = await fetchFilmById(id);
  
  title.innerText = film.title;
  runtime.innerText = `${film.runtime} minutes`;
  filmInfo.innerText = film.description;
  poster.src = film.poster;
  showtime.innerText = film.showtime;
  
  const availableTickets = film.capacity - film.tickets_sold;
  ticketNum.innerText = availableTickets;

  if (availableTickets === 0) {
    buyTicketButton.innerText = 'Sold Out';
    buyTicketButton.disabled = true;
  } else {
    buyTicketButton.innerText = 'Buy Ticket';
    buyTicketButton.disabled = false;
    buyTicketButton.onclick = () => buyTicket(film);
  }
};

// Function to buy a ticket
const buyTicket = async (film) => {
  if (film.tickets_sold < film.capacity) {
    const newTicketsSold = film.tickets_sold + 1;

    // Update tickets_sold on the server
    await fetch(`${BASE_URL}/${film.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tickets_sold: newTicketsSold }),
    });

    // Add a new ticket
    await fetch('http://localhost:3000/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        film_id: film.id,
        number_of_tickets: 1,
      }),
    });

    // Update the displayed film details
    displayFilmDetails(film.id);
    displayFilms();
  }
};

// Function to delete a film
const deleteFilm = async (id) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  
  // Refresh the film list
  displayFilms();
};

// Initial load of films
document.addEventListener('DOMContentLoaded', displayFilms);
