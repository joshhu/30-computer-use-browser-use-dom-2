import {execFileSync} from 'node:child_process';
const run=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const sha=run('subtree','split','--prefix=outputs','HEAD');
execFileSync('git',['push','origin',sha+':refs/heads/gh-pages'],{stdio:'inherit'});
console.log('GitHub Pages branch published:',sha);
