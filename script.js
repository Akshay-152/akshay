document.addEventListener("DOMContentLoaded", () => {

  // Get DOM elements
  const loadingScreen = document.getElementById('loadingScreen');
  const progressBar = document.getElementById('progressBar');
  const percentageText = document.getElementById('percentage');

  // Safety check
  if (!loadingScreen || !progressBar || !percentageText) {
    console.error("Required loading elements not found");
    return;
  }

  // Variables
  let progress = 1;
  const totalProgress = 100;
  const progressTime = 1000; // total loading duration (ms)
  const intervalTime = progressTime / totalProgress;

  let progressInterval;

  // Update progress
  function updateProgress() {
    progressBar.style.width = progress + "%";
    percentageText.textContent = progress + "%";

    if (progress >= totalProgress) {
      clearInterval(progressInterval);

      // Finish loading
      setTimeout(() => {
        loadingScreen.classList.add("hidden");

        // OPTIONAL: allow scrolling after load
        document.body.style.overflow = "auto";
      }, 500);
    }

    progress++;
  }

  // Prevent scroll during loading
  document.body.style.overflow = "hidden";

  // Start progress
  progressInterval = setInterval(updateProgress, intervalTime);

  // Speed variation (realistic feel)
  setTimeout(() => {
    clearInterval(progressInterval);
    progressInterval = setInterval(updateProgress, intervalTime * 0.7);
  }, progressTime * 0.4);

  setTimeout(() => {
    clearInterval(progressInterval);
    progressInterval = setInterval(updateProgress, intervalTime * 1.4);
  }, progressTime * 0.8);

});






        // Image collection - all high-quality abstract/art images
        const images = [
            "https://arc.ceconline.edu/img/portfolio/02-large.jpg",
            "https://arc.ceconline.edu/img/portfolio/01-large.jpg",
            "https://arc.ceconline.edu/img/portfolio/03-large.jpg",
            "https://arc.ceconline.edu/img/portfolio/04-large.jpg",
            "https://arc.ceconline.edu/img/portfolio/05-large.jpg",
            "https://arc.ceconline.edu/img/portfolio/06-large.jpg",
            "https://arc.ceconline.edu/img/portfolio/07-large.jpg",
            "https://arc.ceconline.edu/img/portfolio/08-large.jpg",
            "https://arc.ceconline.edu/img/portfolio/09-large.jpg"
        ];
        
        // DOM elements
        const trackTop = document.getElementById('trackTop');
        const trackBottom = document.getElementById('trackBottom');
        
        // Initialize the gallery
        function initializeGallery() {
            // Clear any existing content
            trackTop.innerHTML = '';
            trackBottom.innerHTML = '';
            
            // Duplicate images to create seamless loops (10 sets of images for each track)
            const totalSets = 10;
            
            for (let set = 0; set < totalSets; set++) {
                images.forEach((imgSrc, index) => {
                    // Create image for top track
                    const topImageWrapper = document.createElement('div');
                    topImageWrapper.className = 'image-wrapper';
                    
                    const topImg = document.createElement('img');
                    topImg.src = imgSrc;
                    topImg.alt = `Gallery image ${index + 1}`;
                    topImg.className = 'gallery-img';
                    topImg.loading = 'lazy';
                    
                    topImageWrapper.appendChild(topImg);
                    trackTop.appendChild(topImageWrapper);
                    
                    // Create image for bottom track (same image)
                    const bottomImageWrapper = document.createElement('div');
                    bottomImageWrapper.className = 'image-wrapper';
                    
                    const bottomImg = document.createElement('img');
                    bottomImg.src = imgSrc;
                    bottomImg.alt = `Gallery image ${index + 1}`;
                    bottomImg.className = 'gallery-img';
                    bottomImg.loading = 'lazy';
                    
                    bottomImageWrapper.appendChild(bottomImg);
                    trackBottom.appendChild(bottomImageWrapper);
                });
            }
        }
        
        // Start the gallery when page loads
        window.addEventListener('DOMContentLoaded', initializeGallery);
        
        // Prevent any right-click or interaction
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Prevent text selection
        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Prevent drag and drop
        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });