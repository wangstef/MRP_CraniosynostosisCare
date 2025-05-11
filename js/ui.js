document.addEventListener('DOMContentLoaded', function () {
  // Create the button
  const button = document.createElement('button');
  button.id = 'mainMenuButton';
  button.className = 'menu-button';
  button.innerText = '🏠 Main Menu';

  // Add to body
  document.body.appendChild(button);

  // Dynamically compute path to index.html
  let depth = window.location.pathname.split('/').filter(p => p.length > 0).length - 1;
  let pathToRoot = './' + '../'.repeat(depth);
  let mainMenuPath = pathToRoot + 'index.html';

  // Add confirmation click event
  button.addEventListener('click', function () {
    const confirmed = confirm("Are you sure you want to return to the main menu? Unsaved progress may be lost.");
    if (confirmed) {
      window.location.href = mainMenuPath;
    }
  });
});
