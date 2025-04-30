const scrollPanels = document.querySelectorAll('.scrollPanel');
let panelIndex = 0;
let scrollDirection = 1;

function goToPanel(delta) {
  panelIndex += delta;

  if (panelIndex >= scrollPanels.length) {
    panelIndex = scrollPanels.length - 2;
    scrollDirection = -1;
  } else if (panelIndex < 0) {
    panelIndex = 1;
    scrollDirection = 1;
  }

  scrollPanels[panelIndex].scrollIntoView({ behavior: 'smooth' });
}

// Intersection observer to show content
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visiblePanel');
    }
  });
}, { threshold: 0.3 });

scrollPanels.forEach(panel => revealObserver.observe(panel));

// Auto-scroll every 5 seconds
setInterval(() => {
  goToPanel(scrollDirection);
}, 5000);