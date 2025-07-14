// js/chapter2.js (your provided code)

const pages = [
    {
        img: "../img/images/Non journey/Ch 2 What is Craniosynostosis_.png",
        showButton: false,
        showTextBox: false,
        showProgressDots: true,
        text: ""
    },     
    { 
        img: "../img/images/Non journey/BG-wave.png",
        showButton: false,
        showTextBox: true,
        showProgressDots: true,
        text: "Most parents have never heard of craniosynostosis before their child is diagnosed. <strong> Click on the Button</strong> above to hear how it is pronounced.",
        showAudioButton: true,
        audioSrc: "/img/audio/Craniosynostosispronounce_Shelley.mp3"
    }, 
    {
        img: "../img/images/Non journey/BG-wave.png",
        showButton: false,
        showTextBox: true,
        showProgressDots: true,
        showVideoButton: true,
        text: "If parents want to go through with surgical options, the timing is very important, as certain options (ex. Endoscopic strip Craniectomy) can only be done while the skull is still soft and growing. <strong> Click the Video Button</strong> to watch a brief summary video of craniosynostosis."
    },
    {
        img: "../img/images/Non journey/BG colour.png",
        showButton: false,
        showTextBox: false,
        showProgressDots: true,
        text: "",
        youtubeId: "qVMcp1ZcgZw" // YouTube video ID
    },
    {
        img: "../img/images/Non journey/NJConsequences.png",
        showButton: false,
        showTextBox: true,
        showProgressDots: true,
        text: "Challenges children may face growing up with craniosynostosis."
    },
    {
        img: "../img/images/Non journey/Ch 2 l.png",
        showButton: false,
        showTextBox: true,
        showProgressDots: true,
        text: "With craniosynostosis there are some cases that can affect brain development and cause other complications. Your team will inform you if there are any concerns."
    },
    {
        img: "../img/images/Non journey/BG-wave.png",
        showButton: false,
        showTextBox: true,
        showProgressDots: true,
        text: "The primary purpose of this surgery is to help with the shape of the child’s head and to make room for the growing brain."
    },
    {
        img: "../img/images/Non journey/BG-wave.png",
        showButton: true,
        showTextBox: true,
        showProgressDots: true,
        text: "There are different types of craniosynostosis depending on what sutures have fused, <strong> Click the Learn More </strong> button to explore some different types."
    },
    {
        img: "../img/images/Non journey/Ch 2 o.png",
        showButton: false,
        showTextBox: true,
        showProgressDots: true,
        text: "Although many children undergo craniosynostosis surgery, the decision is yours to make based on what you believe is best for your child. Children with craniosynostosis have grown up with healthy brain function and lead fulfilling, successful lives"
    },
    {
        img: "../img/images/Non journey/BG-wave.png",
        showButton: false,
        showTextBox: true,
        showProgressDots: true,
        text: "No matter what your decision is, your Craniofacial team at the hospital will be there to help. If you choose not to pursue surgery, your team will still monitor and regularly check up to make sure your child stays healthy."
    }
]; 

let currentPage = 0; // Initialize currentPage to 0

// Removed initial hash parsing from here. We'll handle it in a function.

const backgroundImg = document.getElementById("backgroundImg");
const infoButton = document.getElementById("infoButton");
const lightbox = document.getElementById("lightbox");
const nextArrow = document.getElementById("nextArrow"); 
const videoContainer = document.getElementById("videoContainer");

//Audio
const audioButton = document.getElementById("audioButton");
const pageAudio = document.getElementById("pageAudio");
const playPauseIcon = document.getElementById("playPauseIcon");

//video
const videoButton = document.getElementById("videoButton");
const playVidIcon = document.getElementById("playVidIcon");
const videoButtonText = document.getElementById("videoButtonText");

// Icons for play and pause states
const playIconSVG = '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 84.86"><title>volume</title><path d="M11.32,19.85H33.89L52.56,1a3.55,3.55,0,0,1,5,0,3.48,3.48,0,0,1,1,2.51h0V81.3a3.56,3.56,0,0,1-6.1,2.49l-18.45-15H11.32A11.35,11.35,0,0,1,0,57.49V31.17A11.37,11.37,0,0,1,11.32,19.85ZM74.71,31.62A3.32,3.32,0,0,1,81,29.51c1.14,3.39,1.69,8.66,1.6,13.67s-.81,9.72-2.19,12.57a3.33,3.33,0,0,1-6-2.91c1-2,1.47-5.76,1.55-9.77a38.19,38.19,0,0,0-1.27-11.45Zm17.14-12.4A3.32,3.32,0,0,1,98,16.67c3.08,7.4,4.75,16.71,4.89,26s-1.21,18.25-4.14,25.51a3.31,3.31,0,0,1-6.15-2.47c2.6-6.44,3.79-14.67,3.67-23s-1.63-16.86-4.41-23.5ZM108.42,8.68a3.32,3.32,0,1,1,6-2.88,89.44,89.44,0,0,1,8.48,37.53c.1,12.58-2.44,25.12-8,35.81a3.31,3.31,0,1,1-5.89-3c5-9.71,7.32-21.17,7.23-32.72a82.47,82.47,0,0,0-7.83-34.7Z"/></svg>';
const pauseIconSVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';

