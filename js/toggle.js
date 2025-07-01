// js/toggle.js

document.addEventListener('DOMContentLoaded', function () {
    const journeyToggle = document.getElementById('journeyToggle');
    if (!journeyToggle) return;

    const pathKey = 'visualNovelChosenPath';

    // Function to determine the current journey from the URL folder
    const getCurrentJourneyFromURL = () => {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        return pathSegments[pathSegments.length - 2] || 'cranialvault'; // Default to cranialvault if no folder found
    };

    // Set the toggle's initial state based on the URL
    const currentJourney = getCurrentJourneyFromURL();
    journeyToggle.checked = currentJourney === 'cranialvault';

    // Add the event listener to handle clicks
    journeyToggle.addEventListener('change', function () {
        const newJourney = this.checked ? 'cranialvault' : 'endoscopic'; // Determine target journey

        // --- KEY CHANGE ---
        // 1. Set the chosen path in localStorage so the next page knows the context
        localStorage.setItem(pathKey, newJourney);

        // 2. Get the current filename and hash
        const currentPageFilename = window.location.pathname.split("/").pop();
        const currentHash = window.location.hash || "#page0";

        // 3. Redirect to force a full page reload in the new context
        window.location.href = `../${newJourney}/${currentPageFilename}${currentHash}`;
    });
});