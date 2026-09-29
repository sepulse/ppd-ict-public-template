// Prepare offline SQL and private credentials. Never executes SQL or uses a network.
// Default --dry-run prints counts only; --write writes files inside this repo's private/.
import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomInt} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const PASSWORD_ALPHABET='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
export function hashPassword(password){return createHash('sha256').update(String(password||''),'utf8').digest('hex')}
export function generatePassword(){return Array.from({length:12},()=>PASSWORD_ALPHABET[randomInt(PASSWORD_ALPHABET.length)]).join('')}
function csvCells(raw){
 const rows=[];let row=[],value='',quoted=false;
 raw=String(raw).replace(/^\uFEFF/,'');
 for(let i=0;i<raw.length;i++){
  const c=raw[i];
  if(quoted){if(c==='"'&&raw[i+1]==='"'){value+='"';i++}else if(c==='"')quoted=false;else value+=c}
  else if(c==='"'){if(value.trim())throw Error('Invalid CSV quote');quoted=true}
  else if(c===','){row.push(value.trim());value=''}
  else if(c==='\r'||c==='\n'){if(c==='\r'&&raw[i+1]==='\n')i++;row.push(value.trim());if(row.some(Boolean))rows.push(row);row=[];value=''}
  else value+=c;
 }
 if(quoted)throw Error('Unclosed CSV quote');row.push(value.trim());if(row.some(Boolean))rows.push(row);return rows;
}
export function parseCsv(raw){
 const rows=csvCells(raw);if(!rows.length)throw Error('CSV empty');
 const header=rows.shift().map(x=>x.toLowerCase());for(const key of ['email','nama','kategori'])if(!header.includes(key))throw Error('CSV missing '+key);
 const seen=new Set();
 return rows.map(cells=>{
  if(cells.length!==header.length)throw Error('CSV column count');
  const row=Object.fromEntries(header.map((h,i)=>[h,cells[i]]));row.email=row.email.trim().toLowerCase();
  if(!/^[a-z0-9._%+-]+@moe\.gov\.my$/.test(row.email))throw Error('Staff email must be @moe.gov.my');
  if(!row.nama||!['JTK','PPTM'].includes(row.kategori.toUpperCase()))throw Error('Invalid name/category');
  if(seen.has(row.email))throw Error('Duplicate staff email');seen.add(row.email);
  row.zone_id=row.zone_id||row.zon||row.zone||'';return row;
 });
}
export function readInventory(data){
 let rows;
 if(Array.isArray(data)&&data.every(x=>x&&'email'in x))rows=data;
 else if(Array.isArray(data))rows=data.flatMap(x=>Array.isArray(x.results)?x.results:[]).filter(x=>x&&'email'in x&&'id'in x);
 else if(Array.isArray(data.admins))rows=data.admins;
 else if(Array.isArray(data.results))rows=data.results.filter(x=>x&&'email'in x&&'id'in x);
 else throw Error('Invalid admins inventory JSON');
 const seen=new Set();return rows.map(x=>{
  if(!x.id||!x.email||!x.role)throw Error('Inventory row missing id/email/role');
  const email=String(x.email).trim().toLowerCase();if(seen.has(email))throw Error('Duplicate admins email');seen.add(email);return{...x,email};
 });
}
const sqlQuote=v=>"'"+String(v??'').replace(/'/g,"''")+"'";
const csvQuote=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
export function buildPlan({staff,admins,zonePasswords,random=false,createdBy,now=Date.now()}){
 if(!staff.length||staff.length>200)throw Error('Staff count must be 1..200');
 if(Boolean(zonePasswords)===Boolean(random))throw Error('Choose --zone-passwords or --random');
 if(zonePasswords&&(typeof zonePasswords!=='object'||Array.isArray(zonePasswords)))throw Error('Invalid zone-passwords JSON map');
 const validZone=z=>/^ZON [1-8]$/.test(z)||z==='ZON PPD';
 if(zonePasswords)for(const [zone,password] of Object.entries(zonePasswords)){
  if(!validZone(zone))throw Error('Invalid zone in zone-passwords map');
  if(typeof password!=='string'||password.length<10||password.trim()!==password||/[\r\n\0]/.test(password))throw Error('Zone password must be at least 10 characters, without newlines');
 }
 admins=readInventory(admins);
 const activeSupers=admins.filter(x=>x.role==='SUPER_ADMIN'&&String(x.status).toLowerCase()==='aktif');
 const actor=createdBy||(activeSupers.length===1?activeSupers[0].email:null);
 if(!actor)throw Error('One active SUPER_ADMIN or --created-by is required');
 const byEmail=new Map(admins.map(x=>[x.email,x])),usedIds=new Set(admins.map(x=>String(x.id)));
 const passwords=[],statements=['-- Offline P7 plan. Refresh inventory and backup before applying.','BEGIN TRANSACTION;'];
 let reset=0,inserted=0,nextId=now; const seenStaff=new Set();
 for(const entry of staff){
  const email=String(entry.email).trim().toLowerCase(),existing=byEmail.get(email);
  if(existing?.role==='SUPER_ADMIN')throw Error('Refuse to reset SUPER_ADMIN from staff CSV');
  if(!/^[a-z0-9._%+-]+@moe\.gov\.my$/.test(email)||!entry.nama||seenStaff.has(email))throw Error('Invalid or duplicate staff email/name'); seenStaff.add(email);
  const zone=String(entry.zone_id||entry.zon||entry.zone||existing?.zone_id||'').trim().toUpperCase();
  if(!validZone(zone))throw Error('Staff without valid zone; update private CSV before preparing SQL');
  if(zonePasswords&&!Object.hasOwn(zonePasswords,zone))throw Error('Missing password for '+zone);
  const password=random?generatePassword():zonePasswords[zone],hash=hashPassword(password);
  if(password.toLowerCase()===email)throw Error('Password cannot equal staff email');
  if(existing){
   reset++;
   statements.push('UPDATE admins SET password_hash='+sqlQuote(hash)+", must_change_password=1, password_changed_at=datetime('now','+8 hours'), failed_login_count=0, locked_until=NULL WHERE id="+sqlQuote(existing.id)+' AND lower(trim(email))='+sqlQuote(email)+';');
  }else{
   inserted++;let id;do{id='usr_'+nextId++}while(usedIds.has(id));usedIds.add(id);
   statements.push('INSERT INTO admins (id,email,nama,password_hash,role,zone_id,status,created_by,created_at,must_change_password,failed_login_count,locked_until,password_changed_at) SELECT '+[id,email,entry.nama,hash,'PEGAWAI',zone,'aktif',actor].map(sqlQuote).join(',')+",datetime('now','+8 hours'),1,0,NULL,NULL WHERE NOT EXISTS (SELECT 1 FROM admins WHERE lower(trim(email))="+sqlQuote(email)+');');
  }
  passwords.push([email,entry.nama,password]);
 }
 statements.push('COMMIT;');
 return{sql:statements.join('\n')+'\n',passwordCsv:'email,nama,kata_laluan\n'+passwords.map(row=>row.map(csvQuote).join(',')).join('\n')+'\n',summary:{total:staff.length,new:inserted,reset,unchangedAdmins:admins.length-reset,passwordMode:random?'random':'zone',missingZones:0}};
}
function getArgs(argv){
 const args={};
 for(let i=0;i<argv.length;i++){
  const key=argv[i];if(['--write','--dry-run','--random'].includes(key)){args[key.slice(2)]=true;continue}
  if(!['--csv','--inventory','--out-dir','--zone-passwords','--created-by','--expect-count'].includes(key)||argv[i+1]===undefined)throw Error('Unknown or incomplete option: '+key);
  args[key.slice(2)]=argv[++i];
 }
 if(args.write&&args['dry-run'])throw Error('Choose --write or --dry-run');return args;
}
function privateOutput(directory){
 const privateDir=path.join(root,'private'),resolved=path.resolve(directory);
 const relative=path.relative(privateDir,resolved);if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('Outputs must stay inside repo private/');
 fs.mkdirSync(privateDir,{recursive:true});
 if(fs.realpathSync(privateDir)!==privateDir)throw Error('private/ must not be a symlink');
 let parent=resolved;while(!fs.existsSync(parent))parent=path.dirname(parent);
 const real=fs.realpathSync(parent),relReal=path.relative(privateDir,real);if(relReal.startsWith('..')||path.isAbsolute(relReal))throw Error('Output parent escapes private/');
 fs.mkdirSync(resolved,{recursive:true});return resolved;
}
export function main(argv=process.argv.slice(2)){
 const args=getArgs(argv),csv=args.csv||path.join(root,'private/staff_allowlist.csv'),inventory=args.inventory||path.join(root,'private/inventory_admins.json');
 const staff=parseCsv(fs.readFileSync(csv,'utf8')),admins=readInventory(JSON.parse(fs.readFileSync(inventory,'utf8')));
 const expected=args['expect-count']===undefined?null:Number(args['expect-count']);if(expected!==null&&staff.length!==expected)throw Error('Staff count differs from --expect-count');
 const plan=buildPlan({staff,admins,zonePasswords:args['zone-passwords']?JSON.parse(fs.readFileSync(args['zone-passwords'],'utf8')):undefined,random:Boolean(args.random),createdBy:args['created-by']});
 const summary={mode:args.write?'write-offline':'dry-run',...plan.summary,sqlApplied:false,networkUsed:false};
 if(args.write){
  const directory=privateOutput(args['out-dir']||path.join(root,'private/preprovision'));
  for(const name of ['preprovision.sql','kata_laluan_sementara.csv'])if(fs.existsSync(path.join(directory,name)))throw Error('Refuse to overwrite existing output; archive it privately first');
  fs.writeFileSync(path.join(directory,'preprovision.sql'),plan.sql,{flag:'wx',mode:0o600});
  fs.writeFileSync(path.join(directory,'kata_laluan_sementara.csv'),plan.passwordCsv,{flag:'wx',mode:0o600});
  summary.outputDirectory=directory;
 }
 console.log(JSON.stringify(summary));
 return summary;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 try{main()}catch(error){console.error(error.message);process.exitCode=1}
}
