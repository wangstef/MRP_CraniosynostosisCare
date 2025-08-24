
const pages = [
    //img: is bg img, showbutton is for lightbox button, text: is the text in the text box 
    {
        img: "../img/images/Non journey/NJSplash.png",
        showButton: false,
        showTextBox: true,
        text: "Although we reach the end of this resource, your journey will continue. There are so many people that want to help and support you and your family."
    }, 
    {
        img: "../img/images/Non journey/NJCredits.png",
        showButton: false,
        showTextBox: false,
        text: ""
    }
];
  
let currentPage = 0;

  
// Jump to specific page if URL hash exists
if (window.location.hash.startsWith("#page")) {
    const pageFromHash = parseInt(window.location.hash.replace("#page", ""));
    if (!isNaN(pageFromHash) && pageFromHash >= 0 && pageFromHash < pages.length) {
      currentPage = pageFromHash;
    }
  } else {
    currentPage = 0; // default only if no hash
  }
  
  
  const backgroundImg = document.getElementById("backgroundImg");
  const infoButton = document.getElementById("infoButton");
  const lightbox = document.getElementById("lightbox");
  
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
    textBox.style.display = "flex"; // changed from "block" for flex layout
    textContent.innerText = page.text;
  } else {
    textBox.style.display = "none";
  }

  // Highlight current progress dot
  const dots = document.querySelectorAll(".progress-dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentPage);
  });

    // 🧩 Always store current page in the hash so toggle goes to the corresponding page
     window.location.hash = "#page" + currentPage;
  }  
  
  function nextPage() {
    if (currentPage < pages.length - 1) {
      currentPage++;
      renderPage();
    } else {
      // Go to next chapter
      window.location.href = "/index.html";
    }
  }
  
function prevPage() {
  if (currentPage > 0) {
    // If we are not on the first page, just go to the previous one.
    currentPage--;
    renderPage();
  } else {
    // If on the first page (page 0), check where the user came from.
    const previousPageUrl = document.referrer;

    // Check if the previous page was chapter 5 of the endoscopic path.
    if (previousPageUrl.includes('endoscopic')) {
      // 👉 Redirect directly to page 2 of that chapter.
      window.location.href = '../endoscopic/chapter5.html#page8';

    // Check if the previous page was chapter 5 of the cranial vault path.
    } else if (previousPageUrl.includes('cranialvault')) {
      // 👉 Redirect directly to page 2 of that chapter.
      window.location.href = '../cranialvault/chapter5.html#page5';
     } // else if (previousPageUrl.includes('nonjourney')) {
    //   // 👉 Redirect directly to page 2 of that chapter.
    //   window.location.href = '.././path_selection.html';
    // }
    // If the user came from any other page, clicking 'previous' on page 0 will do nothing.
  }
}
  
 // Keyboard navigation with arrow keys
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    nextPage(); // Right arrow → Next page
  } else if (event.key === "ArrowLeft") {
    prevPage(); // Left arrow → Previous page
  }
});   


  // Event listeners THE LIGHTBOX
  function toggleLightbox() {
    lightbox.classList.toggle("hidden");
  }
  
  infoButton.addEventListener("click", toggleLightbox);
  
  // Initial render
  renderPage();
  