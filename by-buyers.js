/* buyers.html wiring (prefix by-) */
(function(){
  var esc=UI.esc;
  var EDITED={rl:'2026-11-17',mc:'2026-11-02',je:'2026-10-26',tb:'2026-10-25',ps:'2026-09-18'};
  var TESTED={rl:'',je:'2026-10-26',tb:'2026-10-26',mc:'2026-11-02',ps:'2026-09-18'};
  var COLORS=['c1','c2','c3','c4','c5'];
  var WSG=BYC.get('pm-by-wsg',[
    {t:'Never asks about age, family or background.',lock:true},
    {t:'Never uses personal insults.',lock:true},
    {t:'Never asks about health or disability.',lock:true},
    {t:'Never comments on the candidate’s voice, accent or pauses.',lock:true}
  ]);
  var st={f:'all',role:'all',sort:'edited',q:''};

  /* Rosa's draft was discarded on the edit screen */
  if(BYC.get('pm-by-rosa','')==='discarded'){
    BY.forEach(function(b){if(b.id==='rl'){b.status='use';b.ver='v2';b.tested='Oct 26';TESTED.rl='2026-10-26';EDITED.rl='2026-10-26';
      b.hist=[['Oct 26','Dana · stayed in character','7:00'],['Sep 30','Dana · first test','6:20']];b.moodStart=1;b.moodTo=1;b.moodNote='Rushed the whole call.';}});
  }
  /* New buyers saved on by-new-buyer.html */
  function fromNew(n){
    var ini=n.name.split(/\s+/).map(function(w){return w.charAt(0)}).join('').slice(0,2).toUpperCase();
    var v=BYC.voice(n.voice);
    return {id:n.id,isNew:true,ini:ini,c:COLORS[(n.name.length)%5],name:n.name,role:n.role||'Buyer',size:n.size||n.company||'New',
      mood:MOODS[n.start],concern:(n.objections[0]||'No objection set'),roles:[],status:'draft',ver:'v1 draft',tested:'Never',
      about:n.persona||'No persona written yet.',moodStart:+n.start,moodTo:+n.best,
      moodNote:'Starts '+MOODS[n.start].toLowerCase()+'. A good call can move them to '+MOODS[n.best].toLowerCase()+'.',
      decide:[['Objections',n.objections.length?n.objections.join(' · '):'None yet'],['Company',n.company||'Not set']],
      guard:['Ends the call politely at the time limit; never mid-sentence.','Does not invent numbers beyond the brief.'],
      voice:[v.name,v.desc],voiceLen:v.len,diff:'Set by each role that uses it',hist:[],changed:'Dana created it today'};
  }
  var NEW=BYC.get('pm-by-new',[]);
  NEW.slice().reverse().forEach(function(n){if(!BY.some(function(b){return b.id===n.id})){BY.unshift(fromNew(n));EDITED[n.id]='2026-11-17T'+(n.t||'12:00');TESTED[n.id]='';}});

  function inRole(b,r){if(r==='all')return true;if(r==='none')return !b.roles.length;return b.roles.some(function(x){return x[0]===r});}
  function visible(){
    var q=st.q.toLowerCase();
    var L=BY.filter(function(b){
      if(st.f==='draft'&&b.status!=='draft')return false;
      if(st.f==='use'&&!b.roles.length)return false;
      if(!inRole(b,st.role))return false;
      if(q&&(b.name+' '+b.role+' '+b.size+' '+b.mood+' '+b.concern).toLowerCase().indexOf(q)<0)return false;
      return true;});
    L.sort(function(a,b){
      if(st.sort==='name')return a.name.localeCompare(b.name);
      if(st.sort==='tested'){var x=TESTED[a.id]||'',y=TESTED[b.id]||'';if(!x&&y)return 1;if(x&&!y)return -1;return y.localeCompare(x);}
      return (EDITED[b.id]||'').localeCompare(EDITED[a.id]||'');});
    return L;
  }
  window.byStatus=function(b){return b.status==='draft'?'<span class="by-st draft"><i></i>Draft '+esc(b.ver.replace(' draft',''))+'</span>':'<span class="by-st"><i></i>In use · '+esc(b.ver)+'</span>';};
  window.byRows=function(f){
    if(f)st.f=f;
    var L=visible(),h='';
    L.forEach(function(b){
      h+='<tr data-id="'+b.id+'" class="'+(b.id===byCur?'by-sel':'')+'" onclick="bySel(\''+b.id+'\')"><td><button class="by-who" data-js aria-label="Show '+esc(b.name)+'"><span class="by-av '+b.c+'">'+esc(b.ini)+'</span><span><b>'+esc(b.name)+'</b><small>'+esc(b.role)+' · '+esc(b.size)+'</small></span></button></td>'+
      '<td>'+byTags(b)+'</td><td'+(b.roles.length?'':' class="by-dim"')+'>'+(b.roles.length?b.roles.map(function(r){return r[0]}).join(', '):'None')+'</td><td>'+byStatus(b)+'</td><td class="'+(b.tested==='Never'?'by-dim':'')+'">'+esc(b.tested)+'</td></tr>';});
    if(!L.length)h='<tr class="by-none"><td colspan="5">No buyers match these filters. <button class="by-link" data-js onclick="byClear()">Clear filters</button></td></tr>';
    document.getElementById('byRows').innerHTML=h;
    var cnt=document.querySelector('.by-foot .meta');if(cnt)cnt.textContent=L.length===BY.length?BY.length+' buyers':L.length+' of '+BY.length+' buyers';
    var n=document.querySelectorAll('.by-tabs .by-n');
    n[0].textContent=BY.length;n[1].textContent=BY.filter(function(b){return b.roles.length}).length;n[2].textContent=BY.filter(function(b){return b.status==='draft'}).length;
  };
  window.byClear=function(){st.role='all';st.q='';st.f='all';var i=document.getElementById('bySrch');if(i)i.value='';
    document.querySelectorAll('.by-tabs button').forEach(function(x){x.classList.toggle('on',x.getAttribute('data-f')==='all')});setRoleLbl();byRows();};

  /* Search box */
  var sb=document.querySelector('.by-srch');
  sb.innerHTML='<svg class="i" viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg><input id="bySrch" type="search" placeholder="Search buyers" aria-label="Search buyers" autocomplete="off">';
  document.getElementById('bySrch').addEventListener('input',function(e){st.q=e.target.value.trim();byRows();});

  /* Role filter */
  var roleBtn=UI.byText('Role: All',document.querySelector('.by-bar'))[0];
  var ROLES=[['all','All roles'],['Req 114','Req 114 · AE, Mid-Market'],['Req 117','Req 117 · SDR, Inbound'],['Req 109','Req 109 · AE, Enterprise'],['none','Not used in a role']];
  function setRoleLbl(){var lab=st.role==='all'?'All':(st.role==='none'?'Not used':st.role);
    roleBtn.childNodes.forEach(function(nd){if(nd.nodeType===3&&nd.textContent.trim())nd.textContent='Role: '+lab;});
    roleBtn.classList.toggle('by-act',st.role!=='all');}
  UI.wire(roleBtn,function(){UI.menu(roleBtn,ROLES.map(function(r){
    var c=BY.filter(function(b){return inRole(b,r[0])}).length;
    return {label:r[1],small:String(c),check:st.role===r[0],onClick:function(){st.role=r[0];setRoleLbl();byRows();}};}),{align:'left'});});

  /* Sort */
  var sortBtn=UI.byText('Last edited',document.querySelector('.by-bar'))[0];
  var SORTS=[['edited','Last edited'],['tested','Last tested'],['name','Name, A to Z']];
  UI.wire(sortBtn,function(){UI.menu(sortBtn,[{header:'Sort by'}].concat(SORTS.map(function(s){return {label:s[1],check:st.sort===s[0],onClick:function(){
    st.sort=s[0];sortBtn.childNodes.forEach(function(nd){if(nd.nodeType===3&&nd.textContent.trim())nd.textContent=s[1];});byRows();UI.toast('Sorted by '+s[1].toLowerCase()+'.');}};})));});

  /* New buyer */
  UI.byText('New buyer').forEach(function(b){b.setAttribute('data-go','by-new-buyer.html');});

  /* Workspace guardrails */
  function wsgBody(){return '<p class="by-dp">These rules apply to every buyer in Northwind Freight. A buyer’s own guardrails sit on top of them and can’t override them.</p><ul class="by-wsg">'+
    WSG.map(function(g,i){return '<li><svg class="i" viewBox="0 0 16 16"><rect x="4" y="7.5" width="8" height="6" rx="1"/><path d="M5.5 7.5V5.5a2.5 2.5 0 0 1 5 0v2"/></svg><span>'+esc(g.t)+'</span>'+(g.lock?'<em>Always on</em>':'<button class="by-link" data-rm="'+i+'">Remove</button>')+'</li>';}).join('')+
    '</ul><label for="byWsgNew">Add a rule</label><input id="byWsgNew" placeholder="For example: Never mentions a competitor by name.">'+
    '<p class="by-dp" style="margin-top:12px">Changes apply to new calls only. Each call logs the rules that were on.</p>';}
  function openWsg(){
    var dr=UI.drawer({title:'Workspace guardrails',body:wsgBody(),width:460,actions:[{label:'Close'},{label:'Add rule',primary:true,onClick:function(d){
      var i=d.querySelector('#byWsgNew'),v=i.value.trim();if(!v){i.focus();i.style.borderColor='#B42318';return false;}
      if(!/[.!?]$/.test(v))v+='.';WSG.push({t:v});BYC.set('pm-by-wsg',WSG);d.querySelector('.ui-md-b').innerHTML=wsgBody();bindRm(d);refresh();UI.toast('Added a workspace guardrail. It applies to new calls in every role.');return false;}}]});
    bindRm(dr);
  }
  function bindRm(d){d.querySelectorAll('[data-rm]').forEach(function(b){b.onclick=function(){var g=WSG.splice(+b.getAttribute('data-rm'),1)[0];BYC.set('pm-by-wsg',WSG);d.querySelector('.ui-md-b').innerHTML=wsgBody();bindRm(d);refresh();UI.toast('Removed “'+g.t.replace(/\.$/,'')+'”.');};});}
  UI.wire(UI.byText('Workspace guardrails')[0],openWsg);

  function cur(){return BY.filter(function(b){return b.id===byCur})[0];}
  function refresh(){byRows();var b=cur();if(b)byPanel(b);}

  /* Panel: wrap the original renderer and wire its controls */
  var _panel=byPanel;
  window.byPanel=function(b){
    BYC.stop();
    _panel(b);
    var P=document.getElementById('byPanel');
    // workspace guardrails list from WSG
    var gr=P.querySelector('.by-gr');
    if(gr){gr.querySelectorAll('li.lk').forEach(function(li){li.remove()});
      WSG.forEach(function(g){var li=document.createElement('li');li.className='lk';li.innerHTML=LOCK+esc(g.t)+'<em>Workspace</em>';gr.appendChild(li);});}
    var s=P.querySelector('.by-state');
    if(b.isNew){
      s.innerHTML='<div class="by-txt"><b>Draft buyer · not tested</b><small>Version 1. Not used in a role yet. Test it, then add it in a role’s Interview setup.</small></div>'+(b.id.charAt(0)==='d'?'':'<button class="btn sm" data-go="by-new-buyer.html?id='+b.id+'">Edit</button>')+'<button class="btn sm yellow" data-go="test-call.html">Test call</button>';
      var ed=P.querySelector('.by-ed');if(ed)ed.textContent='';
      var rs=P.querySelector('.by-roles');if(rs)rs.outerHTML='<div class="by-empty">Not used in a role yet. Add it in a role’s Interview setup after a test call.</div>';
    }else if(b.status==='draft'&&b.id!=='rl'){
      var n=b.ver.replace(' draft','').slice(1),rl=b.roles.map(function(r){return r[0]}).join(', ');
      s.innerHTML='<div class="by-txt"><b>Draft buyer · not tested</b><small>Version '+n+'. '+(rl?rl+' calls keep using '+b.live+' until you test and publish.':'Not used in a role.')+'</small></div><button class="btn sm by-pub">Publish</button><button class="btn sm yellow" data-go="test-call.html">Test call</button>';
      s.className='by-state draft';
      UI.wire(s.querySelector('.by-pub'),function(){UI.toast('Test the draft before publishing. Calls stay on '+b.live+'.');});
      P.querySelectorAll('.by-kv dd').forEach(function(dd){if(dd.textContent===b.ver)dd.textContent=b.ver+' · '+b.live+' in use';});
    }
    // In-use Edit
    P.querySelectorAll('.by-state .btn').forEach(function(x){if(x.textContent.trim()==='Edit'&&!x.hasAttribute('data-go'))UI.wire(x,function(){editDraft(b);});});
    // Voice sample with playhead
    var vb=P.querySelector('.by-voice');
    if(vb){var len=b.voiceLen||BYC.voice(b.voice[0]).len||8;
      var meta=document.createElement('div');meta.className='by-vmeta';meta.innerHTML='<span class="by-vtrack"><i></i></span><span class="by-vtime">0:00 / '+BYC.fmt(len)+'</span>';vb.appendChild(meta);
      var pb=vb.querySelector('.by-play');
      UI.wire(pb,function(){BYC.play(pb,len,{bar:meta.querySelector('i'),time:meta.querySelector('.by-vtime'),onEnd:function(){vb.classList.remove('by-on');}});vb.classList.toggle('by-on',pb.classList.contains('by-playing'));});}
    // More actions
    var more=P.querySelector('[aria-label="More actions"]');
    if(more)UI.wire(more,function(){moreMenu(more,b);});
  };

  function editDraft(b){
    var n=parseInt(b.ver.slice(1),10)+1;
    var md=UI.modal({title:'Edit '+b.name,body:'<p>This creates draft v'+n+'. '+(b.roles.length?b.roles.map(function(r){return r[0]}).join(', ')+' calls keep using '+b.ver+' until you test and publish the draft.':'')+'</p>'+
      '<label for="byEdC">Concern</label><input id="byEdC" value="'+esc(b.concern)+'"><label for="byEdA">What’s on their mind</label><textarea id="byEdA">'+esc(b.about)+'</textarea>'+
      '<label for="byEdN">How the mood moves</label><textarea id="byEdN" style="min-height:64px">'+esc(b.moodNote)+'</textarea>',
      actions:[{label:'Cancel'},{label:'Save draft v'+n,primary:true,onClick:function(m){
        b.concern=m.querySelector('#byEdC').value.trim()||b.concern;b.about=m.querySelector('#byEdA').value.trim()||b.about;b.moodNote=m.querySelector('#byEdN').value.trim()||b.moodNote;
        b.live=b.ver;b.status='draft';b.ver='v'+n+' draft';b.tested='Never';TESTED[b.id]='';EDITED[b.id]='2026-11-17T23';b.hist=[];b.changed='Dana saved it today';
        byRows();byPanel(b);
        UI.toast('Saved draft v'+n+' of '+b.name+'. Calls keep using '+b.live+'.');}}]});
  }

  function moreMenu(btn,b){
    var items=[];
    if(b.status==='draft'&&b.id==='rl')items.push({label:'Edit draft',go:'buyer-edit.html'});
    else if(b.isNew)items.push({label:'Edit',go:'by-new-buyer.html?id='+b.id});
    else items.push({label:'Edit',onClick:function(){editDraft(b);}});
    items.push({label:'Test call',go:'test-call.html'});
    items.push({sep:true});
    items.push({label:'Rename',onClick:function(){
      UI.modal({title:'Rename buyer',body:'<label for="byRn">Name</label><input id="byRn" value="'+esc(b.name)+'"><p class="by-dp" style="margin-top:8px">Candidates see this name on the prep page. Past calls keep the name they ran with.</p>',
        actions:[{label:'Cancel'},{label:'Rename',primary:true,onClick:function(m){var v=m.querySelector('#byRn').value.trim();if(!v)return false;var old=b.name;b.name=v;
          b.ini=v.split(/\s+/).map(function(w){return w.charAt(0)}).join('').slice(0,2).toUpperCase();saveNew(b);refresh();UI.toast('Renamed '+old+' to '+v+'.');}}]});}});
    items.push({label:'Duplicate',onClick:function(){
      var c=JSON.parse(JSON.stringify(b));c.id='d'+Date.now().toString(36);c.name='Copy of '+b.name;c.ini=b.ini;c.status='draft';c.ver='v1 draft';c.tested='Never';c.roles=[];c.hist=[];c.isNew=true;c.changed='Dana duplicated it from '+b.name+' today';
      BY.unshift(c);EDITED[c.id]='2026-11-17T23:59';TESTED[c.id]='';byCur=c.id;byRows();byPanel(c);UI.toast('Duplicated '+b.name+'. The copy is a draft and isn’t used in any role.');}});
    items.push({label:'Download brief',small:'TXT',onClick:function(){
      var t=b.name+'\n'+b.role+' · '+b.size+'\nStatus: '+(b.status==='draft'?'Draft '+b.ver:'In use '+b.ver)+'\n\nConcern: '+b.concern+'\n'+b.about+'\n\nMood: '+MOODS[b.moodStart]+' to '+MOODS[b.moodTo]+'\n'+b.moodNote+'\n\nHow they decide\n'+
        b.decide.map(function(x){return '- '+x[0]+': '+x[1]}).join('\n')+'\n\nGuardrails\n'+b.guard.concat(WSG.map(function(g){return g.t+' (workspace)'})).map(function(g){return '- '+g}).join('\n')+'\n\nVoice: '+b.voice.join(', ')+'\n';
      UI.download(b.name.toLowerCase().replace(/\W+/g,'-')+'-brief.txt',t,'text/plain');}});
    items.push({sep:true});
    items.push({label:'Archive',danger:true,onClick:function(){
      if(b.roles.length){UI.modal({title:'Can’t archive '+b.name,body:'<p>'+esc(b.name)+' is in the buyer mix for '+b.roles.map(function(r){return r[0]+' ('+r[1]+')'}).join(', ')+'. Every candidate in a role gets the same mix, so remove the buyer in that role’s Interview setup first.</p>',
        actions:[{label:'Close'},{label:'Open interview setup',primary:true,onClick:function(){location.href='setup.html';}}]});return;}
      UI.confirm('Archive '+b.name+'?','The buyer leaves this list. Past calls keep their record of the buyer version they ran with.','Archive',function(){
        BY.splice(BY.indexOf(b),1);var N=BYC.get('pm-by-new',[]).filter(function(n){return n.id!==b.id});BYC.set('pm-by-new',N);
        byCur=(visible()[0]||BY[0]).id;byRows();bySel(byCur);UI.toast('Archived '+b.name+'.');},true);}});
    UI.menu(btn,items);
  }
  function saveNew(b){if(!b.isNew)return;var N=BYC.get('pm-by-new',[]);N.forEach(function(n){if(n.id===b.id)n.name=b.name;});BYC.set('pm-by-new',N);}

  // initial render with possible ?new=
  var m=location.search.match(/new=([\w-]+)/);
  if(m&&BY.some(function(b){return b.id===m[1]})){byCur=m[1];}
  byRows();bySel(byCur);
  if(/discarded=1/.test(location.search))UI.toast('Discarded draft v3 of Rosa Lin. Req 114 keeps using v2.');
  if(m){var nb=cur();if(nb)UI.toast('Saved '+nb.name+' as a draft. Test it before adding it to a role.');}
})();
