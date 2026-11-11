// Browser integration runner using Chromium's DevTools protocol and Node built-ins.
// Start a local server first. Optional: CV_BASE_URL, CHROME_BIN.
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../',import.meta.url));
const base = process.env.CV_BASE_URL || 'http://127.0.0.1:8765/';
const browser = process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
mkdirSync(resolve(root,'tmp'),{recursive:true});
const session = mkdtempSync(resolve(root,'tmp/cv-browser-'));
const downloads = resolve(session,'downloads');mkdirSync(downloads);
const child=spawn(browser,['--headless','--no-sandbox','--disable-gpu','--no-first-run','--remote-debugging-port=0',`--user-data-dir=${session}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
const delay = ms=>new Promise(r=>setTimeout(r,ms));
async function waitFor(fn,label,timeout=30000){
  const end=Date.now()+timeout;
  while(Date.now()<end){const result=await fn();if(result)return result;await delay(100);}
  throw Error('Timed out: '+label);
}
let socket;let nextId=0;const pending=new Map();
function send(method,params={},sessionId){
  return new Promise((resolve,reject)=>{
    const id=++nextId;pending.set(id,{resolve,reject});
    socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
}
try {
  const portFile=resolve(session,'DevToolsActivePort');
  await waitFor(()=>existsSync(portFile),'browser startup');
  const [port,path]=readFileSync(portFile,'utf8').trim().split(/\r?\n/);
  socket=new WebSocket(`ws://127.0.0.1:${port}${path}`);
  await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
  socket.onmessage=event=>{
    const data=JSON.parse(event.data);const request=pending.get(data.id);
    if(request){pending.delete(data.id);data.error?request.reject(Error(JSON.stringify(data.error))):request.resolve(data.result);}
  };
  const {targetId}=await send('Target.createTarget',{url:'about:blank'});
  const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
  const evaluate=async expression=>{
    const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId);
    if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  // Keep any browser downloads inside this test session directory.
  await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloads});
  await send('Page.navigate',{url:new URL('tests/browser.html',base).href},sessionId);
  const result=await waitFor(async()=>{
    const text=await evaluate("document.querySelector('#results')?.textContent || ''");
    if(text.startsWith('FAIL'))throw Error(text.split('\n').slice(0,5).join('\n'));
    return text.startsWith('SUCCESS')?text:false;
  },'browser checks');
  writeFileSync(resolve(session,'results.txt'),result);
  console.log(result.split('\n')[0]);
  // Full native save on desktop and a mobile viewport, without click interception.
  await send('Page.navigate',{url:base},sessionId);
  await waitFor(()=>evaluate('Boolean(window.CVI18n && window.CVDownload)'),'application load');
  const digest=buffer=>createHash('sha256').update(buffer).digest('hex');
  for(const width of [1280,375]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===375},sessionId);
    const folder=resolve(downloads,String(width));mkdirSync(folder);
    await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:folder});
    for(const [lang,suffix] of [['pt-BR','PT'],['es-AR','ES'],['en','EN']]){
      const name=`Richard_Marlon_Balestrim_CV_${suffix}.pdf`;
      const expected=digest(readFileSync(resolve(root,'assets/cv',name)));
      await evaluate(`window.CVI18n.setLanguage(${JSON.stringify(lang)});document.querySelector('.download-button').click();true`);
      await waitFor(()=>existsSync(resolve(folder,name)) && digest(readFileSync(resolve(folder,name)))===expected,`${width}px ${lang} saved PDF`);
      console.log(`PASS ${width}px ${lang}: native saved file matches source SHA-256`);
    }
  }
  console.log('Evidence: '+session);
} finally {
  if(socket?.readyState===WebSocket.OPEN){await send('Browser.close').catch(()=>{});socket.close();}
  else child.kill();
}
