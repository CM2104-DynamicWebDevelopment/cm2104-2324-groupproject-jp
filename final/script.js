$(document).ready(function () {
    // Function to toggle styles based on mode
    function toggleStyles(isDarkMode) {
        // gets the root tag from css, then depending is the dark mode is checked will change colours, first column is dark and second is light
        $(':root').get(0).style.setProperty('--main-colour', isDarkMode ? '#000' : '#df5441');
        $(':root').get(0).style.setProperty('--text-colour1', isDarkMode ? '#111' : '#e8e8e8');
        $(':root').get(0).style.setProperty('--text-colour2', isDarkMode ? '#222' : '#787878');
        $(':root').get(0).style.setProperty('--text-colour3', isDarkMode ? '#333' : '#363636');
        $(':root').get(0).style.setProperty('--background-colour1', isDarkMode ? '#fff' : '#e87f54');
        $(':root').get(0).style.setProperty('--background-colour3', isDarkMode ? '#fff' : '#f0a967');
        $(':root').get(0).style.setProperty('--background-colour2', isDarkMode ? '#fff' : '#ecc9a8');
    }

    // Event listener for checkbox change
    $('#darkMode').change(function () {
        toggleStyles($(this).prop('checked'));
    });

    // Initialize in light mode
    toggleStyles(false);



    function getResultsFromTMDB() {
        var apiKey = "7e6dd248e2a77acc70a843ea3a92a687";
        var url = "https://api.themoviedb.org/3/trending/movie/week?api_key=" + apiKey;
        
        $.getJSON(url, function (jsondata) {
            getTrendingMovieDisplay(jsondata);
            displayAndCreateMovies(jsondata.results);
        });
        }
        
        function getTrendingMovieDisplay(jsondata) {
        var htmlstring = "";
        for (var i = 0; i < 3; i++) {
            var title = jsondata.results[i].title;
            var movieBackdrop = jsondata.results[i].backdrop_path;
            var movieDescription = jsondata.results[i].overview;
        
            console.log("Title: " + title);
            console.log("Backdrop Path: " + movieBackdrop);
            console.log("Overview: " + movieDescription);
        
            htmlstring += "<div class='carousel-item" + (i === 0 ? " active" : "") + "'>" +
                "<img src='https://image.tmdb.org/t/p/original/" + movieBackdrop + "' class='d-block w-100' alt='" + title + "'>" +
                "<div class='carousel-caption d-none d-md-block'>" +
                "<h5 class='movieTitle'>" + title + "</h5>" +
                "<p class='movieDescription'>" + movieDescription + "</p>" +
                "</div></div>";
        }
        
        // Insert the HTML string into the carousel inner
        $('.carousel-inner').html(htmlstring);
        }
        
function displayAndCreateMovies(movies) {
        var htmlString = "";
        for (var i = 0; i < 28 && i < movies.length; i++) {
            var title = movies[i].title;
            var moviePoster = movies[i].poster_path;
            var movieDescription = movies[i].overview;
            var id = movies[i].id;
            var maxDescriptionLength = 250;
            if (movieDescription.length > maxDescriptionLength) {
                // If it is, truncate the description and add "..." to the end
                console.log("over...")
                movieDescription = movieDescription.slice(0,250);
                movieDescription = movieDescription + "...";
            }
            var releaseDate = movies[i].release_date.split('-')[0]; // Extract the year from release date
        
            console.log("Title: " + title);
            console.log("Poster Path: " + moviePoster);
            console.log("Overview: " + movieDescription);
            
            console.log("Release Date: " + releaseDate);
        
            htmlString += "<div class='movie_card'>" +
                "<div class='movie_card-content'>" +
                "<div class='movie_card-header'><img class='movie_card-header__image' src='https://image.tmdb.org/t/p/original/" + moviePoster + "' alt='" + title + "'/></div>" +
                "<div class='movie_card-body'>" +
                "<h4 class='movie_card-body__header'>" + title + "</h4>" +
                "<p class='movie_card-body__desc'>" + movieDescription + "</p>" +
                "</div>" +
                "<div class='movie_card-footer'>" +
                "<div class='movie_card-footer__date'>Year of release: " + releaseDate + "</div>" +
                "<a class='review_btn' onclick='toggleReviewCard(" + i + ","+id+")'>Review</a>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='movie-card movie-card-" + i + "'>" +
                "</div>";
        }
        
        // Insert the HTML string into the movie_cards container
        $('.movie_cards').html(htmlString);
        }
        
        // Call the function to fetch and display movie data
        getResultsFromTMDB();
});



function toggleToLogin() {
var signupForm = document.querySelector('.signup');
var loginForm = document.querySelector('.login');

signupForm.style.display = 'none';
loginForm.style.display = 'block';
}

