
  // Disable right-click
  document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  }, false);

  // Disable Ctrl+U and F12
  document.onkeydown = function(e) {
    if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
      e.preventDefault();
      return false;
    }
    if (e.key === "F12") {
      e.preventDefault();
      return false;
    }
  };
