 // fetch films from json file
 fetch('http://localhost:3000/films')
 .then(response => response.json())
 .then(films => {
   const filmsList = document.getElementById('films');

   // clear placeholder text
   filmsList.innerHTML = '';

   // films list population
   films.forEach(film => {
     const li = document.createElement('li');
     li.className = 'film-item';
     li.textContent = film.title;

     // event listener for loading movie details
     li.addEventListener('click', () => {
       displayMovieDetails(film);
     });

     filmsList.appendChild(li);
   });

   //  display the first movie details on loading
   if (films.length > 0) {
     displayMovieDetails(films[0]);
   }
 })
 .catch(error => console.error('Error fetching films:', error));

// display movie details
function displayMovieDetails(movie) {
 const poster = document.getElementById('poster');
 const title = document.getElementById('title');
 const runtime = document.getElementById('runtime');
 const filmInfo = document.getElementById('film-info');
 const showtime = document.getElementById('showtime');
 const ticketNum = document.getElementById('ticket-num');
 const buyTicketButton = document.getElementById('buy-ticket');

 // update poster & movie details
 poster.src = movie.poster;
 poster.alt = movie.title;
 title.textContent = movie.title;
 runtime.textContent = `${movie.runtime} minutes`;
 filmInfo.textContent = movie.description;
 showtime.textContent = movie.showtime;

 // calc remaining tickets
 const remainingTickets = movie.capacity - movie.tickets_sold;
 ticketNum.textContent = remainingTickets;

 // enable or disable the buy ticket button based on availability
 if (remainingTickets > 0) {
   buyTicketButton.disabled = false;
   buyTicketButton.textContent = 'Buy Ticket';
 } else {
   buyTicketButton.disabled = true;
   buyTicketButton.textContent = 'Sold Out';
 }

 // code for ticket purchase 
 buyTicketButton.onclick = () => {
   if (remainingTickets > 0) {
     // decrease the number of remaining tickets
     const newRemainingTickets = remainingTickets - 1;
     ticketNum.textContent = newRemainingTickets;

     // btn is disabled if no tickets are left
     if (newRemainingTickets === 0) {
       buyTicketButton.disabled = true;
       buyTicketButton.textContent = 'Sold Out';
     }

     // ticket updation in the server
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