function toggleToSignup() {
var signupForm = document.querySelector('.signup');
var loginForm = document.querySelector('.login');

signupForm.style.display = 'block';
loginForm.style.display = 'none';
}


function displayMovieReviewDetails(moviesinfo, Rlocation) {
    var htmlString = "";
    for (var i = 0; i < 28 && i < moviesinfo.length; i++) {
        if (i === Rlocation) {
            // Run something when i is 5
            console.log("review has been called");
            var title = moviesinfo[i].title;
            var moviePoster = moviesinfo[i].poster_path;
            var movieDescription = moviesinfo[i].overview;
            var releaseDate = moviesinfo[i].release_date.split('-')[0]; // Extract the year from release date
        
            console.log("THISSSS IS SSS REVIEWWW Title: " + title);
            console.log("Poster Path: " + moviePoster);
            console.log("Overview: " + movieDescription);
            console.log("Release Date: " + releaseDate);
        
            htmlString += "<div class='movie-details'>" +
            "<h2>" + title + "</h2>" +
            "<img src='https://image.tmdb.org/t/p/original/" + moviePoster + "' alt='" + title + "'/>" +
            "<p>" + movieDescription + "</p>" +
            "<p>Year: 1985</p>" +
            "</div>" +
            "<div class='reviews'>" +
            "<button class='button-watchlist'>Add to Watchlist</button>" +
            "<div class='rating-buttons'>" +
            "<button class='rating' value='1'>1</button>" +
            "<button class='rating' value='2'>2</button>" +
            "<button class='rating' value='3'>3</button>" +
            "<button class='rating' value='4'>4</button>" +
            "</div>" +
            "<div class='review-section'>" +
            "<label class='comments-review'>Have your say:</label>" +
            "<textarea class='review-section-text' rows='4'></textarea>" +
            "<button class='leave-review'>Leave review</button>" +
            "</div>" +
            "</div>" +
            "<div class='right'>" +
            "<div class='friends-ratings'>" +
            "<h3>Friends Ratings</h3>" +
            "<p>Rating 1: 25%</p>" +
            "<p>Rating 2: 30%</p>" +
            "<p>Rating 3: 20%</p>" +
            "<p>Rating 4: 25%</p>" +
            "</div>" +
            "<div class='similar-movies'>" +
            "<h3>Similar Movies</h3>" +
            "<img src='https://image.tmdb.org/t/p/original/" + moviePoster + "' alt='Similar " + title + " Poster'/>" +
            "<!-- Add smaller posters and titles for similar movies -->" +
            "</div>" +
            "</div>" +
            "</div>";
        } else {
            console.log("Not matching movie");
        }

    }
    
    // Insert the HTML string into the movie_cards container
    $('.movie-card-' + Rlocation).append(htmlString);
    }




    function toggleReviewCard(location) {
        console.log(location);
        var apiKey = "7e6dd248e2a77acc70a843ea3a92a687";
        var url = "https://api.themoviedb.org/3/trending/movie/week?api_key=" + apiKey;
        // Hide all review cards and clear their content
        $('.movie-card').hide().html('');
        $.getJSON(url, function (jsondata) {
            displayMovieReviewDetails(jsondata.results, location);
        });
    
        // Update the class name to match the correct review card element
        var reviewCard = document.querySelector('.movie-card-' + location);
        reviewCard.style.display = 'flex';
    }


function getSearchFromTMDB(movieTitle) {
    console.log(movieTitle);
    var apiKey = "7e6dd248e2a77acc70a843ea3a92a687";
    var url = "https://api.themoviedb.org/3/search/movie?query=" + movieTitle + "&api_key=" + apiKey;

    $.getJSON(url, function (jsondata) {
        console.log(jsondata);
        displayResultsSearch(jsondata.results);
    });
}


function displayResultsSearch(movies) {
    console.log("movies called");
    var htmlString = "";
    for (var i = 0; i < 5 && i < movies.length; i++) {
        // Run something when i is 5
        console.log("review has been called");
        var title = movies[i].title;
        var moviePoster = movies[i].poster_path;
        var movieDescription = movies[i].overview;
        var movieBackdrop = movies[i].backdrop_path;
        var movieRating = movies[i].vote_average;
        var releaseDate = movies[i].release_date; // Extract the year from release date

        console.log("THISSSS IS SSS REVIEWWW Title: " + title);
        console.log("Poster Path: " + moviePoster);
        console.log("Overview: " + movieDescription);
        console.log("Release Date: " + releaseDate);

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
            "</div>" +
            "</div>";
    }
    $('.results-movie-card-container').html(htmlString);
}
