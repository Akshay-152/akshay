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
    "https://arc.ceconline.edu/img/portfolio/01-large.jpg",
    "https://arc.ceconline.edu/img/portfolio/02-large.jpg",
    "https://arc.ceconline.edu/img/portfolio/03-large.jpg",
    "https://arc.ceconline.edu/img/portfolio/04-large.jpg",
    "https://arc.ceconline.edu/img/portfolio/05-large.jpg",
    "https://arc.ceconline.edu/img/portfolio/06-large.jpg",
    "https://arc.ceconline.edu/img/portfolio/07-large.jpg",
    "https://arc.ceconline.edu/img/portfolio/08-large.jpg",
    "https://arc.ceconline.edu/img/portfolio/09-large.jpg"
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
