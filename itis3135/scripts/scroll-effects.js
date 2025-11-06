(function(){
  'use strict';

  function init() {
    // Fade sections with IntersectionObserver
    const sections = document.querySelectorAll('main section');
    if (sections && sections.length) {
  sections.forEach((s) => s.classList.add('section-hidden'));

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            entry.target.classList.remove('section-hidden');
          } else {
            entry.target.classList.remove('section-visible');
            entry.target.classList.add('section-hidden');
          }
        });
  }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });

  sections.forEach((s) => observer.observe(s));
    }

    // Sticky nav behavior
    const nav = document.getElementById('site-nav');
    if (!nav) return; // nothing to do

    // Compute nav offset relative to document
    const rect = nav.getBoundingClientRect();
    const navTop = rect.top + window.pageYOffset;

    // placeholder to avoid content jump when nav becomes fixed
    const placeholder = document.createElement('div');
    placeholder.className = 'nav-placeholder';

    let isSticky = false;

    function onScroll() {
      if (window.pageYOffset >= navTop && !isSticky) {
        nav.classList.add('nav-sticky');
        // insert placeholder after nav to preserve layout
        if (!nav.nextElementSibling || !nav.nextElementSibling.classList || nav.nextElementSibling.className.indexOf('nav-placeholder') === -1) {
          placeholder.style.height = nav.offsetHeight + 'px';
          nav.parentNode.insertBefore(placeholder, nav.nextSibling);
        }
        isSticky = true;
      } else if (window.pageYOffset < navTop && isSticky) {
        nav.classList.remove('nav-sticky');
        if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
        isSticky = false;
      }
    }

    // run on scroll (passive) and once to set initial state
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Wait for HTML includes to be loaded. Poll for nav element.
  function waitForNav(attempts) {
    attempts = attempts || 0;
    if (document.getElementById('site-nav') || attempts > 40) {
      try { init(); } catch (e) { console.error('scroll-effects init error', e); }
    } else {
      setTimeout(function(){ waitForNav(attempts + 1); }, 100);
    }
  }

  // Start when page loads
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    waitForNav(0);
  } else {
    window.addEventListener('load', function(){ waitForNav(0); });
  }

})();
