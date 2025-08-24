
const pages = [
    //img: is bg img, showbutton is for lightbox button, text: is the text in the text box
    { 
        img: "../img/images/Non journey/NJWelcome-title.png",
        showButton: false ,
        showTextBox: false,
        showtooltip: false,
        text: ""

    }, 
    {
        img: "../img/images/Non journey/BG-wave.png",
        showButton: false,
        showTextBox: true,
        showtooltip: false,        
        text: "Welcome to Craniosynostosis Care. My name is Dr. Cranio and I am here to guide you through a surgical journey from pre-operation to aftercare."
    }, 
    {
        img: "../img/images/Non journey/BG-wave.png",
        showButton: false,
        showTextBox: true,
        showtooltip: true,
        text: "If you find any words hard to understand. You can check for how to pronounce them and a definition in our <strong>“Vocabulary Words”</strong> page."
    },
    {
        img: "../img/images/Non journey/BG-wave.png",
        showButton: false,
        showTextBox: true,
        showtooltip: false,
        text: "Arrival of a new baby can be both a joyful and stressful experience. A diagnosis of craniosynostosis may add to those overwhelming emotions. This resource gives a summary about commonly offered options."
    },
    {
        img: "../img/images/Non journey/Ch 1 d.png",
        showButton: false,
        showTextBox: true,
        showtooltip: false,
        text: "This resource has information about craniosynostosis to help you communicate with your medical care team. Your medical care team will guide you through the journey and fully support your treatment choices."
    },
    {
        img: "../img/images/Non journey/Ch 1 e.png",
        showButton: false,
        showTextBox: false,
        showtooltip: false,
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


  //RENDER page 
  function renderPage() {
  const page = pages[currentPage];
  backgroundImg.src = page.img;
  infoButton.style.display = page.showButton ? "block" : "none";

  const textBox = document.getElementById("textBox");
  const textContent = document.getElementById("textContent");
  const tooltip = document.getElementById("static-tooltip-container");

  if (page.showTextBox) {
    textBox.style.display = "flex"; // changed from "block" for flex layout
    textContent.innerHTML  = page.text;
;
  } else {
    textBox.style.display = "none";
  }

  // Tooltip visibility
  tooltip.style.display = page.showtooltip ? "block" : "none";

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
      window.location.href = "chapter2.html";
    }
  }
  
  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
      renderPage();
    } else {
      window.location.href = "tutorial.html"; // Go back to main menu
    }
  }
  


  // Event listeners THE LIGHTBOX
  function toggleLightbox() {
    lightbox.classList.toggle("hidden");
  }
  
  infoButton.addEventListener("click", toggleLightbox);


// Keyboard navigation with arrow keys
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    nextPage(); // Right arrow → Next page
  } else if (event.key === "ArrowLeft") {
    prevPage(); // Left arrow → Previous page
  }
});

  
  // Initial render
  renderPage();
  