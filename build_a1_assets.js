'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const PAGES=['landing_page_dossier.html','index.html','ptis.html','map.html','radar.html','AdminApp.html','qrcode.html','pwa.html'];
const registry=()=>JSON.parse(fs.readFileSync('a1-assets.json','utf8'));
function references(html){return [...html.matchAll(/(?:src|href)=["'](\/a1\/[^"'?#]+)(?:\?[^"']*)?["']/g)].map(m=>m[1]);}
function buildAssets(version){
 const sources=registry(),wanted=new Set();
 for(const page of PAGES)if(fs.existsSync(page))references(fs.readFileSync(page,'utf8')).forEach(x=>wanted.add(x));
 const add=url=>{if(!sources[url])throw Error('Aset tiada sumber: '+url);if(/(?:lab-data|real_records|fixture|stub|mockup|\/qa\/)/i.test(sources[url]))throw Error('Sumber QA dilarang: '+url)};
 for(const url of wanted)add(url);
 for(const url of wanted){const source=sources[url];if(/\.css$/.test(source)){for(const m of fs.readFileSync(source,'utf8').matchAll(/url\(["']?([^)"']+)["']?\)/g)){if(/^(data:|https?:|#)/.test(m[1]))continue;const child=path.posix.normalize(path.posix.join(path.posix.dirname(url),m[1].split('?')[0]));add(child);wanted.add(child)}}}
 fs.mkdirSync('public/a1',{recursive:true});
 const manifest=[];
 for(const url of [...wanted].sort()){const source=sources[url],dest=path.join('public',url.slice(1));fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(source,dest);manifest.push({url,source,sha256:crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex')})}
 const stale=[];const walk=d=>{for(const f of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,f.name);if(f.isDirectory())walk(p);else if(!wanted.has('/'+p.replace(/\\/g,'/').slice('public/'.length)))stale.push(p)}};walk('public/a1');
 for(const file of stale){const full=path.resolve(file),root=path.resolve('public/a1')+path.sep;if(!full.startsWith(root))throw Error('Aset di luar public/a1');fs.unlinkSync(full)}
 fs.writeFileSync('a1-assets-built.json',JSON.stringify({version,assets:manifest},null,2)+'\n');
 return manifest;
}
module.exports={PAGES,references,buildAssets};
if(require.main===module)console.log('Aset A-1:',buildAssets('__BUILD_VERSION__').length);
