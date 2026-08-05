(function () {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  function revealAll(scope) {
    const target = scope || document;
    target.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
  }

  function canUseGsap() {
    return !reduceMotion.matches && window.gsap;
  }

  function setupGsap() {
    if (!canUseGsap()) return false;
    root.classList.add('gsap-enhanced');
    gsap.defaults({ duration: 0.7, ease: 'power3.out' });
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    return true;
  }

  function animateNav(selector) {
    const nav = document.querySelector(selector);
    if (!nav) return;
    gsap.from(nav, {
      autoAlpha: 0,
      y: -18,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'transform,opacity,visibility',
    });
  }

  function bindHoverLift(selector) {
    if (!window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll(selector).forEach((element) => {
      element.addEventListener('pointerenter', () => {
        gsap.to(element, { y: -5, duration: 0.24, overwrite: 'auto' });
      });
      element.addEventListener('pointerleave', () => {
        gsap.to(element, {
          y: 0,
          duration: 0.28,
          overwrite: 'auto',
          clearProps: 'transform',
        });
      });
    });
  }

  function initHome() {
    const heroTitle = document.getElementById('hero-title');
    if (!heroTitle) return;

    if (!setupGsap()) {
      revealAll();
      return;
    }

    const revealElements = gsap.utils.toArray('.reveal');
    gsap.set(revealElements, { autoAlpha: 0, y: 30 });

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTimeline
      .add(() => animateNav('.top-nav'))
      .from('.hero .kicker', { autoAlpha: 0, y: 16, duration: 0.55 }, 0.12)
      .from('#hero-title > *', {
        autoAlpha: 0,
        yPercent: 30,
        rotation: -1.2,
        duration: 0.82,
        stagger: 0.08,
      }, 0.22)
      .from('.hero-side > *', {
        autoAlpha: 0,
        y: 22,
        duration: 0.62,
        stagger: 0.08,
      }, 0.42);

    if (window.ScrollTrigger) {
      ScrollTrigger.batch(revealElements, {
        start: 'top 86%',
        once: true,
        interval: 0.08,
        batchMax: 4,
        onEnter: (batch) => {
          batch.forEach((element) => element.classList.add('is-visible'));
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            overwrite: 'auto',
            clearProps: 'transform,opacity,visibility',
          });
        },
      });

      gsap.to('.film-frame', {
        y: -24,
        ease: 'none',
        scrollTrigger: {
          trigger: '.film-wrap',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.1,
        },
      });

      gsap.to('.film-orbit', {
        rotation: 10,
        transformOrigin: '50% 50%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.film-wrap',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

    } else {
      gsap.to(revealElements, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.06,
        delay: 0.4,
        onStart: () => revealElements.forEach((element) => element.classList.add('is-visible')),
        clearProps: 'transform,opacity,visibility',
      });
    }

    bindHoverLift('.system-card, .price-card, .custom-strip, .faq-item');
  }

  function initDownload() {
    const content = document.getElementById('content');
    if (!content || content.dataset.motionReady === 'true') return;
    content.dataset.motionReady = 'true';

    if (!setupGsap()) return;

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    timeline
      .add(() => animateNav('.nav-wrap nav'))
      .from('.hero .eyebrow', { autoAlpha: 0, y: 14, duration: 0.5 }, 0.12)
      .from('#download-title', { autoAlpha: 0, y: 26, duration: 0.75 }, 0.2)
      .from('.subtitle', { autoAlpha: 0, y: 18, duration: 0.62 }, 0.34)
      .from('.release-card', {
        autoAlpha: 0,
        y: 34,
        scale: 0.97,
        duration: 0.82,
      }, 0.32)
      .from('.release-card > *', {
        autoAlpha: 0,
        y: 14,
        duration: 0.42,
        stagger: 0.045,
      }, 0.56)
      .from('.content-grid .panel', {
        autoAlpha: 0,
        y: 26,
        duration: 0.68,
      }, 0.72)
      .from('.download-item', {
        autoAlpha: 0,
        y: 16,
        duration: 0.48,
        stagger: 0.07,
      }, 0.84);

    bindHoverLift('.download-item');
  }

  ready(() => {
    initHome();
  });

  window.CrawshrimpMotion = {
    initHome,
    initDownload,
    revealAll,
  };
})();
