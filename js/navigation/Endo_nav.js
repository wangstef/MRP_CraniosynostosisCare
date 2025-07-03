// js/Endo_nav.js

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
    const navContainer = document.getElementById('chapter-nav-container-endo');
    if (!navContainer) {
        console.error("Chapter navigation container (#chapter-nav-container-endo) not found.");
        return;
    }

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
            file: "chapter2.html", // Or chapter2.html#page0 if your Intro also starts at #page0
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
            file: "chapter5.html#page0", // This is the change you made
            isPathSpecific: true,
            hasPopup: true,
            popup: [
                { name: "Timeline", file: "chapter5.html#page1" },
                { name: "Benefit vs Risks", file: "chapter5.html#page2" },
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

        // Conditional rendering: If it's a path-specific chapter and no path is chosen, don't render it.
        if (chapter.isPathSpecific && !chosenPath) {
            return;
        }

        // Construct the full link path for navigation
        let chapterLinkPath = "";
        if (chapter.file.startsWith('../') || chapter.file.startsWith('/') || chapter.file.includes('://')) {
            chapterLinkPath = chapter.file;
        } else {
            chapterLinkPath = `../${targetLinkFolder}/${chapter.file}`;
        }
        
        a.href = chapterLinkPath;

        // --- Active State Logic ---
        const currentBrowserUrlNormalized = new URL(`${window.location.pathname}${window.location.hash}`, window.location.origin).href;
        
        let isMainActive = false;
        let isSubActive = false;

        const chapterFileOnly = chapter.file.split('#')[0];
        const currentFileOnly = currentPageFilename.split('#')[0];

        // Main Chapter Active Check:
        if (chapterFileOnly === currentFileOnly) {
            const chapterFolderMatch = targetLinkFolder === currentUrlFolder;
            
            if (chapterFolderMatch) {
                if (chapter.hasPopup && chapter.popup) {
                    // **MODIFIED LINE HERE:**
                    // Main button is active if current hash is empty (default view)
                    // OR if the current hash matches the main chapter's explicit hash (e.g., #page0)
                    isMainActive = (!hash || hash === `#${chapter.file.split('#')[1]}`);
                } else {
                    // For chapters WITHOUT popups:
                    isMainActive = true; 
                }
            }
        }

        // Sub-Item Active Check:
        if (chapter.hasPopup && chapter.popup) {
            isSubActive = chapter.popup.some(sub => {
                let subItemPath = sub.file;
                if (!sub.file.startsWith('../') && !sub.file.startsWith('/') && !sub.file.includes('://')) {
                    subItemPath = `../${targetLinkFolder}/${sub.file}`;
                }
                const subLinkPathNormalized = new URL(subItemPath, window.location.origin + window.location.pathname).href;
                return subLinkPathNormalized === currentBrowserUrlNormalized;
            });
        }
        
        // Apply active classes
        if (isMainActive || isSubActive) {
            a.classList.add('active');
            if (isSubActive) {
                a.classList.add('active-parent'); // Style parent if a sub-item is active
            }
        }

        if (chapter.hasPopup) {
            li.classList.add('has-popup');
            const iconSpan = document.createElement('span');
            iconSpan.className = 'nav-icon popup-icon';
            iconSpan.innerHTML = " &#9650;"; // Upwards triangle
            a.appendChild(iconSpan);
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
                
                let subItemFinalPath = subItem.file;

                if (!subItem.file.startsWith('../') && !subItem.file.startsWith('/') && !subItem.file.includes('://')) {
                    subItemFinalPath = `../${targetLinkFolder}/${subItem.file}`;
                }
                subA.href = subItemFinalPath;

                const subLinkPathNormalized = new URL(subItemFinalPath, window.location.origin + window.location.pathname).href;
                if (subLinkPathNormalized === currentBrowserUrlNormalized) {
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

        if (mainLink && popupMenu && mainLink.getAttribute('href') !== "javascript:void(0);") {
            let closeTimer = null;
            const startHideTimer = () => {
                closeTimer = setTimeout(() => popupLi.classList.remove('popup-open'), 250);
            };
            const cancelHideTimer = () => {
                if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
            };

            mainLink.addEventListener('mouseenter', () => {
                cancelHideTimer();
                popupLi.classList.add('popup-open');
            });
            mainLink.addEventListener('mouseleave', startHideTimer);
            popupMenu.addEventListener('mouseenter', cancelHideTimer);
            popupMenu.addEventListener('mouseleave', startHideTimer);
        }
    });

    // Apply body class for theming based on the current path
    document.body.className = document.body.className.replace(/\b(path-|journey-)[a-zA-Z0-9_-]+\b/g, '');

    // Theming still depends on chosenPath from localStorage
    if (chosenPath === 'endoscopic') {
        document.body.classList.add('path-endoscopic');
    } else if (chosenPath === 'cranialvault') {
        document.body.classList.add('path-cranialvault');
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


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    setDynamicChapterTitle();
    generateChapterNavigation();
});

window.addEventListener('hashchange', () => {
    generateChapterNavigation();
});