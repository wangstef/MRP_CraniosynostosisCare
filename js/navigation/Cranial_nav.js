// js/navigation.js

/**
 * Sets the dynamic chapter title in the top bar based on the document's title.
 */
function setDynamicChapterTitle() {
    const dynamicTitleElement = document.getElementById('dynamic-chapter-title');
    if (dynamicTitleElement) {
        const pageTitle = document.title;
        const chapterPart = pageTitle.split('–')[0].trim();
        dynamicTitleElement.textContent = chapterPart;
    }
}

/**
 * Generates and manages the chapter navigation menu.
 */
function generateChapterNavigation() {
    const navContainer = document.getElementById('chapter-nav-container-cranial');
    if (!navContainer) {
        console.error("Chapter navigation container (#chapter-nav-container-cranial) not found.");
        return;
    }

    // Clear existing navigation to prevent duplication
    navContainer.innerHTML = '';

    const path = window.location.pathname;
    const hash = window.location.hash;
    const pathSegments = path.split('/').filter(Boolean);
    const currentPageFilename = pathSegments.pop() || '';
    const currentUrlFolder = pathSegments.pop() || '';

    const chosenPathKey = 'visualNovelChosenPath';
    const chosenPath = localStorage.getItem(chosenPathKey);

    // --- Manually define your chapters here ---
    const chapterDefinitions = [
        { id: 1, name: "Welcome", file: "chapter1.html", isPathSpecific: false },
        {
            id: 2,
            name: "Intro",
            file: "chapter2.html",
            isPathSpecific: false,
            hasPopup: true,
            popup: [
                { name: "Pronunciation", file: "chapter2.html#page1" },
                { name: "Video: Craniosynostosis", file: "chapter2.html#page3" },
                { name: "Types", file: "chapter2.html#page7" },
                { name: "Surgical options", file: "../path_selection.html" }
            ]
        },
        { id: 3, name: "Pre-Op", file: "chapter3.html", isPathSpecific: true },
        { id: 4, name: "Surgery", file: "chapter4.html", isPathSpecific: true },
        {
            id: 5,
            name: "Post-Op",
            file: "chapter5.html",
            isPathSpecific: true,
            hasPopup: true,
            popup: [
                { name: "Timeline", file: "popup_timeline.html" },
                { name: "Benefit vs Risks", file: "popup_benefits.html" },
            ]
        },
        { id: 6, name: "End", file: "../nonjourney/chapter6.html", isPathSpecific: false }
    ];

    const navElement = document.createElement('nav');
    const ul = document.createElement('ul');

    chapterDefinitions.forEach(chapter => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = chapter.name;

        const targetLinkFolder = chapter.isPathSpecific ? chosenPath : 'nonjourney';
        const needsPathSelection = chapter.isPathSpecific && !chosenPath;
        const currentFullPath = `../${currentUrlFolder}/${currentPageFilename}${hash}`;

        // Determine if the current chapter or one of its sub-items is active
        const isMainActive = targetLinkFolder && chapter.file === currentPageFilename && currentUrlFolder === targetLinkFolder;
        let isSubActive = false;
        
        if (chapter.hasPopup && chapter.popup) {
            isSubActive = chapter.popup.some(sub => {
                const subPath = sub.file.includes('../') ? sub.file : `../${targetLinkFolder}/${sub.file}`;
                return subPath === currentFullPath;
            });
        }
        
        if (isMainActive || isSubActive) {
            a.classList.add('active');
        }

        if (chapter.hasPopup) {
            li.classList.add('has-popup');
            // Add the arrow icon to the main link
            const iconSpan = document.createElement('span');
            iconSpan.className = 'nav-icon popup-icon';
            iconSpan.innerHTML = " &#9650;"; // Upwards triangle
            a.appendChild(iconSpan);

            // Hide arrow if clicking it would open the path selection modal
            if (needsPathSelection) {
                iconSpan.style.display = 'none';
            }
        }

        // Configure link behavior
        if (needsPathSelection) {
            a.href = "javascript:void(0);";
            a.addEventListener('click', (e) => {
                e.preventDefault();
                displayPathSelectionModalInNav(chapter.file);
            });
        } else {
            a.href = `../${targetLinkFolder}/${chapter.file}`;
        }

        li.appendChild(a);

        // Create and append popup menu if it exists
        if (chapter.hasPopup && chapter.popup) {
            const popupUl = document.createElement('ul');
            popupUl.className = 'popup-menu';

            chapter.popup.forEach(subItem => {
                const subLi = document.createElement('li');
                const subA = document.createElement('a');
                subA.textContent = subItem.name;
                let subItemPath = '';

                if (needsPathSelection) {
                    subA.href = "javascript:void(0);";
                    subA.addEventListener('click', (e) => {
                        e.preventDefault();
                        displayPathSelectionModalInNav(subItem.file);
                    });
                } else {
                    // Handle special relative paths vs. standard chapter files
                    if (subItem.file.includes('../')) {
                        subItemPath = subItem.file;
                    } else {
                        subItemPath = `../${targetLinkFolder}/${subItem.file}`;
                    }
                    subA.href = subItemPath;
                }

                if (subItemPath === currentFullPath) {
                    subA.classList.add('active-sub-item');
                }

                subLi.appendChild(subA);
                popupUl.appendChild(subLi);
            });

            li.appendChild(popupUl);
        }

        ul.appendChild(li);
    });

    navElement.appendChild(ul);
    navContainer.appendChild(navElement);

    // Add hover event listeners for popups
    document.querySelectorAll('.has-popup').forEach(popupLi => {
        const mainLink = popupLi.querySelector('a');
        const popupMenu = popupLi.querySelector('.popup-menu');

        if (!mainLink || !popupMenu || mainLink.getAttribute('href') === "javascript:void(0);") {
            return; // Don't add hover listeners if the link opens the modal
        }

        let closeTimer = null;
        const startHideTimer = () => {
            closeTimer = setTimeout(() => popupLi.classList.remove('popup-open'), 250);
        };
        const cancelHideTimer = () => clearTimeout(closeTimer);

        mainLink.addEventListener('mouseenter', () => {
            cancelHideTimer();
            popupLi.classList.add('popup-open');
        });
        mainLink.addEventListener('mouseleave', startHideTimer);
        popupMenu.addEventListener('mouseenter', cancelHideTimer);
        popupMenu.addEventListener('mouseleave', startHideTimer);
    });

    // Apply body class for theming based on the current path
    document.body.className = document.body.className.replace(/\b(path-|journey-)[a-zA-Z0-9_-]+\b/g, '');
    if (chosenPath && chapterDefinitions.some(c => c.isPathSpecific && currentUrlFolder === chosenPath)) {
        document.body.classList.add(`path-${chosenPath}`);
    } else {
        document.body.classList.add('journey-nonjourney');
    }

    // Scroll to hash element if present
    if (hash) {
        const targetElement = document.getElementById(hash.substring(1));
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}


