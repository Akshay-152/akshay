
// Disable right-click
document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
}, false);

// Disable Ctrl+U, F12, Ctrl+Shift+I (View Source / DevTools)
document.addEventListener("keydown", function(e) {
  // View Source
  if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
    e.preventDefault();
  }
  // F12
  if (e.key === "F12") {
    e.preventDefault();
  }
  // DevTools: Ctrl+Shift+I
  if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) {
    e.preventDefault();
  }
  // Screenshot key (PrintScreen)
  if (e.key === "PrintScreen") {
    navigator.clipboard.writeText('');
    alert("Screenshot disabled!");
    e.preventDefault();
  }
});

// Blur content when tab is hidden (e.g., screen recording or tab switching)
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    document.body.style.filter = "blur(8px)";
  } else {
    document.body.style.filter = "none";
  }
});

// Optional: Disable text selection and dragging
document.addEventListener("DOMContentLoaded", function () {
  document.body.style.userSelect = "none";
  document.body.style.webkitUserSelect = "none";
  document.body.style.msUserSelect = "none";
  document.body.style.webkitUserDrag = "none";
});
