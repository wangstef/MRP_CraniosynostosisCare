
// When clicking the "Start" button, redirect to the first chapter of the nonjourney html
 function startJourney() {
   window.location.href = '/nonjourney/tutorial.html'; 
 }


// When clicking the "Start" button, redirect to the first chapter of the nonjourney html
function startJourney() {
    window.location.href = '/nonjourney/tutorial.html';
}

// Button for our team button
// Get the HTML elements
const infoButton = document.getElementById('ourTeamBtn');
const ourTeamLightbox = document.getElementById('ourTeamLightbox'); // Renamed variable

// Function to toggle the "Our Team" lightbox's visibility
function toggleOurTeamLightbox() { // Renamed function
    ourTeamLightbox.classList.toggle('hidden');
}

// Add a click event listener to the "Our Team" button
infoButton.addEventListener('click', toggleOurTeamLightbox); // Updated function call


