/**
 * Main JavaScript module for radchenko.github.io
 * Handles progressive enhancement and user interactions
 */

(function() {
  'use strict';

  // Feature detection and polyfills
  const supportsIntersectionObserver = 'IntersectionObserver' in window;
  const supportsCustomProperties = CSS.supports('color', 'var(--test)');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Performance monitoring
  const perfStart = performance.now();

  // DOM ready state handler
  function domReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  // Smooth scroll enhancement for anchor links
  function initSmoothScroll() {
    if (prefersReducedMotion) return;

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without triggering scroll
          if (history.pushState) {
            history.pushState(null, null, `#${targetId}`);
          }
        }
      });
    });
  }

  // Intersection Observer for animations
  function initScrollAnimations() {
    if (!supportsIntersectionObserver || prefersReducedMotion) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe sections for fade-in animation
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(section);
    });
  }

  // Loading bar animation
  function initLoadingBar() {
    const loadingBar = document.querySelector('.loading-bar');
    if (!loadingBar) return;

    // Hide loading bar after animation completes
    setTimeout(() => {
      loadingBar.style.opacity = '0';
      setTimeout(() => {
        loadingBar.remove();
      }, 300);
    }, 2000);
  }

  // Enhanced focus management
  function initFocusManagement() {
    let isUsingKeyboard = false;

    // Track keyboard usage
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        isUsingKeyboard = true;
        document.body.classList.add('using-keyboard');
      }
    });

    // Track mouse usage
    document.addEventListener('mousedown', () => {
      isUsingKeyboard = false;
      document.body.classList.remove('using-keyboard');
    });

    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView();
        }
      });
    }
  }

  // Theme detection and system preference handling
  function initThemeHandling() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    function updateThemeColor(isDark) {
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.content = isDark ? '#0f172a' : '#ffffff';
      }
    }

    // Set initial theme color
    updateThemeColor(mediaQuery.matches);

    // Listen for theme changes
    mediaQuery.addEventListener('change', (e) => {
      updateThemeColor(e.matches);
    });
  }

  // Contact link enhancements
  function initContactEnhancements() {
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
      // Add click analytics (privacy-friendly)
      link.addEventListener('click', () => {
        const platform = link.getAttribute('aria-label') || 'unknown';
        console.log(`Contact interaction: ${platform}`);
      });

      // Email link enhancement
      if (link.href.startsWith('mailto:')) {
        link.addEventListener('click', (e) => {
          // Check if user has a default email client
          if (!navigator.userAgent.includes('Mobile')) {
            const subject = encodeURIComponent('Hello from your website');
            link.href = `${link.href}?subject=${subject}`;
          }
        });
      }
    });
  }

  // Performance monitoring and reporting
  function initPerformanceMonitoring() {
    window.addEventListener('load', () => {
      const perfEnd = performance.now();
      const loadTime = perfEnd - perfStart;
      
      // Log performance metrics (development only)
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.group('🚀 Performance Metrics');
        console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
        console.log(`DOM elements: ${document.querySelectorAll('*').length}`);
        console.log(`CSS support: Custom Properties ${supportsCustomProperties ? '✅' : '❌'}`);
        console.log(`JS support: Intersection Observer ${supportsIntersectionObserver ? '✅' : '❌'}`);
        console.log(`Accessibility: Reduced motion ${prefersReducedMotion ? '✅' : '❌'}`);
        console.groupEnd();
      }
    });
  }

  // Error handling and graceful degradation
  function initErrorHandling() {
    window.addEventListener('error', (e) => {
      console.warn('Non-critical error:', e.error);
      // Graceful degradation - ensure core functionality still works
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.warn('Unhandled promise rejection:', e.reason);
      e.preventDefault(); // Prevent console spam
    });
  }

  // Main initialization function
  function init() {
    // Core functionality
    const yearEl = document.querySelector('.current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    // Progressive enhancements
    initLoadingBar();
    initSmoothScroll();
    initScrollAnimations();
    initFocusManagement();
    initThemeHandling();
    initContactEnhancements();
    initPerformanceMonitoring();
    initErrorHandling();

    // Mark page as enhanced
    document.documentElement.classList.add('js-enabled');
  }

  // Initialize when DOM is ready
  domReady(init);

  // Export for potential external use
  window.RadchenkoSite = {
    version: '2.0.0',
    features: {
      smoothScroll: !prefersReducedMotion,
      animations: supportsIntersectionObserver && !prefersReducedMotion,
      customProperties: supportsCustomProperties
    }
  };

})();
