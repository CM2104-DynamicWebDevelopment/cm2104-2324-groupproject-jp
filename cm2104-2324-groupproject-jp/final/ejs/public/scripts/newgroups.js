/*
  Created by Michael Piercey 2206222 -- finalised 11/12/23
*/


// nav bar for showing accout, review, watchlist and freinds, accepts the page user wants to view
// Function to show content based on the selected page (group code)
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

// Function to fetch and display group details on page load
function loadUserGroups() {
    // Make an AJAX request to fetch group details for the logged-in user
    fetch('/user/groups/details')
        .then(response => response.json())
        .then(groups => {
            // Iterate over each group and display its details
            groups.forEach(group => {
                const groupContainer = document.createElement('div');
                groupContainer.classList.add('group-container');

                const groupNameElement = document.createElement('h2');
                groupNameElement.textContent = `Group Name: ${group.groupName}`;

                const groupCodeElement = document.createElement('p');
                groupCodeElement.textContent = `Group Code: ${group.groupCode}`;

                // You can display other group details similarly

                groupContainer.appendChild(groupNameElement);
                groupContainer.appendChild(groupCodeElement);

                document.getElementById('user-groups').appendChild(groupContainer);
            });
        })
        .catch(error => console.error('Error fetching user groups:', error));
}

// Call the function to load user groups when the page loads
window.addEventListener('load', loadUserGroups);


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
