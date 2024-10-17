// Fetch the films from the JSON server
fetch('http://localhost:3000/films')
  .then(response => response.json())
  .then(films => {
    const filmsList = document.getElementById('films');

    // Clear placeholder text
    filmsList.innerHTML = '';

    // Populate the films list
    films.forEach(film => {
      const li = document.createElement('li');
      li.className = 'film item';
      li.textContent = film.title;

      // Add click event listener to load the movie details
      li.addEventListener('click', () => {
        displayMovieDetails(film);
      });

      filmsList.appendChild(li);
    });

    // Automatically display the first movie details on load
    if (films.length > 0) {
      displayMovieDetails(films[0]);
    }
  })
  .catch(error => console.error('Error fetching films:', error));

// Function to display movie details
function displayMovieDetails(movie) {
  const poster = document.getElementById('poster');
  const title = document.getElementById('title');
  const runtime = document.getElementById('runtime');
  const filmInfo = document.getElementById('film-info');
  const showtime = document.getElementById('showtime');
  const ticketNum = document.getElementById('ticket-num');
  const buyTicketButton = document.getElementById('buy-ticket');

  // Update the poster and movie details
  poster.src = movie.poster;
  poster.alt = movie.title;
  title.textContent = movie.title;
  runtime.textContent = `${movie.runtime} minutes`;
  filmInfo.textContent = movie.description;
  showtime.textContent = movie.showtime;

  // Calculate remaining tickets
  const remainingTickets = movie.capacity - movie.tickets_sold;
  ticketNum.textContent = remainingTickets;

  // Enable or disable the Buy Ticket button based on availability
  if (remainingTickets > 0) {
    buyTicketButton.disabled = false;
    buyTicketButton.textContent = 'Buy Ticket';
  } else {
    buyTicketButton.disabled = true;
    buyTicketButton.textContent = 'Sold Out';
  }

  // Handle ticket buying logic
  buyTicketButton.onclick = () => {
    if (remainingTickets > 0) {
      // Decrease the number of remaining tickets
      const newRemainingTickets = remainingTickets - 1;
      ticketNum.textContent = newRemainingTickets;

      // If no tickets left, disable the button
      if (newRemainingTickets === 0) {
        buyTicketButton.disabled = true;
        buyTicketButton.textContent = 'Sold Out';
      }

      // Update tickets_sold in the server
      fetch(`http://localhost:3000/films/${movie.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tickets_sold: movie.tickets_sold + 1,
        }),
      })
        .then(response => response.json())
        .catch(error => console.error('Error updating tickets:', error));
    }
  };
}
