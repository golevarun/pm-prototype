/* cx.js — candidate data, candidate table, candidate drawer and invite flow for
   all-candidates.html, candidates.html, shortlists.html, shortlist.html, compare.html.
   State lives in the shared PMStore (store.js): decisions, accommodation answers and invites
   are the same on every screen, across reloads. */
(function(){
var NOW=620; /* 10:20 am, Tue Nov 17 2026 */
var TODAY=new Date(2026,10,17);
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function dAt(d){var x=new Date(TODAY);x.setDate(x.getDate()-d);return x;}
function dl(d){var x=dAt(d);return MON[x.getMonth()]+' '+x.getDate();}
function dlw(d){var x=dAt(d);return WD[x.getDay()]+', '+MON[x.getMonth()]+' '+x.getDate();}
function hm(min){var h=Math.floor(min/60),m=Math.round(min%60),ap=h>=12?'pm':'am';h=h%12||12;return h+':'+(m<10?'0':'')+m+' '+ap;}
function lt(d,mod){return d*1440+NOW-mod;}
function lastLbl(p){if(p.lastTxt)return p.lastTxt;var t=p.lt;if(t<NOW)return hm(NOW-t);var d=Math.floor((t-NOW)/1440)+1;return d===1?'Yesterday':dl(d);}
var SSK={'cx-dec':'decisions','cx-people':'people','cx-notes':'notes'};
function ss(k,v){k=SSK[k]||k;if(v===undefined)return PMStore.get(k,null);PMStore.set(k,v);}
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function slug(n){return n.toLowerCase().replace(/[^a-z]+/g,'-');}
function ini(n){return n.split(' ').map(function(w){return w[0]}).join('').slice(0,2).toUpperCase();}
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]});};
function note(m){if(window.UI)UI.toast(m);else if(window.protoNote)protoNote(m);}

var ROLES={
 '114':{name:'Account Executive, Mid-Market',short:'AE, Mid-Market',href:'overview.html',hm:'Marcus Lee'},
 '117':{name:'SDR, Inbound',short:'SDR, Inbound',href:'roles.html',hm:'Alex Romero'},
 '109':{name:'Account Executive, Enterprise',short:'AE, Enterprise',href:'roles.html',hm:'Marcus Lee'}
};
var ST={needs:['Needs you','warn'],inv:['Invited','wait'],notice:['Notice period','wait'],call:['In scored call','live'],fin:['Finished','done'],stop:['Reminders stopped','stop'],wd:['Withdrew','stop']};
var LOCL={chi:'Chicago area',rem:'Remote, US',oth:'Other US'};

/* ---------- Shortlist data for Req 114 (ranked) ---------- */
var SL9=[
 {id:'sam',name:'Sam Rivera',note:'Strongest at discovery',ov:[7.0,8.0],sk:[[7.5,8.5],[6.5,7.5],[7.0,8.0]],fd:0,date:'Nov 17',time:'9:05–9:12 am',pr:'his',
  mo:[['03:12','Discovery','Asked what happened to the last tool before pitching anything.','Before I tell you about us, what went wrong with the one you tried?'],['05:40','Handling doubt','Offered to let drivers flag roads, tied to Jordan\'s own story.'],['06:55','Getting a next step','Booked a follow-up with the ops manager for Tuesday.']]},
 {id:'priya',name:'Priya Nair',note:'Strongest at next steps',close:1,ov:[6.5,8.0],sk:[[6.0,7.5],[6.0,7.0],[7.5,8.5]],fd:1,date:'Nov 16',time:'3:20–3:27 pm',pr:'her',
  mo:[['01:48','Discovery','Found the budget review in the first two minutes.','Is there a budget review coming up that this would need to fit into?'],['04:30','Handling doubt','Moved past the drivers\' concern a little fast.'],['06:20','Getting a next step','Asked for a pilot and got a yes in principle.']]},
 {id:'ama',name:'Ama Owusu',note:'Strongest at handling doubt',ov:[6.0,7.5],sk:[[6.0,7.0],[7.0,8.0],[6.0,7.0]],fd:0,date:'Nov 17',time:'8:48–8:55 am',pr:'her',
  mo:[['02:05','Discovery','Asked about overtime costs first.','What is overtime costing you on the days the routes go wrong?'],['04:48','Handling doubt','Repeated Jordan\'s words back before answering.'],['06:40','Getting a next step','Proposed a two-week trial with five drivers.']]},
 {id:'rhea',name:'Rhea Das',note:'Even across skills',ov:[6.0,7.0],sk:[[6.0,7.0],[6.0,7.0],[5.5,7.0]],fd:1,date:'Nov 16',time:'11:02–11:09 am',pr:'her',
  mo:[['02:30','Discovery','Asked how routes get planned on a normal morning.','Walk me through how a route gets planned on a normal morning.'],['04:55','Handling doubt','Gave a short example from a fleet of a similar size.'],['06:30','Getting a next step','Suggested a call with the dispatch lead next week.']]},
 {id:'nia',name:'Nia Brooks',note:'Strongest at discovery',ov:[5.5,7.0],sk:[[6.5,7.5],[5.0,6.5],[5.5,6.5]],fd:4,date:'Nov 13',time:'4:15–4:22 pm',pr:'her',
  mo:[['01:55','Discovery','Asked how many routes change after the morning plan goes out.','How many routes change after the morning plan goes out?'],['04:40','Handling doubt','Answered the drivers\' concern with a list of features.'],['06:45','Getting a next step','Offered to send a summary but set no date.']]},
 {id:'ben',name:'Ben Carter',note:'Strongest at next steps',ov:[5.5,7.0],sk:[[5.0,6.5],[5.5,6.5],[6.5,7.5]],fd:5,date:'Nov 12',time:'10:30–10:37 am',pr:'his',
  mo:[['02:40','Discovery','Asked about fleet size, then moved on quickly.','How many vans are we talking about across your regions?'],['05:05','Handling doubt','Acknowledged the last tool before answering.'],['06:35','Getting a next step','Got Jordan to agree to a demo on Friday.']]},
 {id:'theo',name:'Theo Grant',note:'Strongest at handling doubt',ov:[5.5,6.5],sk:[[5.0,6.0],[6.0,7.0],[5.0,6.5]],fd:5,date:'Nov 12',time:'1:44–1:51 pm',pr:'his',
  mo:[['02:20','Discovery','Asked one question about current costs.','Where does the cost show up first, fuel or overtime?'],['04:15','Handling doubt','Asked what would make Jordan trust a new tool.'],['06:50','Getting a next step','Asked for a follow-up and Jordan said maybe.']]},
 {id:'carmen',name:'Carmen Ruiz',note:'Strongest at discovery',ov:[5.0,6.5],sk:[[6.0,7.0],[4.5,6.0],[4.5,6.0]],fd:6,date:'Nov 11',time:'9:20–9:27 am',pr:'her',
  mo:[['01:40','Discovery','Asked what the drivers think of the routes they get now.','What do your drivers say about the routes they get now?'],['04:25','Handling doubt','Moved to pricing before answering Jordan\'s concern.'],['06:40','Getting a next step','Ended the call without a next step.']]},
 {id:'ian',name:'Ian Walsh',note:'Even across skills',ov:[5.0,6.0],sk:[[5.0,6.0],[5.0,6.0],[5.0,6.5]],fd:7,date:'Nov 10',time:'2:05–2:12 pm',pr:'his',
  mo:[['02:50','Discovery','Asked how the fleet is split across regions.','Is that 120 vans in one region or spread out?'],['05:00','Handling doubt','Offered a reference customer in freight.'],['06:40','Getting a next step','Proposed a follow-up call with the date to be confirmed.']]}
];
var EXTRA_N=['Owen Hart','Lucia Moreno','Felix Wagner','Imani Scott','Ryan Doyle','Sana Malik','Peter Lund','Chloe Martin','Marco Bianchi','Yuki Mori','Daniel Okafor','Ella Burns','Hugo Lambert','Nadia Rahman','Sean Murphy','Tara Singh','Victor Hale','Wendy Zhou','Kofi Mensah','Laura Fox','Mateo Cruz','Nora Quinn','Paolo Ricci','Riley Adams','Sara Holm','Tyler Reed','Uma Patel','Will Turner','Xavier Dunn','Yara Saleh'];
var MOT=[
 [['02:10','Discovery','Asked how routes are planned today.','How do routes get planned right now?'],['02:35','Discovery','Asked about fleet size, then pitched.','How many vans run each day?'],['01:58','Discovery','Asked what a bad route day costs.','What does a bad route day cost you?']],
 [['04:30','Handling doubt','Answered the concern about drivers with a feature list.'],['05:10','Handling doubt','Asked Jordan what went wrong last time before answering.'],['04:50','Handling doubt','Moved on before Jordan finished the concern.']],
 [['06:30','Getting a next step','Offered to send a summary, no date set.'],['06:45','Getting a next step','Asked for a demo and Jordan said maybe.'],['06:20','Getting a next step','Proposed a follow-up next week.']]
];
var SKN=['Discovery','Handling doubt','Getting a next step'],SKS=['discovery','handling doubt','next steps'];
function buildSL(){
 var r=rng(114),out=SL9.map(function(c){var o=Object.assign({},c);o.ini=ini(c.name);o.rec=true;return o;});
 EXTRA_N.forEach(function(n,k){
  var ov=k<5?[4.5,6.0]:k<12?[4.5,5.5]:k<20?[4.0,5.5]:[4.0,5.0];
  var sk=[0,1,2].map(function(j){var d=[-0.5,0,0.5][Math.floor(r()*3)];var lo=Math.max(4.0,ov[0]+d),hi=Math.min(10,lo+(ov[1]-ov[0])-(r()<.4?0.5:0));if(hi<=lo)hi=lo+0.5;return [lo,hi];});
  var best=0;sk.forEach(function(s,j){if(s[0]+s[1]>sk[best][0]+sk[best][1])best=j;});
  var even=Math.abs(sk[0][0]-sk[1][0])<0.1&&Math.abs(sk[1][0]-sk[2][0])<0.1;
  var fd=1+(k*3)%7,st=540+((k*47)%420);
  out.push({id:slug(n),name:n,ini:ini(n),rec:false,note:even?'Even across skills':'Strongest at '+SKS[best],ov:ov,sk:sk,fd:fd,date:dl(fd),time:hm(st)+'–'+hm(st+7),pr:'their',
   mo:[MOT[0][k%3],MOT[1][(k+1)%3],MOT[2][(k+2)%3]]});
 });
 return out;
}
var SL=buildSL();

