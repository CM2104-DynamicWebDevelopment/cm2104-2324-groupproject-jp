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





function getSearchFromTMDBWatchlist() {
    var movieTitle = document.getElementById('movie-search-bar').value;
    var groupCode = document.getElementById('groupcode').value;

    console.log("Hello");
    console.log(movieTitle);
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
        displayWatchlistResultsSearch(jsondata.results, groupCode);
    });
}

function displayWatchlistResultsSearch(movies, groupCode) {
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
            "<div class='results-extra' id='results-extra-" + id + "' style=\"background-image: url('https://image.tmdb.org/t/p/original/" + movieBackdrop + "'); display: block;\">" +
            "<h3>About " + title + "</h3>" +
            "<p>" + movieDescription + "</p>" +
            "<form id='watchlistForm' action='/addwatchlist' method='POST'>" +
            "<input type='hidden' name='movieId' value='" + id + "'>" +
            "<input type='hidden' name='groupCode' value='" + groupCode + "'>" + // Include group code in the form
            "<button class='button-watchlist' type='submit'>Add to Watchlist</button>" +
            "</form>" +
            "<button class='button-review' type='submit' onclick='addReview(" + id + ")'>Review</button>" +
            "</div>" +
            "<div class='make-review' id='make-review-" + id + "'  style=\"background-image: url('https://image.tmdb.org/t/p/original/" + movieBackdrop + "'); display: none;\">" +
            "<form id='reviewForm' action='/addreview' method='POST'>" +
            "<input type='hidden' name='movieId' value='" + id + "'>" +
            "<input type='hidden' name='groupCode' value='" + groupCode + "'>" + // Include group code in the form
            "<h6>number review</h6>" +
            "<select name='rating'>" +
            "<option value='1'>1</option>" +
            "<option value='2'>2</option>" +
            "<option value='3'>3</option>" +
            "<option value='4'>4</option>" +
            "<option value='5'>5</option>" +
            "</select>" +
            "<div class='review-section'>" +
            "<label class='comments-review'>Have your say:</label>" +
            "<textarea class='review-section-text' rows='3' name='review'></textarea>" +
            "<button class='leave-review' type='submit'>Leave review</button>" +
            "</div>" +
            "</form>" +
            "<button class='back' onclick='backReview(" + id + ")'>Back</button>" +
            "</div>" +
            "</div>";
    }
    // insert html into search results container with group code
    $('.results-movie-card-container-' + groupCode).html(htmlString);
}
