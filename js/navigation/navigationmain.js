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
    const navContainer = document.getElementById('chapter-nav-container-main');
    if (!navContainer) {
        console.error("Chapter navigation container (#chapter-nav-container-main) not found.");
        return;
    }

    // Clear existing navigation to prevent duplication
    navContainer.innerHTML = '';

    const path = window.location.pathname;
    const hash = window.location.hash;
    const pathSegments = path.split('/').filter(Boolean);
    const currentPageFilename = pathSegments.pop() || '';
    const currentUrlFolder = pathSegments.pop() || '';

    // MODIFICATION: Determine the chosen path from the URL, not localStorage.
    let chosenPath = null;
    if (currentUrlFolder === 'endoscopic' || currentUrlFolder === 'cranialvault') {
        chosenPath = currentUrlFolder;
    }

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
                { name: "Video: Introduction to Craniosynostosis", file: "chapter2.html#page3" },
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
        { id: 6, name: "End", file: "chapter6.html", isPathSpecific: false }
    ];

    const navElement = document.createElement('nav');
    const ul = document.createElement('ul');

    chapterDefinitions.forEach(chapter => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = chapter.name;

        let targetLinkFolder = chapter.isPathSpecific ? chosenPath : 'nonjourney';
        // This is the crucial check: Does this button need a modal?
        // It needs one if it's path-specific AND the user hasn't chosen a path yet.
        const needsPathSelection = chapter.isPathSpecific && !chosenPath;

        // --- Active State Logic (Preserved from your working code) ---
        const currentFullPath = `../${currentUrlFolder}/${currentPageFilename}${hash}`;
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

        // --- Popup Arrow Logic (Preserved from your working code) ---
        if (chapter.hasPopup) {
            li.classList.add('has-popup');
            const iconSpan = document.createElement('span');
            iconSpan.className = 'nav-icon popup-icon';
            iconSpan.innerHTML = " &#9650;";
            a.appendChild(iconSpan);
            if (needsPathSelection) {
                iconSpan.style.display = 'none';
            }
        }

        // --- Link Behavior Logic ---
        if (needsPathSelection) {
            a.href = "javascript:void(0);";
            // NEW: Manually call the correct modal function based on the chapter ID
            switch (chapter.id) {
                case 3:
                    a.addEventListener('click', (e) => { e.preventDefault(); displayPreOpModal(); });
                    break;
                case 4:
                    a.addEventListener('click', (e) => { e.preventDefault(); displaySurgeryModal(); });
                    break;
                case 5:
                    a.addEventListener('click', (e) => { e.preventDefault(); displayPostOpModal(); });
                    break;
            }
        } else {
            // This is your original, working link logic
            let finalHref = chapter.file;
            if (!finalHref.includes('../')) {
                finalHref = `../${targetLinkFolder}/${chapter.file}`;
            }
            a.href = finalHref;
        }

        li.appendChild(a);

        // --- Popup Menu Generation (Preserved from your working code) ---
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
                    // NEW: Manually call the correct modal for popup sub-items
                    switch (chapter.id) {
                         case 5: // Post-Op popup items
                            subA.addEventListener('click', (e) => { e.preventDefault(); displayPostOpModal(subItem.file); });
                            break;
                    }
                } else {
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

    // --- Hover Logic (Preserved from your working code) ---
    document.querySelectorAll('.has-popup').forEach(popupLi => {
        const mainLink = popupLi.querySelector('a');
        const popupMenu = popupLi.querySelector('.popup-menu');
        if (!mainLink || !popupMenu || mainLink.getAttribute('href') === "javascript:void(0);") {
            return;
        }
        let closeTimer = null;
        const startHideTimer = () => { closeTimer = setTimeout(() => popupLi.classList.remove('popup-open'), 250); };
        const cancelHideTimer = () => clearTimeout(closeTimer);
        mainLink.addEventListener('mouseenter', () => { cancelHideTimer(); popupLi.classList.add('popup-open'); });
        mainLink.addEventListener('mouseleave', startHideTimer);
        popupMenu.addEventListener('mouseenter', cancelHideTimer);
        popupMenu.addEventListener('mouseleave', startHideTimer);
    });

    // --- Theming Logic (Preserved from your working code) ---
    document.body.className = document.body.className.replace(/\b(path-|journey-)[a-zA-Z0-9_-]+\b/g, '');
    if (chosenPath && chapterDefinitions.some(c => c.isPathSpecific && currentUrlFolder === chosenPath)) {
        document.body.classList.add(`path-${chosenPath}`);
    } else {
        document.body.classList.add('journey-nonjourney');
    }

    if (hash) {
        const targetElement = document.getElementById(hash.substring(1));
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// --- NEW: Helper function to create the modal ---
// This contains the repeated logic for all modals to keep the code cleaner.
function createAndShowModal(title, text, targetFile) {
    if (document.getElementById('pathChoiceOverlay')) return; // Don't open if one is already open

    const choiceContainer = document.createElement('div');
    choiceContainer.id = 'pathChoiceOverlay';
    choiceContainer.className = 'path-choice-overlay';
    
    choiceContainer.innerHTML = `
        <div class="path-choice-content">
            <h2>${title}</h2>
            <p>${text}</p>
            <div class="path-choice-actions">
                <button id="navModalSelectEndoscopic" class="path-choice-button">Endoscopic Path</button>
                <button id="navModalSelectCV" class="path-choice-button">Cranial Vault Path</button>
            </div>
            <button id="navModalCancelPathChoice" class="path-choice-button">Cancel</button>
        </div>
    `;
    document.body.appendChild(choiceContainer);
    requestAnimationFrame(() => choiceContainer.classList.add('visible'));

    const handlePathSelection = (selectedPathId) => {
        localStorage.setItem('visualNovelChosenPath', selectedPathId);
        
        // Use the targetFile passed to the function
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

    document.getElementById('navModalSelectEndoscopic').addEventListener('click', () => handlePathSelection('endoscopic'));
    document.getElementById('navModalSelectCV').addEventListener('click', () => handlePathSelection('cranialvault'));
    document.getElementById('navModalCancelPathChoice').addEventListener('click', removeModal);
}

// --- NEW: Manual Modal Functions ---

function displayPreOpModal() {
    // Manually define the title, text, and where the buttons go (chapter3.html)
    createAndShowModal(
        '<strong>Pre-Op Path Selection</strong>',
        'To view the pre-operative steps, please select which procedure to follow.',
        'chapter3.html'
    );
}

function displaySurgeryModal() {
    // Manually define the title, text, and where the buttons go (chapter4.html)
    createAndShowModal(
        '<strong>Surgery Path Selection</strong>',
        'To see the details of the surgery, please select which procedure to follow.',
        'chapter4.html'
    );
}

function displayPostOpModal(targetFile = 'chapter5.html') {
    // Manually define the title, text, and where the buttons go (chapter5.html or a sub-item)
    createAndShowModal(
        '<strong>Post-Op Path Selection</strong>',
        'For post-operative information, please select which procedure to follow.',
        targetFile
    );
}


// --- Event Listeners (Preserved from your working code) ---
document.addEventListener('DOMContentLoaded', () => {
    setDynamicChapterTitle();
    generateChapterNavigation();
});

window.addEventListener('hashchange', () => {
    generateChapterNavigation();
});
