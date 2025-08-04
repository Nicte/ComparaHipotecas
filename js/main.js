/**
 * ComparaHipotecas - Main JavaScript
 * Minimal UX enhancements with accessibility in mind
 */

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Utility functions
const utils = {
  // Add accessible focus indicators
  setupFocusIndicators() {
    // Add focus-visible class for better focus management
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-focus");
      }
    });

    document.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-focus");
    });
  },

  // Smooth scroll with reduced motion support
  setupSmoothScrolling() {
    // Only add smooth scrolling if user hasn't requested reduced motion
    if (!prefersReducedMotion) {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      });
    }
  },

  // Add loading animation for cards (if motion is allowed)
  setupCardAnimations() {
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll(".tool-card");
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    cards.forEach((card, index) => {
      // Set initial state only if motion is allowed
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = `opacity 0.6s ease-out ${
        index * 0.1
      }s, transform 0.6s ease-out ${index * 0.1}s`;

      cardObserver.observe(card);
    });
  },

  // Setup tool button interactions
  setupToolButtons() {
    const toolButtons = document.querySelectorAll(".tool-button");

    toolButtons.forEach((button) => {
      // Add click handler for disabled buttons
      button.addEventListener("click", (e) => {
        // Don't prevent navigation for active tool buttons (links)
        if (button.classList.contains("tool-button-active")) {
          return; // Let the link navigate normally
        }
        
        e.preventDefault();

        // Show a subtle feedback for disabled buttons
        if (button.disabled) {
          button.style.transform = "scale(0.98)";
          setTimeout(() => {
            button.style.transform = "";
          }, 150);

          // Announce to screen readers
          const announcement = document.createElement("div");
          announcement.setAttribute("aria-live", "polite");
          announcement.setAttribute("aria-atomic", "true");
          announcement.style.position = "absolute";
          announcement.style.left = "-10000px";
          announcement.textContent =
            "Esta herramienta estará disponible próximamente";
          document.body.appendChild(announcement);

          setTimeout(() => {
            document.body.removeChild(announcement);
          }, 1000);
        }
      });

      // Add keyboard interaction
      button.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          button.click();
        }
      });
    });
  },

  // Setup external link indicators
  setupExternalLinks() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');

    externalLinks.forEach((link) => {
      // Add visual indicator for external links
      link.setAttribute("rel", "noopener noreferrer");

      // Add keyboard support
      link.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          // The browser will handle the actual navigation
          // This just ensures keyboard users get the same experience
        }
      });
    });
  },

  // Add subtle hover effects (respecting motion preferences)
  setupHoverEffects() {
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll(".tool-card");

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-4px)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  },

  // Setup performance monitoring (basic)
  setupPerformanceMonitoring() {
    // Log basic performance metrics for debugging
    window.addEventListener("load", () => {
      if ("performance" in window) {
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;

        // Only log in development (when on localhost)
        if (
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1"
        ) {
          console.log(`Page load time: ${loadTime}ms`);
        }
      }
    });
  },

  // Handle reduced motion changes dynamically
  setupMotionPreferenceListener() {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    mediaQuery.addEventListener("change", (e) => {
      if (e.matches) {
        // User now prefers reduced motion - disable animations
        document.body.classList.add("reduced-motion");
      } else {
        // User allows motion - enable animations
        document.body.classList.remove("reduced-motion");
      }
    });

    // Set initial state
    if (mediaQuery.matches) {
      document.body.classList.add("reduced-motion");
    }
  },
};

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Core functionality
  utils.setupFocusIndicators();
  utils.setupSmoothScrolling();
  utils.setupToolButtons();
  utils.setupExternalLinks();
  utils.setupMotionPreferenceListener();

  // Visual enhancements (respect motion preferences)
  utils.setupCardAnimations();
  utils.setupHoverEffects();

  // Performance monitoring
  utils.setupPerformanceMonitoring();

  // Log successful initialization in development
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    console.log("ComparaHipotecas initialized successfully");
  }
});

// Handle errors gracefully
window.addEventListener("error", (e) => {
  // In production, you might want to send this to an error reporting service
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    console.error("ComparaHipotecas error:", e.error);
  }
});

// Export utils for potential future use
window.ComparaHipotecas = {
  utils,
  version: "1.0.0",
};
