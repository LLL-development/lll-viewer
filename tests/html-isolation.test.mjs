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
