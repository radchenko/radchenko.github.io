/**
 * Business Card Theme Switcher & Enhancements
 */

(function() {
  'use strict';

  // Theme management
  const themeManager = {
    init() {
      this.setupThemeToggle();
      this.loadSavedTheme();
      this.updateCurrentYear();
    },

    setupThemeToggle() {
      const themeToggle = document.querySelector('.theme-toggle');
      if (!themeToggle) return;

      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    },

    toggleTheme() {
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      this.saveTheme(newTheme);
      this.updateThemeColor(newTheme);
    },

    loadSavedTheme() {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = savedTheme || (prefersDark ? 'dark' : 'light');
      
      document.documentElement.setAttribute('data-theme', theme);
      this.updateThemeColor(theme);
    },

    saveTheme(theme) {
      localStorage.setItem('theme', theme);
    },

    updateThemeColor(theme) {
      const themeColorMeta = document.getElementById('theme-color');
      if (themeColorMeta) {
        themeColorMeta.content = theme === 'dark' ? '#0f172a' : '#ffffff';
      }
    },

    updateCurrentYear() {
      const yearElements = document.querySelectorAll('.current-year');
      const currentYear = new Date().getFullYear();
      
      yearElements.forEach(element => {
        element.textContent = currentYear;
      });
    }
  };

  // Enhanced interactions
  const interactions = {
    init() {
      this.setupContactCards();
      this.setupKeyboardNavigation();
    },

    setupContactCards() {
      const contactCards = document.querySelectorAll('.contact-card');
      
      contactCards.forEach(card => {
        const link = card.querySelector('.contact-link');
        if (!link) return;

        // Make entire card clickable
        card.addEventListener('click', (e) => {
          if (e.target === card || e.target.closest('.contact-card') === card) {
            link.click();
          }
        });

        // Add keyboard support
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            link.click();
          }
        });

        // Make card focusable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Visit ${card.querySelector('.contact-label')?.textContent || 'link'}`);
      });
    },

    setupKeyboardNavigation() {
      // Track keyboard usage for enhanced focus styles
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('using-keyboard');
        }
      });

      document.addEventListener('mousedown', () => {
        document.body.classList.remove('using-keyboard');
      });
    }
  };

  // Smooth animations
  const animations = {
    init() {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      this.setupHoverEffects();
    },

    setupHoverEffects() {
      // Add subtle entrance animation
      const businessCard = document.querySelector('.business-card');
      if (businessCard) {
        businessCard.style.opacity = '0';
        businessCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          businessCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          businessCard.style.opacity = '1';
          businessCard.style.transform = 'translateY(0)';
        }, 100);
      }
    }
  };

  // Initialize everything
  function init() {
    themeManager.init();
    interactions.init();
    animations.init();
    
    // Add loaded class for any CSS that depends on JS
    document.documentElement.classList.add('js-loaded');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
