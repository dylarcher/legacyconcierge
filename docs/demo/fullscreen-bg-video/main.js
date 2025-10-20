(() => {
  // Cache DOM elements
  const video = document.getElementById("bgVideo");
  const videoBackground = document.getElementById("videoBackground");
  const statusAnnouncements = document.getElementById("status-announcements");

  /**
   * Announces a message to screen readers
   * @param {string} message - The message to announce
   * @param {number} delay - Delay before clearing the message (ms)
   */
  function announceToScreenReader(message, delay = 3000) {
    if (!statusAnnouncements) return;

    statusAnnouncements.textContent = message;

    // Clear the announcement after delay
    setTimeout(() => {
      statusAnnouncements.textContent = "";
    }, delay);
  }

  /**
   * Handle video playback error with user feedback
   * @param {Error} error - The error object
   */
  function handleVideoError(error) {
    console.log("Video error:", error);
    videoBackground.classList.add("no-video");
    announceToScreenReader("Background video unavailable. Displaying static image fallback.");
  }

  /**
   * Initialize video playback with accessibility features
   */
  function initializeVideo() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      video.pause();
      videoBackground.classList.add("no-video");
      announceToScreenReader("Video playback disabled due to motion sensitivity preferences.");
      return;
    }

    // Attempt to play video
    video.play().catch((error) => {
      handleVideoError(error);
    });
  }

  // Event Listeners for video state changes

  video.addEventListener("error", () => {
    console.log("Video failed to load, showing fallback image");
    handleVideoError(new Error("Video failed to load"));
  });

  video.addEventListener("suspend", () => {
    if (video.currentTime === 0) {
      videoBackground.classList.add("no-video");
      announceToScreenReader("Background video suspended. Displaying fallback image.");
    }
  });

  video.addEventListener("canplay", () => {
    videoBackground.classList.remove("no-video");
  });

  video.addEventListener("loadeddata", () => {
    console.log("Video loaded successfully");
  });

  // Listen for changes to motion preferences
  const motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  motionMediaQuery.addEventListener("change", (e) => {
    if (e.matches) {
      video.pause();
      videoBackground.classList.add("no-video");
      announceToScreenReader("Video playback paused due to motion sensitivity preferences.");
    } else {
      video.play().catch(handleVideoError);
      announceToScreenReader("Video playback resumed.");
    }
  });

  // Keyboard shortcuts for accessibility
  document.addEventListener("keydown", (e) => {
    // Allow users to pause/play video with Space or P key (when not in an input)
    if (
      (e.key === " " || e.key === "p" || e.key === "P") &&
      !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
    ) {
      e.preventDefault();

      if (video.paused) {
        video.play().catch(handleVideoError);
        announceToScreenReader("Background video playing.");
      } else {
        video.pause();
        announceToScreenReader("Background video paused.");
      }
    }
  });

  // Ensure proper cleanup on page unload
  window.addEventListener("beforeunload", () => {
    video.pause();
    video.src = "";
    video.load();
  });

  // Initialize video playback
  initializeVideo();

  // Announce page ready to screen readers
  window.addEventListener("load", () => {
    announceToScreenReader("Page loaded. Background video is decorative and can be paused with the Space or P key.");
  });
})();
