const pages = [
    {
        img: "../img/images/Cranial Vault/CVSurg-title.png",
        showButton: false,
        showTextBox: false,
        text: "cv ch4", 
        pageContentTitle: "", // Changed name
        pageContentDescription: "" // Changed name
    },
    {
        img: "../img/images/Cranial Vault/Surg-time.png",
        showButton: false,
        showTextBox: false,
        text: "cv ch4", 
        pageContentTitle: "", // Changed name
        pageContentDescription: "The surgery will likely last around 4-6 hours" // Changed name
    },
    {
        img: "../img/images/Cranial Vault/CVSurg-1.png",
        showButton: false,
        showTextBox: false,
        text: "cv ch4", 
        pageContentTitle: "1. Preparation", // Changed name
        pageContentDescription: "The child will be put to sleep with medication through a mask, then receive anaesthesia through an IV." // Changed name
    },
    {
        img: "../img/images/Cranial Vault/CVSurg-2.png",
        showButton: false,
        showTextBox: false,
        text: "cv ch4 2",
        pageContentTitle: "2. Making the incision", // Changed name
        pageContentDescription: "An incision is made across the top of the head from one ear to the other." // Changed name
    },
    {
        img: "../img/images/Cranial Vault/CVSurg-3.png",
        showButton: false,
        showTextBox: false,
        text: "",
        pageContentTitle: "3. Removing skull ", // Changed name
        pageContentDescription: "Sections of the skull bones are carefully removed." // Changed name
    },
    {
        img: "../img/images/Cranial Vault/CVSurg-4.png",
        showButton: false,
        showTextBox: false,
        text: "",
        pageContentTitle: "4. Reshaping the bones", // Changed name
        pageContentDescription: "The removed bone pieces are reshaped." // Changed name
    },
    {
        img: "../img/images/Cranial Vault/CVSurg-5.png",
        showButton: false,
        showTextBox: false,
        text: "",
        pageContentTitle: "5. Placing bones in place", // Changed name
        pageContentDescription: "Reshaped pieces are placed back in a way that allows the skull to grow normally." // Changed name
    },
    {
        img: "../img/images/Cranial Vault/CVSurg-6.png",
        showButton: false,
        showTextBox: false,
        text: "",
        pageContentTitle: "6. Secure bones in place", // Changed name
        pageContentDescription: "Small special plates and screws are used to secure the bones, the plates and screws will dissolve on their own." // Changed name
    },
    {
        img: "../img/images/Cranial Vault/CVSurg-7.png",
        showButton: false,
        showTextBox: false,
        text: "",
        pageContentTitle: "7. Closing the incision ", // Changed name
        pageContentDescription: "After the bones are all secured, the incision is closed with stitches and a drain is placed." // Changed name
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
    document.title = page.pageContentTitle ? `Surgery – Cranial Vault` : "Surgery – Cranial Vault";


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
      window.location.href = "../path_selection.html";
    }
}

function toggleLightbox() {
    lightbox.classList.toggle("hidden");
}

infoButton.addEventListener("click", toggleLightbox);

// Initial render
renderPage();