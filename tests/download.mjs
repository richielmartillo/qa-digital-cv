import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const script = readFileSync(new URL('js/download.js',root),'utf8');
const languages = { 'pt-BR':'PT', 'es-AR':'ES', en:'EN' };
const catalogs = Object.fromEntries(Object.keys(languages).map(lang => [lang,JSON.parse(readFileSync(new URL(`locales/${lang}.json`,root),'utf8'))]));
function boot(fetcher, protocol='http:') {
  const link = { attrs:{}, handlers:{}, setAttribute(k,v) { this.attrs[k]=v; }, removeAttribute(k) { delete this.attrs[k]; }, addEventListener(k,v) { this.handlers[k]=v; } };
  const status = { hidden:true, textContent:'' };
  const downloads=[]; const blobs=[]; const calls=[];
  const document = {
    querySelector: s => s === '.download-button' ? link : status,
    body:{ appendChild() {} },
    createElement: () => ({ click() { downloads.push({href:this.href,filename:this.download}); },remove() {} }),
  };
  const window = { CV_LOCALES:catalogs,location:{protocol},setTimeout:()=>1,clearTimeout(){},
    URL:{createObjectURL(blob) { blobs.push(blob); return 'blob:test'; },revokeObjectURL(){}},
    fetch:async (url,options) => { calls.push(url); return fetcher ? fetcher(url,options) : {ok:true,blob:async()=>new Blob([readFileSync(new URL(url,root))])}; },
  };
  vm.runInNewContext(script,{window,document,AbortController,Blob});
  return {link,status,downloads,blobs,calls,api:window.CVDownload,click:()=>link.handlers.click({preventDefault(){}})};
}
for(const [lang,suffix] of Object.entries(languages)) test(`${lang}: correct filename, path, served bytes and GitHub Pages resolution`,async()=>{
  const app=boot();app.api.setLanguage(lang);
  const path=`assets/cv/Richard_Marlon_Balestrim_CV_${suffix}.pdf`;
  assert.equal(app.link.attrs.href,path);
  assert.equal(app.link.attrs.hreflang,lang);
  assert.equal(new URL(path,'https://richielmartillo.github.io/qa-digital-cv/').pathname,`/qa-digital-cv/${path}`);
  await app.click();
  assert.deepEqual(app.calls,[path]);
  assert.equal(app.downloads[0].filename,path.split('/').pop());
  assert.deepEqual(Buffer.from(await app.blobs[0].arrayBuffer()),readFileSync(new URL(path,root)));
  assert.equal(app.status.hidden,true);
});
test('404, HTML response, empty file, network failure and abort show localized error without another-language fallback',async()=>{
  const scenarios=[()=>({ok:false}),()=>({ok:true,blob:async()=>new Blob(['<html>404</html>'])}),()=>({ok:true,blob:async()=>new Blob([])}),()=>{throw Error('offline');},()=>{throw new DOMException('timeout','AbortError');}];
  for(const lang of Object.keys(languages))for(const fail of scenarios){
    const app=boot(fail);app.api.setLanguage(lang);await app.click();
    assert.equal(app.downloads.length,0);assert.equal(app.status.hidden,false);
    assert.equal(app.status.textContent,catalogs[lang].downloadUnavailable);
    assert.equal(app.calls.length,1);assert.ok(app.calls[0].endsWith(`_${languages[lang]}.pdf`));
    assert.equal(app.link.attrs['aria-busy'],undefined);
  }
});
test('changing language cancels stale download; rapid repeated clicks do not duplicate it',async()=>{
  let resolve;
  const app=boot(()=>new Promise(r=>{resolve=r;}));app.api.setLanguage('en');
  const pending=app.click();await app.click();assert.equal(app.calls.length,1);
  app.api.setLanguage('es-AR');
  resolve({ok:true,blob:async()=>new Blob(['%PDF-test'])});await pending;
  assert.equal(app.downloads.length,0);assert.equal(app.status.hidden,true);
  assert.ok(app.link.attrs.href.endsWith('_ES.pdf'));
});
test('file URL preserves native language-specific download without unsupported fetch',async()=>{
  const app=boot(null,'file:');app.api.setLanguage('en');await app.click();
  assert.equal(app.calls.length,0);assert.ok(app.link.attrs.href.endsWith('_EN.pdf'));
});
