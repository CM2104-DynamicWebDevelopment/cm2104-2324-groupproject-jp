/*
  Created by Michael Piercey 2206222 -- finalised 11/12/23
*/


// nav bar for showing accout, review, watchlist and freinds, accepts the page user wants to view
function showAccountContent(page) {
    // this hides all containers
    document.querySelectorAll('.account-container').forEach(element => {
      // by setting dispaly to none the container does not appear
        element.style.display = 'none';
    });

    // this then uses input to show selected container
    var selectedContainer = document.getElementById(`container-${page}`);
    if (selectedContainer) {
      // sets display to block instead of none
        selectedContainer.style.display = 'block';
    }
}

// change review function accepts the number of movie to change
function changeReview(num) {
  console.log("change review called");
  // hides the your review container and shows the editing container
  document.getElementById('review-extra-' + num).style.display = 'none';
  document.getElementById('review-change-' + num).style.display = 'flex';
}

// save review function saves the new review and goes back to the your review container
function saveReview(num) {
  console.log("save review called");
  // gets the new review from text box
  var newText = document.getElementById('change-review-textbox-' +num).value;
  // sets the new review to the text from textbox
  document.getElementById('review-text-' + num).innerHTML = newText;
  // hides the edit review and shows the your review container
  document.getElementById('review-extra-' + num).style.display = 'flex';
  document.getElementById('review-change-' + num).style.display = 'none';
}

// view where to watch
function viewWatchlistOptions(num) {
    console.log("watchlist called");
    // hides the users watchlist movie description to show the where to watch 
    document.getElementById('watchlist-extra-' + num).style.display = 'none';
    document.getElementById('watchlist-view-' + num).style.display = 'flex';
  }

// back to watchlist description
  function watchlistBack(num) {
    console.log("back from watchlist called");
    // hides where to watch and shows the description
    document.getElementById('watchlist-extra-' + num).style.display = 'flex';
    document.getElementById('watchlist-view-' + num).style.display = 'none';
  }



// Function to fetch watchlist data from TMDB and display watchlist cards
function getWatchlistFromTMDB(movieIds) {
  movieIds.forEach(function(movieId, index) {
      // Build URL to fetch movie details
      var apiKey = "7e6dd248e2a77acc70a843ea3a92a687";
      var url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + apiKey;

      // Fetch JSON data from TMDB
      $.getJSON(url, function(movie) {
          // Send data to the displayWatchlist function
          displayWatchlist(movie, index);
      });
  });
}

// Function to display watchlist movie card
function displayWatchlist(movie, index) {
  // Extract movie details
  var title = movie.title;
  var moviePoster = movie.poster_path;
  var movieDescription = movie.overview;
  var movieBackdrop = movie.backdrop_path;
  var releaseDate = movie.release_date;

  // Build HTML string for the watchlist movie card
  var htmlString = `
  <div class="watchlist-movie-card">
  <div class="watchlist-movie-details" id="watchlist-movie-details">
      <h2>${title}</h2>
      <img src="https://image.tmdb.org/t/p/original/${moviePoster}" alt="Movie Poster">
      <p>Year: ${releaseDate}</p>
  </div>

  <div class="watchlist-extra" id="watchlist-extra-0" style="background-image: url('https://image.tmdb.org/t/p/original/${movieBackdrop}'); display: flex;">
      <h3>Description</h3>
      <p>${movieDescription}</p>
      <!-- Goes to where to watch using JS, will add where to watch API next semester -->          
      <button class="watchlist-change-button" onclick="viewWatchlistOptions(0)">Where to watch</button>
  </div>

  <div class="watchlist-view" id="watchlist-view-0" style="background-image: url('https://image.tmdb.org/t/p/original/${movieBackdrop}'); display: none;">
      <h3>Where to watch</h3>
      <h4>Disney +</h4>
      <button class="watchlist-back" onclick="watchlistBack(0)">Back</button>
  </div>
</div>`;
  // Insert HTML into watchlist container
  $('#watchlist-movie-card-' + index).html(htmlString);
}
