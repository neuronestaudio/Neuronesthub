const fs = require('fs');
const html = fs.readFileSync('soundhub.html','utf8');
// match mosaic cards
const re = /<a[^>]*?class=["'][^"']*?mosaic-card[^"']*?["'][^>]*?href=["']([^"']+)["'][^>]*?>[\s\S]*?<h3>([\s\S]*?)<\/h3>[\s\S]*?<p>([\s\S]*?)<\/p>/gi;
const arr = [];
function strip(s){ return s.replace(/<[^>]*>/g,'').replace(/[\n\r]/g,' ').replace(/\s+/g,' ').trim(); }
function yt(url){ try{ const u=new URL(url); if(u.hostname.includes('youtu.be')) return u.pathname.slice(1); if(u.hostname.includes('youtube.com')) return u.searchParams.get('v')||''; }catch(e){} const m=url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/); return m?m[1]:''; }
let m;
while((m=re.exec(html))!==null){ const href=m[1]; const h3=strip(m[2]); const p=strip(m[3]); arr.push({ youtubeId: yt(href)||'', title: h3, hubTitle: h3, hubDescription: p, keywords: h3, duration: '' }); }
fs.mkdirSync('assets',{recursive:true}); fs.writeFileSync('assets/soundhub-data.json', JSON.stringify(arr,null,2));
console.log('Wrote assets/soundhub-data.json with', arr.length, 'items');
