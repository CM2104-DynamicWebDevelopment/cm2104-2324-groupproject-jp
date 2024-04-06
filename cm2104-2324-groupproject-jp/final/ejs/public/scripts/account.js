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



