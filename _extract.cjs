const fs=require('fs');
const h=fs.readFileSync('index.html','utf8');
const re=/<script type="module">([\s\S]*?)<\/script>/g;
let m, best='';
while((m=re.exec(h))){ if(m[1].length>best.length) best=m[1]; }
if(!best){ console.error('no module script found'); process.exit(2); }
fs.writeFileSync('_check.mjs', best);
console.log('extracted '+best.length+' chars');
