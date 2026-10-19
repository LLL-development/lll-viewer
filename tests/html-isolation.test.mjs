import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const {JSDOM}=await import(process.env.JSDOM_MODULE || 'jsdom');
test('HTML preview permits document scripts in an opaque sandbox while preventing app-origin access',()=>{
 const dom=new JSDOM(readFileSync(new URL('../html/index.html',import.meta.url),'utf8'));
 const frame=dom.window.document.querySelector('#frame');
 assert.equal(frame.getAttribute('sandbox'),'allow-scripts');
 assert.ok(!frame.getAttribute('sandbox').includes('allow-same-origin'));
 dom.window.close();
});
test('new-tab HTML preview uses the same isolated frame and validates its blob URL',()=>{
 const index=readFileSync(new URL('../html/index.html',import.meta.url),'utf8');
 assert.ok(index.includes('preview.html#'));
 assert.ok(index.includes('noopener'));
 const dom=new JSDOM(readFileSync(new URL('../html/preview.html',import.meta.url),'utf8'),{url:'https://example.test/html/preview.html'});
 assert.equal(dom.window.document.querySelector('#frame').getAttribute('sandbox'),'allow-scripts');
 const js=readFileSync(new URL('../html/preview.js',import.meta.url),'utf8');
 for(const [hash,expected] of [['#'+encodeURIComponent('blob:https://example.test/opaque-id'),'blob:https://example.test/opaque-id'],['#'+encodeURIComponent('javascript:alert(1)'),null],['#'+encodeURIComponent('blob:https://other.test/id'),null]]) {
  const page=new JSDOM('<iframe id="frame" sandbox="allow-scripts"></iframe>',{url:'https://example.test/html/preview.html'+hash,runScripts:'outside-only'});
  page.window.eval(js);
  assert.equal(page.window.document.querySelector('#frame').getAttribute('src'),expected);
  page.window.close();
 }
 dom.window.close();
});

test('URL-driven wrappers only accept HTTP(S) app-origin blobs',async()=>{
 const {runInNewContext}=await import('node:vm');
 const source=readFileSync(new URL('../html/preview.js',import.meta.url),'utf8');
 const cases=[
  {protocol:'file:',origin:'file://',url:'blob:null/normal-owned-uuid'},
  {protocol:'file:',origin:'null',url:'blob:null/normal-owned-uuid'},
  {protocol:'file:',origin:'file://',url:'blob:https://other.test/id'},
  {protocol:'file:',origin:'file://',url:'https://other.test/document.html'},
  {protocol:'file:',origin:'file://',url:'javascript:alert(1)'},
  {protocol:'file:',origin:'file://',url:'data:text/html,payload'},
  {protocol:'https:',origin:'https://example.test',url:'blob:https://example.test/normal-id',expected:'blob:https://example.test/normal-id'},
  {protocol:'https:',origin:'https://example.test',url:'blob:null/normal-owned-uuid'},
  {protocol:'https:',origin:'https://example.test',url:'blob:https://other.test/id'},
 ];
 for(const fixture of cases){
  const frame={};
  runInNewContext(source,{location:{protocol:fixture.protocol,origin:fixture.origin,hash:'#'+encodeURIComponent(fixture.url)},document:{getElementById:()=>frame}});
  assert.equal(frame.src,fixture.expected,JSON.stringify(fixture));
 }
});

test('direct-file new tabs keep exact uploaded bytes only inside the sandboxed srcdoc',async()=>{
 const source=readFileSync(new URL('../html/index.html',import.meta.url),'utf8');
 const blobs=new Map();let opened;
 const dom=new JSDOM(source,{url:'file:///viewer/html/index.html',runScripts:'dangerously',beforeParse(w){
  w.LLL_NAV={build(){return null;}};w.LLL_I18N={init(){},t(){return '';}};
  w.URL.createObjectURL=b=>{const url='blob:null/owned-'+blobs.size;blobs.set(url,b);return url;};
  w.URL.revokeObjectURL=()=>{};w.open=(...args)=>{opened=args;};
 }});
 const w=dom.window;
 const content='<h1>Normal</h1></iframe><script>document.body.dataset.localScript="works"</script><p title="&quot;">Text</p>';
 const input=w.document.querySelector('#fileInput');
 Object.defineProperty(input,'files',{value:[new w.File([content],'normal.html',{type:'text/html'})]});
 input.dispatchEvent(new w.Event('change'));
 const button=w.document.querySelector('#newTabBtn');
 assert.equal(button.disabled,true);
 await new Promise((resolve,reject)=>{let tries=0;const poll=()=>button.disabled?(++tries<100?setTimeout(poll,5):reject(Error('preview not ready'))):resolve();poll();});
 button.click();assert.equal(opened[2],'noopener');
 const wrapper=await new Promise((resolve,reject)=>{const reader=new w.FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsText(blobs.get(opened[0]));});
 const preview=new JSDOM(wrapper);const frame=preview.window.document.querySelector('iframe');
 assert.equal(frame.getAttribute('sandbox'),'allow-scripts');
 assert.equal(frame.getAttribute('srcdoc'),content);
 assert.equal(preview.window.document.querySelectorAll('script').length,0);
 preview.window.close();dom.window.close();
});
