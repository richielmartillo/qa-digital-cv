// Dependency-free checks. DOM doubles verify behavior, not browser rendering.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(rootDir, 'index.html'), 'utf8');
const script = readFileSync(resolve(rootDir, 'js/main.js'), 'utf8');

class Element {
  constructor(attrs = {}) {
    this.attrs = { ...attrs };
    this.listeners = {};
    this.classes = new Set();
    this.classList = {
      add: name => this.classes.add(name),
      toggle: (name, force) => force ? this.classes.add(name) : this.classes.delete(name),
    };
  }
  setAttribute(name, value) { this.attrs[name] = value; }
  getAttribute(name) { return this.attrs[name] ?? null; }
  removeAttribute(name) { delete this.attrs[name]; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  fire(name, event = {}) { this.listeners[name]?.(event); }
  focus() { this.focused = true; }
  getBoundingClientRect() { return { top: this.top }; }
}

function boot({ reduced = false, observer = true } = {}) {
  const ids = ['identificacao', 'resumo', 'competencias', 'experiencia', 'projetos', 'formacao', 'contato'];
  const root = new Element();
  root.dataset = { theme: 'futurista' };
  root.scrollHeight = 6000;
  const sections = ids.map((id, i) => Object.assign(new Element(), { id, top: i * 800 }));
  const links = ids.map(id => Object.assign(new Element(), { hash: `#${id}` }));
  const nodes = Object.fromEntries(['#navigation', '.menu-toggle', '.theme-toggle', '.back-to-top', '.print-button'].map(selector => [selector, new Element()]));
  nodes['.menu-toggle'].setAttribute('aria-expanded', 'false');
  const label = { textContent: 'Modo minimalista' };
  nodes['.theme-toggle'].querySelector = () => label;
  const details = [Object.assign(new Element(), { open: false }), Object.assign(new Element(), { open: true })];
  const document = new Element();
  Object.assign(document, {
    documentElement: root,
    querySelector: selector => nodes[selector] ?? sections.find(section => `#${section.id}` === selector),
    querySelectorAll: selector => selector === 'details' ? details : selector.startsWith('nav') ? links : sections,
  });
  const mobile = new Element();
  mobile.matches = false;
  const window = new Element();
  let prints = 0;
  let observerCallback;
  const observed = [];
  Object.assign(window, {
    scrollY: 0, innerHeight: 768,
    print: () => { prints++; },
    requestAnimationFrame: callback => callback(),
    matchMedia: query => query.includes('reduced-motion') ? { matches: reduced } : mobile,
  });
  const context = { document, window };
  if (observer) {
    class Observer {
      constructor(callback) { observerCallback = callback; }
      observe(element) { observed.push(element); }
      unobserve(element) { observed.splice(observed.indexOf(element), 1); }
    }
    window.IntersectionObserver = Observer;
    context.IntersectionObserver = Observer;
  }
  vm.runInNewContext(script, context, { filename: 'main.js' });
  return { root, nodes, sections, links, document, window, mobile, label, details, observed, get prints() { return prints; }, reveal: entries => observerCallback(entries) };
}

test('all internal links resolve to unique IDs; seven sections exist', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), `Missing #${id}`);
  assert.equal((html.match(/<section /g) ?? []).length, 7);
});