/* ---------- People ---------- */
var FIRST=['Aaron','Abby','Adam','Aisha','Alan','Alice','Amir','Ana','Andre','Anya','Ari','Beth','Blake','Bruno','Caleb','Cara','Cole','Dara','Derek','Diana','Eli','Emma','Ethan','Eva','Finn','Gia','Hassan','Holly','Ivan','Jade','Jack','Jen','Joel','Kara','Kyle','Lana','Liam','Lily','Mason','Mila','Nate','Nina','Oscar','Petra','Quinn','Rosa','Ruth','Sami','Tess','Vik'];
var LAST=['Abbott','Bauer','Bishop','Byrne','Chavez','Clarke','Diaz','Elder','Evans','Ford','Garcia','Gill','Gomez','Hale','Hayes','Hughes','Ibrahim','Jensen','Joshi','Kane','Khan','Klein','Lopez','Lowe','Mehta','Meyer','Miller','Moss','Nash','Nolan','Ochoa','Price','Reyes','Rossi','Shah','Shaw','Silva','Soto','Stone','Tran','Vance','Vega','Wade','Ward','Webb','West','Wong','Young','Yusuf','Zimmer'];
var DOM=['gmail.com','outlook.com','icloud.com','hey.com','proton.me','yahoo.com','gmail.com','gmail.com'];
var GEN_TARGET={'114':{needs:2,inv:51,notice:23,call:1,fin:39,stop:34,wd:62},'117':{inv:28,notice:15,fin:21,stop:12,wd:20},'109':{inv:12,notice:7,fin:12,stop:5,wd:8}};
var PR_TARGET={'114':90,'117':43,'109':20};
var LOC_TARGET={'114':{chi:96,rem:116},'117':{chi:30,rem:44,oth:22},'109':{chi:13,rem:16,oth:15}};

