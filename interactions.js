(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const tablist = document.querySelector('.preview-tabs');
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  const captions = [
    '常用平台、任务和 AI 工具，放进同一个工作台。',
    '从平台操作到本地交付，看一遍完整演示。',
    '按任务整理结果，随时查看与另存。',
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
  let userPaused = reducedMotion.matches;
  const playback = document.querySelector('.playback-toggle');
  function updatePlaybackButton() {
    playback.dataset.paused = String(userPaused);
    playback.setAttribute('aria-label', userPaused ? '播放演示视频' : '暂停演示视频');
    playback.innerHTML = `${userPaused ? '播放演示' : '暂停演示'}<svg class="icon" aria-hidden="true" focusable="false"><use href="assets/icons.svg#${userPaused ? 'play' : 'pause'}"></use></svg>`;
    playback.hidden = active !== 1;
  }
  playback.addEventListener('click', () => {
    userPaused = !userPaused;
    updatePlaybackButton();
    syncVideoPlayback();
  });
  reducedMotion.addEventListener('change', event => {
    userPaused = event.matches;
    updatePlaybackButton();
    syncVideoPlayback();
  });
  updatePlaybackButton();
  function syncVideoPlayback() {
    if (active === 1 && previewVisible && !document.hidden && !userPaused) {
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
    document.querySelector('.preview-count').textContent = `0${active + 1} / 03`;
    updatePlaybackButton();
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
  document.querySelectorAll('[data-preview-video]').forEach(link => link.addEventListener('click', () => selectTab(1)));
  document.querySelectorAll('[data-preview-adapters]').forEach(link => link.addEventListener('click', () => selectTab(0)));
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
  if (!reducedMotion.matches) {
    document.querySelectorAll('.hero-message, .hero-art, .product-stage').forEach((element, i) => {
      element.animate([{opacity: .4, transform: 'translateY(16px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 700, delay: i * 90, easing: 'cubic-bezier(.22,1,.36,1)'});
    });
  }
})();
