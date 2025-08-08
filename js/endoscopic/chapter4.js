const pages = [
    {
        img: "../img/images/Endoscopic/ESurg-title.png",
        showButton: false,
        showTextBox: false,
        text: "cv ch4", 
        pageContentTitle: "", // Changed name
        pageContentDescription: "" // Changed name
    },
    {
        img: "../img/images/Endoscopic/Surg-time.png",
        showButton: false,
        showTextBox: false,
        text: "cv ch4", 
        pageContentTitle: "", // Changed name
        pageContentDescription: "The surgery will likely last around 2-3 hours" // Changed name
    },
    {
        img: "../img/images/Endoscopic/ESurg-1.png",
        showButton: false,
        showTextBox: false,
        text: "cv ch4", 
        pageContentTitle: "1. Preparation", // Changed name
        pageContentDescription: "The doctor will have the child fall asleep with medication through a gas mask, and after they will give the child anesthesia through an IV." // Changed name
    },
    {
        img: "../img/images/Endoscopic/ESurg-2.png",
        showButton: false,
        showTextBox: false,
        text: "cv ch4 2",
        pageContentTitle: "2. Making the incision", // Changed name
        pageContentDescription: "The doctor makes two small incisions on the child’s head, near the closed sutures."
    },
    {
        img: "../img/images/Endoscopic/ESurg-3.png", 
        showButton: false,
        showTextBox: false,
        text: "",
        pageContentTitle: "3. Tools ", // Changed name
        pageContentDescription: "Once the child is asleep, the doctors will use small tools and a tiny camera called an endoscope." // Changed name
    },
    {
        img: "../img/images/Endoscopic/ESurg-4.png",
        showButton: false,
        showTextBox: false,
        text: "",
        pageContentTitle: "4. Removing the bone strip", // Changed name
        pageContentDescription: "Using the camera and tools, the doctor carefully removes a strip of bone from the fused area. This opens up space so the skull can grow properly." // Changed name
    },
    {
        img: "../img/images/Endoscopic/ESurg-5.png",
        showButton: false,
        showTextBox: false,
        text: "",
        pageContentTitle: "5. Closing the incision", // Changed name
        pageContentDescription: "Because the tools are tiny, they don’t need to make a big incision, which means after surgery, the child heals faster." // Changed name
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
    document.title = page.pageContentTitle ? "Surgery – Cranial Vault" : "Surgery – Cranial Vault";


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
      window.location.href = "../path_selection.html"; // Adjusted to point to the correct path selection page
    }
}

function toggleLightbox() {
    lightbox.classList.toggle("hidden");
}

infoButton.addEventListener("click", toggleLightbox);

// Initial render
renderPage();