function P(name,req,st,o){var p={id:o.id||slug(name),name:name,email:o.email,req:req,st:st,stx:o.stx||ST[st][0],cls:o.cls||ST[st][1],pr:o.pr,call:o.call,lt:o.lt,lastTxt:o.lastTxt,invD:o.invD,conD:o.conD,finD:o.finD,loc:o.loc,acc:o.acc||[],rem:o.rem||0,named:1};return p;}
function named(){return [
 P('Dev Kapoor','114','needs',{email:'dev.kapoor@gmail.com',stx:'Asked for extra time',pr:'y',call:'Opens Nov 30',lt:lt(0,520),invD:8,conD:1,loc:'chi',acc:[{type:'time',text:'Extra time on the scored call (10 minutes instead of 7)',state:'pending',when:'Today, 8:40 am'}]}),
 P('Mia Brandt','114','needs',{email:'mia.brandt@outlook.com',stx:'Asked for a human interviewer',pr:'y',call:'Opens Nov 30',lt:lt(1,840),invD:9,conD:2,loc:'rem',acc:[{type:'human',text:'A person to interview her instead of the AI buyer',state:'pending',when:'Yesterday, 2:00 pm'}]}),
 P('Kai Morgan','114','call',{email:'kai.m@proton.me',pr:'y',call:'Started 10:05 am',lt:0,lastTxt:'Now',invD:16,conD:14,loc:'chi'}),
 P('Lena Ortiz','117','fin',{email:'lena.ortiz@gmail.com',pr:'y',call:'Nov 17 · 7 min',lt:lt(0,602),invD:18,conD:16,finD:0,loc:'rem'}),
 P('Sam Rivera','114','fin',{id:'sam',email:'sam.rivera@gmail.com',pr:'y',call:'Nov 17 · 7 min',lt:lt(0,552),invD:15,conD:15,finD:0,loc:'chi'}),
 P('Ama Owusu','114','fin',{id:'ama',email:'ama.owusu@gmail.com',pr:'y',call:'Nov 17 · 7 min',lt:lt(0,535),invD:17,conD:16,finD:0,loc:'rem'}),
 P('Marta Silva','109','fin',{email:'marta.silva@gmail.com',pr:'y',call:'Nov 16 · 7 min',lt:lt(1,700),invD:20,conD:17,finD:1,loc:'oth'}),
 P('Priya Nair','114','fin',{id:'priya',email:'priya.nair@icloud.com',pr:'y',call:'Nov 16 · 7 min',lt:lt(1,927),invD:18,conD:17,finD:1,loc:'chi'}),
 P('Rhea Das','114','fin',{id:'rhea',email:'rhea.das@gmail.com',pr:'y',call:'Nov 16 · 7 min',lt:lt(1,669),invD:19,conD:17,finD:1,loc:'rem'}),
 P('Nia Brooks','114','fin',{id:'nia',email:'nia.brooks@gmail.com',pr:'y',call:'Nov 13 · 7 min',lt:lt(4,982),invD:20,conD:19,finD:4,loc:'chi'}),
 P('Ben Carter','114','fin',{id:'ben',email:'ben.carter@yahoo.com',pr:'n',call:'Nov 12 · 7 min',lt:lt(5,637),invD:21,conD:20,finD:5,loc:'rem'}),
 P('Theo Grant','114','fin',{id:'theo',email:'theo.grant@gmail.com',pr:'y',call:'Nov 12 · 7 min',lt:lt(5,831),invD:21,conD:20,finD:5,loc:'chi'}),
 P('Carmen Ruiz','114','fin',{id:'carmen',email:'carmen.ruiz@outlook.com',pr:'y',call:'Nov 11 · 7 min',lt:lt(6,567),invD:21,conD:21,finD:6,loc:'rem'}),
 P('Ian Walsh','114','fin',{id:'ian',email:'ian.walsh@gmail.com',pr:'y',call:'Nov 10 · 7 min',lt:lt(7,852),invD:21,conD:21,finD:7,loc:'chi'}),
 P('Jon Reyes','117','notice',{email:'jon.reyes@outlook.com',pr:'y',call:'Opens Nov 23',lt:lt(1,600),invD:12,conD:8,loc:'chi'}),
 P('Leo Park','114','notice',{email:'leo.park@gmail.com',pr:'y',call:'Opens Nov 24',lt:lt(1,640),invD:10,conD:7,loc:'rem',acc:[{type:'captions',text:'Captions during the scored call',state:'approved',when:'Nov 12'}]}),
 P('Jo Tanaka','114','notice',{email:'jo.tanaka@gmail.com',pr:'n',call:'Opens Dec 1',lt:lt(1,700),invD:4,conD:1,loc:'chi'}),
 P('Elif Yilmaz','109','notice',{email:'elif.yilmaz@gmail.com',pr:'n',call:'Opens Nov 27',lt:lt(4,610),invD:9,conD:4,loc:'oth'}),
 P('Noah Fischer','109','inv',{email:'noah.fischer@hey.com',stx:'Invited · reminder 1 sent',pr:'n',call:'Opens Nov 25',lt:lt(5,540),invD:8,rem:1,loc:'chi'}),
 P('Zoe Adler','117','inv',{email:'zoe.adler@gmail.com',pr:'n',call:'Opens Dec 1',lt:lt(1,560),invD:1,loc:'rem'}),
 P('Omar Haddad','114','inv',{email:'omar.haddad@gmail.com',stx:'Invited · reminder 1 sent',pr:'n',call:'Opens Nov 25',lt:lt(4,540),invD:7,rem:1,loc:'rem'}),
 P('Grace Kim','114','inv',{email:'grace.kim@hey.com',pr:'n',call:'Opens Dec 1',lt:lt(1,545),invD:1,loc:'chi'}),
 P('Chris Webb','117','stop',{email:'chris.webb@yahoo.com',pr:'n',call:'Link still open',lt:lt(13,600),invD:27,rem:2,loc:'oth'}),
 P('Luis Ortega','114','stop',{email:'luis.ortega@gmail.com',pr:'n',call:'Link still open',lt:lt(11,600),invD:19,rem:2,loc:'chi'}),
 P('Hana Sato','114','wd',{email:'hana.sato@gmail.com',pr:'y',call:'—',lt:lt(12,700),invD:20,conD:16,loc:'rem'})
];}
function build(){
 var all=named(),used={},r=rng(352),gi=0;
 all.forEach(function(p){used[p.name]=1;});
 EXTRA_N.forEach(function(n){used[n]=1;});
 function genName(){for(;;){var i=gi++;var n=FIRST[i%50]+' '+LAST[(Math.floor(i/50)*7+i*3)%50];if(!used[n]){used[n]=1;return n;}}}
 function mail(n,k){var a=n.toLowerCase().split(' ');return (k%3===0?a[0]+'.'+a[1]:k%3===1?a[0]+a[1]:a[0][0]+a[1])+'@'+DOM[k%DOM.length];}
 var ix=0;
 Object.keys(GEN_TARGET).forEach(function(req){
  var T=GEN_TARGET[req],old=req==='114'?21:70;
  Object.keys(T).forEach(function(st){
   var have=all.filter(function(p){return p.req===req&&p.st===st;}).length;
   var extras=req==='114'&&st==='fin'?EXTRA_N.slice():[];
   for(var k=have;k<T[st];k++){
    var n=extras.length?extras.shift():genName(),o={email:mail(n,ix++)},p;
    if(st==='inv'){var d=1+Math.floor(r()*(req==='114'?20:old-1));o.invD=d;o.rem=d>=7?2:d>=3?1:0;o.stx=o.rem?'Invited · reminder '+o.rem+' sent':'Invited';var op=d-14;o.call=op<0?'Opens '+dl(op):'Link open';o.lt=lt(Math.max(1,o.rem===2?d-7:o.rem?d-3:d),540+Math.floor(r()*420));}
    else if(st==='notice'){var c=1+Math.floor(r()*9);o.conD=c;o.invD=Math.min(old,c+1+Math.floor(r()*5));o.call='Opens '+dl(c-14);o.lt=lt(c,500+Math.floor(r()*500));}
    else if(st==='fin'){var f=req==='114'?(SL.filter(function(s){return s.name===n;})[0]||{fd:3}).fd:1+Math.floor(r()*27);o.finD=f;o.invD0=Math.floor(r()*30);o.conD=Math.min(old,f+14);o.invD=Math.min(old,o.conD+(req==='114'?Math.floor(r()*3):o.invD0));o.call=dl(f)+' · 7 min';o.lt=lt(f,560+Math.floor(r()*420));}
    else if(st==='stop'){var s=(req==='114'?10:14)+Math.floor(r()*(old-(req==='114'?10:14)));o.invD=s;o.rem=2;o.call='Link still open';o.lt=lt(s-7,540);}
    else if(st==='wd'){var w=3+Math.floor(r()*(old-3));o.invD=w;o.conD=r()<.5?w-1:null;o.call='—';o.lt=lt(Math.max(1,w-2),600);}
    p=P(n,req,st,o);p.named=0;if(SL.some(function(s){return s.name===n;}))p.id=slug(n);all.push(p);
   }
  });
  /* practice: exact count; nobody practises before agreeing to the notice */
  var rs=all.filter(function(p){return p.req===req;});
  var y=rs.filter(function(p){return p.named&&p.pr==='y';}).length;
  rs.filter(function(p){return !p.named;}).forEach(function(p){
   var can=p.st!=='inv'&&p.st!=='stop'&&!(p.st==='wd'&&p.conD==null);
   p.pr=can&&y<PR_TARGET[req]?(y++,'y'):'n';
  });
  /* location: exact counts */
  var L=LOC_TARGET[req],left={};Object.keys(L).forEach(function(k){left[k]=L[k];});
  rs.filter(function(p){return p.named;}).forEach(function(p){left[p.loc]--;});
  var bag=[];Object.keys(left).forEach(function(k){for(var j=0;j<left[k];j++)bag.push(k);});
  for(var j=bag.length-1;j>0;j--){var q=Math.floor(r()*(j+1)),t=bag[j];bag[j]=bag[q];bag[q]=t;}
  rs.filter(function(p){return !p.named;}).forEach(function(p,j){p.loc=bag[j]||'rem';});
 });
 /* a few resolved accommodation requests */
 [['114','notice',3,{type:'text',text:'A text version of the call',state:'approved',when:'Nov 11'}],['117','notice',2,{type:'time',text:'Extra time on the scored call',state:'approved',when:'Nov 9'}],['114','fin',12,{type:'captions',text:'Captions during the scored call',state:'approved',when:'Nov 6'}]].forEach(function(a){
  var c=all.filter(function(p){return p.req===a[0]&&p.st===a[1]&&!p.named;})[a[2]];if(c)c.acc=[a[3]];
 });
 return all;
}
var BASE=build();
function stageOf(p,dec){
 if(p.stage)return p.stage;
 if(dec[p.id]==='adv')return 'Final round';
 if(dec[p.id]==='dec')return 'Not moving forward';
 if(p.st==='wd')return 'Withdrawn';
 if(p.st==='fin'&&p.req!=='109')return 'Review';
 return 'Phone screen';
}
/* Dev's and Mia's requests are shared with Home and the role overview through PMStore.acc() */
var ACCK={'dev-kapoor':'dev','mia-brandt':'mia'};
function applyAcc(p,A){
 var k=ACCK[p.id];if(!k)return;var v=A[k];if(!v)return;
 var a=(p.acc||[]).map(function(x){return Object.assign({},x);}),pend=a[0];if(!pend)return;
 pend.by='Dana · just now';p.acc=a;p.st='notice';p.lt=0;p.lastTxt='Just now';
 if(k==='dev'&&v.state==='approved'){pend.state='approved';pend.detail=(v.min||'10')+' minutes';p.stx='Extra time approved';p.cls='done';p.call='Opens Nov 30 · '+(v.min||'10')+' min';}
 else if(k==='dev'){pend.state='declined';pend.reason=v.reason||'';p.stx='Extra time declined';p.cls='wait';}
 else{var first=v.who.split(' ')[0],short=(v.date||'').split(', ')[1]||v.date;pend.state='assigned';pend.detail=v.who+', '+v.date+(v.time?' at '+v.time:'');p.stx='Human interviewer: '+first+', '+short;p.cls='done';p.call='With '+first+' · '+short;}
}
function people(){
 var S=ss('cx-people')||{},patch=S.patch||{},dec=ss('cx-dec')||{},A=PMStore.acc();
 var list=(S.added||[]).concat(BASE).map(function(b){var p=Object.assign({},b);if(patch[p.id])Object.assign(p,patch[p.id]);applyAcc(p,A);p.stageNow=stageOf(p,dec);
  if(p.st==='fin'&&dec[p.id])p.stx=dec[p.id]==='adv'?'Finished · advanced':'Finished · declined';return p;});
 return list;
}
function save(id,obj){var S=ss('cx-people')||{};S.patch=S.patch||{};S.patch[id]=Object.assign(S.patch[id]||{},obj);ss('cx-people',S);}
function addPeople(arr){var S=ss('cx-people')||{};S.added=arr.concat(S.added||[]);ss('cx-people',S);}

/* ---------- applicant tracker pool for Invite candidates ---------- */
var POOL=PMStore.POOL;
function pool(req){return PMStore.pool(req);}

