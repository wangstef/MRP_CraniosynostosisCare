const pages = [
    { 
        img: "../img/images/Non journey/Ch 2 a.png",
        showButton: false ,
        showTextBox: true,
        text: "Most parents have...."
    }, //showbutton is for lightbox button
    {
        img: "../img/images/Non journey/Ch 2 b.png",
        showButton: true,
        showTextBox: true,
        text: "If parents want...."
    },
    {
        img: "../img/images/Non journey/Ch 2 c.png",
        showButton: false,
        showTextBox: false,
        text: ""
    }
  ];
  
  let currentPage = 0;
  
  const backgroundImg = document.getElementById("backgroundImg");
  const infoButton = document.getElementById("infoButton");
  const lightbox = document.getElementById("lightbox");
  
  function renderPage() {
    const page = pages[currentPage];
    backgroundImg.src = page.img;
    infoButton.style.display = page.showButton ? "block" : "none";
    document.getElementById("textBox").innerText = page.text;  // This is the key part!

    // Show or hide the text box based on the page's property
    const textBox = document.getElementById("textBox");
    if (page.showTextBox) {
      textBox.innerText = page.text;
      textBox.style.display = "block";
    } else {
      textBox.style.display = "none";
    }

    // 🧩 Always store current page in the hash
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
      // Go to the last page of Chapter 1
      window.location.href = "chapter1.html#page2";
    }
  }
  
  function toggleLightbox() {
    lightbox.classList.toggle("hidden");
  }
  
  infoButton.addEventListener("click", toggleLightbox);
  
  // Initial render
  renderPage();
  