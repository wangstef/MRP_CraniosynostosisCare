// js/navigation.js

// Function to handle dynamic chapter title in the top bar
function setDynamicChapterTitle() {
    const dynamicTitleElement = document.getElementById('dynamic-chapter-title');
    if (dynamicTitleElement) {
        const pageTitle = document.title;
        const chapterPart = pageTitle.split('–')[0].trim();
        dynamicTitleElement.textContent = chapterPart;
    }
}

// Function to generate and manage the chapter navigation
function generateChapterNavigation() {
    const navContainer = document.getElementById('chapter-nav-container-main');
    if (!navContainer) {
        console.error("Chapter navigation container (#chapter-nav-container-main) not found in HTML.");
        return;
    }

    // Clear existing navigation to prevent duplicates on hash change
    navContainer.innerHTML = ''; 

    const path = window.location.pathname;
    const hash = window.location.hash; // Get the current hash
    const pathSegments = path.split('/').filter(Boolean);

    if (pathSegments.length < 2) {
        navContainer.style.display = 'none';
        console.warn("Path does not have enough segments to determine folder and file for navigation. Nav will not be displayed.");
        return;
    }

    const currentPageFilename = pathSegments[pathSegments.length - 1];
    const currentUrlFolder = pathSegments[pathSegments.length - 2];

    const chosenPathKey = 'visualNovelChosenPath';
    const chosenPath = localStorage.getItem(chosenPathKey);

    const chapterDefinitions = [
        { id: 1, name: "Welcome", file: "chapter1.html" },
        {
            id: 2, name: "Intro", file: "chapter2.html", hasPopup: true,
            popup: [
                { name: "Pronunciation", file: "chapter2.html#page1" },
                { name: "Video: Craniosynostosis", file: "chapter2.html#page3" },
                { name: "Types", file: "chapter2.html#page7" },
                { name: "Surgical options", file: "../path_selection.html" }
            ]
        },
        { id: 3, name: "Pre-Op", file: "chapter3.html" }, // Assuming this will resolve to e.g., endoscopic/chapter3.html
        { id: 4, name: "Surgery", file: "chapter4.html" }, // Assuming this will resolve to e.g., endoscopic/chapter4.html
        {
            id: 5, name: "Post-Op", file: "chapter5.html", hasPopup: true,
            popup: [
                { name: "Timeline", file: "popup_timeline.html" },
                { name: "Benefit vs Risks", file: "popup_benefits.html" },
            ]
        },
        { id: 6, name: "End", file: "chapter6.html" }
    ];

    let currentContextualFolder = 'nonjourney';
    if (chosenPath && currentUrlFolder === chosenPath) {
        currentContextualFolder = chosenPath;
    } else if (currentUrlFolder !== 'nonjourney' && chosenPath && currentUrlFolder !== chosenPath) {
        console.warn(`Current URL folder "${currentUrlFolder}" does not match chosenPath "${chosenPath}" or "nonjourney". Navigation active states might be affected.`);
        currentContextualFolder = currentUrlFolder;
    } else {
        currentContextualFolder = currentUrlFolder;
    }

    let viewerChapterId = null;
    let viewerSubItemId = null; // Track the active sub-item ID/name if applicable

    // Determine the viewerChapterId and potentially viewerSubItemId
    for (const chapterDef of chapterDefinitions) {
        const isPathSpecificChapter = chapterDef.id >= 3;
        let chapterDefExpectedFolder = 'nonjourney'; // Default for chapters 1 and 2

        if (isPathSpecificChapter) {
            if (chosenPath) {
                chapterDefExpectedFolder = chosenPath;
            } else {
                // For chapters 3+, if no path is chosen, they are effectively in a 'no-path' context
                chapterDefExpectedFolder = null; // Indicate no specific path to match for active state
            }
        }
        
        // Match main chapter file
        // Only consider the chapter as 'active' if its file matches AND its expected folder matches the current folder,
        // OR if it's a non-path-specific chapter (id < 3)
        const isCurrentMainChapter = (chapterDef.file === currentPageFilename && 
                                      ((!isPathSpecificChapter && currentContextualFolder === 'nonjourney') || 
                                       (isPathSpecificChapter && chosenPath && currentContextualFolder === chosenPath)));

        if (isCurrentMainChapter) {
            viewerChapterId = chapterDef.id;
            // If the current URL has a hash, and this chapter has popups,
            // we need to check if the hash matches a sub-item for active state.
            if (hash && chapterDef.hasPopup && chapterDef.popup) {
                const matchedSubItem = chapterDef.popup.find(subItem => subItem.file.endsWith(hash));
                if (matchedSubItem) {
                    viewerSubItemId = matchedSubItem.name; // Use name or unique ID
                }
            }
            break; 
        }

        // Match popup sub-items (if the main file matches or sub-item directly matches)
        if (chapterDef.popup) {
            for (const subItem of chapterDef.popup) {
                const subItemFullFile = subItem.file; // e.g., "chapter2.html#page1" or "../path_selection.html"
                const currentBrowserUrl = currentPageFilename + hash; // e.g., "chapter2.html#page1"

                // Determine if this sub-item is the current active one
                const isCurrentSubItem = (subItemFullFile === currentBrowserUrl && 
                                          ((!isPathSpecificChapter && currentContextualFolder === 'nonjourney') || 
                                           (isPathSpecificChapter && chosenPath && currentContextualFolder === chosenPath)));

                if (isCurrentSubItem) {
                    viewerChapterId = chapterDef.id;
                    viewerSubItemId = subItem.name; 
                    break;
                }
            }
        }
        if (viewerChapterId) break; // Found the current chapter/sub-item, no need to check further
    }


    const navElement = document.createElement('nav');
    const ul = document.createElement('ul');

    chapterDefinitions.forEach(chapter => {
        const isTargetChapterPathSpecific = chapter.id >= 3;
        let targetLinkFolder;
        
        if (isTargetChapterPathSpecific) {
            targetLinkFolder = chosenPath; // Will be null if no path is chosen
        } else {
            targetLinkFolder = 'nonjourney';
        }

        const targetChapterFileForModal = chapter.file || 
                                          (chapter.popup && chapter.popup[0] ? chapter.popup[0].file : 
                                          (isTargetChapterPathSpecific ? `chapter${chapter.id}.html` : 'chapter1.html'));

        let chapterLinkPath = "";
        const li = document.createElement('li');
        if (chapter.hasPopup) {
            li.classList.add('has-popup');
        }

        const a = document.createElement('a');
        a.textContent = chapter.name;

        // NEW LOGIC: Always render the button, but determine its action based on path
        if (isTargetChapterPathSpecific && !chosenPath) {
            // If it's a path-specific chapter (3+) and no path is chosen
            a.href = "javascript:void(0);"; // Prevent default navigation
            a.addEventListener('click', (e) => {
                e.preventDefault();
                displayPathSelectionModalInNav(targetChapterFileForModal);
            });
            // Hide the popup icon if no path chosen for path-specific chapters
            if (chapter.hasPopup) {
                const iconSpan = document.createElement('span');
                iconSpan.className = 'nav-icon popup-icon';
                iconSpan.innerHTML = " &#9650;"; // Upwards triangle
                iconSpan.style.display = 'none'; // Hide the icon
                a.appendChild(iconSpan);
            }
        } else {
            // Normal navigation for non-path-specific chapters OR path-specific chapters with chosenPath
            if (chapter.file) {
                // Adjust link path for chapters with hashes if not a direct file
                // Ensure correct relative path handling (e.g., ../folder/file.html)
                if (chapter.file.includes('../')) { // Already a relative path like "../path_selection.html"
                    chapterLinkPath = chapter.file;
                } else if (targetLinkFolder) { // If a valid folder is determined
                    chapterLinkPath = `../${targetLinkFolder}/${chapter.file}`;
                } else { // Fallback if no targetLinkFolder, should not happen for chapters with file
                    chapterLinkPath = chapter.file; // Might break if not in root
                }
            } else if (chapter.hasPopup) {
                chapterLinkPath = "javascript:void(0);"; // Main button for popup, no direct link
            } else {
                // This case should ideally not be reached for defined chapters
                console.warn(`Chapter ${chapter.name} has no file and no popup defined.`);
                return; // Do not render this chapter if it has neither
            }
            a.href = chapterLinkPath;
            
            // Add popup icon if applicable and not hidden by the !chosenPath logic above
            if (chapter.hasPopup) {
                const iconSpan = document.createElement('span');
                iconSpan.className = 'nav-icon popup-icon';
                iconSpan.innerHTML = " &#9650;"; // Upwards triangle
                a.appendChild(iconSpan);
            }
        }
        
        // Active state for main chapter link
        // Check if the current page's filename matches the chapter's file AND the contextual folder matches,
        // OR if it's a popup sub-item that matches.
        const currentFullPage = currentPageFilename + hash;
        const chapterFileWithoutHash = chapter.file ? chapter.file.split('#')[0] : '';

        // Active state for main chapter link
        const isActiveMainChapter = (chapterFileWithoutHash === currentPageFilename && 
                                     ((!isTargetChapterPathSpecific && currentContextualFolder === 'nonjourney') || 
                                      (isTargetChapterPathSpecific && chosenPath && currentContextualFolder === chosenPath)));
        
        // Active state for main chapter if one of its sub-items is active
        let parentIsActiveFromSub = false; // Initialized here for direct use
        if (chapter.hasPopup && chapter.popup) {
            parentIsActiveFromSub = chapter.popup.some(subItem => {
                const subItemFileFull = subItem.file; // e.g. "chapter2.html#page1"
                return subItemFileFull === currentFullPage && 
                       ((!isTargetChapterPathSpecific && currentContextualFolder === 'nonjourney') || 
                        (isTargetChapterPathSpecific && chosenPath && currentContextualFolder === chosenPath));
            });
        }

        if (isActiveMainChapter || parentIsActiveFromSub) {
            a.classList.add('active');
        }

        li.appendChild(a);

        if (chapter.hasPopup && chapter.popup && chapter.popup.length > 0) {
            const popupUl = document.createElement('ul');
            popupUl.className = 'popup-menu';
            // parentIsActiveFromSub already determined above.

            chapter.popup.forEach(subItem => {
                const subItemTargetFolder = targetLinkFolder; // Use the determined targetLinkFolder
                const subItemFileForModal = subItem.file;

                const subLi = document.createElement('li');
                const subA = document.createElement('a');
                subA.textContent = subItem.name;

                // Sub-item link logic also considers if path is chosen
                if (isTargetChapterPathSpecific && !chosenPath) {
                    subA.href = "javascript:void(0);";
                    subA.addEventListener('click', (e) => {
                        e.preventDefault();
                        displayPathSelectionModalInNav(subItemFileForModal);
                    });
                } else {
                    if (subItem.file.includes('../')) { // Handle specific relative paths like ../path_selection.html
                        subA.href = subItem.file;
                    } else if (!subItemTargetFolder) {
                        console.warn("Sub-item cannot determine target folder:", subItem.name, "Parent Chapter ID:", chapter.id);
                        subA.href = "javascript:void(0);";
                    } else {
                        subA.href = `../${subItemTargetFolder}/${subItem.file}`;
                    }
                }

                // Active state for sub-items: Match current page filename AND hash
                const subItemFullFile = subItem.file; // e.g., chapter2.html#page1
                const currentBrowserUrl = currentPageFilename + hash; // e.g., chapter2.html#page1

                if (subItemFullFile === currentBrowserUrl && 
                    ((!isTargetChapterPathSpecific && currentContextualFolder === 'nonjourney') || 
                     (isTargetChapterPathSpecific && chosenPath && currentContextualFolder === chosenPath))) {
                    subA.classList.add('active-sub-item');
                    // parentIsActiveFromSub is set during initial calculation for the main 'a' tag
                }
                subLi.appendChild(subA);
                popupUl.appendChild(subLi);
            });
            li.appendChild(popupUl);
            // No need to set parentIsActiveFromSub again here, it was already handled when setting main 'a' tag class.
        }
        ul.appendChild(li);
    });

    navElement.appendChild(ul);
    navContainer.appendChild(navElement);

    // Event listeners for popups (hover logic)
    document.querySelectorAll('.has-popup').forEach(popupLi => {
        const mainLink = popupLi.querySelector('a');
        const popupMenu = popupLi.querySelector('.popup-menu');
        let closeTimer = null; 

        // Only add hover effects if the main link is not just opening the modal (i.e., it has a real href or is a valid popup trigger)
        // Check if the link's href is not "javascript:void(0);" when it's a path-specific chapter with no chosenPath
        const chapterIdFromLi = chapterDefinitions.find(c => c.name === mainLink.textContent.replace(' ▲', '') || c.name === mainLink.textContent.trim())?.id;
        const isPathSpecificAndNoPath = chapterIdFromLi >=3 && !chosenPath;
        
        if (mainLink && popupMenu && !isPathSpecificAndNoPath) { // Do not apply hover if it's going to open the modal
            const openMenuByLink = () => {
                if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
                popupLi.classList.add('popup-open');
            };
            const hideMenu = () => {
                popupLi.classList.remove('popup-open');
            };
            const startHideTimer = () => {
                if (closeTimer) { clearTimeout(closeTimer); }
                closeTimer = setTimeout(hideMenu, 250); 
            };
            const cancelHideTimer = () => {
                if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
            };

            mainLink.addEventListener('mouseenter', openMenuByLink);
            mainLink.addEventListener('mouseleave', startHideTimer);
            popupMenu.addEventListener('mouseenter', cancelHideTimer);
            popupMenu.addEventListener('mouseleave', startHideTimer);
        } else if (mainLink && mainLink.getAttribute('href') === "javascript:void(0);" && isPathSpecificAndNoPath) {
             // If it's a path-specific chapter with no path, we want the "popup-icon" to be hidden
             // This is handled above, but double-check any extra hover effects that might be unwanted.
        }
    });

    // Apply body class for theming
    document.body.className = document.body.className.replace(/\b(path-|journey-)[a-zA-Z0-9_-]+\b/g, '');
    const currentChapterDefForTheme = chapterDefinitions.find(c => c.id === viewerChapterId);

    if (chosenPath && currentChapterDefForTheme && currentChapterDefForTheme.id >= 3) {
        document.body.classList.add(`path-${chosenPath}`);
    } else if (currentContextualFolder === 'nonjourney' && (currentChapterDefForTheme && currentChapterDefForTheme.id <=2 || viewerChapterId === null)) {
        document.body.classList.add('journey-nonjourney');
    } else if (chosenPath && currentContextualFolder === chosenPath) { // This handles cases where a user might be directly in a path folder but viewerChapterId hasn't been set yet for some reason.
        document.body.classList.add(`path-${chosenPath}`);
    }


    // Scroll to the hash element after navigation is built/updated
    if (hash) {
        const targetElement = document.getElementById(hash.substring(1)); // Remove '#'
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}


// --- Function to display the path selection modal ---
function displayPathSelectionModalInNav(targetChapterFileOnClick) {
    if (document.getElementById('pathChoiceOverlay')) {
        const existingOverlay = document.getElementById('pathChoiceOverlay');
        existingOverlay.dataset.targetFile = targetChapterFileOnClick;
        requestAnimationFrame(() => existingOverlay.classList.add('visible'));
        return;
    }

    const choiceContainer = document.createElement('div');
    choiceContainer.id = 'pathChoiceOverlay';
    choiceContainer.className = 'path-choice-overlay'; 
    choiceContainer.dataset.targetFile = targetChapterFileOnClick; 

    const PATH_SPLIT_CRANIECTOMY_MODAL = {
        id: 'splitcraniectomy', 
        displayText: 'Split Craniectomy Path'
    };
    const PATH_CRANIAL_VAULT_ADVANCED_MODAL = {
        id: 'cranialvaultadvanced', 
        displayText: 'Advanced Cranial Vault Path'
    };

    choiceContainer.innerHTML = `
        <div class="path-choice-content">
            <h2>Choose Your Path</h2>
            <p>To explore this section, please first select which surgical approach you'd like to follow for the upcoming chapters.</p>
            <div class="path-choice-actions">
                <button id="navModalSelectSplit" class="path-choice-button">${PATH_SPLIT_CRANIECTOMY_MODAL.displayText}</button>
                <button id="navModalSelectCV" class="path-choice-button">${PATH_CRANIAL_VAULT_ADVANCED_MODAL.displayText}</button>
            </div>
            <button id="navModalCancelPathChoice" class="path-choice-button" style="background-color: #7f8c8d; margin-top: 15px;">Cancel</button>
        </div>
    `;
    document.body.appendChild(choiceContainer);
    requestAnimationFrame(() => choiceContainer.classList.add('visible'));

    const handlePathSelection = (selectedPathId) => {
        localStorage.setItem('visualNovelChosenPath', selectedPathId);
        let targetFile = document.getElementById('pathChoiceOverlay').dataset.targetFile || `chapter3.html`;
        
        // Ensure that if targetFile is e.g., "../path_selection.html", we handle it appropriately
        let finalTargetFile = targetFile;
        let originalHash = '';

        if (targetFile.includes('#')) {
            const parts = targetFile.split('#');
            finalTargetFile = parts[0];
            originalHash = '#' + parts[1];
        }

        // If the target file is path_selection.html, we don't want to append selectedPathId to it
        if (finalTargetFile.includes('path_selection.html')) {
             window.location.href = `../path_selection.html`;
        } else {
             // Extract just the filename to construct the new path
            const filenameOnly = finalTargetFile.split('/').pop();
            window.location.href = `../${selectedPathId}/${filenameOnly}${originalHash || '#page0'}`; 
        }
        
        removeModal();
    };

    document.getElementById('navModalSelectSplit').addEventListener('click', () => handlePathSelection(PATH_SPLIT_CRANIECTOMY_MODAL.id));
    document.getElementById('navModalSelectCV').addEventListener('click', () => handlePathSelection(PATH_CRANIAL_VAULT_ADVANCED_MODAL.id));
    document.getElementById('navModalCancelPathChoice').addEventListener('click', removeModal);

    function removeModal() {
        const overlay = document.getElementById('pathChoiceOverlay');
        if (overlay) {
            overlay.classList.remove('visible');
            setTimeout(() => {
                if (overlay && overlay.parentElement) {
                    overlay.parentElement.removeChild(overlay);
                }
            }, 300);
        }
    }
}


// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    setDynamicChapterTitle();
    generateChapterNavigation(); // Initial navigation load
});

window.addEventListener('hashchange', () => {
    setDynamicChapterTitle(); // Re-evaluate title if needed (though unlikely to change just on hash)
    generateChapterNavigation(); // Re-generate navigation to update active states and scroll
});