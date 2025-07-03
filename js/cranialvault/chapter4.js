const pages = [
    {
        img: "../img/images/Non journey/BG-wave.png",
        showButton: false,
        showTextBox: false,
        text: "cv ch4",
        pageContentTitle: "Introduction to Surgery", // Changed name
        pageContentDescription: "This chapter covers the surgical approaches for craniosynostosis. Here's an overview of what to expect." // Changed name
    },
    {
        img: "../img/images/Non journey/BG-wave.png",
        showButton: false,
        showTextBox: false,
        text: "cv ch4 2",
        pageContentTitle: "Preparing for the Operation", // Changed name
        pageContentDescription: "Important steps and considerations before your child's surgery. We'll guide you through it." // Changed name
    },
    {
        img: "../img/images/Non journey/BG-wave.png",
        showButton: false,
        showTextBox: false,
        text: "",
        pageContentTitle: "Post-Operative Care", // Changed name
        pageContentDescription: "What to expect during recovery and how to care for your child after surgery. Follow these guidelines." // Changed name
    }
];

let currentPage = 0;

//Necessary to determine the current page based on URL hash
if (window.location.hash && window.location.hash.startsWith("#page")) {
    const pageFromHash = parseInt(window.location.hash.substring(5));

    if (!isNaN(pageFromHash) && pageFromHash >= 0 && pageFromHash < pages.length) {
        currentPage = pageFromHash;
    }
}

const backgroundImg = document.getElementById("backgroundImg");
const infoButton = document.getElementById("infoButton");
const lightbox = document.getElementById("lightbox");

// Get the NEW elements for page-specific content
const pageContentTitle = document.getElementById("pageContentTitle"); // Changed ID
const pageContentDescription = document.getElementById("pageContentDescription"); // Changed ID

//set progress bar pages (dots)
const progressBar = document.getElementById("progressBar");

    // Create one dot per page
    pages.forEach(() => {
      const dot = document.createElement("div");
      dot.classList.add("progress-dot");
      progressBar.appendChild(dot);
    });

function renderPage() {
    const page = pages[currentPage];
    backgroundImg.src = page.img;
    infoButton.style.display = page.showButton ? "block" : "none";

    const textBox = document.getElementById("textBox");
    const textContent = document.getElementById("textContent");

    if (page.showTextBox) {
        textBox.style.display = "flex";
        textContent.innerText = page.text;
    } else {
        textBox.style.display = "none";
    }

    // Update the new page-specific title and description
    // This will NOT affect #dynamic-chapter-title or navigation
    pageContentTitle.innerText = page.pageContentTitle || "";
    pageContentDescription.innerText = page.pageContentDescription || "";

    // You can still update the browser tab's title if you wish, using the new pageContentTitle
    document.title = page.pageContentTitle ? `Chapter 4: ${page.pageContentTitle}` : "Chapter 4: Surgery – Cranial Vault";


    // Highlight current progress dot
    const dots = document.querySelectorAll(".progress-dot");
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentPage);
    });

    // Always store current page in the hash
    window.location.hash = "#page" + currentPage;
}

//next page and end of chapter 2
function nextPage() {
    if (currentPage < pages.length - 1) {
        currentPage++;
        if (typeof renderPage === "function") {
            renderPage();
        } else {
            console.error("renderPage function is not defined in this chapter script.");
        }
    } else {
        window.location.href = "chapter5.html#page0";
    }
}

function prevPage() {
    if (currentPage > 0) {
      currentPage--;
      renderPage();
    } else {
      window.location.href = "chapter3.html#page2";
    }
}

function toggleLightbox() {
    lightbox.classList.toggle("hidden");
}

infoButton.addEventListener("click", toggleLightbox);

// Initial render
renderPage();