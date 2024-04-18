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
