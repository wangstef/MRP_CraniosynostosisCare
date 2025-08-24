// js/toggle.js

document.addEventListener('DOMContentLoaded', function () {
    const journeyToggle = document.getElementById('journeyToggle');
    if (!journeyToggle) return;

    const pathKey = 'visualNovelChosenPath';

    // Function to determine the current journey from the URL folder
    const getCurrentJourneyFromURL = () => {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        return pathSegments[pathSegments.length - 2] || 'cranialvault';
    };

    // Set the toggle's initial state based on the URL
    const currentJourney = getCurrentJourneyFromURL();
    journeyToggle.checked = currentJourney === 'cranialvault';

    // Add the event listener to handle clicks
    journeyToggle.addEventListener('change', function () {
        const newJourney = this.checked ? 'cranialvault' : 'endoscopic';

        localStorage.setItem(pathKey, newJourney);

        const currentPageFilename = window.location.pathname.split("/").pop();
        
        let targetHash = window.location.hash || "#page0";

        // Existing logic for chapter4.html
        // if (currentPageFilename === 'chapter4.html') {
        //     targetHash = '#page0';
        // }

        // --- REVISED LOGIC FOR CHAPTER 4 ---
        if (currentPageFilename === 'chapter4.html') {
            const currentHash = window.location.hash;
            const currentJourneyInURL = getCurrentJourneyFromURL(); // e.g., 'cranialvault' or 'endoscopic'

            // Define your specific mappings for Chapter 5
            // The key is the *current* journey, and the value is an object
            // mapping the *current* hash to the *target* hash in the *other* journey.
            const chapter4Mappings = {
                'cranialvault': { // If currently in 'cranialvault' journey
                    // When toggling from cranialvault to endoscopic:
                    '#page0': '#page0', // From cranialvault/chapter5.html#page0 to endoscopic/chapter5.html#page0
                    '#page1': '#page1', // From cranialvault/chapter5.html#page1 to endoscopic/chapter5.html#page1

                    // Add more cranialvault -> endoscopic mappings as needed
                },
                'endoscopic': { // If currently in 'endoscopic' journey
                    // When toggling from endoscopic to cranialvault:
                    '#page0': '#page0', // From endoscopic/chapter5.html#page0 to cranialvault/chapter5.html#page0
                    '#page1': '#page1', // From endoscopic/chapter5.html#page1 to cranialvault/chapter5.html#page1
                    // Add more endoscopic -> cranialvault mappings as needed
                }
            };

            // Look up the target hash based on the current journey and current hash
            if (chapter4Mappings[currentJourneyInURL] && chapter4Mappings[currentJourneyInURL][currentHash]) {
                targetHash = chapter4Mappings[currentJourneyInURL][currentHash];
            } else {
                // Fallback if no specific mapping is found for the current hash in chapter 5.
                // It's often safest to default to #page0 if you don't have a specific mapping.
                // Or you could keep the currentHash if you prefer that behavior: targetHash = currentHash;
                targetHash = '#page0';
            }
        }
        // --- END REVISED LOGIC FOR CHAPTER 4 ---


        // --- REVISED LOGIC FOR CHAPTER 5 ---
        if (currentPageFilename === 'chapter5.html') {
            const currentHash = window.location.hash;
            const currentJourneyInURL = getCurrentJourneyFromURL(); // e.g., 'cranialvault' or 'endoscopic'

            // Define your specific mappings for Chapter 5
            // The key is the *current* journey, and the value is an object
            // mapping the *current* hash to the *target* hash in the *other* journey.
            const chapter5Mappings = {
                'cranialvault': { // If currently in 'cranialvault' journey
                    // When toggling from cranialvault to endoscopic:
                    '#page0': '#page0', // From cranialvault/chapter5.html#page0 to endoscopic/chapter5.html#page0
                    '#page1': '#page1', // From cranialvault/chapter5.html#page1 to endoscopic/chapter5.html#page1
                    '#page2': '#page2',  // From cranialvault/chapter5.html#page2 to endoscopic/chapter5.html#page3 (example of different mapping)
                    '#page3': '#page6',
                    '#page4': '#page7',
                    '#page5': '#page8',
                    '#page6': '#page9'
                    // Add more cranialvault -> endoscopic mappings as needed
                },
                'endoscopic': { // If currently in 'endoscopic' journey
                    // When toggling from endoscopic to cranialvault:
                    '#page0': '#page0', // From endoscopic/chapter5.html#page0 to cranialvault/chapter5.html#page0
                    '#page1': '#page1', // From endoscopic/chapter5.html#page1 to cranialvault/chapter5.html#page1
                    '#page2': '#page2',  // From endoscopic/chapter5.html#page3 to cranialvault/chapter5.html#page2 (inverse of the example above)
                    '#page3': '#page3',
                    '#page4': '#page3',
                    '#page5': '#page3',
                    '#page6': '#page3',
                    '#page7': '#page4',
                    '#page8': '#page5',
                    '#page9': '#page6'
                    // Add more endoscopic -> cranialvault mappings as needed
                }
            };

            // Look up the target hash based on the current journey and current hash
            if (chapter5Mappings[currentJourneyInURL] && chapter5Mappings[currentJourneyInURL][currentHash]) {
                targetHash = chapter5Mappings[currentJourneyInURL][currentHash];
            } else {
                // Fallback if no specific mapping is found for the current hash in chapter 5.
                // It's often safest to default to #page0 if you don't have a specific mapping.
                // Or you could keep the currentHash if you prefer that behavior: targetHash = currentHash;
                targetHash = '#page0';
            }
        }
        // --- END REVISED LOGIC FOR CHAPTER 5 ---

        // 3. Redirect to force a full page reload in the new context
        window.location.href = `../${newJourney}/${currentPageFilename}${targetHash}`;
    });
});