/*
  Created by Michael Piercey 2206222 -- finalised 11/12/23
*/


// nav bar for showing accout, review, watchlist and freinds, accepts the page user wants to view
function showAccountContent(groupCode) {
    // Hide all containers
    document.querySelectorAll('.account-container').forEach(element => {
        element.style.display = 'none';
    });

    // Show the selected container based on group code
    var selectedContainer = document.getElementById(`container-${groupCode}`);
    if (selectedContainer) {
        selectedContainer.style.display = 'block';
    }
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


function getSearchFromTMDBWatchlist(groupCode) {
    var movieTitle = document.getElementById('movie-search-bar-' + groupCode).value;

    console.log("Hello");
    console.log("Movie Title:", movieTitle);
    console.log("Group Code:", groupCode);

    // build url to get search
    var apiKey = "7e6dd248e2a77acc70a843ea3a92a687"; // Replace with your API key
    var url = "https://api.themoviedb.org/3/search/movie?query=" + movieTitle + "&api_key=" + apiKey;

    // Append group code to the URL
    url += "&groupCode=" + groupCode;

    // get the json data from tmdb
    $.getJSON(url, function(jsondata) {
        console.log(jsondata);
        // send data to the results function
        displayResultsSearch(jsondata.results, groupCode);
    });
}

function displayResultsSearch(movies, groupCode) {
    console.log("movies called");
    // set up the html to be used later
    var htmlString = "";
    // get the top 5 movies from search
    for (var i = 0; i < 5 && i < movies.length; i++) {
        // get the data from the json 
        console.log("review has been called");
        var title = movies[i].title;
        var moviePoster = movies[i].poster_path;
        var movieDescription = movies[i].overview;
        var movieBackdrop = movies[i].backdrop_path;
        var movieRating = movies[i].vote_average;
        var releaseDate = movies[i].release_date;
        var id = movies[i].id;

        console.log("THISSSS IS SSS REVIEWWW Title: " + title);
        console.log("Poster Path: " + moviePoster);
        console.log("Overview: " + movieDescription);
        console.log("Release Date: " + releaseDate);

        // build html string for search results card
        htmlString +=
        "<div class='results-movie-card'>" +
        "<div class='results-movie-details'>" +
        "<h2>" + title + "</h2>" +
        "<img src='https://image.tmdb.org/t/p/original/" + moviePoster + "' alt='" + title + " Poster'>" +
        "<p>" + releaseDate + "</p>" +
        "<p>" + movieRating + "</p>" +
        "</div>" +
        "<div class='results-extra' style=\"background-image: url('https://image.tmdb.org/t/p/original/" + movieBackdrop + "');\">" +
        "<h3>About " + title + "</h3>" +
        "<p>" + movieDescription + "</p>" +
        "<button class='button-watchlist' onclick='toggleWatchlistForm(" + id + ")'>Add to Watchlist</button>" +
        "<div class='add-watchlist' id='add-watchlist-" + id + "' style='display:none;'>" + // Initially hidden
        "<form class='watchlist-form' id='watchlist-form' action='/addgroupwatchlist' method='POST'>" +
        "<input type='hidden' name='movieId' value='" + id + "'>" +
        "<input type='hidden' name='groupCode' value='" + groupCode + "'>" +
        "<label for='watchDate'>Date:</label>" +
        "<input type='date' id='watchDate' name='watchDate' required>" +
        "<label for='watchTime'>Time:</label>" +
        "<input type='time' id='watchTime' name='watchTime' required>" +
        "<button type='submit'>Create Watchlist</button>" +
        "</form>" +
        "</div>" +
        "</div>" +
        "</div>";
    }
        // insert html into search results container with group code
        $('#results-movie-card-container-' + groupCode).html(htmlString);
        }


// Function to toggle the visibility of the watchlist form
function toggleWatchlistForm(id) {
  var watchlistForm = document.getElementById('add-watchlist-' + id);
  if (watchlistForm.style.display === "none" || watchlistForm.style.display === "") {
    watchlistForm.style.display = "block";
  } else {
    watchlistForm.style.display = "none";
  }
}


// Function to get movie details from TMDB
function getWatchlistFromTMDB(movieId, watchDate, watchTime, groupCode) {
    var apiKey = "7e6dd248e2a77acc70a843ea3a92a687"; // Replace with your TMDB API key
    var url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + apiKey;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(movieInfo => {
            // Combine movie details with watch date, watch time, and group code
            movieInfo.watchDate = watchDate;
            movieInfo.watchTime = watchTime;
            // Build movie card with movie info and group code
            buildMovieCard(movieInfo, groupCode);
        })
        .catch(error => console.error('Error:', error));
}


// Function to build movie card HTML and insert it into the watchlist movie card container for a specific group
function buildMovieCard(movieInfo, groupCode) {
    // Extracting movie information
    var title = movieInfo.original_title;
    var moviePoster = movieInfo.poster_path;
    var releaseDate = movieInfo.release_date.split('-')[0];
    var watchDate = movieInfo.watchDate;
    var watchTime = movieInfo.watchTime;

    // Constructing the HTML string for movie card
    var htmlString =
    '<div class="watchlist-movie-card">'+
    '<div class="watchlist-movie-details" id="watchlist-movie-details">'+
        '<h2>' + title + '</h2>' +
        '<img src="https://image.tmdb.org/t/p/original/' + moviePoster + '" alt="Movie Poster">' +
        '<p>Year: ' + releaseDate + '</p>' +
    '</div>' +

    '<div class="watchlist-extra" id="watchlist-extra-' + groupCode + '" style="background-image: url(\'https://image.tmdb.org/t/p/original/' + moviePoster + '\'); display: flex;">' +
        '<h3>Watchlist scheduled</h3>' +
        '<h6>' + watchDate + ': ' + watchTime + '</h6>' +
    '</div>' +

    '</div>';

    // Inserting the HTML into the watchlist movie card container for the specific group
    $('#watchlist-movie-card-container-' + groupCode).append(htmlString);
}
