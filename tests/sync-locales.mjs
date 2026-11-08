import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const base = new URL('../', import.meta.url);
const catalogs = Object.fromEntries(['pt-BR', 'es-AR', 'en'].map(lang => [lang, JSON.parse(readFileSync(new URL(`locales/${lang}.json`, base), 'utf8'))]));
const output = '// Generated from locales/*.json by tests/sync-locales.mjs.\nwindow.CV_LOCALES = ' + JSON.stringify(catalogs, null, 2) + ';\n';
const target = new URL('js/locales.js', base);
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== output) throw new Error('Run node tests/sync-locales.mjs to update js/locales.js');
} else writeFileSync(fileURLToPath(target), output);
