import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');

test('public interface resources contain no email addresses or personal telephone links', () => {
  const paths = ['index.html', ...['js', 'css', 'locales'].flatMap(dir =>
    readdirSync(new URL(dir + '/', root)).map(name => `${dir}/${name}`))];
  for (const path of paths) {
    const source = read(path);
    assert.doesNotMatch(source, /mailto:|tel:/i, path);
    assert.doesNotMatch(source, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, path);
    assert.doesNotMatch(source, /\+?55[\s()-]*44[\s()-]*9(?:[\s()-]*\d){8}|44[\s()-]*9(?:[\s()-]*\d){8}/, path);
    assert.doesNotMatch(source, /phoneLabel|emailLabel/, path);
  }
});

test('professional contact channels remain accessible without JavaScript', () => {
  const html = read('index.html');
  for (const url of [
    'https://www.linkedin.com/in/richard-marlon-balestrim',
    'https://github.com/richielmartillo/qa-portfolio',
    'https://richielmartillo.github.io/qa-portfolio/',
  ]) assert.ok(html.includes(`href="${url}"`), url);
  assert.match(html, /id="contato"/);
});
