const slideItems = document.querySelectorAll('.scrollPanel');
const slideTrack = document.getElementById('scrollTrack');
let currentSlideIndex = 0;
let autoDirection = 1; // 1 = forward, -1 = backward

function moveToSlide(step) {
  currentSlideIndex += step;

  // Reverse direction if ends are reached
  if (currentSlideIndex >= slideItems.length) {
    currentSlideIndex = slideItems.length - 2;
    autoDirection = -1;
  } else if (currentSlideIndex < 0) {
    currentSlideIndex = 1;
    autoDirection = 1;
  }

  slideItems[currentSlideIndex].scrollIntoView({ behavior: 'smooth' });
}

// Intersection Observer for animation
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visiblePanel');
    }
  });
}, { threshold: 0.3 });

slideItems.forEach(item => revealObserver.observe(item));

// Auto-scroll every 5 seconds
setInterval(() => {
  moveToSlide(autoDirection);
}, 5000);

// Optional button controls if needed
function nextSlide() {
  moveToSlide(1);
}

function previousSlide() {
  moveToSlide(-1);
}