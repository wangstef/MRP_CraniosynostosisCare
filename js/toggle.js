// js/toggle.js

document.addEventListener('DOMContentLoaded', function () {
    const journeyToggle = document.getElementById('journeyToggle');
    if (!journeyToggle) return;

    const pathKey = 'visualNovelChosenPath';

    // Function to determine the current journey from the URL folder
    const getCurrentJourneyFromURL = () => {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        // This assumes your chapter files are directly inside 'cranialvault' or 'endoscopic' folders
        // e.g., /cranialvault/chapter4.html
        return pathSegments[pathSegments.length - 2] || 'cranialvault'; // Default to cranialvault if no folder found
    };

    // Set the toggle's initial state based on the URL
    const currentJourney = getCurrentJourneyFromURL();
    journeyToggle.checked = currentJourney === 'cranialvault';

    // Add the event listener to handle clicks
    journeyToggle.addEventListener('change', function () {
        const newJourney = this.checked ? 'cranialvault' : 'endoscopic'; // Determine target journey

        // 1. Set the chosen path in localStorage so the next page knows the context
        localStorage.setItem(pathKey, newJourney);

        // 2. Get the current filename. This will be the filename for the redirect.
        const currentPageFilename = window.location.pathname.split("/").pop();
        
        let targetHash = window.location.hash || "#page0"; // Default to current hash or #page0

        // --- KEY CHANGE: Apply logic for chapter4.html regardless of the journey ---
        // If the current file being toggled from/to is chapter4.html,
        // then always set the hash to #page0 for that chapter in the target journey.
        if (currentPageFilename === 'chapter4.html') {
            targetHash = '#page0';
        }

        // 3. Redirect to force a full page reload in the new context
        // The path will be ../[newJourney]/[currentPageFilename][targetHash]
        window.location.href = `../${newJourney}/${currentPageFilename}${targetHash}`;
    });
});