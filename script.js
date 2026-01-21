document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     INJECT STYLES (CSS in JS)
  ========================== */

  const style = document.createElement("style");
  style.textContent = `
    .image-wrapper {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }

    .gallery-img {
      width: 280px;
      height: 180px;
      object-fit: cover;
      will-change: transform;
      transform: translateZ(0);
      user-select: none;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  /* =========================
     LOADING SCREEN
  ========================== */

  const loadingScreen = document.getElementById('loadingScreen');
  const progressBar = document.getElementById('progressBar');
  const percentageText = document.getElementById('percentage');

  if (!loadingScreen || !progressBar || !percentageText) {
    console.error("Loading elements missing");
    return;
  }

  let progress = 1;
  const totalProgress = 100;
  const progressTime = 900;
  const intervalTime = progressTime / totalProgress;
  let progressInterval;

  document.body.style.overflow = "hidden";

  function updateProgress() {
    progressBar.style.width = progress + "%";
    percentageText.textContent = progress + "%";

    if (progress >= totalProgress) {
      clearInterval(progressInterval);
      setTimeout(() => {
        loadingScreen.classList.add("hidden");
        document.body.style.overflow = "auto";
      }, 300);
    }
    progress++;
  }

  progressInterval = setInterval(updateProgress, intervalTime);

  /* =========================
     IMAGE SOURCES
  ========================== */

  const images = [
    "https://res.cloudinary.com/de7bwqvq5/image/upload/v1769008806/uq4ldfzsna9u9ajcjucn.jpg",
    "https://res.cloudinary.com/de7bwqvq5/image/upload/v1768989808/z2cz2i5flh1acntviozv.png",
    "https://res.cloudinary.com/drooohxav/image/upload/v1769008996/emm0t4kcvyb7tiyfu8x9.jpg",
    "https://i.postimg.cc/wjLzj34g/03-large.jpg",
    "https://i.postimg.cc/3xT8pgvp/06_large.jpg",
    "https://i.postimg.cc/HkgY5QyX/07_large.jpg",
    "https://i.postimg.cc/mgsLMQHG/08_large.jpg",
    "https://i.postimg.cc/7Y7PfBf4/09_large.jpg",
    "https://i.postimg.cc/gkpQH4NS/01-large.jpg",
    "https://i.postimg.cc/9F2KY1Jk/02-large.jpg",
    "https://i.postimg.cc/dQrgCgm3/04-large.jpg",
    "https://i.postimg.cc/RVPdJT8R/10-large.jpg",
    "https://i.postimg.cc/5NPgQmGs/11-large.jpg",
    "https://i.postimg.cc/4N8PH1M9/15.jpg"
  ];

  const trackTop = document.getElementById('trackTop');
  const trackBottom = document.getElementById('trackBottom');

  if (!trackTop || !trackBottom) {
    console.error("Gallery tracks missing");
    return;
  }

  /* =========================
     UTILITIES
  ========================== */

  // Shuffle without adjacent duplicates
  function shuffleNoRepeat(arr) {
    let result = [];
    let last = null;

    while (result.length < arr.length) {
      const options = arr.filter(i => i !== last);
      const pick = options[Math.floor(Math.random() * options.length)];
      result.push(pick);
      last = pick;
    }
    return result;
  }

  // Preload images (fast + smooth)
  function preloadImages(srcs) {
    return Promise.all(
      srcs.map(src => new Promise(resolve => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve;
      }))
    );
  }

  /* =========================
     GALLERY INITIALIZATION
  ========================== */

  function initializeGallery() {
    trackTop.innerHTML = '';
    trackBottom.innerHTML = '';

    const sets = 6; // length of line
    let lastTop = null;
    let lastBottom = null;

    for (let i = 0; i < sets; i++) {

      shuffleNoRepeat(images).forEach(src => {
        if (src === lastTop) return;

        const wrap = document.createElement('div');
        wrap.className = 'image-wrapper';

        const img = document.createElement('img');
        img.src = src;
        img.className = 'gallery-img';
        img.loading = 'eager';
        img.decoding = 'async';

        wrap.appendChild(img);
        trackTop.appendChild(wrap);
        lastTop = src;
      });

      shuffleNoRepeat(images).forEach(src => {
        if (src === lastBottom) return;

        const wrap = document.createElement('div');
        wrap.className = 'image-wrapper';

        const img = document.createElement('img');
        img.src = src;
        img.className = 'gallery-img';
        img.loading = 'eager';
        img.decoding = 'async';

        wrap.appendChild(img);
        trackBottom.appendChild(wrap);
        lastBottom = src;
      });
    }
  }

  /* =========================
     START EVERYTHING
  ========================== */

  preloadImages(images).then(() => {
    initializeGallery();
  });

  /* =========================
     INTERACTION LOCK
  ========================== */

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());

});
