document.addEventListener("DOMContentLoaded", () => {

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
  const progressTime = 1000;
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
      }, 400);
    }

    progress++;
  }

  progressInterval = setInterval(updateProgress, intervalTime);

  /* =========================
     IMAGE GALLERY (FAST LOAD)
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
    "https://i.postimg.cc/wjLzj34g/03-large.jpg",
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

  // Preload images for smooth animation
  function preloadImages(srcArray) {
    return Promise.all(
      srcArray.map(src => {
        return new Promise(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );
  }

  function initializeGallery() {
    trackTop.innerHTML = '';
    trackBottom.innerHTML = '';

    const totalSets = 8; // enough for seamless loop

    for (let set = 0; set < totalSets; set++) {
      images.forEach((src, index) => {

        const createImage = () => {
          const wrapper = document.createElement('div');
          wrapper.className = 'image-wrapper';

          const img = document.createElement('img');
          img.src = src;
          img.alt = `Gallery image ${index + 1}`;
          img.className = 'gallery-img';
          img.loading = 'eager'; // IMPORTANT for speed
          img.decoding = 'async';

          wrapper.appendChild(img);
          return wrapper;
        };

        trackTop.appendChild(createImage());
        trackBottom.appendChild(createImage());
      });
    }
  }

  // Start gallery AFTER images are ready
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
