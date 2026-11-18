/* by-audit-log.html: filterable, paged audit log */
(function(){
  var esc=UI.esc,$=function(id){return document.getElementById(id)};
  var TYPES=[['Decision','Decisions','green'],['Notice','Notice versions','beige'],['Consent','Consent','beige'],['Export','Exports','blue'],['Draw','Buyer draws','gray'],['Call','Scored calls','gray'],['Score','Scores','gray'],['Accommodation','Accommodations','pink'],['Check','Fairness checks','green'],['Settings','Settings changes','gray']];
  var TC={};TYPES.forEach(function(t){TC[t[0]]=t;});
  var ROLES=['Req 114','Req 117','Req 109','Req 101','All roles'];
  var PEOPLE=[];BY_LOG.forEach(function(e){if(PEOPLE.indexOf(e.by)<0&&['PM','Dana Whitfield','Marcus Lee','Alex Romero','Jess Park'].indexOf(e.by)>=0)PEOPLE.push(e.by);});
  PEOPLE.push('Candidates');
  var st={q:'',type:'all',role:'all',by:'all',from:'2026-10-01',to:'2026-11-17',desc:true,page:0},PER=20;
  var m=location.search.match(/role=([^&]+)/);if(m)st.role=decodeURIComponent(m[1]);
  var m2=location.search.match(/type=([^&]+)/);if(m2)st.type=decodeURIComponent(m2[1]);
  var STAFF=['PM','Dana Whitfield','Marcus Lee','Alex Romero','Jess Park'];
  function list(){var q=st.q.toLowerCase();
    var L=BY_LOG.filter(function(e){var d=e.t.slice(0,10);
      if(st.type!=='all'&&e.type!==st.type)return false;
      if(st.role!=='all'&&e.role!==st.role)return false;
      if(st.by!=='all'){if(st.by==='Candidates'){if(STAFF.indexOf(e.by)>=0)return false;}else if(e.by!==st.by)return false;}
      if(d<st.from||d>st.to)return false;
      if(q&&(e.ev+' '+e.cand+' '+e.by+' '+e.det+' '+e.role+' '+e.id).toLowerCase().indexOf(q)<0)return false;return true;});
    L.sort(function(a,b){return st.desc?b.t.localeCompare(a.t):a.t.localeCompare(b.t);});return L;}
  function lbl(btn,t,act){btn.textContent=t;btn.classList.toggle('by-act',!!act);}
  function draw(){
    var L=list(),pages=Math.max(1,Math.ceil(L.length/PER));if(st.page>=pages)st.page=pages-1;
    var P=L.slice(st.page*PER,st.page*PER+PER);
    $('byRows').innerHTML=P.length?P.map(function(e){var t=TC[e.type];return '<tr data-id="'+e.id+'" tabindex="0"><td class="mono by-dim">'+byFmtTime(e.t)+'</td><td>'+esc(e.ev)+'</td><td><span class="tag '+t[2]+'">'+t[1].replace(/s$/,'').replace('Buyer draw','Draw').replace('Settings change','Settings').replace('Fairness check','Check').replace('Scored call','Call').replace('Notice version','Notice')+'</span></td><td>'+esc(e.role)+'</td><td'+(e.cand?'':' class="by-dim"')+'>'+esc(e.cand||'–')+'</td><td>'+esc(e.by)+'</td><td class="by-dim" title="'+esc(e.det)+'">'+esc(e.det)+'</td></tr>';}).join('')
      :'<tr><td colspan="7" class="by-none">No entries match these filters. <button class="by-clear" data-js id="byClr2">Clear all</button></td></tr>';
    $('byCount').textContent=L.length+(L.length===1?' entry':' entries')+(L.length<BY_LOG.length?' of '+BY_LOG.length:'');
    $('byPgL').textContent=L.length?(st.page*PER+1)+'–'+Math.min(L.length,st.page*PER+PER)+' · page '+(st.page+1)+' of '+pages:'';
    $('byPrev').disabled=st.page===0;$('byNext').disabled=st.page>=pages-1;
    lbl($('byType'),'Type: '+(st.type==='all'?'All':TC[st.type][1]),st.type!=='all');
    lbl($('byRole'),'Role: '+(st.role==='all'?'All':st.role),st.role!=='all');
    lbl($('byBy'),'By: '+(st.by==='all'?'Anyone':st.by),st.by!=='all');
    $('bySort').textContent=st.desc?'Newest first':'Oldest first';
    var chips=[];if(st.q)chips.push(['q','“'+st.q+'”']);if(st.type!=='all')chips.push(['type',TC[st.type][1]]);if(st.role!=='all')chips.push(['role',st.role]);if(st.by!=='all')chips.push(['by',st.by]);
    if(st.from!=='2026-10-01'||st.to!=='2026-11-17')chips.push(['date',byFmtTime(st.from+'T00:00').split(',')[0]+' – '+byFmtTime(st.to+'T00:00').split(',')[0]]);
    var ch=$('byChips');ch.hidden=!chips.length;
    ch.innerHTML=chips.map(function(c){return '<span class="by-chip">'+esc(c[1])+'<button data-js data-k="'+c[0]+'" aria-label="Remove filter">×</button></span>';}).join('')+(chips.length?'<button class="by-clear" data-js id="byClr">Clear all</button>':'');
    ch.querySelectorAll('[data-k]').forEach(function(b){b.onclick=function(){var k=b.getAttribute('data-k');if(k==='q'){st.q='';$('byQ').value='';}else if(k==='date'){st.from='2026-10-01';st.to='2026-11-17';$('byFrom').value=st.from;$('byTo').value=st.to;}else st[k]='all';st.page=0;draw();};});
    [$('byClr'),$('byClr2')].forEach(function(b){if(b)b.onclick=clear;});
    $('byRows').querySelectorAll('tr[data-id]').forEach(function(r){r.onclick=function(){detail(r.getAttribute('data-id'));};r.onkeydown=function(e){if(e.key==='Enter')detail(r.getAttribute('data-id'));};});
  }
  function clear(){st.q='';st.type='all';st.role='all';st.by='all';st.from='2026-10-01';st.to='2026-11-17';st.page=0;$('byQ').value='';$('byFrom').value=st.from;$('byTo').value=st.to;draw();UI.toast('Cleared all filters.');}
  function detail(id){var e=BY_LOG.filter(function(x){return x.id===id})[0];if(!e)return;
    var why={Decision:'A person made this decision. PM can’t advance or decline anyone.',Draw:'The buyer and difficulty were drawn in code. Everyone in the role gets the same mix.',Notice:'Candidates see the notice 10 business days before the scored call opens.',Consent:'Consent is recorded against the notice version the candidate read.',
      Export:'Exports cover what PM records. An independent auditor does the bias audit.',Accommodation:'Accommodation requests go to recruiters only.',Score:'Only Discovery, Handling doubt and Getting a next step are scored. Voice, accent, face and pauses are not.'}[e.type]||'Kept with the record it refers to.';
    var acts=[{label:'Close'}];
    if(e.cand&&e.role==='Req 114')acts.unshift({label:'Open candidate',onClick:function(){location.href='candidates.html';}});
    if(e.type==='Export')acts.unshift({label:'Download again',onClick:function(){UI.download('pm-audit-'+e.role.replace(/\W+/g,'').toLowerCase()+'-'+e.t.slice(0,10)+'.csv','entry_id,time,role,detail\n'+e.id+','+e.t+','+e.role+',"'+e.det+'"\n');return false;}});
    UI.drawer({title:e.ev,width:440,body:'<dl class="by-kv"><dt>Entry</dt><dd class="mono">'+e.id+'</dd><dt>Time</dt><dd>'+byFmtTime(e.t)+', 2026</dd><dt>Type</dt><dd>'+TC[e.type][1]+'</dd><dt>Role</dt><dd>'+esc(e.role)+'</dd><dt>Candidate</dt><dd>'+esc(e.cand||'–')+'</dd><dt>By</dt><dd>'+esc(e.by)+'</dd><dt>Detail</dt><dd>'+esc(e.det)+'</dd></dl><div class="by-dnote">'+why+'</div>',actions:acts});
  }
  function menuFor(btn,items,cur,set){UI.menu(btn,items.map(function(it){return {label:it[1],small:it[2],check:cur===it[0],onClick:function(){set(it[0]);st.page=0;draw();}};}),{align:'left'});}
  function count(k,v){return String(BY_LOG.filter(function(e){return k==='by'&&v==='Candidates'?STAFF.indexOf(e.by)<0:e[k]===v}).length);}
  UI.wire($('byType'),function(b){menuFor(b,[['all','All types',String(BY_LOG.length)]].concat(TYPES.map(function(t){return [t[0],t[1],count('type',t[0])]})),st.type,function(v){st.type=v;});});
  UI.wire($('byRole'),function(b){menuFor(b,[['all','All roles','']].concat(ROLES.map(function(r){return [r,r==='All roles'?'Workspace-wide':r,count('role',r)]})),st.role,function(v){st.role=v;});});
  UI.wire($('byBy'),function(b){menuFor(b,[['all','Anyone','']].concat(PEOPLE.map(function(p){return [p,p,count('by',p)]})),st.by,function(v){st.by=v;});});
  UI.wire($('bySort'),function(){st.desc=!st.desc;st.page=0;draw();});
  UI.wire($('byPrev'),function(){if(st.page>0){st.page--;draw();}});
  UI.wire($('byNext'),function(){st.page++;draw();});
  $('byQ').addEventListener('input',function(){st.q=this.value.trim();st.page=0;draw();});
  ['byFrom','byTo'].forEach(function(id){$(id).addEventListener('change',function(){var a=$('byFrom').value||'2026-10-01',b=$('byTo').value||'2026-11-17';if(a>b){UI.toast('The start date is after the end date.');return;}st.from=a;st.to=b;st.page=0;draw();});});
  UI.wire($('byExp'),function(){var L=list();
    var rows=['entry_id,time,type,event,role,candidate,by,detail'].concat(L.map(function(e){return [e.id,e.t,e.type,e.ev,e.role,e.cand,e.by,e.det].map(function(x){x=String(x);return /[",]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x;}).join(',');}));
    UI.download('pm-audit-log-'+st.from+'-to-'+st.to+'.csv',rows.join('\n'));});
  draw();
})();