function invite(req,onDone){
 var reqs=req?[req]:['114','117','109'];var cur=reqs[0],picked={};
 function step1(){
  var md=UI.modal({title:'Invite candidates',wide:true,body:
   (reqs.length>1?'<label for="cxIr">Role</label><select id="cxIr">'+reqs.map(function(q){return '<option value="'+q+'"'+(q===cur?' selected':'')+'>Req '+q+' · '+ROLES[q].name+'</option>';}).join('')+'</select>':'<p><b>Req '+cur+' · '+ROLES[cur].name+'</b></p>')+
   '<p class="cx-mnote">These applicants are at Phone screen in your applicant tracker and haven\'t been invited to PM yet. Each one gets the candidate notice and their own link.</p><div class="cx-ilist" id="cxIl"></div>',
   actions:[{label:'Cancel'},{label:'Preview email',primary:true,onClick:function(m){var n=Object.keys(picked).length;if(!n){note('Pick at least one applicant.');return false;}setTimeout(step2,0);}}]});
  function draw(){
   var P=pool(cur),box=md.querySelector('#cxIl');
   if(!P.length){box.innerHTML='<div class="cx-iempty">Everyone at Phone screen for Req '+cur+' has been invited.</div>';return;}
   box.innerHTML='<label class="cx-irow cx-iall"><input type="checkbox" class="cx-cb" id="cxIa"'+(P.every(function(a){return picked[a[0]];})?' checked':'')+'><b>Select all '+P.length+'</b></label>'+
    P.map(function(a){return '<label class="cx-irow"><input type="checkbox" class="cx-cb" value="'+esc(a[0])+'"'+(picked[a[0]]?' checked':'')+'><span class="pav">'+ini(a[0])+'</span><span><b>'+esc(a[0])+'</b><small>'+esc(a[1])+' · Applied '+a[2]+'</small></span></label>';}).join('');
   box.querySelectorAll('input[value]').forEach(function(i){i.onchange=function(){if(i.checked)picked[i.value]=1;else delete picked[i.value];draw();};});
   md.querySelector('#cxIa').onchange=function(e){P.forEach(function(a){if(e.target.checked)picked[a[0]]=1;else delete picked[a[0]];});draw();};
   var go=md.querySelectorAll('.ui-md-f .ui-b')[1];var n=Object.keys(picked).length;go.textContent=n?'Preview email for '+n:'Preview email';
  }
  var sel=md.querySelector('#cxIr');if(sel)sel.onchange=function(){cur=sel.value;picked={};draw();};
  draw();
 }
 function step2(){
  var names=Object.keys(picked),fn=names[0].split(' ')[0],R=ROLES[cur];
  var md=UI.modal({title:'Preview the invite',wide:true,body:
   '<div class="cx-mail"><div class="cx-mail-h"><div><small>From</small>Dana Whitfield &lt;dana@northwindfreight.com&gt;</div><div><small>To</small>'+names.map(esc).join(', ')+'</div><div><small>Subject</small>Your first interview for '+esc(R.name)+' at Northwind</div></div>'+
   '<div class="cx-mail-b" id="cxMb"><p>Hi <span class="cx-var">'+esc(fn)+'</span>,</p><p>Thanks for applying. The next step is a short practice call, then a 7-minute call with an AI buyer. You can do both on your own time, on a laptop or a phone.</p><p>Practice opens today and is never scored. The scored call opens on '+dlw(-14)+'. Before it starts, you\'ll read how it works and agree to it.</p><p>If you\'d like extra time, captions, a text version or a person to interview you, reply to this email.</p><p>Dana</p></div>'+
   '<div class="cx-mail-f">Attached: Candidate notice.pdf · 1 page<button class="btn sm ghost" data-js id="cxEd">Edit message</button></div></div>'+
   '<p class="cx-mnote">Each candidate sees their own first name. Replies go to Dana. Requests for accommodations show to recruiters only.</p>',
   actions:[{label:'Back',onClick:function(){setTimeout(step1,0);}},{label:'Send '+names.length+' invite'+(names.length>1?'s':''),primary:true,onClick:function(){send(names);}}]});
  var ed=md.querySelector('#cxEd'),mb=md.querySelector('#cxMb');
  ed.onclick=function(){var on=mb.getAttribute('contenteditable')==='true';mb.setAttribute('contenteditable',on?'false':'true');mb.classList.toggle('cx-editing',!on);ed.textContent=on?'Edit message':'Done editing';if(!on)mb.focus();};
 }
 function send(names){
  var add=PMStore.addInvites(cur,names);
  note('Invited '+names.length+' candidate'+(names.length>1?'s':'')+' to Req '+cur+'. Dana\'s email went out just now.');
  if(onDone)onDone(add);
 }
 step1();
}

/* ---------- accommodation actions ---------- */
function interviewers(){var m=PMStore.members(),l=[['Dana Whitfield','recruiter'],['Marcus Lee','hiring manager']].filter(function(x){return m.removed.indexOf(x[0])<0;});
 m.added.forEach(function(x){if(x.r==='Recruiter'||x.r==='Hiring manager')l.push([x.n,x.r.toLowerCase()]);});return l;}
function accAct(p,act,done){
 var fn=p.name.split(' ')[0],a=(p.acc||[]).map(function(x){return Object.assign({},x);}),pend=a.filter(function(x){return x.state==='pending';})[0];
 if(!pend)return;
 var K=ACCK[p.id];
 if(act==='approve'&&K){PMStore.setAcc(K,{state:'approved',min:'10'});note('Approved. '+fn+' gets 10 minutes for the scored call and an email from Dana.');done&&done();return;}
 if(act==='approve'){pend.state='approved';pend.by='Dana · just now';save(p.id,{st:'notice',stx:pend.type==='time'?'Extra time approved':'Request approved',cls:'done',acc:a,lt:0,lastTxt:'Just now'});note('Approved. '+fn+' gets 10 minutes for the scored call and an email from Dana.');done&&done();}
 else if(act==='decline'){
  UI.modal({title:'Decline '+fn+'\'s request?',body:'<p>'+esc(pend.text)+'.</p><label for="cxRs">Reason for '+fn+'</label><textarea id="cxRs" placeholder="For example: the call length is the same for everyone in this role. We can offer captions or a text version instead."></textarea><p class="cx-mnote">Dana\'s email to '+fn+' includes this reason. Hiring managers don\'t see the request or the reason.</p>',
   actions:[{label:'Cancel'},{label:'Decline request',danger:true,onClick:function(m){var t=m.querySelector('textarea');if(!t.value.trim()){t.style.borderColor='#B42318';t.focus();return false;}if(K){PMStore.setAcc(K,{state:'declined',reason:t.value.trim()});note('Declined. Dana\'s email to '+fn+' includes your reason.');done&&done();return;}pend.state='declined';pend.by='Dana · just now';pend.reason=t.value.trim();save(p.id,{st:'notice',stx:'Extra time declined',cls:'wait',acc:a,lt:0,lastTxt:'Just now'});note('Declined. Dana\'s email to '+fn+' includes your reason.');done&&done();}}]});
 }
 else if(act==='assign'){
  UI.modal({title:'Assign an interviewer for '+fn,body:'<p>'+fn+' asked for a person to interview her instead of the AI buyer. The interviewer uses the same scenario and the same three skills.</p><label for="cxIv">Interviewer</label><select id="cxIv">'+interviewers().map(function(x){return '<option>'+esc(x[0])+', '+esc(x[1])+'</option>';}).join('')+'</select><label for="cxId">Date</label><select id="cxId"><option>Thu, Nov 19</option><option selected>Fri, Nov 20</option><option>Mon, Nov 23</option></select><label for="cxIt">Time</label><select id="cxIt"><option>10:00 am</option><option>1:30 pm</option><option>3:00 pm</option></select>',
   actions:[{label:'Cancel'},{label:'Assign and send invite',primary:true,onClick:function(m){var who=m.querySelector('#cxIv').value.split(',')[0],first=who.split(' ')[0],d=m.querySelector('#cxId').value,t=m.querySelector('#cxIt').value,short=d.split(', ')[1];
    if(K){PMStore.setAcc(K,{state:'assigned',who:who,date:d,time:t});note('Assigned. '+fn+' gets an invite for a call with '+first+' on '+short+' at '+t+'.');done&&done();return;}
    pend.state='assigned';pend.by='Dana · just now';pend.detail=who+', '+d+' at '+t;save(p.id,{st:'notice',stx:'Human interviewer: '+first+', '+short,cls:'done',call:'With '+first+' · '+short,acc:a,lt:0,lastTxt:'Just now'});note('Assigned. '+fn+' gets an invite for a call with '+first+' on '+short+' at '+t+'.');done&&done();}}]});
 }
}

