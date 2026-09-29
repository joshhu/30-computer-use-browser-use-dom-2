import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const base=new URL('../outputs/',import.meta.url);
const snapshotDate=process.argv[2] || new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const boards=JSON.parse(await fs.readFile(new URL('raw-rankings.json',base),'utf8'));
const regions=JSON.parse(await fs.readFile(new URL('screenshot-regions.json',base),'utf8'));
for(const r of regions){
 const slug=r.site==='天瓏'?'tenlong':'books-computer';
 const card=`cards/${slug}-${r.period}-${r.rank}.png`;
 execFileSync('sips',['--cropToHeightWidth',String(r.height),String(r.width),'--cropOffset',String(r.y),String(r.x),new URL('screenshots/'+r.source,base).pathname,'--out',new URL(card,base).pathname],{stdio:'ignore'});
 const b=boards.find(b=>b.site===r.site&&b.period===r.period&&b.scope===r.scope);
 const i=b.matches.find(i=>i.rank===r.rank);i.screenshot=card;i.pageScreenshot='screenshots/'+r.source;
}
// Crop the public page before any personal browsing-history carousel.
const cuts=JSON.parse(await fs.readFile(new URL('screenshot-cutoffs.json',base),'utf8'));
for(const [f,h] of Object.entries(cuts)){
 if(!Number.isInteger(h)||h<100)throw new Error('Invalid screenshot cutoff');
 const file=new URL('screenshots/'+f,base).pathname;
 execFileSync('sips',['--cropToHeightWidth',String(h),'1265','--cropOffset','0','0',file,'--out',file],{stdio:'ignore'});
}
const report={date:snapshotDate,timezone:'Asia/Taipei',capturedAt:(await fs.stat(new URL('raw-rankings.json',base))).mtime.toISOString(),publisher:'深智數位',schedule:'每天 09:00（台灣時間）',scheduleStatus:'已啟用 · 需本機 Codex 可用',scopeNote:'博客來採中文書總榜及電腦資訊榜；天瓏採繁體中文全分類榜。天瓏未確認有獨立的全站跨語言總榜或電腦資訊總分類榜。各榜查核前 100 名。',boards:boards.map((b,index)=>({...b,id:index,checkedCount:b.items.length,items:undefined,matches:b.matches.map(i=>({...i,publisher:'深智數位'}))}))};
await fs.writeFile(new URL('data/'+snapshotDate+'.json',base),JSON.stringify(report,null,2));
await fs.writeFile(new URL('data.js',base),'window.REPORT = '+JSON.stringify(report)+';\n');
console.log(JSON.stringify({boards:report.boards.length,records:regions.length}));
