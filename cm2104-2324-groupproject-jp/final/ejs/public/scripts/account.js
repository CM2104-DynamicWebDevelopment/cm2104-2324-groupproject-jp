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


  
  // Function to fetch watchlist movie IDs
  function fetchWatchlistMovieIds() {
    fetch('/getWatchlistMovieIds')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle the response data
            console.log(data.watchlistMovieIds);
            // Update the HTML content with the watchlist movie IDs
            document.getElementById('watchlist-movie-ids').innerText = data.watchlistMovieIds.join(', ');

            // After fetching movie IDs, build movie cards for each movie
            data.watchlistMovieIds.forEach(movieId => {
                getWatchlistFromTMDB(movieId);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Function to get movie details from TMDB
function getWatchlistFromTMDB(movieId) {
    console.log(movieId);
    var apiKey = "7e6dd248e2a77acc70a843ea3a92a687"; // Replace with your TMDB API key
    var url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + apiKey;
    console.log("movie searched for " + movieId)

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsondata => {
            console.log(jsondata);
            // Build movie card with the retrieved data
            buildMovieCard(jsondata);
        })
        .catch(error => console.error('Error:', error));
}

// Function to build movie card HTML
function buildMovieCard(movieInfo) {
    // Extracting movie information
    var title = movieInfo.original_title;
    var moviePoster = movieInfo.poster_path;
    var movieDescription = movieInfo.overview;
    var releaseDate = movieInfo.release_date.split('-')[0];
    var id = movieInfo.id;

    // Constructing the HTML string for movie card
    var htmlString =
        "<div class='watchlist-movie-card'>" +
        "<div class='watchlist-movie-details'>" +
        "<h2>" + title + "</h2>" +
        "<img src='https://image.tmdb.org/t/p/original/" + moviePoster + "' alt='" + title + " Poster'>" +
        "<p>Year: " + releaseDate + "</p>" +
        "<p>Description: " + movieDescription + "</p>" +
        "</div>" +
        "</div>";

    // Inserting the HTML into the watchlist movie card container
    $('.watchlist-movie-card-container').append(htmlString);
}

// Call fetchWatchlistMovieIds() when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
    fetchWatchlistMovieIds();
    console.log("FETHC WATCHKKKUSTTT CAKKKED")
});