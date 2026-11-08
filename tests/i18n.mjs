import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const catalogs = Object.fromEntries(['pt-BR', 'es-AR', 'en'].map(lang => [lang, JSON.parse(read(`locales/${lang}.json`))]));
const html = read('index.html');
test('all catalogs have identical keys, complete nonempty values and valid markup references', () => {
  const keys = Object.keys(catalogs['pt-BR']).sort();
  for (const catalog of Object.values(catalogs)) {
    assert.deepEqual(Object.keys(catalog).sort(), keys);
    for (const value of Object.values(catalog)) assert.ok(typeof value === 'string' && value.trim());
  }
  for (const [, value] of html.matchAll(/data-i18n(?:-aria-label|-content)?="([^"]+)"/g)) {
    for (const key of value.split(' ')) assert.ok(keys.includes(key), key);
  }
  const context = { window: {} };
  vm.runInNewContext(read('js/locales.js'), context);
  assert.equal(JSON.stringify(context.window.CV_LOCALES), JSON.stringify(catalogs));
});
function boot(saved, blocked = false) {
  const nodes = {};
  function element(text = '') {
    const node = { dataset: {}, hidden: true, childNodes: [{ nodeType:3, textContent:text }], attrs: {}, handlers:{} };
    node.setAttribute = (key,value) => node.attrs[key] = value;
    node.getAttribute = key => node.attrs[key];
    node.addEventListener = (key,fn) => node.handlers[key] = fn;
    node.focus = () => document.activeElement = node;
    node.closest = selector => selector === '.language-picker' ? node : null;
    node.click = () => node.handlers.click?.({ target:node });
    return node;
  }
  const document = { documentElement: { dataset: { theme:'futurista' } }, handlers:{} };
  for (const selector of ['#language-toggle','#language-options','#language-code','#language-status','.theme-label','.theme-toggle','.print-button']) nodes[selector] = element();
  const buttons = ['pt-BR','es-AR','en'].map(lang => { const node = element(); node.dataset.language = lang; return node; });
  const heading = element(' Sobre mim '); heading.dataset.i18n = 't005';
  const aria = element(); aria.attrs['data-i18n-aria-label'] = 'languageLabel';
  document.querySelector = selector => nodes[selector];
  document.querySelectorAll = selector => selector === '[data-language]' ? buttons : selector === '[data-i18n]' ? [heading] : selector === '[data-i18n-aria-label]' ? [aria] : [];
  document.addEventListener = (key, fn) => document.handlers[key] = fn;
  const storage = { value:saved, getItem() { if (blocked) throw Error(); return this.value; }, setItem(key,value) { if (blocked) throw Error(); this.value=value; } };
  const window = { CV_LOCALES:catalogs, localStorage:storage };
  vm.runInNewContext(read('js/i18n.js'), { window, document });
  return { api:window.CVI18n, document, nodes, buttons, heading, aria, storage };
}
test('Portuguese default, complete language cycle, accessibility and saved preference', () => {
  const app = boot(); assert.equal(app.document.documentElement.lang, 'pt-BR');
  for (const [lang,label] of [['es-AR','Sobre mí'],['en','About me'],['pt-BR','Sobre mim']]) {
    app.buttons.find(button => button.dataset.language === lang).click();
    assert.equal(app.heading.childNodes[0].textContent.trim(), label);
    assert.equal(app.document.documentElement.lang, lang);
    assert.equal(app.storage.value, lang);
    assert.equal(app.aria.attrs['aria-label'], catalogs[lang].languageLabel);
    assert.ok(app.nodes['#language-options'].hidden);
  }
  app.api.setLanguage('en'); assert.equal(boot(app.storage.value).api.language, 'en');
  assert.equal(boot('unknown').api.language, 'pt-BR');
});
test('restricted storage does not prevent translation; theme and print stay translated', () => {
  const app = boot(null, true); app.api.setLanguage('en');
  app.document.documentElement.dataset.theme = 'minimalista'; app.api.refreshThemeLabel();
  assert.equal(app.nodes['.theme-label'].textContent, 'Futuristic mode');
  app.api.setLanguage('es-AR');
  assert.equal(app.nodes['.theme-label'].textContent, 'Modo futurista');
  assert.match(app.nodes['.print-button'].attrs['aria-label'], /idioma seleccionado/);
  assert.equal(app.nodes['#language-status'].textContent, catalogs['es-AR'].languageChanged);
});
test('language picker supports focus, arrows, Escape, outside click and focus departure', () => {
  const app = boot(); app.nodes['#language-toggle'].click();
  assert.equal(app.document.activeElement, app.buttons[0]);
  const event = key => ({ key, target:app.document.activeElement, preventDefault() {} });
  app.document.handlers.keydown(event('ArrowDown')); assert.equal(app.document.activeElement, app.buttons[1]);
  app.document.handlers.keydown(event('End')); assert.equal(app.document.activeElement, app.buttons[2]);
  app.document.handlers.keydown(event('Home')); assert.equal(app.document.activeElement, app.buttons[0]);
  app.document.handlers.keydown(event('Escape'));
  assert.equal(app.document.activeElement, app.nodes['#language-toggle']);
  assert.ok(app.nodes['#language-options'].hidden);
  for (const type of ['click','focusin']) {
    app.nodes['#language-toggle'].click();
    app.document.handlers[type]({ target:{ closest:() => null } });
    assert.ok(app.nodes['#language-options'].hidden);
  }
});