/* ---------- drawer ---------- */
function openCall(p){
 if(p.id==='sam')return {go:'call-review.html',label:'Open call review'};
 if(p.req==='114'&&p.st==='fin')return {go:'shortlist.html#'+p.id,label:'Open on shortlist'};
 return null;
}
function timeline(p){
 var t=[],R='Req '+p.req;
 t.push([dl(p.invD),'Invited to PM by Dana','Notice email and candidate notice sent']);
 if(p.rem>=1)t.push([dl(Math.max(0,p.invD-3)),'Reminder 1 sent','In their working hours']);
 if(p.rem>=2)t.push([dl(Math.max(0,p.invD-7)),'Reminder 2 sent','Automation stops after two reminders']);
 if(p.conD!=null&&p.conD!==undefined){t.push([dl(p.conD),'Read the notice and agreed','Notice period of 10 business days started']);}
 if(p.pr==='y')t.push([dl(p.conD!=null?Math.max(0,p.conD-1):0),'Started practice','Practice is never scored or shared']);
 (p.acc||[]).forEach(function(a){t.push([a.when,'Asked for an accommodation',a.text]);if(a.state!=='pending')t.push([a.by?'Today':a.when,a.state==='approved'?'Request approved':a.state==='declined'?'Request declined':'Interviewer assigned',a.detail||a.reason||(a.by||'Dana')]);});
 if(p.st==='call')t.push(['Today','Scored call started','10:05 am · with Jordan Ellis, medium']);
 if(p.st==='fin')t.push([dl(p.finD),'Finished the scored call','7 min with '+(p.req==='114'?'Jordan Ellis':'an AI buyer')+', medium']);
 if(p.st==='fin'&&p.stageNow!=='Phone screen')t.push([dl(p.finD),'Moved to '+(p.stageNow==='Review'?'Review':p.stageNow),'In your applicant tracker']);
 if(p.review)t.push(['Today','Added to shortlist review','For '+ROLES[p.req].hm]);
 if(p.st==='wd')t.push([lastLbl(p),'Withdrew','From the applicant tracker']);
 if(p.lastTxt==='Just now'&&p.remToday)t.push(['Today','Reminder sent by Dana','Sent just now']);
 if(p.fresh)t=[['Today','Invited to PM by Dana','Notice email and candidate notice sent']];
 return t;
}
function drawer(p,refresh){
 var R=ROLES[p.req],oc=openCall(p),pend=(p.acc||[]).filter(function(a){return a.state==='pending';})[0];
 var call;
 if(p.st==='fin')call='<p>Finished '+esc(p.call.replace(' · 7 min',''))+' · 7 min, medium difficulty.</p>'+(oc?'<button class="btn sm" data-go="'+oc.go+'">'+oc.label+'</button>':'<p class="cx-mnote">Ranges for Req '+p.req+' show on its shortlist, shared with '+R.hm+'.</p><a class="btn sm" href="calls.html">Open in Calls</a>');
 else if(p.st==='call')call='<p><span class="st live"><i></i>In a scored call now</span> Started 10:05 am with Jordan Ellis.</p><p class="cx-mnote">Nobody can listen in while the call runs. The review is ready a few minutes after it ends.</p><a class="btn sm" href="calls.html">Open in Calls</a>';
 else if(p.st==='wd')call='<p>No scored call. '+esc(p.name.split(' ')[0])+' withdrew.</p>';
 else call='<p>'+esc(p.call)+'.</p>';
 var acc=(p.acc||[]).length?(p.acc||[]).map(function(a){var s=a.state==='pending'?'<span class="tag beige">Waiting on you</span>':a.state==='declined'?'<span class="tag gray">Declined</span>':'<span class="tag green">'+(a.state==='assigned'?'Arranged':'Approved')+'</span>';
   return '<div class="cx-accq"><div><b>'+esc(a.text)+'</b><small>Asked '+esc(a.when)+(a.detail?' · '+esc(a.detail):'')+'</small></div>'+s+'</div>'+(a.state==='pending'?'<div class="cx-acc-a">'+(a.type==='human'?'<button class="btn sm yellow" data-js data-da="assign">Assign interviewer</button>':'<button class="btn sm" data-js data-da="decline">Decline</button><button class="btn sm yellow" data-js data-da="approve">Approve</button>')+'</div>':'');}).join(''):'<p class="dim">No requests.</p>';
 var tl=timeline(p).map(function(e){return '<li><i></i><div><b>'+esc(e[1])+'</b><small>'+esc(e[0])+' · '+esc(e[2])+'</small></div></li>';}).join('');
 var acts=[{label:'Close'}];
 if(p.st==='inv'||p.st==='stop')acts.unshift({label:'Send reminder',onClick:function(){remind([p]);refresh&&refresh();}});
 var dr=UI.drawer({title:p.name,width:460,body:
  '<div class="cx-dh"><span class="pav">'+ini(p.name)+'</span><div><b>'+esc(p.name)+'</b><small>'+esc(p.email)+'</small></div><span class="st '+p.cls+'" style="margin-left:auto"><i></i>'+esc(p.stx)+'</span></div>'+
  '<dl class="cx-dl"><div><dt>Role</dt><dd><a href="'+R.href+'">'+esc(R.name)+'</a> · Req '+p.req+'</dd></div><div><dt>Stage in applicant tracker</dt><dd>'+esc(p.stageNow)+'</dd></div><div><dt>Location</dt><dd>'+LOCL[p.loc]+'</dd></div><div><dt>Invited</dt><dd>'+(p.fresh?'Today':dl(p.invD))+'</dd></div><div><dt>Practice</dt><dd>'+(p.pr==='y'?'Started':'Not started')+'</dd></div><div><dt>Last activity</dt><dd>'+lastLbl(p)+'</dd></div></dl>'+
  '<h3 class="cx-h3">Scored call</h3>'+call+
  '<h3 class="cx-h3">Accommodation requests<span class="cx-lock">Recruiters only</span></h3>'+acc+
  '<h3 class="cx-h3">Timeline</h3><ol class="cx-tl">'+tl+'</ol>'+
  '<p class="cx-mnote">Practice shows only whether it started. What happens in practice is never shared with the hiring team.</p>',
  actions:acts});
 dr.querySelectorAll('[data-da]').forEach(function(b){b.addEventListener('click',function(){var act=b.getAttribute('data-da');if(act==='approve'){dr.close();}else dr.close();accAct(p,act,refresh);});});
 return dr;
}
function remind(list){
 var ok=list.filter(function(p){return p.st==='inv'||p.st==='stop';}),skip=list.length-ok.length;
 ok.forEach(function(p){var n=(p.rem||0)+1;save(p.id,{rem:n,stx:p.st==='inv'?'Invited · reminder '+n+' sent':'Reminders stopped · Dana sent one today',lt:0,lastTxt:'Just now',remToday:1});});
 if(!ok.length){note('Nobody to remind. Reminders go only to candidates who haven\'t agreed to the notice yet.');return 0;}
 note('Sent a reminder to '+ok.length+' candidate'+(ok.length>1?'s':'')+'.'+(skip?' Skipped '+skip+' who already agreed or finished.':''));
 return ok.length;
}
function csvRow(a){return a.map(function(v){v=String(v==null?'':v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}).join(',');}
function peopleCsv(list){
 return [csvRow(['Name','Email','Role','Req','PM status','Practice','Scored call','Stage in applicant tracker','Location','Invited','Last activity'])].concat(list.map(function(p){return csvRow([p.name,p.email,ROLES[p.req].name,p.req,p.stx,p.pr==='y'?'Started':'Not started',p.call,p.stageNow,LOCL[p.loc],p.fresh?'Nov 17':dl(p.invD),lastLbl(p)]);})).join('\n');
}

/* ---------- table engine ---------- */
var SVGCK='<svg viewBox="0 0 16 16"><path d="M4 8.2l2.6 2.6L12 5.4"/></svg>';
var IC={
 req:'<svg class="i" viewBox="0 0 16 16"><rect x="2.5" y="4.5" width="11" height="8.5" rx="1.5"/><path d="M5.5 4.5V3.2c0-.4.3-.7.7-.7h3.6c.4 0 .7.3.7.7v1.3"/></svg>',
 st:'<svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5"/><path d="M5.8 8.2l1.5 1.5 3-3.2"/></svg>',
 stage:'<svg class="i" viewBox="0 0 16 16"><path d="M3 4.5h10M5 8h6M7 11.5h2"/></svg>',
 pr:'<svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5"/><path d="M7 6v4l3-2z"/></svg>',
 inv:'<svg class="i" viewBox="0 0 16 16"><rect x="2.5" y="3.5" width="11" height="10" rx="1.5"/><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3"/></svg>',
 loc:'<svg class="i" viewBox="0 0 16 16"><path d="M8 13.5s4.5-4 4.5-7.3a4.5 4.5 0 0 0-9 0C3.5 9.5 8 13.5 8 13.5z"/><circle cx="8" cy="6.2" r="1.5"/></svg>',
 acc:'<svg class="i" viewBox="0 0 16 16"><rect x="4" y="7.5" width="8" height="6" rx="1"/><path d="M5.5 7.5V5.5a2.5 2.5 0 0 1 5 0v2"/></svg>'
};
var GROUPS={
 req:{label:'Role',opts:[['114','Req 114','AE, Mid-Market'],['117','Req 117','SDR, Inbound'],['109','Req 109','AE, Enterprise']],get:function(p){return p.req;}},
 st:{label:'PM status',opts:[['needs','Needs you'],['inv','Invited'],['notice','Notice period'],['call','In scored call'],['fin','Finished'],['stop','Reminders stopped'],['wd','Withdrew']],get:function(p){return p.st;}},
 stage:{label:'Stage in applicant tracker',opts:[['Phone screen','Phone screen'],['Review','Review'],['Final round','Final round'],['Not moving forward','Not moving forward'],['Withdrawn','Withdrawn']],get:function(p){return p.stageNow;}},
 pr:{label:'Practice',opts:[['y','Started'],['n','Not started']],get:function(p){return p.pr;}},
 inv:{label:'Invited on',opts:[['7','Last 7 days'],['30','8 to 30 days ago'],['old','Earlier']],get:function(p){return p.invD<=7?'7':p.invD<=30?'30':'old';}},
 loc:{label:'Location',opts:[['chi','Chicago area'],['rem','Remote, US'],['oth','Other US']],get:function(p){return p.loc;}},
 acc:{label:'Accommodation request',opts:[['pend','Waiting on you'],['done','Approved or arranged'],['decl','Declined'],['none','No request']],get:function(p){var a=p.acc||[];if(!a.length)return 'none';if(a.some(function(x){return x.state==='pending';}))return 'pend';if(a.some(function(x){return x.state==='declined';}))return 'decl';return 'done';}}
};
var COLS=[['cand','Candidate',1],['role','Role'],['st','PM status'],['pr','Practice'],['call','Scored call'],['stage','Stage'],['loc','Location'],['inv','Invited'],['last','Last activity']];
var SORTS=[['needs','Needs you first'],['last','Last activity'],['name','Name, A to Z'],['inv','Invited, newest']];
var PAGE=25;

function table(root,cfg){
 var S={f:{},q:'',sort:'needs',page:0,sel:{},shown:cfg.groups.slice(),open:cfg.open.slice(),hide:cfg.hide.slice(),view:cfg.views[0][0],nofp:false};
 Object.keys(GROUPS).forEach(function(g){S.f[g]=[];});
 var saved=ss('cx-views-'+cfg.key)||[];
 var L=[];
 function all(){var a=people();if(cfg.req)a=a.filter(function(p){return p.req===cfg.req;});return a;}
 function match(p,except){
  for(var g in S.f){if(g===except)continue;var v=S.f[g];if(v.length&&v.indexOf(GROUPS[g].get(p))<0)return false;}
  if(S.q){var q=S.q.toLowerCase();if((p.name+' '+p.email).toLowerCase().indexOf(q)<0)return false;}
  return true;
 }
 function sorted(a){
  var b=a.slice();
  b.sort(function(x,y){
   if(S.sort==='name')return x.name.localeCompare(y.name);
   if(S.sort==='inv')return (x.fresh?-1:x.invD)-(y.fresh?-1:y.invD)||x.lt-y.lt;
   if(S.sort==='needs'){var nx=x.st==='needs'?0:1,ny=y.st==='needs'?0:1;if(nx!==ny)return nx-ny;}
   return x.lt-y.lt||x.name.localeCompare(y.name);
  });
  return b;
 }
 function shell(){
  root.innerHTML=
  '<aside class="fp" aria-label="Filters"><div class="fsum cx-sum"></div><div class="cx-groups"></div><div class="fp-foot"><button class="btn ghost" data-js data-a="clear">Clear all</button><button class="btn" data-js data-a="more">More filters</button></div></aside>'+
  '<div class="tw"><div class="tbar">'+
   '<button class="btn ghost" data-js data-a="views">'+'<svg class="i" viewBox="0 0 16 16"><rect x="2.5" y="2.5" width="11" height="11" rx="1.5"/><path d="M2.5 6.5h11M6.5 6.5v7"/></svg><span class="cx-vn"></span><svg class="i" viewBox="0 0 16 16" style="width:14px;height:14px"><path d="m4.5 6.5 3.5 3.5 3.5-3.5"/></svg></button>'+
   '<button class="btn ghost" data-js data-a="hidefp"><svg class="i" viewBox="0 0 16 16"><path d="M3 4.5h10M5 8h6M7 11.5h2"/></svg><span>Hide filters</span></button>'+
   '<label class="srch"><svg class="i" viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg><input class="cx-q" placeholder="Search name or email" aria-label="Search candidates"></label>'+
   '<div class="cx-chips"></div>'+
   '<div class="r"><button class="btn" data-js data-a="sort"><svg class="i" viewBox="0 0 16 16"><path d="M5 3v10M2.5 10.5 5 13l2.5-2.5M11 13V3M8.5 5.5 11 3l2.5 2.5"/></svg><span class="cx-sn"></span></button><button class="btn" data-js data-a="cols"><svg class="i" viewBox="0 0 16 16"><rect x="2.5" y="3" width="3" height="10" rx="1"/><rect x="6.5" y="3" width="3" height="10" rx="1"/><rect x="10.5" y="3" width="3" height="10" rx="1"/></svg>Columns</button></div></div>'+
  '<div class="sel-bar cx-sel"><span class="box cx-chk cx-all" role="checkbox" aria-checked="false" tabindex="0" aria-label="Select all on this page">'+SVGCK+'</span><span class="meta cx-seln">0 selected</span>'+
   '<button class="btn sm" data-js data-a="b-remind">Send reminder</button><button class="btn sm" data-js data-a="b-stage">Move stage</button><button class="btn sm" data-js data-a="b-review">Add to shortlist review</button><button class="btn sm" data-js data-a="b-export">Export selected</button><button class="btn sm ghost cx-clrsel" data-js data-a="b-clear">Clear selection</button></div>'+
  '<div class="tscroll"><table class="cx-table"><thead></thead><tbody></tbody></table></div>'+
  '<div class="pager"><span class="foot-note"><svg class="i" viewBox="0 0 16 16" style="width:13px;height:13px"><rect x="4" y="7.5" width="8" height="6" rx="1"/><path d="M5.5 7.5V5.5a2.5 2.5 0 0 1 5 0v2"/></svg>Accommodation requests show to recruiters only. Practice shows only whether it started.</span>'+
   '<span class="meta cx-pgn" style="margin-left:auto;margin-right:0"></span><button class="pg" data-js data-a="prev" aria-label="Previous page"><svg class="i" viewBox="0 0 16 16" style="width:14px;height:14px"><path d="m10 4-4 4 4 4"/></svg></button><button class="pg" data-js data-a="next" aria-label="Next page"><svg class="i" viewBox="0 0 16 16" style="width:14px;height:14px"><path d="m6 4 4 4-4 4"/></svg></button></div></div>';
  root.querySelector('.cx-q').addEventListener('input',function(e){S.q=e.target.value.trim();S.page=0;render();});
 }
 function sum(){
  var base=all().filter(function(p){return match(p,'st');});
  var c={all:base.length,needs:base.filter(function(p){return p.st==='needs';}).length,fin:base.filter(function(p){return p.st==='fin';}).length};
  var k=!S.f.st.length?'all':S.f.st.length===1&&(S.f.st[0]==='needs'||S.f.st[0]==='fin')?S.f.st[0]:'';
  root.querySelector('.cx-sum').innerHTML=[['all','All'],['needs','Needs you'],['fin','Finished']].map(function(x){return '<button data-js data-sum="'+x[0]+'" class="'+(k===x[0]?'on':'')+'" aria-pressed="'+(k===x[0])+'"><b>'+x[1]+'</b><span>'+c[x[0]]+'</span></button>';}).join('');
 }
 function groups(){
  var A=all();
  root.querySelector('.cx-groups').innerHTML=S.shown.map(function(g){
   var G=GROUPS[g],base=A.filter(function(p){return match(p,g);}),tot={};
   A.forEach(function(p){var v=G.get(p);tot[v]=(tot[v]||0)+1;});
   var open=S.open.indexOf(g)>=0,on=S.f[g].length;
   return '<div class="acc cx-acc'+(open?' open':'')+'"><button class="acc-h" data-js data-acc="'+g+'" aria-expanded="'+open+'">'+IC[g]+G.label+(on?'<span class="cnt">'+on+' on</span>':'')+'<span class="car"></span></button><div class="acc-b">'+
    G.opts.filter(function(o){return tot[o[0]]||S.f[g].indexOf(o[0])>=0;}).map(function(o){var n=base.filter(function(p){return G.get(p)===o[0];}).length,sel=S.f[g].indexOf(o[0])>=0;
     return '<button class="opt cx-opt'+(n||sel?'':' cx-zero')+'" data-js data-g="'+g+'" data-v="'+esc(o[0])+'" role="checkbox" aria-checked="'+sel+'"><span class="box'+(sel?' on':'')+'">'+SVGCK+'</span>'+o[1]+(o[2]?' <span class="cx-sub">'+o[2]+'</span>':'')+'<span class="n">'+n+'</span></button>';}).join('')+'</div></div>';
  }).join('');
 }
 function chips(){
  var h='';Object.keys(S.f).forEach(function(g){S.f[g].forEach(function(v){var o=GROUPS[g].opts.filter(function(x){return x[0]===v;})[0];h+='<span class="cx-chip">'+(g==='pr'?'Practice '+o[1].toLowerCase():g==='inv'?'Invited '+o[1].toLowerCase():o[1])+'<button data-js data-rm="'+g+'|'+esc(v)+'" aria-label="Remove filter '+esc(o[1])+'"><svg class="i" viewBox="0 0 16 16"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/></svg></button></span>';});});
  root.querySelector('.cx-chips').innerHTML=h;
 }
 function cols(){return COLS.filter(function(c){return S.hide.indexOf(c[0])<0&&!(c[0]==='role'&&cfg.req);});}
 function cell(k,p){
  var R=ROLES[p.req];
  if(k==='cand')return '<td><div class="person"><span class="pav">'+ini(p.name)+'</span><div><b>'+esc(p.name)+(p.fresh?'<span class="cx-new">New</span>':'')+'</b><small>'+esc(p.email)+'</small></div></div></td>';
  if(k==='role')return '<td class="cx-role"><a href="'+R.href+'" title="'+esc(R.name)+'">'+R.short+'</a><small>Req '+p.req+'</small></td>';
  if(k==='st')return '<td class="cx-stc"><span class="st '+p.cls+'"><i></i>'+esc(p.stx)+'</span>'+(p.review?'<small class="cx-rv">On shortlist review</small>':'')+'</td>';
  if(k==='pr')return '<td>'+(p.pr==='y'?'Started':'Not started')+'</td>';
  if(k==='call')return '<td class="mono">'+(/^(Opens|Nov|Dec|With)/.test(p.call)?esc(p.call):'<span class="dim">'+esc(p.call)+'</span>')+'</td>';
  if(k==='stage')return '<td><span class="stage">'+esc(p.stageNow)+'</span></td>';
  if(k==='loc')return '<td>'+LOCL[p.loc]+'</td>';
  if(k==='inv')return '<td class="dim">'+(p.fresh?'Today':dl(p.invD))+'</td>';
  if(k==='last')return '<td class="dim">'+lastLbl(p)+'</td>';
 }
 function act(p){
  var pend=(p.acc||[]).filter(function(a){return a.state==='pending';})[0];
  if(pend){
   if(cfg.inlineRequests)return pend.type==='human'?'<button class="btn sm yellow" data-js data-r="assign">Assign interviewer</button>':'<button class="btn sm" data-js data-r="decline">Decline</button> <button class="btn sm yellow" data-js data-r="approve">Approve</button>';
   return '<button class="btn sm yellow" data-js data-r="view">Review request</button>';
  }
  if(p.st==='fin'){var oc=openCall(p);return oc?'<button class="btn sm" data-go="'+oc.go+'">Open call</button>':'<button class="btn sm" data-js data-r="view">Open call</button>';}
  return '<button class="btn sm ghost" data-js data-r="view">View</button>';
 }
 function rows(){
  var C=cols(),A=all();L=sorted(A.filter(function(p){return match(p);}));
  var pages=Math.max(1,Math.ceil(L.length/PAGE));if(S.page>=pages)S.page=pages-1;
  var slice=L.slice(S.page*PAGE,S.page*PAGE+PAGE);
  root.querySelector('thead').innerHTML='<tr><th class="cbx"></th>'+C.map(function(c){var sk=c[0]==='cand'?'name':c[0]==='last'?'last':c[0]==='inv'?'inv':'';return '<th>'+(sk?'<button class="cx-th'+(S.sort===sk?' on':'')+'" data-js data-sk="'+sk+'">'+c[1]+(S.sort===sk?' <span aria-hidden="true">↓</span>':'')+'</button>':c[1])+'</th>';}).join('')+'<th></th></tr>';
  root.querySelector('tbody').innerHTML=slice.length?slice.map(function(p){var sel=!!S.sel[p.id];
   return '<tr data-id="'+p.id+'" class="cx-row'+(p.st==='needs'?' flag':'')+(sel?' cx-on':'')+'"><td class="cbx"><span class="box cx-chk'+(sel?' on':'')+'" role="checkbox" aria-checked="'+sel+'" tabindex="0" aria-label="Select '+esc(p.name)+'">'+SVGCK+'</span></td>'+C.map(function(c){return cell(c[0],p);}).join('')+'<td class="act">'+act(p)+'</td></tr>';}).join('')
   :'<tr class="cx-empty"><td colspan="'+(C.length+2)+'">No candidates match these filters. <button class="btn sm ghost" data-js data-a="clear">Clear filters</button></td></tr>';
  var a=S.page*PAGE+1,b=Math.min(L.length,a+PAGE-1);
  root.querySelector('.cx-pgn').textContent=L.length?a+'–'+b+' of '+L.length:'0 of 0';
  root.querySelector('[data-a="prev"]').disabled=S.page===0;root.querySelector('[data-a="next"]').disabled=S.page>=pages-1;
  var n=Object.keys(S.sel).length,pageAll=slice.length&&slice.every(function(p){return S.sel[p.id];});
  root.querySelector('.cx-seln').textContent=n+' selected';root.querySelector('.cx-sel').classList.toggle('ac-live',n>0);root.querySelector('.cx-sel').classList.toggle('cx-live',n>0);
  var al=root.querySelector('.cx-all');al.classList.toggle('on',!!pageAll);al.setAttribute('aria-checked',!!pageAll);
  root.querySelector('.cx-clrsel').style.display=n?'':'none';
  return slice;
 }
 function labels(){
  var v=cfg.views.concat(saved.map(function(x){return [x.id,x.name];})).filter(function(x){return x[0]===S.view;})[0];
  root.querySelector('.cx-vn').textContent=v?v[1]:'Custom filters';
  root.querySelector('.cx-sn').textContent=SORTS.filter(function(s){return s[0]===S.sort;})[0][1];
  root.querySelector('[data-a="hidefp"] span').textContent=S.nofp?'Show filters':'Hide filters';
  root.classList.toggle('cx-nofp',S.nofp);
 }
 function render(){sum();groups();chips();rows();labels();if(cfg.onRender)cfg.onRender(all());}
 function reset(){Object.keys(S.f).forEach(function(g){S.f[g]=[];});S.q='';root.querySelector('.cx-q').value='';S.page=0;}
 function applyView(id){
  reset();S.view=id;
  var v=saved.filter(function(x){return x.id===id;})[0];
  if(v){Object.keys(v.f).forEach(function(g){S.f[g]=v.f[g].slice();if(v.f[g].length&&S.shown.indexOf(g)<0)S.shown.push(g);});S.q=v.q||'';root.querySelector('.cx-q').value=S.q;S.sort=v.sort||S.sort;}
  else cfg.viewFn(id,S);
  render();
 }
 function selected(){var A=all();return A.filter(function(p){return S.sel[p.id];});}
 function csv(list,name){UI.download(name,peopleCsv(list));}
 function bulk(a,btn){
  var list=selected();
  if(a==='b-clear'){S.sel={};render();return;}
  if(!list.length){note('Select candidates first.');return;}
  if(a==='b-remind'){if(remind(list)){S.sel={};}render();}
  if(a==='b-export'){csv(list,'candidates-selected-'+list.length+'.csv');}
  if(a==='b-review'){
   var ok=list.filter(function(p){return p.st==='fin';}),skip=list.length-ok.length;
   if(!ok.length){note('Only finished candidates can go on a shortlist review. None of the selected have finished.');return;}
   var hms={};ok.forEach(function(p){hms[ROLES[p.req].hm]=1;save(p.id,{review:true});});
   S.sel={};render();note('Added '+ok.length+' finished candidate'+(ok.length>1?'s':'')+' to the shortlist review for '+Object.keys(hms).join(' and ')+'.'+(skip?' Skipped '+skip+' who '+(skip>1?'haven\'t':'hasn\'t')+' finished.':''));
  }
  if(a==='b-stage'){
   UI.menu(btn,[{header:'Move '+list.length+' in your applicant tracker'}].concat(['Phone screen','Review','Final round'].map(function(s){return {label:s,onClick:function(){
    UI.confirm('Move '+list.length+' candidate'+(list.length>1?'s':'')+' to '+s+'?','This changes their stage in your applicant tracker. PM doesn\'t email them. To decline someone, the hiring manager decides on the shortlist and gives a reason.','Move '+list.length,function(){list.forEach(function(p){save(p.id,{stage:s,lt:0,lastTxt:'Just now'});});S.sel={};render();note('Moved '+list.length+' candidate'+(list.length>1?'s':'')+' to '+s+'.');});
   }};})),{align:'left'});
  }
 }
 function find(id){return all().filter(function(p){return p.id===id;})[0];}
 root.addEventListener('click',function(e){
  var t=e.target,el;
  if((el=t.closest('.cx-chk'))){e.preventDefault();var tr=el.closest('tr');
   if(el.classList.contains('cx-all')){var slice=L.slice(S.page*PAGE,S.page*PAGE+PAGE),on=!slice.every(function(p){return S.sel[p.id];});slice.forEach(function(p){if(on)S.sel[p.id]=1;else delete S.sel[p.id];});}
   else{var id=tr.getAttribute('data-id');if(S.sel[id])delete S.sel[id];else S.sel[id]=1;}
   rows();return;}
  if((el=t.closest('[data-sum]'))){var k=el.getAttribute('data-sum');S.f.st=k==='all'?[]:[k];S.page=0;S.view='';render();return;}
  if((el=t.closest('[data-acc]'))){var g=el.getAttribute('data-acc'),i=S.open.indexOf(g);if(i<0)S.open.push(g);else S.open.splice(i,1);groups();return;}
  if((el=t.closest('[data-g]'))){var g2=el.getAttribute('data-g'),v=el.getAttribute('data-v'),j=S.f[g2].indexOf(v);if(j<0)S.f[g2].push(v);else S.f[g2].splice(j,1);S.page=0;S.view='';render();return;}
  if((el=t.closest('[data-rm]'))){var gv=el.getAttribute('data-rm').split('|');S.f[gv[0]].splice(S.f[gv[0]].indexOf(gv[1]),1);S.page=0;S.view='';render();return;}
  if((el=t.closest('[data-sk]'))){S.sort=el.getAttribute('data-sk');S.page=0;render();return;}
  if((el=t.closest('[data-r]'))){var p=find(el.closest('tr').getAttribute('data-id')),r=el.getAttribute('data-r');if(r==='view')drawer(p,render);else accAct(p,r,render);return;}
  if((el=t.closest('[data-a]'))){var a=el.getAttribute('data-a');
   if(a==='clear'){reset();S.view=cfg.views[0][0];render();note('Filters cleared.');}
   else if(a==='prev'){S.page=Math.max(0,S.page-1);rows();root.querySelector('.tscroll').scrollTop=0;}
   else if(a==='next'){S.page++;rows();root.querySelector('.tscroll').scrollTop=0;}
   else if(a==='hidefp'){S.nofp=!S.nofp;labels();}
   else if(a==='sort'){UI.menu(el,SORTS.map(function(s){return {label:s[1],check:S.sort===s[0],onClick:function(){S.sort=s[0];S.page=0;render();}};}));}
   else if(a==='cols'){var pop=UI.popover(el,'<div class="ui-h">Show columns</div>'+COLS.filter(function(c){return !(c[0]==='role'&&cfg.req);}).map(function(c){return '<label class="cx-colr"><input type="checkbox" data-c="'+c[0]+'"'+(S.hide.indexOf(c[0])<0?' checked':'')+(c[2]?' disabled':'')+'>'+c[1]+'</label>';}).join(''),{width:220});
    if(pop)pop.querySelectorAll('input[data-c]').forEach(function(i){i.onchange=function(){var c=i.getAttribute('data-c'),k=S.hide.indexOf(c);if(i.checked&&k>=0)S.hide.splice(k,1);if(!i.checked&&k<0)S.hide.push(c);rows();};});}
   else if(a==='more'){UI.menu(el,[{header:'Filters in the panel'}].concat(Object.keys(GROUPS).filter(function(g){return !(g==='req'&&cfg.req);}).map(function(g){var on=S.shown.indexOf(g)>=0;return {label:GROUPS[g].label,check:on,onClick:function(){
     if(on){S.shown.splice(S.shown.indexOf(g),1);if(S.f[g].length){S.f[g]=[];}note(GROUPS[g].label+' filter removed from the panel.');}else{S.shown.push(g);if(S.open.indexOf(g)<0)S.open.push(g);note(GROUPS[g].label+' filter added to the panel.');}render();}};})),{align:'left'});}
   else if(a==='views'){
    var items=[{header:'Saved views'}].concat(cfg.views.map(function(v){return {label:v[1],small:v[2],check:S.view===v[0],onClick:function(){applyView(v[0]);}};}),saved.map(function(v){return {label:v.name,small:'You',check:S.view===v.id,onClick:function(){applyView(v.id);}};}),[{sep:true},{label:'Save current filters as a view',onClick:saveView}]);
    if(saved.length)items.push({label:'Delete saved views',danger:true,onClick:function(){UI.confirm('Delete your saved views?','This removes the '+saved.length+' view'+(saved.length>1?'s':'')+' you saved on this screen. Shared views stay.','Delete',function(){saved=[];ss('cx-views-'+cfg.key,saved);if(S.view.indexOf('v')===0)S.view=cfg.views[0][0];labels();note('Saved views deleted.');},true);}});
    UI.menu(el,items,{align:'left'});}
   else if(a.indexOf('b-')===0)bulk(a,el);
   return;}
  if((el=t.closest('tr.cx-row'))&&!t.closest('a,button')){drawer(find(el.getAttribute('data-id')),render);}
 });
 root.addEventListener('keydown',function(e){var b=e.target.closest&&e.target.closest('.cx-chk');if(b&&(e.key===' '||e.key==='Enter')){e.preventDefault();b.click();}});
 function saveView(){
  var desc=[];Object.keys(S.f).forEach(function(g){S.f[g].forEach(function(v){desc.push(GROUPS[g].opts.filter(function(o){return o[0]===v;})[0][1]);});});if(S.q)desc.push('“'+S.q+'”');
  UI.modal({title:'Save current filters as a view',body:'<label for="cxVn">View name</label><input id="cxVn" placeholder="For example: Finished this week">'+'<p class="cx-mnote">'+(desc.length?'Filters: '+esc(desc.join(', ')):'No filters on. The view shows everyone.')+' Sorted by '+SORTS.filter(function(s){return s[0]===S.sort;})[0][1].toLowerCase()+'. Only you see it.</p>',
   actions:[{label:'Cancel'},{label:'Save view',primary:true,onClick:function(m){var i=m.querySelector('input');if(!i.value.trim()){i.style.borderColor='#B42318';i.focus();return false;}
    var f={};Object.keys(S.f).forEach(function(g){f[g]=S.f[g].slice();});var v={id:'v'+Date.now(),name:i.value.trim(),f:f,q:S.q,sort:S.sort};saved.push(v);ss('cx-views-'+cfg.key,saved);S.view=v.id;labels();note('Saved the view “'+v.name+'”.');}}]});
 }
 shell();if(cfg.initView)cfg.viewFn(cfg.initView,S);render();
 PMStore.on(function(k){if(/^(people|decisions|acc|members|\*)$/.test(k))render();});
 return {render:render,exportAll:function(){csv(L,cfg.file+'-'+L.length+'.csv');},state:S,list:function(){return L;}};
}

/* ui.js builds modal, drawer and menu buttons without data-js, so proto.js would show its
   "not built" note after they run. Mark them in the capture phase, before proto.js sees the click. */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.ui-b,.ui-x,.ui-it,.ui-pop button');if(b)b.setAttribute('data-js','');},true);

window.CX={ROLES:ROLES,people:people,save:save,SL:SL,table:table,drawer:drawer,invite:invite,accAct:accAct,dl:dl,ss:ss,esc:esc,ini:ini,csvRow:csvRow,note:note};
})();
