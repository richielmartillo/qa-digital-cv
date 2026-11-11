import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const read = path => readFileSync(new URL('../' + path, import.meta.url));
const officialHash = '55aeac1f9e297b7415038956cc07b06bde70345ba00f92853a2b759736e02788';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
test('original and downloadable copy are byte-identical to the reviewed two-page PDF', () => {
  const source = read('Richard Balestrim (Atualizado).docx.pdf');
  const copy = read('assets/cv/Richard_Marlon_Balestrim_CV_PT.pdf');
  assert.equal(hash(source), officialHash);
  assert.equal(hash(copy), officialHash);
  assert.deepEqual(copy, source);
  assert.equal(copy.subarray(0,5).toString(), '%PDF-');
});
test('official facts and all complementary courses remain visible in Portuguese HTML', () => {
  const html = read('index.html').toString();
  for (const fact of ['Richard Marlon','Balestrim','44 999430660','richardbalestrim8@gmail.com','Agosto/2026','2022','2016','uTest','Anthor','Honorable Senado de la Nación Argentina','25 anos','Buenos Aires','2009','2025','2026','Cypress','Cucumber','Postman','Appium','WebdriverIO','Charles Proxy','Docker','Jenkins','k6','JMeter','TypeScript','React','Python','SQL','MongoDB','ADB','Logcat']) assert.ok(html.includes(fact), fact);
  const pt = JSON.parse(read('locales/pt-BR.json'));
  for (let n=113;n<=120;n++) assert.ok(html.includes(pt['t'+n]));
  assert.doesNotMatch(html, /em transição de carreira/i);
  assert.match(html, /href="tel:\+5544999430660"/);
  assert.match(html, /href="mailto:richardbalestrim8@gmail.com"/);
});
test('download works without JS and resolves below a GitHub Pages repository path', () => {
  const html = read('index.html').toString();
  const tag = html.match(/<a class="download-button"[^>]+>/)[0];
  assert.match(tag, /download="Richard_Marlon_Balestrim_CV_PT.pdf"/);
  assert.doesNotMatch(tag, /js-control|onclick|target=/);
  const href = tag.match(/href="([^"]+)"/)[1];
  assert.equal(new URL(href,'https://richielmartillo.github.io/qa-digital-cv/').pathname, '/qa-digital-cv/assets/cv/Richard_Marlon_Balestrim_CV_PT.pdf');
  for (const lang of ['pt-BR','es-AR','en']) {
    const cat = JSON.parse(read('locales/'+lang+'.json'));
    assert.match(cat.downloadNote, /Português|Español|English/);
    for (const key of ['internationalOne','internationalTwo','internationalThree','projectVersioning']) assert.ok(cat[key]);
  }
});
