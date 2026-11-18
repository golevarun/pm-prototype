/* settings.html wiring (prefix by-) */
(function(){
  var esc=UI.esc,q=function(s,r){return (r||document).querySelector(s)},qa=function(s,r){return (r||document).querySelectorAll(s)};
  var CK='<svg viewBox="0 0 10 10"><path d="m2.5 5.2 1.7 1.7 3.3-3.4"/></svg>';
  var CHEV='<svg class="i" viewBox="0 0 16 16"><path d="m4.5 6.5 3.5 3.5 3.5-3.5"/></svg>';

  /* ---------- pending changes + save bar ---------- */
  var pending=[];
  var bar=document.createElement('div');bar.className='by-save';bar.hidden=true;
  bar.innerHTML='<span class="by-sdot"></span><span id="bySaveTxt">1 unsaved change</span><button class="btn sm" data-js id="byDiscard">Discard</button><button class="btn sm yellow" data-js id="bySave">Save changes</button>';
  q('.st-wrap').appendChild(bar);
  function change(key,label,revert){
    var ex=pending.filter(function(p){return p.key===key})[0];
    if(ex){ex.label=label;}else pending.push({key:key,label:label,revert:revert});
    drawBar();
  }
  function drop(key){pending=pending.filter(function(p){return p.key!==key});drawBar();}
  function drawBar(){bar.hidden=!pending.length;q('#bySaveTxt').textContent=pending.length+(pending.length===1?' unsaved change':' unsaved changes')+' · '+pending.map(function(p){return p.label}).slice(0,2).join(', ')+(pending.length>2?'…':'');}
  q('#byDiscard').onclick=function(){var n=pending.length;pending.slice().reverse().forEach(function(p){p.revert();});pending=[];drawBar();UI.toast('Discarded '+n+(n===1?' change.':' changes.'));};
  q('#bySave').onclick=function(){var n=pending.length;pending=[];drawBar();UI.toast('Saved '+n+(n===1?' change':' changes')+' to workspace settings. They apply to new candidates from now on.');};
  addEventListener('beforeunload',function(e){if(pending.length){e.preventDefault();e.returnValue='';}});

  function setText(el,t){var done=false;el.childNodes.forEach(function(n){if(!done&&n.nodeType===3&&n.textContent.trim()){n.textContent=t;done=true;}});if(!done)el.insertBefore(document.createTextNode(t),el.querySelector('svg'));}
  function getText(el){var t='';el.childNodes.forEach(function(n){if(!t&&n.nodeType===3&&n.textContent.trim())t=n.textContent.trim();});return t;}
  /* generic picker on a select-like element */
  function picker(el,key,label,opts,extra){
    el.setAttribute('role','button');el.setAttribute('tabindex','0');el.classList.add('by-pick');
    function open(){var cur=getText(el);UI.menu(el,opts.map(function(o){var v=typeof o==='string'?o:o.v;return {label:v,small:o.small||'',check:cur===v,onClick:function(){
      if(o.disabled){UI.toast(o.disabled);return;}if(v===cur)return;var old=cur;setText(el,v);if(extra)extra(v);
      if(v===el._orig){drop(key);}else change(key,label,function(){setText(el,old===el._orig?el._orig:el._orig);if(extra)extra(el._orig);});}};}),{align:'left'});}
    el._orig=getText(el);
    el.addEventListener('click',open);el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  }

  /* ---------- Team ---------- */
  var CAN={'Recruiter':'Roles, candidates, calls and accommodation requests','Hiring manager':'Shortlists and scored calls for their roles','Viewer':'Shortlists and reports, read only','Auditor':'Audit log, consent records and exports, read only'};
  var tbody=q('#team tbody');
  function bindMember(tr){
    var nm=q('.person b',tr).firstChild.textContent.trim(),role=q('.st-role',tr),more=q('.st-more',tr);
    if(role&&!role.classList.contains('lock')){
      var orig=getText(role);role.setAttribute('role','button');role.setAttribute('tabindex','0');role.style.cursor='pointer';
      var pick=function(){var cur=getText(role);UI.menu(role,[{header:'Role for '+nm}].concat(Object.keys(CAN).map(function(r){return {label:r,check:cur===r,onClick:function(){
        if(r===cur)return;setText(role,r);q('.st-can',tr).textContent=CAN[r];
        if(r===orig)drop('role-'+nm);else change('role-'+nm,nm+' is now '+r.toLowerCase(),function(){setText(role,orig);q('.st-can',tr).textContent=CAN[orig]||'';});}};})),{align:'left'});};
      role.addEventListener('click',pick);role.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();pick();}});
    }
    if(more)UI.wire(more,function(){var em=q('.person small',tr).textContent,pend=tr.classList.contains('by-inv');
      UI.menu(more,[{header:nm},
        {label:'Change role',onClick:function(){role.click();}},
        pend?{label:'Resend invite',onClick:function(){UI.toast('Sent the invite to '+em+' again.');}}:{label:'Sign out of all devices',onClick:function(){UI.toast(nm+' is signed out everywhere. Their access stays the same.');}},
        {label:'Copy email',onClick:function(){try{navigator.clipboard.writeText(em);}catch(e){}UI.toast('Copied '+em+'.');}},
        {sep:true},
        {label:pend?'Cancel invite':'Remove from workspace',danger:true,onClick:function(){
          UI.confirm((pend?'Cancel the invite for ':'Remove ')+nm+'?',pend?'The invite link stops working.':nm+' loses access right away. Decisions and notes they made stay in the audit log.',pend?'Cancel invite':'Remove',function(){
            tr.remove();PMStore.update('members',function(M){M=M||{};M.added=(M.added||[]).filter(function(x){return x.n!==nm;});if(!pend){M.removed=(M.removed||[]).filter(function(x){return x!==nm;}).concat([nm]);}return M;},{});var n=qa('#team tbody tr').length;q('#team .ch p').textContent=n+' members. Each role sets what a member can see and change.';UI.toast(pend?'Cancelled the invite for '+nm+'.':'Removed '+nm+' from Northwind Freight. Logged in the audit log.');},true);}}]);});
  }
  qa('tr',tbody).forEach(bindMember);
  var inv=UI.byText('Invite member')[0];inv.removeAttribute('onclick');
  UI.wire(inv,function(){
    UI.modal({title:'Invite a member',body:'<label for="byIvN">Name</label><input id="byIvN" placeholder="For example: Rachel Kim"><label for="byIvE">Work email</label><input id="byIvE" placeholder="name@northwindfreight.com"><label for="byIvR">Role</label><select id="byIvR">'+
      Object.keys(CAN).map(function(r){return '<option>'+r+'</option>'}).join('')+'</select><p class="by-dp" id="byIvC" style="margin-top:6px">'+CAN.Recruiter+'.</p><p class="by-err" id="byIvErr"></p>',
      actions:[{label:'Cancel'},{label:'Send invite',primary:true,onClick:function(m){
        var n=q('#byIvN',m).value.trim(),e=q('#byIvE',m).value.trim(),r=q('#byIvR',m).value;
        if(!n||!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(e)){q('#byIvErr',m).textContent=!n?'Add a name.':'Add a valid work email.';return false;}
        addRow(n,e,r);PMStore.update('members',function(M){M=M||{};M.added=(M.added||[]).filter(function(x){return x.n!==n;}).concat([{n:n,e:e,r:r}]);M.removed=(M.removed||[]).filter(function(x){return x!==n;});return M;},{});
        UI.toast('Sent an invite to '+e+'. They join as '+r.toLowerCase()+'.');}}]});
    var s=q('.ui-md #byIvR');s.onchange=function(){q('.ui-md #byIvC').textContent=CAN[s.value]+'.';};
  });
  /* members added or removed earlier in this demo (PMStore members) */
  function addRow(n,e,r){
        var ini=n.split(/\s+/).map(function(w){return w.charAt(0)}).join('').slice(0,2).toUpperCase();
        tbody.insertAdjacentHTML('beforeend','<tr class="by-inv"><td><div class="person"><span class="pav" style="background:#E8E2D8;color:#493B2C">'+esc(ini)+'</span><div><b>'+esc(n)+'<span class="st-you">Invited</span></b><small>'+esc(e)+'</small></div></div></td><td><span class="st-role">'+r+CHEV+'</span></td><td class="dim st-can">'+CAN[r]+'</td><td class="dim">Invite sent</td><td class="act"><button class="st-more" aria-label="More for '+esc(n)+'"><svg class="i" viewBox="0 0 16 16"><path d="M4 8h.01M8 8h.01M12 8h.01" stroke-width="2.2"/></svg></button></td></tr>');
        bindMember(tbody.lastElementChild);var c=qa('#team tbody tr').length;q('#team .ch p').textContent=c+' members. Each role sets what a member can see and change.';
  }
  (function(){var M=PMStore.members();
    qa('tr',tbody).forEach(function(tr){var b=q('.person b',tr);if(b&&M.removed.indexOf(b.firstChild.textContent.trim())>=0)tr.remove();});
    M.added.forEach(function(x){addRow(x.n,x.e,x.r);});
    q('#team .ch p').textContent=qa('#team tbody tr').length+' members. Each role sets what a member can see and change.';})();

  /* ---------- Integrations ---------- */
  var mans=UI.byText('Manage',q('#integrations'));
  function intDrawer(row,kind){
    var tag=q('.tag',row),stat=q('.st-stat',row),connected=!tag.classList.contains('gray');
    var body=kind==='ats'?
      '<p class="by-dp">Candidates, stages and decisions sync both ways. PM never moves a candidate on its own: stage changes come from a person or an automation you set up.</p>'+
      '<label class="by-row"><span><b>Import new applicants</b><small>From roles linked to PM</small></span><input type="checkbox" checked></label>'+
      '<label class="by-row"><span><b>Send scores back</b><small>Overall range and skill ranges, as a note</small></span><input type="checkbox" checked></label>'+
      '<label class="by-row"><span><b>Send decisions back</b><small>Who decided and when</small></span><input type="checkbox" checked></label>'+
      '<label for="byStage">Stage for finished scored calls</label><select id="byStage"><option>Review</option><option>Phone screen done</option><option>Hiring manager review</option></select>'+
      '<p class="by-dp" style="margin-top:12px" id="bySync">Last sync 9:02 am · 212 candidates in Req 114</p>'
      :'<p class="by-dp">Debriefs and human interviews book on team calendars. PM only reads free and busy times.</p>'+
      '<label class="by-row"><span><b>Dana Whitfield</b><small>dana.whitfield@northwindfreight.com</small></span><input type="checkbox" checked></label>'+
      '<label class="by-row"><span><b>Marcus Lee</b><small>marcus.lee@northwindfreight.com</small></span><input type="checkbox" checked></label>'+
      '<label for="byLen">Human interview length</label><select id="byLen"><option>30 minutes</option><option selected>45 minutes</option><option>60 minutes</option></select>';
    var acts=[{label:connected?'Disconnect':'Reconnect',danger:connected,onClick:function(d){
      if(connected){UI.confirm('Disconnect the '+(kind==='ats'?'applicant tracker':'calendar')+'?',kind==='ats'?'New applicants stop importing and scores stop syncing. Nothing in PM is deleted.':'Debriefs and human interviews stop booking on calendars.','Disconnect',function(){
        tag.className='tag gray';tag.innerHTML='Not connected';var mt=q('.meta',stat);if(mt)mt.textContent='Sync paused';UI.toast((kind==='ats'?'Applicant tracker':'Calendar')+' disconnected.');},true);}
      else{tag.className='tag green';tag.innerHTML='<span class="dot"></span>Connected';var mt2=q('.meta',stat);if(mt2)mt2.textContent='Last sync just now';UI.toast((kind==='ats'?'Applicant tracker':'Calendar')+' connected again.');}}},
      {label:'Close'}];
    if(kind==='ats'&&connected)acts.splice(1,0,{label:'Sync now',onClick:function(d){var s=q('#bySync',d);s.textContent='Syncing…';setTimeout(function(){s.textContent='Last sync just now · 212 candidates in Req 114';var mt=q('.meta',stat);if(mt)mt.textContent='Last sync just now';UI.toast('Synced with the applicant tracker. No changes found.');},700);return false;}});
    acts.push({label:'Save',primary:true,onClick:function(){UI.toast((kind==='ats'?'Applicant tracker':'Calendar')+' settings saved.');}});
    UI.drawer({title:kind==='ats'?'Applicant tracker':'Calendar',width:440,body:body,actions:acts});
  }
  UI.wire(mans[0],function(){intDrawer(mans[0].closest('.st-row'),'ats');});
  UI.wire(mans[1],function(){intDrawer(mans[1].closest('.st-row'),'cal');});

  /* ---------- Notice ---------- */
  var verRow=q('.st-ver .st-kv');if(verRow)verRow.children[1].textContent='Oct 26';
  var doc=q('#notice .doc'),editBtn=UI.byText('Edit text',q('#notice'))[0],paras=qa('p',doc);
  var noticeV2=BYC.get('pm-by-notice',null);
  function showV2(v){var rows=q('.st-ver .st-rows');var old=q('.by-v2',rows);if(old)old.remove();
    rows.insertAdjacentHTML('afterbegin','<div class="st-kv by-v2"><b>v2</b><span class="dim">Nov 17</span><span>Saved by Dana Whitfield · waiting for Jess Park’s approval</span><span class="tag beige">Waiting</span></div>');
    q('#notice h2 .tag').outerHTML='<span class="tag beige">v2 waiting for approval</span>';}
  if(noticeV2){showV2(noticeV2);paras.forEach(function(p,i){if(noticeV2.text.split('\n')[i])p.textContent=noticeV2.text.split('\n')[i];});}
  var editing=false,before=[];
  UI.wire(editBtn,function(){
    if(!editing){editing=true;before=[].map.call(paras,function(p){return p.textContent});paras.forEach(function(p){p.contentEditable='true';});doc.classList.add('by-editing');paras[0].focus();
      editBtn.textContent='Save as v2';editBtn.classList.add('yellow');
      var c=document.createElement('button');c.className='btn sm';c.textContent='Cancel';c.id='byNoticeCancel';editBtn.parentNode.insertBefore(c,editBtn);
      UI.wire(c,function(){paras.forEach(function(p,i){p.textContent=before[i];p.contentEditable='false';});stop();});
      UI.toast('Editing the notice. Saving creates v2, which Legal approves before candidates see it.');return;}
    var txt=[].map.call(paras,function(p){return p.textContent.trim()});
    if(txt.join('\n')===before.join('\n')){paras.forEach(function(p){p.contentEditable='false';});stop();UI.toast('No changes to the notice.');return;}
    if(!/score/i.test(txt.join(' '))||!/person/i.test(txt.join(' '))){UI.modal({title:'Check the notice',body:'<p>The notice should still say what PM scores and that a person makes the decision. Add those back before you save.</p>'});return;}
    paras.forEach(function(p){p.contentEditable='false';});stop();
    noticeV2={text:txt.join('\n'),date:'Nov 17'};BYC.set('pm-by-notice',noticeV2);showV2(noticeV2);
    UI.toast('Saved notice v2. Jess Park gets a request to approve it. Candidates keep seeing v1 until then.');
  });
  function stop(){editing=false;doc.classList.remove('by-editing');editBtn.textContent='Edit text';editBtn.classList.remove('yellow');var c=q('#byNoticeCancel');if(c)c.remove();}
  var np=q('#notice .facts .st-sel');
  picker(np,'notice-period','notice period',[{v:'10 business days',small:'Minimum'},'15 business days','20 business days']);

  /* ---------- Accommodations ---------- */
  qa('#accommodations .ck').forEach(function(ck){
    var box=q('.box',ck),name=ck.textContent.trim();ck.setAttribute('role','checkbox');ck.setAttribute('tabindex','0');ck.style.cursor='pointer';ck.setAttribute('aria-checked','true');
    function set(on){box.classList.toggle('on',on);box.innerHTML=on?CK:'';ck.setAttribute('aria-checked',String(on));}
    function tog(){var on=!box.classList.contains('on');
      var apply=function(){set(on);if(on)drop('acc-'+name);else change('acc-'+name,name.toLowerCase()+' off',function(){set(true);});};
      if(!on&&name==='Human interviewer'){UI.confirm('Turn off human interviewer?','Candidates who can’t take an AI call would have no other option on the notice page. Mia Brandt’s open request stays open.','Turn off',apply,true);return;}
      apply();}
    ck.addEventListener('click',tog);ck.addEventListener('keydown',function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();tog();}});
  });
  var accSel=qa('#accommodations .st-fields .select');
  picker(accSel[0],'acc-to','request owner',[{v:'Dana Whitfield',small:'Recruiter'},{v:'Marcus Lee',small:'Recruiters only',disabled:'Accommodation requests go to recruiters only. Marcus Lee is a hiring manager.'},{v:'Alex Romero',small:'Recruiters only',disabled:'Accommodation requests go to recruiters only.'}]);
  picker(accSel[1],'acc-time','reply time',['Same day','1 working day','2 working days']);

  /* ---------- Retention ---------- */
  var rs=qa('#retention .st-sel');
  picker(rs[0],'ret-rec','recording retention',['6 months','12 months','24 months']);
  picker(rs[1],'ret-tr','transcript retention',['12 months','24 months','36 months']);
  picker(rs[2],'ret-del','deletion window',['Within 7 days','Within 14 days','Within 30 days']);

  /* ---------- Audit and exports ---------- */
  var fmts=qa('#audit .st-fmt .tag');var FM={};
  fmts.forEach(function(t){var f=t.textContent.trim();FM[f]=f==='CSV';t.setAttribute('role','checkbox');t.setAttribute('tabindex','0');t.classList.add('by-fmt');
    function draw(){t.classList.toggle('by-on',FM[f]);t.setAttribute('aria-checked',String(FM[f]));t.innerHTML=(FM[f]?'<svg viewBox="0 0 10 10" class="by-fck"><path d="m2.5 5.2 1.7 1.7 3.3-3.4"/></svg>':'')+f;}
    t.addEventListener('click',function(){FM[f]=!FM[f];draw();});t.addEventListener('keydown',function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();FM[f]=!FM[f];draw();}});draw();});
  var expBtn=UI.byText('Export audit file')[0];expBtn.removeAttribute('onclick');
  UI.wire(expBtn,function(){var sel=Object.keys(FM).filter(function(f){return FM[f]});if(!sel.length){UI.toast('Pick at least one format.');return;}
    var rows=[['role','enrolled','finished','notice_version','draws_logged','advances','declines','accommodations_requested','accommodations_on_time'],['Req 114',212,39,'v1',39,0,0,2,1],['Req 117',96,21,'v1',21,6,0,3,3],['Req 109',44,12,'v1',12,3,0,1,1],['Req 101',58,19,'v1',19,4,2,2,2]];
    sel.forEach(function(f){
      if(f==='CSV')UI.download('pm-workspace-audit-2026-11-17.csv',rows.map(function(r){return r.join(',')}).join('\n'));
      if(f==='JSON')UI.download('pm-workspace-audit-2026-11-17.json',JSON.stringify(rows.slice(1).map(function(r){var o={};rows[0].forEach(function(k,i){o[k]=r[i];});return o;}),null,2),'application/json');
      if(f==='PDF summary')UI.download('pm-workspace-audit-summary-2026-11-17.txt','PM audit summary · Northwind Freight · Nov 17, 2026\n\nRoles: 4 (3 live, 1 closed)\nCandidates enrolled: 410 · finished scored call: 91\nNotice shown and consent recorded before every scored call: 91 of 91\nBuyer and difficulty draws logged: 91 of 91\nDecisions made by a person: 13 of 13\nScored skills: Discovery (40), Handling doubt (35), Getting a next step (25). Voice, accent, face, pauses and personality are not scored.\n\nPM provides this data. An independent auditor does the bias audit.\n','text/plain');});
    var ex=BYC.get('pm-by-exports',[]);ex.unshift(['2026-11-17T10:'+String(20+Math.min(ex.length,39)),'Export','Audit export downloaded','All roles','','Dana Whitfield','Workspace · '+sel.join(', ')]);BYC.set('pm-by-exports',ex);
    setTimeout(function(){UI.toast('Exported '+sel.join(', ')+'. Logged in the audit log.');},50);
  });
  var accessTxt=q('#audit .st-row small');
  UI.wire(UI.byText('Manage access')[0],function(){
    var items=['Audit log','Consent records','Scores by skill','Exports','Call recordings'];var on=[true,true,true,true,false];
    UI.modal({title:'Auditor access · Jess Park',body:'<p>Auditors can read records. They can’t change roles, candidates or decisions.</p>'+items.map(function(t,i){return '<label class="by-row"><span><b>'+t+'</b>'+(i===4?'<small>Off by default. Recordings include candidates’ voices.</small>':'')+'</span><input type="checkbox" data-i="'+i+'"'+(on[i]?' checked':'')+'></label>';}).join('')+
      '<label for="byExpiry">Access ends</label><select id="byExpiry"><option>Never</option><option>Dec 31, 2026</option><option>Mar 31, 2027</option></select>',
      actions:[{label:'Remove auditor access',danger:true,onClick:function(){UI.confirm('Remove Jess Park’s auditor access?','She can no longer open the audit log or exports. Past exports stay logged.','Remove',function(){
          var row=q('#audit .st-row');q('.tag',row).className='tag gray';q('.tag',row).textContent='No access';accessTxt.textContent='No access. Use Manage access to give it back.';UI.toast('Removed Jess Park’s auditor access.');},true);}},
        {label:'Cancel'},{label:'Save',primary:true,onClick:function(m){var sel=[].filter.call(qa('input[data-i]',m),function(c){return c.checked}).map(function(c){return items[+c.getAttribute('data-i')].toLowerCase()});
          var exp=q('#byExpiry',m).value;accessTxt.textContent='Read only: '+(sel.length?sel.join(', '):'nothing')+(exp==='Never'?'':' · ends '+exp);
          var row=q('#audit .st-row');q('.tag',row).className='tag blue';q('.tag',row).textContent='Auditor';UI.toast('Updated Jess Park’s access.');}}]});
  });

  /* ---------- Sending ---------- */
  var sh=q('#sending .ch .r');sh.insertAdjacentHTML('afterbegin','<button class="btn sm" data-js id="bySendEdit">Edit</button>');
  var kvs=qa('#sending .st-kv');
  UI.wire(q('#bySendEdit'),function(b){
    if(b.textContent==='Edit'){[0,1,2].forEach(function(i){var c=kvs[i].children[1],v=c.textContent;c.setAttribute('data-was',v);c.innerHTML='<input class="by-in" value="'+esc(v)+'" aria-label="'+esc(kvs[i].children[0].textContent)+'">';});
      b.textContent='Save';b.classList.add('yellow');kvs[0].querySelector('input').focus();
      var c=document.createElement('button');c.className='btn sm';c.textContent='Cancel';c.id='bySendCancel';b.parentNode.insertBefore(c,b);
      UI.wire(c,function(){[0,1,2].forEach(function(i){var cc=kvs[i].children[1];cc.textContent=cc.getAttribute('data-was');});done();});return;}
    var vals=[0,1,2].map(function(i){return kvs[i].querySelector('input').value.trim()});
    if(!/@northwindfreight\.com$/i.test(vals[1])){UI.toast('The from address has to use the verified domain, northwindfreight.com.');kvs[1].querySelector('input').focus();return;}
    if(!vals[0]||!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(vals[2])){UI.toast('Add a from name and a valid reply-to address.');return;}
    [0,1,2].forEach(function(i){kvs[i].children[1].textContent=vals[i];});done();UI.toast('Saved sending settings. New invites and reminders use them.');
  });
  function done(){var b=q('#bySendEdit');b.textContent='Edit';b.classList.remove('yellow');var c=q('#bySendCancel');if(c)c.remove();}
})();
