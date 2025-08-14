const pages = [
    { 
        img: "../img/images/Cranial Vault/CVPost-title.png",
        showButton: false ,
        showTextBox: false,
        text: "endo ch5"
    },
    {
        img: "../img/images/Cranial Vault/CVPost-after.png",
        showButton: false,
        showTextBox: true,
        text: "Post surgery: some dried blood near scar, bruising, swelling around the eyes and face are all common. This usually will take a few days to reduce. There will be a drain to collect excess fluid, this will be removed by the doctor."
    },
    {
        img: "../img/images/Cranial Vault/CVPost-timeline.png",
        showButton: false,
        showTextBox: false,
        text: ""
    },
    { 
        img: "../img/images/Cranial Vault/CVPost-healing.png",
        showButton: false ,
        showTextBox: true,
        text: "Your child may experience some discomfort after surgery but they should heal quickly. To improve scarring make sure to keep up with the post operative care."
    },
    {
        img: "../img/images/Cranial Vault/CVPost-Healingtips.png",
        showButton: false,
        showTextBox: false,
        text: "If parents want to go through with surgical options, the timing is very important, as certain options (ex. Endoscopic strip Craniectomy) can only be done while the skull is still soft and growing. The following video will give a summary of craniosynostosis. "
    },
    {
        img: "../img/images/Cranial Vault/CV-Concerns.png",
        showButton: false,
        showTextBox: false,
        text: "If parents want to go through with surgical options, the timing is very important, as certain options (ex. Endoscopic strip Craniectomy) can only be done while the skull is still soft and growing. The following video will give a summary of craniosynostosis. "
    },
    {
        img: "../img/images/Cranial Vault/CVPost-pvc.png",
        showButton: false,
        showTextBox: false,
        text: ""
    }
];

let currentPage = 0;

// References to DOM elements (ensure these exist in your HTML)
const backgroundImg = document.getElementById("backgroundImg");
const infoButton = document.getElementById("infoButton");
const lightbox = document.getElementById("lightbox");
const progressBar = document.getElementById("progressBar"); // Assuming progressBar is global
const textBox = document.getElementById("textBox"); // Assuming textBox is global
const textContent = document.getElementById("textContent"); // Assuming textContent is global
// Add other global elements here if they are controlled by renderPage:
// const nextArrow = document.getElementById("nextArrow"); // If you have one
// const prevArrow = document.getElementById("prevArrow"); // If you have one
const moreDetailsLink = document.getElementById("moreDetailsLink")



// Function to create progress dots (should run once)
function createProgressDots() {
    progressBar.innerHTML = '';
    pages.forEach(() => {
        const dot = document.createElement("div");
        dot.classList.add("progress-dot");
        progressBar.appendChild(dot);
    });
}

// Function to render the current page content
function renderPage() {
    const page = pages[currentPage];
    backgroundImg.src = page.img;
    infoButton.style.display = page.showButton ? "block" : "none";

    if (page.showTextBox) {
        textBox.style.display = "flex";
        textContent.innerText = page.text;
    } else {
        textBox.style.display = "none";
    }

    // Highlight current progress dot
    const dots = document.querySelectorAll(".progress-dot");
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentPage);
    });

    // Show/hide the "More Details" link only on the last page
    if (currentPage === pages.length - 1) {
        moreDetailsLink.classList.remove("hidden");
    } else {
        moreDetailsLink.classList.add("hidden");
    }

    // CRITICAL: Always update the URL hash to reflect the current page
    window.location.hash = "#page" + currentPage;

    // Optional: Scroll to the top of the content area for a cleaner jump,
    // especially if you have an overlaying header.
    // window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function to update currentPage and render based on URL hash
function updatePageFromHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith("#page")) {
        const pageFromHash = parseInt(hash.substring(5)); // Extracts number after "#page"
        if (!isNaN(pageFromHash) && pageFromHash >= 0 && pageFromHash < pages.length) {
            currentPage = pageFromHash;
        } else {
            // Fallback for invalid hash, e.g., go to first page
            currentPage = 0;
        }
    } else {
        // If no hash, default to page 0
        currentPage = 0;
    }
    renderPage(); // Call renderPage to display the correct content
}

// Navigation functions (next/prev arrows, etc.)
function nextPage() {
    if (currentPage < pages.length - 1) {
        currentPage++;
        renderPage();
    } else {
        // End of Chapter 5 - Redirect to Chapter 6
        window.location.href = "../nonjourney/chapter6.html#page0";
    }
}
 
function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        renderPage();
    } else {
        // Go to the last page of Chapter 4
        window.location.href = "../cranialvault/chapter4.html#page8"; // Adjust #lastpage as needed
    }
}
 
function toggleLightbox() {
    lightbox.classList.toggle("hidden");
}
 
infoButton.addEventListener("click", toggleLightbox);

// --- Event Listeners for chapter5.js ---

// 1. On initial page load:
document.addEventListener('DOMContentLoaded', () => {
    createProgressDots(); // Create dots once
    updatePageFromHash(); // Determine initial page from hash and render
});

// 2. LISTEN FOR HASH CHANGES: This is the critical addition!
window.addEventListener('hashchange', updatePageFromHash);
