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
