const slides = document.querySelectorAll('.slideCard');
let slideIndex = 0;
let scrollDir = 1;

const slideObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('activeSlide');
      slideIndex = [...slides].indexOf(entry.target);
    }
  });
}, { threshold: 0.5 });

slides.forEach(slide => slideObserver.observe(slide));

function moveSlide(directionChange) {
  let nextSlide = slideIndex + directionChange;

  if (nextSlide >= slides.length) {
    nextSlide = slides.length - 2;
    scrollDir = -1;
  } else if (nextSlide < 0) {
    nextSlide = 1;
    scrollDir = 1;
  }

  slides[nextSlide].scrollIntoView({ behavior: 'smooth' });
}

setInterval(() => {
  moveSlide(scrollDir);
}, 5000);