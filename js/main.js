(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js-enabled');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nav = document.querySelector('#navigation');
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
  const sections = [...document.querySelectorAll('main > section[id]')];
  const themeButton = document.querySelector('.theme-toggle');
  const topLink = document.querySelector('.back-to-top');

  function setMenu(open) {
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }

  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      setMenu(false);
      // Move keyboard focus into the selected section when the mobile menu closes.
      const target = document.querySelector(link.hash);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });

  const mobileLayout = window.matchMedia('(max-width: 700px)');
  mobileLayout.addEventListener('change', () => setMenu(false));

  themeButton.addEventListener('click', () => {
    const minimal = root.dataset.theme !== 'minimalista';
    root.dataset.theme = minimal ? 'minimalista' : 'futurista';
    themeButton.setAttribute('aria-pressed', String(minimal));
    themeButton.querySelector('.theme-label').textContent = minimal ? 'Modo futurista' : 'Modo minimalista';
    window.CVI18n?.refreshThemeLabel();
  });

  // Expand native disclosures for print, then restore the reader's previous state.
  let disclosures = [];
  window.addEventListener('beforeprint', () => {
    disclosures = [...document.querySelectorAll('details')].map(element => ({ element, open: element.open }));
    disclosures.forEach(({ element }) => { element.open = true; });
  });
  window.addEventListener('afterprint', () => {
    disclosures.forEach(({ element, open }) => { element.open = open; });
    disclosures = [];
  });

  let framePending = false;
  function updatePosition() {
    const headerOffset = mobileLayout.matches ? 155 : 115;
    let active = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= headerOffset) active = section;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 3) {
      active = sections[sections.length - 1];
    }
    navLinks.forEach(link => {
      if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    topLink.hidden = window.scrollY < 450;
    framePending = false;
  }
  function schedulePositionUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updatePosition);
  }
  window.addEventListener('scroll', schedulePositionUpdate, { passive: true });
  window.addEventListener('resize', schedulePositionUpdate);
  window.addEventListener('hashchange', schedulePositionUpdate);
  updatePosition();

  // Progressive enhancement: sections remain visible without JS or observer support.
  if ('IntersectionObserver' in window && !motionPreference.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-ready');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    sections.slice(1).forEach(section => observer.observe(section));
  }
})();