/**
 * Displays a modal for the user to select a surgical path.
 * @param {string} targetChapterFileOnClick - The file to navigate to after path selection.
 */
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

    choiceContainer.innerHTML = `
        <div class="path-choice-content">
            <h2>Choose Your Path</h2>
            <p>To explore this section, please select which surgical approach you'd like to follow.</p>
            <div class="path-choice-actions">
                <button id="navModalSelectSplit" class="path-choice-button">Split Craniectomy Path</button>
                <button id="navModalSelectCV" class="path-choice-button">Advanced Cranial Vault Path</button>
            </div>
            <button id="navModalCancelPathChoice" class="path-choice-button" style="background-color: #7f8c8d; margin-top: 15px;">Cancel</button>
        </div>
    `;
    document.body.appendChild(choiceContainer);
    requestAnimationFrame(() => choiceContainer.classList.add('visible'));

    const handlePathSelection = (selectedPathId) => {
        localStorage.setItem('visualNovelChosenPath', selectedPathId);
        const targetFile = document.getElementById('pathChoiceOverlay').dataset.targetFile;
        const [filename, hash] = targetFile.split('#');
        window.location.href = `../${selectedPathId}/${filename}${hash ? '#' + hash : ''}`;
        removeModal();
    };

    const removeModal = () => {
        const overlay = document.getElementById('pathChoiceOverlay');
        if (overlay) {
            overlay.classList.remove('visible');
            overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
        }
    };

    document.getElementById('navModalSelectSplit').addEventListener('click', () => handlePathSelection('splitcraniectomy'));
    document.getElementById('navModalSelectCV').addEventListener('click', () => handlePathSelection('cranialvaultadvanced'));
    document.getElementById('navModalCancelPathChoice').addEventListener('click', removeModal);
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    setDynamicChapterTitle();
    generateChapterNavigation();
});

window.addEventListener('hashchange', () => {
    generateChapterNavigation();
});