// Icons for video play
const videoIconSVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"></path></svg>';

//set progress bar pages (dots)
const progressBar = document.getElementById("progressBar");

// Moved dot creation into a function to be called on page load
function createProgressDots() {
    progressBar.innerHTML = ''; // Clear existing dots
    pages.forEach(() => {
        const dot = document.createElement("div");
        dot.classList.add("progress-dot");
        progressBar.appendChild(dot);
    });
}


function renderPage() {
    const page = pages[currentPage];
    
    progressBar.style.display = page.showProgressDots ? "flex" : "none";

    backgroundImg.src = page.img;
    infoButton.style.display = page.showButton ? "block" : "none";

    const textBox = document.getElementById("textBox");
    const textContent = document.getElementById("textContent");

    if (page.showTextBox) {
        textBox.style.display = "flex";
        textContent.innerHTML  = page.text;
    } else {
        textBox.style.display = "none";
    }

    if (page.showAudioButton) {
        audioButton.style.display = "flex";
        if (pageAudio.getAttribute('src') !== page.audioSrc) {
            pageAudio.src = page.audioSrc;
        }
    } else {
        audioButton.style.display = "none";
        pageAudio.pause();
        pageAudio.currentTime = 0;
    }
    playPauseIcon.innerHTML = playIconSVG;

    if (page.showVideoButton) {
        videoButton.style.display = "flex";
        // playVidIcon.innerHTML = videoIconSVG; // Set the video icon SVG
        videoButtonText.innerText = "Watch Video"; // Set the text for the video button
    } else {
        videoButton.style.display = "none";
    }

    // VIDEO CONTAINER LOGIC
    if (page.youtubeId) {
        videoContainer.style.display = "block";
        // FIX: Corrected YouTube embed URL.
        videoContainer.innerHTML = `
            <div class="video-responsive-wrapper">
                <iframe
                    src="https://www.youtube.com/embed/${page.youtubeId}?autoplay=1&rel=0"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            </div>
        `;
    } else {
        videoContainer.style.display = "none";
        videoContainer.innerHTML = "";
    }

    // Highlight current progress dot
    const dots = document.querySelectorAll(".progress-dot");
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentPage);
    });

    //make next arrow disappear
    if (page.showNextArrow === false) {
        nextArrow.style.display = "none";
    } else {
        // Ensure next arrow is visible if not explicitly hidden
        // This is important because it might have been hidden by a previous page's setting
        nextArrow.style.display = "block"; 
    }

    // Always update the URL hash to reflect the current page
    // This is crucial for navigation.js to work correctly when linking to specific pages.
    window.location.hash = "#page" + currentPage; 

    // Explicitly scroll to the top of the content area if the hash changes,
    // to ensure the user sees the start of the new "page".
    // Or, if you have a specific container for your pages, scroll that.
    // document.querySelector('.main-content-area').scrollTop = 0; 
    // Or window.scrollTo(0, 0);
} 
    
function toggleAudio() {
    if (pageAudio.paused) {
        pageAudio.play();
        playPauseIcon.innerHTML = pauseIconSVG;
    } else {
        pageAudio.pause();
        playPauseIcon.innerHTML = playIconSVG;
    }
}

// Function to update currentPage and render the page based on the URL hash
function updatePageFromHash() {
    const hash = window.location.hash;
    if (hash.startsWith("#page")) {
        const pageFromHash = parseInt(hash.substring(5));
        if (!isNaN(pageFromHash) && pageFromHash >= 0 && pageFromHash < pages.length) {
            currentPage = pageFromHash;
            renderPage(); // Re-render the page based on the new currentPage
        } else {
            console.warn("Invalid page number in hash:", hash);
            currentPage = 0; // Fallback to default
            renderPage();
        }
    } else if (hash === "") {
        // If hash is cleared (e.g., direct navigation to chapter2.html), go to page 0
        currentPage = 0;
        renderPage();
    }
}

// 5. EVENT LISTENERS
audioButton.addEventListener("click", toggleAudio);
pageAudio.addEventListener("ended", () => {
    playPauseIcon.innerHTML = playIconSVG;
});

videoButton.addEventListener("click", nextPage); // If clicking video button should go to next page

function nextPage() {
    if (currentPage < pages.length - 1) {
        currentPage++;
        renderPage(); // Call renderPage to display the new content
    } else {
        window.location.href = "../path_selection.html";
    }
}
    
function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        renderPage(); // Call renderPage to display the new content
    } else {
        // Go to the last page of Chapter 1 - This will trigger a full page reload for chapter1.html
        window.location.href = "chapter1.html#page5"; 
    }
}
    
function toggleLightbox() {
    lightbox.classList.toggle("hidden");
}

infoButton.addEventListener("click", toggleLightbox);

// Initial setup and render when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    createProgressDots(); // Create dots once on initial load
    updatePageFromHash(); // Determine initial page from hash and render it
});

// LISTEN FOR HASH CHANGES
// This is the crucial part that makes navigation from your top menu work
window.addEventListener('hashchange', updatePageFromHash);