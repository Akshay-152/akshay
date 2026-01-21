document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     PERFORMANCE CONFIGURATION
  ========================== */
  const CONFIG = {
    MAX_PRELOAD_IMAGES: 15,           // Maximum images to preload at once
    PRELOAD_BATCH_SIZE: 4,            // Load images in batches
    LOADING_TIMEOUT: 10000,           // 10 second timeout for image loading
    CACHE_EXPIRY: 300000,             // 5 minutes cache expiry
    MAX_RETRY_ATTEMPTS: 3,            // Retry failed images
    RETRY_DELAY: 1000,                // 1 second between retries
  };

  /* =========================
     IMAGE CACHE SYSTEM
  ========================== */
  const imageCache = new Map();
  const failedImages = new Set();
  const loadingPromises = new Map();

  function addToCache(src, img) {
    imageCache.set(src, {
      element: img,
      timestamp: Date.now(),
      status: 'loaded'
    });
  }

  function getFromCache(src) {
    const cached = imageCache.get(src);
    if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_EXPIRY) {
      return cached.element;
    }
    return null;
  }

  function cleanupCache() {
    const now = Date.now();
    for (const [src, data] of imageCache.entries()) {
      if (now - data.timestamp > CONFIG.CACHE_EXPIRY) {
        imageCache.delete(src);
      }
    }
  }

  /* =========================
     INJECT STYLES
  ========================== */
  const style = document.createElement("style");
  style.textContent = `
    .image-wrapper {
      flex-shrink: 0;
      width: 280px;
      height: 180px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      position: relative;
      background: linear-gradient(45deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .gallery-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: translateZ(0);
      will-change: transform;
      pointer-events: none;
      user-select: none;
      opacity: 0;
      transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .gallery-img.loaded {
      opacity: 1;
    }

    .gallery-img.error {
      opacity: 0.3;
      filter: grayscale(1);
    }

    .loading-placeholder {
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);

  /* =========================
     LOADING SCREEN WITH REAL PROGRESS
  ========================== */
  const loadingScreen = document.getElementById("loadingScreen");
  const progressBar = document.getElementById("progressBar");
  const percentageText = document.getElementById("percentage");

  let progress = 0;
  let realImageProgress = 0;
  let minimumDisplayTime = 1200; // Minimum 1.2 seconds for loading screen
  let loadingStartTime = Date.now();

  document.body.style.overflow = "hidden";

  function updateProgress(value, isRealImageProgress = false) {
    if (isRealImageProgress) {
      realImageProgress = value;
      // Weighted progress: 30% from time, 70% from actual loading
      progress = Math.min(30 + (realImageProgress * 0.7), 100);
    } else {
      progress = Math.min(value, 100 - (realImageProgress * 0.7));
    }
    
    const totalProgress = Math.min(progress, 100);
    progressBar.style.width = totalProgress + "%";
    percentageText.textContent = Math.round(totalProgress) + "%";
    
    return totalProgress;
  }

  // Initial progress animation (time-based)
  const progressInterval = setInterval(() => {
    const elapsed = Date.now() - loadingStartTime;
    const timeProgress = Math.min((elapsed / minimumDisplayTime) * 30, 30);
    updateProgress(timeProgress);
  }, 50);

  /* =========================
     IMAGE SOURCES WITH PRIORITY
  ========================== */
  const images = [
    // High priority images (load first)
    { src: "https://res.cloudinary.com/de7bwqvq5/image/upload/v1769008806/uq4ldfzsna9u9ajcjucn.jpg", priority: 1 },
    { src: "https://res.cloudinary.com/de7bwqvq5/image/upload/v1768989808/z2cz2i5flh1acntviozv.png", priority: 1 },
    { src: "https://res.cloudinary.com/drooohxav/image/upload/v1769008996/emm0t4kcvyb7tiyfu8x9.jpg", priority: 1 },
    
    // Medium priority
    { src: "https://i.postimg.cc/wjLzj34g/03-large.jpg", priority: 2 },
    { src: "https://i.postimg.cc/3xT8pgvp/06_large.jpg", priority: 2 },
    { src: "https://i.postimg.cc/HkgY5QyX/07_large.jpg", priority: 2 },
    { src: "https://i.postimg.cc/mgsLMQHG/08_large.jpg", priority: 2 },
    
    // Lower priority
    { src: "https://i.postimg.cc/7Y7PfBf4/09_large.jpg", priority: 3 },
    { src: "https://i.postimg.cc/gkpQH4NS/01-large.jpg", priority: 3 },
    { src: "https://i.postimg.cc/9F2KY1Jk/02-large.jpg", priority: 3 },
    { src: "https://i.postimg.cc/dQrgCgm3/04-large.jpg", priority: 3 },
    { src: "https://i.postimg.cc/RVPdJT8R/10-large.jpg", priority: 3 },
    { src: "https://i.postimg.cc/5NPgQmGs/11-large.jpg", priority: 3 },
    { src: "https://i.postimg.cc/4N8PH1M9/15.jpg", priority: 3 }
  ];

  // Sort by priority
  images.sort((a, b) => a.priority - b.priority);
  const imageSources = images.map(img => img.src);

  const trackTop = document.getElementById("trackTop");
  const trackBottom = document.getElementById("trackBottom");

  /* =========================
     ADVANCED IMAGE LOADER
  ========================== */
  class ImageLoader {
    constructor(maxConcurrent = CONFIG.PRELOAD_BATCH_SIZE) {
      this.maxConcurrent = maxConcurrent;
      this.queue = [];
      this.active = 0;
      this.loadedCount = 0;
      this.totalCount = 0;
    }

    loadImage(src, retryCount = 0) {
      return new Promise((resolve, reject) => {
        // Check cache first
        const cached = getFromCache(src);
        if (cached) {
          resolve(cached);
          return;
        }

        // Check if already loading
        if (loadingPromises.has(src)) {
          loadingPromises.get(src).then(resolve).catch(reject);
          return;
        }

        const img = new Image();
        const timeoutId = setTimeout(() => {
          img.onload = img.onerror = null;
          img.src = '';
          this.handleLoadError(src, retryCount, resolve, reject, 'timeout');
        }, CONFIG.LOADING_TIMEOUT);

        img.onload = () => {
          clearTimeout(timeoutId);
          img.decode()
            .then(() => {
              addToCache(src, img);
              loadingPromises.delete(src);
              this.loadedCount++;
              updateProgress((this.loadedCount / this.totalCount) * 100, true);
              resolve(img);
            })
            .catch(() => {
              // If decode fails, still use the image
              addToCache(src, img);
              loadingPromises.delete(src);
              this.loadedCount++;
              updateProgress((this.loadedCount / this.totalCount) * 100, true);
              resolve(img);
            });
        };

        img.onerror = () => {
          clearTimeout(timeoutId);
          loadingPromises.delete(src);
          this.handleLoadError(src, retryCount, resolve, reject, 'error');
        };

        img.src = src;
        img.loading = 'eager';
        loadingPromises.set(src, new Promise((res, rej) => {
          img.onload = () => res(img);
          img.onerror = () => rej(new Error('Failed to load'));
        }));
      });
    }

    handleLoadError(src, retryCount, resolve, reject, errorType) {
      if (retryCount < CONFIG.MAX_RETRY_ATTEMPTS && !failedImages.has(src)) {
        setTimeout(() => {
          this.loadImage(src, retryCount + 1).then(resolve).catch(reject);
        }, CONFIG.RETRY_DELAY * (retryCount + 1));
      } else {
        failedImages.add(src);
        this.loadedCount++; // Count as loaded (failed) for progress
        updateProgress((this.loadedCount / this.totalCount) * 100, true);
        
        // Create error placeholder
        const errorImg = new Image();
        errorImg.classList.add('error');
        errorImg.alt = 'Failed to load image';
        resolve(errorImg);
      }
    }

    async loadImages(sources) {
      this.totalCount = sources.length;
      this.loadedCount = 0;
      
      // Load in batches
      const batches = [];
      for (let i = 0; i < sources.length; i += this.maxConcurrent) {
        batches.push(sources.slice(i, i + this.maxConcurrent));
      }

      const results = [];
      for (const batch of batches) {
        const batchPromises = batch.map(src => this.loadImage(src));
        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults);
      }

      return results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
    }
  }

  /* =========================
     UTILITIES
  ========================== */
  function shuffleNoAdjacent(arr) {
    if (arr.length < 2) return [...arr];
    
    const result = [];
    let last = null;
    let attempts = 0;
    const maxAttempts = arr.length * 10;

    while (result.length < arr.length && attempts < maxAttempts) {
      // Filter out the last used image
      const available = arr.filter(img => img !== last);
      
      // If no available images (only one type), break
      if (available.length === 0) {
        result.push(arr[0]);
        break;
      }

      // Pick random from available
      const pick = available[Math.floor(Math.random() * available.length)];
      result.push(pick);
      last = pick;
      attempts++;
    }

    // Fill remaining if needed
    while (result.length < arr.length) {
      const used = new Set(result.slice(-5)); // Look at last 5 images
      const available = arr.filter(img => !used.has(img));
      const pick = available.length > 0 
        ? available[0] 
        : arr[Math.floor(Math.random() * arr.length)];
      result.push(pick);
    }

    return result;
  }

  /* =========================
     GALLERY BUILDER WITH PERFORMANCE OPTIMIZATION
  ========================== */
  function buildTrack(track, imageElements) {
    // Clear track
    track.innerHTML = '';
    
    // Create fragment for batch DOM operations
    const fragment = document.createDocumentFragment();
    
    // Generate optimized sequence
    const imageSrcs = imageElements.map(img => img.src || img.currentSrc);
    let sequence = [];
    
    for (let i = 0; i < 6; i++) {
      const shuffled = shuffleNoAdjacent(imageSrcs);
      sequence = sequence.concat(shuffled);
    }
    
    // Build track with staggered loading
    sequence.forEach((src, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "image-wrapper";
      
      // Find cached image or create placeholder
      const cachedImg = getFromCache(src);
      let img;
      
      if (cachedImg) {
        img = cachedImg.cloneNode();
        img.classList.add('loaded');
      } else {
        img = new Image();
        img.src = src;
        img.className = "gallery-img";
        
        // Add loading placeholder
        const placeholder = document.createElement("div");
        placeholder.className = "loading-placeholder";
        wrapper.appendChild(placeholder);
        
        img.onload = () => {
          img.classList.add('loaded');
          if (placeholder.parentNode === wrapper) {
            wrapper.removeChild(placeholder);
          }
        };
        
        img.onerror = () => {
          img.classList.add('error', 'loaded');
          if (placeholder.parentNode === wrapper) {
            wrapper.removeChild(placeholder);
          }
        };
      }
      
      img.loading = "lazy";
      img.decoding = "async";
      img.fetchPriority = index < 10 ? "high" : "low";
      
      wrapper.appendChild(img);
      wrapper.style.opacity = "0";
      wrapper.style.transform = "translateY(20px)";
      wrapper.style.transition = `opacity 0.5s ease ${index * 0.02}s, transform 0.5s ease ${index * 0.02}s`;
      
      fragment.appendChild(wrapper);
    });

    track.appendChild(fragment);
    
    // Animate in with requestAnimationFrame for smoothness
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const wrappers = track.querySelectorAll('.image-wrapper');
        wrappers.forEach(wrapper => {
          wrapper.style.opacity = "1";
          wrapper.style.transform = "translateY(0)";
        });
      });
    });
  }

  /* =========================
     INITIALIZATION WITH ADVANCED PRELOADING
  ========================== */
  async function initializeGallery() {
    try {
      // Cleanup old cache
      cleanupCache();
      
      // Create image loader
      const loader = new ImageLoader(CONFIG.PRELOAD_BATCH_SIZE);
      
      // Load high priority images first
      const highPriorityImages = images.filter(img => img.priority === 1).map(img => img.src);
      await loader.loadImages(highPriorityImages);
      
      // Load remaining images
      const loadedImages = await loader.loadImages(imageSources);
      
      // Build gallery after all images are loaded or timeout
      const loadTimeout = setTimeout(() => {
        console.warn('Image loading timeout, building with available images');
        buildGallery(loadedImages);
      }, CONFIG.LOADING_TIMEOUT);
      
      // Build gallery immediately if all loaded
      if (loader.loadedCount >= images.length * 0.8) { // At least 80% loaded
        clearTimeout(loadTimeout);
        buildGallery(loadedImages);
      }
      
    } catch (error) {
      console.error('Failed to initialize gallery:', error);
      // Build with whatever we have
      buildGallery([]);
    }
  }

  function buildGallery(loadedImages) {
    // Ensure loading screen completes
    updateProgress(100, true);
    clearInterval(progressInterval);
    
    // Hide loading screen with animation
    setTimeout(() => {
      if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
        loadingScreen.style.transition = 'opacity 0.5s ease';
        loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
          loadingScreen.classList.add("hidden");
          document.body.style.overflow = "auto";
        }, 500);
      }
    }, 300);
    
    // Build tracks
    trackTop.innerHTML = '';
    trackBottom.innerHTML = '';
    
    if (loadedImages.length > 0) {
      buildTrack(trackTop, loadedImages);
      buildTrack(trackBottom, loadedImages);
    } else {
      // Fallback: Use original sources if no images loaded
      buildTrack(trackTop, imageSources.map(src => {
        const img = new Image();
        img.src = src;
        return img;
      }));
      buildTrack(trackBottom, imageSources.map(src => {
        const img = new Image();
        img.src = src;
        return img;
      }));
    }
  }

  /* =========================
     START INITIALIZATION
  ========================== */
  initializeGallery();

  /* =========================
     INTERACTION & PERFORMANCE OPTIMIZATIONS
  ========================== */
  
  // Prevent unwanted interactions
  const preventInteraction = (e) => {
    if (e.type === 'contextmenu' || e.type === 'dragstart') {
      e.preventDefault();
    }
  };
  
  ['contextmenu', 'dragstart', 'selectstart'].forEach(event => {
    document.addEventListener(event, preventInteraction);
  });
  
  // Optimize scrolling performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        // Any scroll-based optimizations can go here
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(progressInterval);
    imageCache.clear();
    loadingPromises.clear();
  });
  
  // Lazy load additional functionality when idle
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      // Prefetch next batch of images if needed
      cleanupCache();
    }, { timeout: 2000 });
  }

});