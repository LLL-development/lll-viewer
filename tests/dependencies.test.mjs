import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
test('vulnerable PDF.js runtime/worker versions are absent from application references',()=>{
 for(const file of ["pdf/index.html"]) assert.doesNotMatch(readFileSync(new URL(file,root),"utf8"),/3\.11\.174|pdf\.worker\.min\.js|pdfjs\/pdf\.min\.js/);
});
test('vendored runtime files match the recorded official distribution hashes',()=>{
 const manifest=JSON.parse(readFileSync(new URL("shared/vendor/UPSTREAM.json",root),'utf8'));
 for(const entry of manifest.packages) for(const file of entry.files){
  const bytes=readFileSync(new URL("shared/vendor/"+file.path,root));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256,file.path);
 }
});
