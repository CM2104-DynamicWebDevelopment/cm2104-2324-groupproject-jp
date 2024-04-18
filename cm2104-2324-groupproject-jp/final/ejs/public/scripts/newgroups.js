/*
  Created by Michael Piercey 2206222 -- finalised 11/12/23
*/


function showGroup(groupCode) {
    // Ajax request to fetch group details
    fetch(`/groups/${groupCode}`)
        .then(response => response.json())
        .then(group => {
            // Get the container for displaying group details
            const groupContainer = document.getElementById(`container-${group.groupName}`);
            groupContainer.innerHTML = ''; // Clear previous content

            // Create elements for each movie in the group's reviews
            group.reviews.forEach(review => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('watchlist-movie-card');

                const movieDetails = document.createElement('div');
                movieDetails.classList.add('watchlist-movie-details');

                const movieTitle = document.createElement('h2');
                movieTitle.textContent = review.movieTitle;

                const moviePoster = document.createElement('img');
                moviePoster.src = review.moviePoster;
                moviePoster.alt = 'Movie Poster';

                const movieYear = document.createElement('p');
                movieYear.textContent = `Year: ${review.movieYear}`;

                movieDetails.appendChild(movieTitle);
                movieDetails.appendChild(moviePoster);
                movieDetails.appendChild(movieYear);

                const extraDetails = document.createElement('div');
                extraDetails.classList.add('watchlist-extra');

                const ratingHeader = document.createElement('h3');
                ratingHeader.textContent = 'List of ratings';

                extraDetails.appendChild(ratingHeader);

                // Loop through ratings and create elements for each
                review.ratings.forEach(rating => {
                    const ratingElement = document.createElement('h6');
                    ratingElement.textContent = `${rating.username} ${rating.rating}`;

                    extraDetails.appendChild(ratingElement);
                });

                // Append movie details and ratings to movie card
                movieCard.appendChild(movieDetails);
                movieCard.appendChild(extraDetails);

                // Append movie card to group container
                groupContainer.appendChild(movieCard);
            });

            // Show the group container
            groupContainer.style.display = 'block';
        })
        .catch(error => console.error('Error fetching group details:', error));
}

function showGroupContent(page) {
  var groupSelectorChat = document.querySelectorAll('.group-selector-container-chat');
  var groupSelectorWatchlist = document.querySelectorAll('.group-selector-container-watchlist');
  var watchlistContainers = document.querySelectorAll('.watchlist-container');
  var chatContainers = document.querySelectorAll('.chat-container');

  if (page === 'watchlists') {
      groupSelectorChat.forEach(function(container) {
          container.style.display = 'block';
      });
      groupSelectorWatchlist.forEach(function(container) {
          container.style.display = 'none';
      });
      watchlistContainers.forEach(function(container) {
          container.style.display = 'block';
      });
      chatContainers.forEach(function(container) {
          container.style.display = 'none';
      });
  } else if (page === 'chat') {
      groupSelectorChat.forEach(function(container) {
          container.style.display = 'none';
      });
      groupSelectorWatchlist.forEach(function(container) {
          container.style.display = 'block';
      });
      watchlistContainers.forEach(function(container) {
          container.style.display = 'none';
      });
      chatContainers.forEach(function(container) {
          container.style.display = 'block';
      });
  }
}