test('public resources are local and present, including the official PDF', () => {
  for (const [, path] of html.matchAll(/(?:src|href)="((?:css|js|assets)\/[^"#]+)"/g)) assert.ok(existsSync(resolve(rootDir, path)), path);
  assert.match(html, /href="assets\/cv\/Richard_Marlon_Balestrim_CV\.pdf" download=/);
  assert.doesNotMatch(html, /<(?:iframe|form)\b|https?:\/\/[^"\s]+\.(?:js|css)(?:["?])/i);
});

test('external links use HTTPS and isolated new tabs', () => {
  for (const [tag] of html.matchAll(/<a\b[^>]*href="https?:[^>]+>/g)) {
    assert.match(tag, /href="https:\/\//);
    assert.match(tag, /target="_blank"/);
    assert.match(tag, /rel="noopener noreferrer"/);
  }
});

test('scripts avoid dynamic HTML injection, network and cookies', () => {
  const sources = ['main.js', 'i18n.js', 'locales.js'].map(file => readFileSync(resolve(rootDir, 'js', file), 'utf8')).join('\n');
  assert.doesNotMatch(sources, /innerHTML|outerHTML|insertAdjacentHTML|\beval\s*\(|\bfetch\s*\(|XMLHttpRequest|document\.cookie/);
});

test('mobile menu supports open, Escape, and focus restoration', () => {
  const app = boot();
  app.nodes['.menu-toggle'].fire('click');
  assert.equal(app.nodes['.menu-toggle'].getAttribute('aria-expanded'), 'true');
  assert.ok(app.nodes['#navigation'].classes.has('is-open'));
  app.document.fire('keydown', { key: 'Escape' });
  assert.equal(app.nodes['.menu-toggle'].getAttribute('aria-expanded'), 'false');
  assert.ok(app.nodes['.menu-toggle'].focused);
});

test('section navigation closes the menu and focuses selected content', () => {
  const app = boot();
  app.nodes['.menu-toggle'].fire('click');
  app.links[4].fire('click');
  assert.ok(app.sections[4].focused);
  assert.equal(app.nodes['.menu-toggle'].getAttribute('aria-expanded'), 'false');
  app.nodes['.menu-toggle'].fire('click');
  app.mobile.fire('change');
  assert.equal(app.nodes['.menu-toggle'].getAttribute('aria-expanded'), 'false');
});

test('theme toggle cycles appearance and accessible state', () => {
  const app = boot();
  app.nodes['.theme-toggle'].fire('click');
  assert.equal(app.root.dataset.theme, 'minimalista');
  assert.equal(app.nodes['.theme-toggle'].getAttribute('aria-pressed'), 'true');
  assert.equal(app.label.textContent, 'Modo futurista');
  app.nodes['.theme-toggle'].fire('click');
  assert.equal(app.root.dataset.theme, 'futurista');
  assert.equal(app.nodes['.theme-toggle'].getAttribute('aria-pressed'), 'false');
});

test('native printing still expands and restores courses without a download print handler', () => {
  const app = boot();
  app.nodes['.print-button'].fire('click');
  assert.equal(app.prints, 0);
  assert.doesNotMatch(script, /window\.print\s*\(/);
  app.window.fire('beforeprint');
  assert.ok(app.details.every(detail => detail.open));
  app.window.fire('afterprint');
  assert.equal(app.details[0].open, false);
  assert.equal(app.details[1].open, true);
});

test('active navigation and back-to-top follow scroll position', () => {
  const app = boot();
  assert.equal(app.links[0].getAttribute('aria-current'), 'location');
  assert.equal(app.nodes['.back-to-top'].hidden, true);
  app.window.scrollY = 1700;
  app.sections.forEach((section, index) => { section.top = index * 800 - 1700; });
  app.window.fire('scroll');
  assert.equal(app.links[2].getAttribute('aria-current'), 'location');
  assert.equal(app.links.filter(link => link.getAttribute('aria-current')).length, 1);
  assert.equal(app.nodes['.back-to-top'].hidden, false);
  app.window.scrollY = 5232;
  app.window.fire('scroll');
  assert.equal(app.links[6].getAttribute('aria-current'), 'location');
});

test('reduced motion and unavailable observers preserve readable content', () => {
  const app = boot({ reduced: true });
  assert.equal(app.observed.length, 0);
  assert.doesNotThrow(() => boot({ observer: false }));
  const animated = boot();
  assert.equal(animated.observed.length, 6);
  animated.reveal([{ isIntersecting: true, target: animated.sections[1] }]);
  assert.ok(animated.sections[1].classes.has('reveal-ready'));
});

function luminance(hex) {
  const rgb = hex.match(/[a-f\d]{2}/gi).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
test('principal text palettes meet 4.5:1 contrast', () => {
  const palettes = [
    ['e9ebe5', '0d100f'], ['a0a89e', '0d100f'], ['a0a89e', '191e1a'],
    ['d2b477', '26271d'], ['97d3a2', '131715'], ['151810', 'd2b477'],
    ['202a25', 'fafaf7'], ['566357', 'f2f2ed'], ['73561d', 'eeecdf'],
    ['28643a', 'ffffff'], ['ffffff', '73561d'],
  ];
  for (const [fg, bg] of palettes) {
    const values = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
    const ratio = (values[0] + .05) / (values[1] + .05);
    assert.ok(ratio >= 4.5, `${fg}/${bg}: ${ratio.toFixed(2)}`);
  }
});
