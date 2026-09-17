(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const tablist = document.querySelector('.preview-tabs');
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  const captions = [
    '从平台操作到本地交付，先看一遍完整介绍。',
    '界面示例 · 按平台组织适配包，让重复操作成为可复用的任务。',
    '界面示例 · 结果按任务留在本地，方便查找、复核与另存。',
  ];
  const indicator = document.createElement('span');
  indicator.className = 'tab-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  tablist.prepend(indicator);
  tablist.classList.add('has-indicator');
  let active = 0;
  let animation;
  const video = document.querySelector('.hero-video');
  let previewVisible = false;
  function syncVideoPlayback() {
    if (active === 0 && previewVisible && !document.hidden) {
      video.play().catch(() => { /* Browser autoplay policy may defer playback. */ });
    } else {
      video.pause();
    }
  }
  function positionIndicator() {
    indicator.style.width = `${tabs[active].offsetWidth}px`;
    indicator.style.transform = `translateX(${tabs[active].offsetLeft}px)`;
  }
  function selectTab(index, focus = false) {
    const previous = active;
    active = index;
    animation?.cancel();
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === active));
      tab.tabIndex = i === active ? 0 : -1;
      panels[i].hidden = i !== active;
    });
    document.getElementById('preview-caption').textContent = captions[active];
    document.querySelector('.preview-count').textContent = `0${active + 1} — 03`;
    syncVideoPlayback();
    positionIndicator();
    if (focus) tabs[active].focus();
    if (!reducedMotion.matches && previous !== active) {
      animation = panels[active].animate([
        { opacity: .35, transform: `translateX(${active > previous ? 12 : -12}px)` },
        { opacity: 1, transform: 'translateX(0)' },
      ], { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(i));
    tab.addEventListener('keydown', event => {
      const next = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
      if (next !== undefined) { event.preventDefault(); selectTab(next, true); }
    });
  });
  new ResizeObserver(positionIndicator).observe(tablist);
  document.fonts.ready.then(positionIndicator);

  const contact = document.getElementById('wechat-popup');
  window.openContact = () => { if (!contact.open) contact.showModal(); };
  window.closeContact = () => contact.close();
  const menu = document.getElementById('mobile-menu');
  document.querySelector('.menu-toggle').addEventListener('click', () => menu.showModal());
  document.querySelector('.menu-close').addEventListener('click', () => menu.close());
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close()));
  [contact, menu].forEach(dialog => {
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
  });

  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = links.map(link => document.querySelector(link.hash));
  let scheduled = false;
  function updateNavigation() {
    scheduled = false;
    let current = -1;
    sections.forEach((section, index) => { if (section.getBoundingClientRect().top <= innerHeight * .4) current = index; });
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); }
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  updateNavigation();
  // Resume the muted loop when the introduction is visible; pause hidden media.
  new IntersectionObserver(entries => {
    previewVisible = entries[0].isIntersecting;
    syncVideoPlayback();
  }).observe(document.querySelector('.film-frame'));
  document.addEventListener('visibilitychange', syncVideoPlayback);
})();
