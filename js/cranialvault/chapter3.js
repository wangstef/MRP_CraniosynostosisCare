
const pages = [
    //img: is bg img, showbutton is for lightbox button, text: is the text in the text box
    { 
        img: "../img/images/Cranial Vault/CVPre-title.png",
        showButton: false ,
        showTextBox: false,
        text: "Cranial Vault"
    },
    { 
        img: "../img/images/Cranial Vault/CVPre-healingTips.png",
        showButton: false ,
        showTextBox: false,
        text: "Cranial Vault"
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
      window.location.href = "chapter4.html#page0";
    }
  }
  
  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
      renderPage();
    } else {
      // Go to the last page of Chapter 2
      window.location.href = "../nonjourney/chapter2.html#page9"; // Redirect to the last page of Chapter 2
    }
  }
  
  function toggleLightbox() {
    lightbox.classList.toggle("hidden");
  }
  
  infoButton.addEventListener("click", toggleLightbox);
  
  // Initial render
  renderPage();
  