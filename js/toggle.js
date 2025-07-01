document.addEventListener('DOMContentLoaded', function () {
    const journeyToggle = document.getElementById('journeyToggle');
    if (!journeyToggle) return;

    // This function determines the current "journey" based on the URL folder.
    const getCurrentJourney = () => {
        const path = window.location.pathname;
        // Assuming your journey folders are right before the file, e.g., /endoscopic/chapter3.html
        const pathSegments = path.split('/').filter(Boolean);
        const folder = pathSegments[pathSegments.length - 2];
        
        // This logic should align with your folder structure.
        // Let's assume 'cranialvault' is one journey and anything else (like 'endoscopic') is the other.
        if (folder === 'cranialvault') {
            return 'cranialvault';
        } else {
            return 'endoscopic'; // Or whatever your other journey folder is named
        }
    };

    // Set the initial state of the toggle based on the current page's URL
    const currentJourney = getCurrentJourney();
    // The toggle is checked if the journey is 'cranialvault', unchecked otherwise.
    journeyToggle.checked = currentJourney === 'cranialvault';


    // Add the event listener to handle clicks on the toggle
    journeyToggle.addEventListener('change', function () {
        const isChecked = this.checked;
        const newJourney = isChecked ? 'cranialvault' : 'endoscopic'; // Determine target journey

        // Get the current filename (e.g., "chapter3.html")
        const currentPageFilename = window.location.pathname.split("/").pop();

        // Get the current page hash (e.g., "#page1") if it exists, otherwise default to #page0
        const currentHash = window.location.hash || "#page0";

        // --- This is the key part ---
        // Construct the new URL and navigate to it.
        // This forces a full page load, which will cause Cranial_nav.js to run correctly.
        window.location.href = `../${newJourney}/${currentPageFilename}${currentHash}`;
    });
});