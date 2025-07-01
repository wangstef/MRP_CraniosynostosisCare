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
        let chapterDefExpectedFolder = isPathSpecificChapter ? chosenPath : 'nonjourney';

        if (isPathSpecificChapter && !chosenPath) {
            chapterDefExpectedFolder = null;
        }

        // Match main chapter file
        if (chapterDef.file === currentPageFilename && chapterDefExpectedFolder && chapterDefExpectedFolder === currentContextualFolder) {
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
                // If the subItem.file includes the current page filename AND the current hash
                // This handles cases like chapter2.html#page1 matching subItem.file "chapter2.html#page1"
                const subItemMatchesCurrentPage = subItem.file.startsWith(currentPageFilename) && subItem.file.endsWith(hash);

                // For cases where a sub-item file might be just the filename without hash if current page has no hash
                const subItemIsJustFilename = subItem.file === currentPageFilename && !hash;

                if ((subItemMatchesCurrentPage || subItemIsJustFilename) && chapterDefExpectedFolder && chapterDefExpectedFolder === currentContextualFolder) {
                    viewerChapterId = chapterDef.id;
                    viewerSubItemId = subItem.name; 
                    break;
                }
            }
        }
        if (viewerChapterId) break;
    }

    const navElement = document.createElement('nav');
    const ul = document.createElement('ul');

    chapterDefinitions.forEach(chapter => {
        const isTargetChapterPathSpecific = chapter.id >= 3;
        let targetLinkFolder;

        if (isTargetChapterPathSpecific) {
            if (chosenPath) {
                targetLinkFolder = chosenPath;
            } else {
                return; // Do not render nav items for chapters 3+ if no path chosen.
            }
        } else {
            targetLinkFolder = 'nonjourney';
        }

        const targetChapterFileForModal = chapter.file || 
                                           (chapter.popup && chapter.popup[0] ? chapter.popup[0].file : 
                                           (isTargetChapterPathSpecific ? `chapter${chapter.id}.html` : 'chapter1.html'));

        let chapterLinkPath = "";
        if (chapter.file) {
            // Adjust link path for chapters with hashes if not a direct file
            if (chapter.file.includes('#')) {
                chapterLinkPath = `../${targetLinkFolder}/${chapter.file}`;
            } else {
                chapterLinkPath = `../${targetLinkFolder}/${chapter.file}`;
            }
        } else if (chapter.hasPopup) {
            chapterLinkPath = "javascript:void(0);";
        } else {
            return;
        }

        const li = document.createElement('li');
        if (chapter.hasPopup) {
            li.classList.add('has-popup');
        }

        const a = document.createElement('a');
        a.textContent = chapter.name;

        const onEarlyChapterOrNonChapterPage = (viewerChapterId === null || viewerChapterId === 1 || viewerChapterId === 2);

        if (onEarlyChapterOrNonChapterPage && isTargetChapterPathSpecific && !chosenPath) {
            a.href = "javascript:void(0);";
            a.addEventListener('click', (e) => {
                e.preventDefault();
                displayPathSelectionModalInNav(targetChapterFileForModal);
            });
        } else {
            a.href = chapterLinkPath;
        }
        
        if (chapter.hasPopup) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'nav-icon popup-icon';
            iconSpan.innerHTML = " &#9650;"; // Upwards triangle
            if (onEarlyChapterOrNonChapterPage && isTargetChapterPathSpecific && !chosenPath) {
                iconSpan.style.display = 'none';
            }
            a.appendChild(iconSpan);
        }

        // Active state for main chapter link (based on file *and* fragment if present)
        const currentFullPage = currentPageFilename + hash;
        if ((chapter.file === currentPageFilename && targetLinkFolder === currentContextualFolder) ||
            (chapter.popup && chapter.popup.some(sub => sub.file === currentFullPage && targetLinkFolder === currentContextualFolder))) {
            a.classList.add('active');
        }
        
        li.appendChild(a);

        if (chapter.hasPopup && chapter.popup && chapter.popup.length > 0) {
            const popupUl = document.createElement('ul');
            popupUl.className = 'popup-menu';
            let parentIsActiveFromSub = false;

            chapter.popup.forEach(subItem => {
                const subItemTargetFolder = targetLinkFolder; 
                const subItemFileForModal = subItem.file;

                const subLi = document.createElement('li');
                const subA = document.createElement('a');
                subA.textContent = subItem.name;

                if (onEarlyChapterOrNonChapterPage && isTargetChapterPathSpecific && !chosenPath) {
                    subA.href = "javascript:void(0);";
                    subA.addEventListener('click', (e) => {
                        e.preventDefault();
                        displayPathSelectionModalInNav(subItemFileForModal);
                    });
                } else {
                    if (!subItemTargetFolder) {
                        console.warn("Sub-item cannot determine target folder:", subItem.name, "Parent Chapter ID:", chapter.id);
                        subA.href = "javascript:void(0);";
                    } else {
                        // Ensure relative path is correct. If subItem.file already contains full path relative to root,
                        // you might need to adjust. Assuming subItem.file is just the filename + hash.
                        subA.href = `../${subItemTargetFolder}/${subItem.file}`;
                    }
                }

                // Active state for sub-items: Match current page filename AND hash
                const subItemFullFile = subItem.file; // e.g., chapter2.html#page1
                const currentBrowserUrl = currentPageFilename + hash; // e.g., chapter2.html#page1

                if (subItemFullFile === currentBrowserUrl && subItemTargetFolder === currentContextualFolder) {
                    subA.classList.add('active-sub-item');
                    parentIsActiveFromSub = true;
                }
                subLi.appendChild(subA);
                popupUl.appendChild(subLi);
            });
            li.appendChild(popupUl);
            if (parentIsActiveFromSub) {
                a.classList.add('active-parent');
            }
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

        if (mainLink && mainLink.getAttribute('href') !== "javascript:void(0);" && popupMenu) {
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
        }
    });

    // Apply body class for theming
    document.body.className = document.body.className.replace(/\b(path-|journey-)[a-zA-Z0-9_-]+\b/g, '');
    const currentChapterDefForTheme = chapterDefinitions.find(c => c.id === viewerChapterId);

    if (chosenPath && currentChapterDefForTheme && currentChapterDefForTheme.id >= 3) {
        document.body.classList.add(`path-${chosenPath}`);
    } else if (currentContextualFolder === 'nonjourney' && (currentChapterDefForTheme && currentChapterDefForTheme.id <=2 || viewerChapterId === null)) {
        document.body.classList.add('journey-nonjourney');
    } else if (chosenPath && currentContextualFolder === chosenPath) {
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
        
        const finalTargetFile = targetFile.split('/').pop().split('#')[0]; // Remove hash from finalTargetFile

        // Append the original hash if it was part of the targetChapterFileOnClick
        const originalHash = targetFile.includes('#') ? '#' + targetFile.split('#')[1] : '';

        window.location.href = `../${selectedPathId}/${finalTargetFile}${originalHash || '#page0'}`; 
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