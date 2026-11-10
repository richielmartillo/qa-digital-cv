(() => {
  'use strict';
  const catalogs = window.CV_LOCALES;
  const supported = ['pt-BR', 'es-AR', 'en'];
  const storageKey = 'cv-language';
  let language = 'pt-BR';
  const root = document.documentElement;
  const toggle = document.querySelector('#language-toggle');
  const options = document.querySelector('#language-options');
  const buttons = [...document.querySelectorAll('[data-language]')];
  // Bind original text nodes once, keeping inline markup, links and listeners intact.
  const bindings = [];
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.dataset.i18n.split(' ').forEach(key => {
      const node = [...element.childNodes].find(node => node.nodeType === 3 && node.textContent.trim() === catalogs['pt-BR'][key]);
      if (node) bindings.push({ node, key, before: node.textContent.match(/^\s*/)[0], after: node.textContent.match(/\s*$/)[0] });
    });
  });
  const attributes = ['aria-label', 'content'];
  const attributeBindings = attributes.flatMap(attribute => [...document.querySelectorAll(`[data-i18n-${attribute}]`)].map(element => ({ element, attribute, key: element.getAttribute(`data-i18n-${attribute}`) })));
  function t(key) { return catalogs[language][key] ?? catalogs['pt-BR'][key] ?? ''; }
  function refreshThemeLabel() {
    const key = root.dataset.theme === 'minimalista' ? 't015' : 't014';
    const label = document.querySelector('.theme-label');
    label.textContent = t(key);
    document.querySelector('.theme-toggle').setAttribute('aria-label', t(key));
  }
  function setOpen(open, restoreFocus = false) {
    options.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (restoreFocus) toggle.focus();
  }
  function setLanguage(next, { persist = true, announce = true } = {}) {
    if (!supported.includes(next)) next = 'pt-BR';
    language = next;
    bindings.forEach(({ node, key, before, after }) => { node.textContent = before + t(key) + after; });
    attributeBindings.forEach(({ element, attribute, key }) => element.setAttribute(attribute, t(key)));
    root.lang = next;
    document.querySelector('#language-code').textContent = { 'pt-BR': 'PT', 'es-AR': 'ES', en: 'EN' }[next];
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === next)));
    refreshThemeLabel();
    const download = document.querySelector('.download-button');
    download.setAttribute('title', t('downloadHint'));
    download.setAttribute('aria-label', t('downloadHint'));
    if (persist) { try { window.localStorage.setItem(storageKey, next); } catch { /* Private/restricted storage: translation still works. */ } }
    if (announce) document.querySelector('#language-status').textContent = t('languageChanged');
  }
  toggle.addEventListener('click', () => {
    const open = options.hidden;
    setOpen(open);
    if (open) buttons.find(button => button.dataset.language === language).focus();
  });
  buttons.forEach(button => button.addEventListener('click', () => { setLanguage(button.dataset.language); setOpen(false, true); }));
  document.addEventListener('click', event => { if (!event.target.closest('.language-picker')) setOpen(false); });
  document.addEventListener('focusin', event => { if (!event.target.closest('.language-picker')) setOpen(false); });
  document.addEventListener('keydown', event => {
    if (options.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false, true); }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) && event.target.closest('.language-picker')) {
      event.preventDefault();
      const current = buttons.indexOf(document.activeElement);
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[index].focus();
    }
  });
  window.CVI18n = { t, setLanguage, refreshThemeLabel, get language() { return language; } };
  let saved;
  try { saved = window.localStorage.getItem(storageKey); } catch { /* Portuguese is the default. */ }
  setLanguage(saved, { persist: false, announce: false });
})();
