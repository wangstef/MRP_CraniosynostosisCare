
const pages = [
    //img: is bg img, showbutton is for lightbox button, text: is the text in the text box
    { 
        img: "../img/images/Non journey/Ch 1 a.png",
        showButton: false ,
        text: "Welcome to the story of craniosynostosis. Let's begin with the basics."
    }, 
    {
        img: "../img/images/Non journey/Ch 1 b.png",
        showButton: true,
        text: "This is what the condition looks like in early stages."
    },
    {
        img: "../img/images/Non journey/Ch 1 c.png",
        showButton: false,
        text: "Treatment options differ depending on age and severity."
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
  
  function renderPage() {
    const page = pages[currentPage];
    backgroundImg.src = page.img;
    infoButton.style.display = page.showButton ? "block" : "none";
    document.getElementById("textBox").innerText = page.text;  // This is for the text box

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
    }
  }
  
  function toggleLightbox() {
    lightbox.classList.toggle("hidden");
  }
  
  infoButton.addEventListener("click", toggleLightbox);
  
  // Initial render
  renderPage();
  