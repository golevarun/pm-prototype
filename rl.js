/* Shared helpers for Home, Roles, role overview, role settings, setup, test call and new role.
   State lives in the shared PMStore (store.js). */
(function(){
  var RL=window.RL={};

  /* State lives in PMStore (store.js) under rl.* keys, so every screen agrees across pages and reloads. */
  RL.get=function(k,d){return PMStore.get('rl.'+k,d);};
  RL.set=function(k,v){PMStore.set('rl.'+k,v);};
  RL.esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
  RL.now=function(){var d=new Date(),h=d.getHours(),m=('0'+d.getMinutes()).slice(-2);return ((h%12)||12)+':'+m+' '+(h<12?'am':'pm');};

  /* Roles in the workspace. Numbers match Home and Roles. */
  RL.ROLES={
    '114':{t:'Account Executive, Mid-Market',st:'live',loc:'Chicago or remote (US)',enr:212,fin:39,rec:9,upd:'9:12 am',owner:'Dana Whitfield',hm:'Marcus Lee',slug:'northwind-ae',go:'overview.html'},
    '117':{t:'SDR, Inbound',st:'live',loc:'Chicago',enr:96,fin:21,rec:5,upd:'Yesterday',owner:'Dana Whitfield',hm:'Alex Romero',slug:'northwind-sdr-in'},
    '109':{t:'Account Executive, Enterprise',st:'live',loc:'Remote (US)',enr:44,fin:12,rec:3,upd:'Nov 13',owner:'Dana Whitfield',hm:'Marcus Lee',slug:'northwind-ae-ent'},
    '120':{t:'SDR, Outbound',st:'draft',loc:'Remote (US)',enr:null,fin:null,rec:null,upd:'Nov 16',owner:'Dana Whitfield',hm:'Alex Romero',slug:'northwind-sdr-out'},
    '101':{t:'Sales Manager, Central',st:'closed',loc:'Chicago',enr:58,fin:19,rec:4,upd:'Oct 30',owner:'Dana Whitfield',hm:'Alex Romero',slug:'northwind-sm'}
  };
  RL.roleHref=function(req){return req==='114'?'overview.html':'rl-role.html?req='+req;};

  /* Accommodation requests on Req 114 */
  /* Shape for Home and overview: {dev:{ok,min}|null, mia:{who,when}|null}. Stored as PMStore.acc(). */
  RL.needs=function(){var a=PMStore.acc();
    return {dev:a.dev?{ok:a.dev.state==='approved',min:a.dev.min||'10'}:null,mia:a.mia?{who:a.mia.who,when:a.mia.date+' · '+a.mia.time}:null};};
  RL.openNeeds=function(){return PMStore.openNeeds();};
  function setNeed(k,v){
    if(!v){PMStore.setAcc(k,null);return;}
    if(k==='dev')PMStore.setAcc('dev',v.ok?{state:'approved',min:String(v.min||'10')}:{state:'declined',reason:v.reason||''});
    if(k==='mia'){var p=String(v.when).split(' · ');PMStore.setAcc('mia',{state:'assigned',who:v.who,date:p[0],time:p[1]||''});}
  }
  RL.setNeed=setNeed;
  /* Interviewers: the hiring team plus workspace members added as recruiter or hiring manager */
  RL.interviewers=function(){var m=PMStore.members(),l=['Dana Whitfield','Marcus Lee','Alex Romero'].filter(function(n){return m.removed.indexOf(n)<0;});
    m.added.forEach(function(x){if((x.r==='Recruiter'||x.r==='Hiring manager')&&l.indexOf(x.n)<0)l.push(x.n);});return l;};
  RL.reviewDev=function(done){
    UI.modal({title:'Extra time for Dev Kapoor',body:
      '<p>Dev asked for extra time on his scored call for Account Executive, Mid-Market (Req 114). His scored call opens Nov 30.</p>'+
      '<div style="border:1px solid var(--line);border-radius:var(--r-md);padding:10px 12px;margin:0 0 10px;background:var(--bg)"><div style="font-size:var(--fs-sm);color:var(--mute)">His note · 8:40 am</div>"I process spoken questions more slowly and would like a few extra minutes on the call."</div>'+
      '<label for="rlDevMin">Call length if approved</label><select id="rlDevMin"><option value="10" selected>10 minutes (7 plus 3)</option><option value="12">12 minutes (7 plus 5)</option><option value="14">14 minutes (double time)</option></select>'+
      '<p style="margin-top:10px;color:var(--mute);font-size:var(--fs-sm)">Only recruiters see this request. The hiring team sees the scores, never the accommodation. Scoring uses the same skills and weights as everyone else.</p>',
      actions:[{label:'Cancel'},{label:'Decline',onClick:function(){setNeed('dev',{ok:false,reason:'The call length is the same for everyone in this role.'});UI.toast('Declined. Dev gets an email that his call stays at 7 minutes.');if(done)done();}},
        {label:'Approve',primary:true,onClick:function(md){var m=md.querySelector('#rlDevMin').value;setNeed('dev',{ok:true,min:m});UI.toast('Approved. Dev\'s scored call is now '+m+' minutes. He gets an email.');if(done)done();}}]});
  };
  RL.assignMia=function(done){
    UI.modal({title:'Human interviewer for Mia Brandt',body:
      '<p>Mia asked for a person to run her call in place of the AI buyer. The interviewer plays the same buyer and scores the same three skills.</p>'+
      '<label for="rlMiaWho">Interviewer</label><select id="rlMiaWho">'+RL.interviewers().map(function(n){return '<option>'+RL.esc(n)+'</option>';}).join('')+'</select>'+
      '<label for="rlMiaWhen">Time</label><select id="rlMiaWhen"><option>Fri, Nov 20 · 11:00 am</option><option>Fri, Nov 20 · 2:30 pm</option><option>Mon, Nov 23 · 10:00 am</option></select>'+
      '<p style="margin-top:10px;color:var(--mute);font-size:var(--fs-sm)">Mia gets a calendar invite and the buyer brief. The interviewer gets the script for Jordan Ellis and the scoring guide.</p>',
      actions:[{label:'Cancel'},{label:'Assign',primary:true,onClick:function(md){var w=md.querySelector('#rlMiaWho').value,t=md.querySelector('#rlMiaWhen').value;setNeed('mia',{who:w,when:t});UI.toast('Assigned '+w+'. Mia gets an invite for '+t.replace(' · ',' at ')+'.');if(done)done();}}]});
  };

  /* Invite link and invite modal */
  RL.copyLink=function(slug){
    var url='https://pm.app/i/'+(slug||'northwind-ae');
    function ok(){UI.toast('Copied the invite link: '+url.replace('https://',''));}
    try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(ok,ok);return;}}catch(e){}
    ok();
  };
  /* Invite modal. role: {t, req}. Invites go into the shared store, so Candidates, Overview and Home count them. */
  RL.inviteModal=function(role,done){
    role=role||RL.ROLES['114'];
    var req=role.req||(function(){for(var k in RL.ROLES){if(RL.ROLES[k].t===role.t)return k;}return '114';})();
    var P=PMStore.pool(req);
    var md=UI.modal({title:'Invite candidates',wide:true,body:
      '<p>Invite people to '+RL.esc(role.t)+'. Each one gets the notice first, then practice opens. The scored call opens after 10 business days.</p>'+
      '<label>From the applicant tracker <span style="color:var(--mute)">· at Phone screen, not invited yet</span></label>'+
      '<div id="rlInvList" style="border:1px solid var(--line);border-radius:var(--r-md)">'+
      (P.length?P.map(function(p,i){
        return '<label style="display:flex;align-items:center;gap:8px;margin:0;padding:8px 12px;font-size:var(--fs-md);color:var(--ink);'+(i?'border-top:1px solid var(--line)':'')+'"><input type="checkbox" checked style="width:auto" data-n="'+RL.esc(p[0])+'">'+RL.esc(p[0])+'<span style="margin-left:auto;color:var(--mute);font-size:var(--fs-sm)">'+RL.esc(p[1])+'</span></label>';}).join(''):'<div style="padding:10px 12px;color:var(--mute)">Everyone at Phone screen for this role has been invited.</div>')+
      '</div><label for="rlInvEm">Or add email addresses</label><textarea id="rlInvEm" placeholder="One per line" style="min-height:64px"></textarea>',
      actions:[{label:'Cancel'},{label:'Send invites',primary:true,onClick:function(m){
        var names=[].map.call(m.querySelectorAll('#rlInvList input:checked'),function(i){return i.getAttribute('data-n');});
        var extra=m.querySelector('#rlInvEm').value.split(/[\s,;]+/).filter(function(x){return /@/.test(x);});
        var bad=m.querySelector('#rlInvEm').value.split(/[\s,;]+/).filter(function(x){return x&&!/@/.test(x);});
        if(bad.length){UI.toast('"'+bad[0]+'" is not an email address.');return false;}
        var n=names.length+extra.length;if(!n){UI.toast('Pick at least one person to invite.');return false;}
        PMStore.addInvites(req,names,extra);
        UI.toast('Sent '+n+' invite'+(n>1?'s':'')+' from Dana Whitfield.');if(done)done(n);}}]});
    return md;
  };

  RL.newRoles=function(){return PMStore.newRoles();};
  RL.addRole=function(r){PMStore.addRole(r);};
  RL.roleState=function(req,k,d){var v=PMStore.role(req)[k];return v===undefined?d:v;};
  RL.setRoleState=function(req,k,v){PMStore.setRole(req,k,v);};
  /* Live counts: story numbers plus what changed in this demo */
  RL.isLive=function(req){var r=RL.ROLES[req];if(r&&r.st==='live')return true;return PMStore.isLive(req);};
  RL.enrolled=function(req){var r=RL.ROLES[req];return ((r&&r.enr)||0)+PMStore.invitedCount(req);};
})();
