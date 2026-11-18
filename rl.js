/* Shared helpers for Home, Roles, role overview, role settings, setup, test call and new role.
   State lives in sessionStorage so Home and the role overview agree within one tab. */
(function(){
  var RL=window.RL={};

  /* Buttons inside UI modals, menus and drawers are built by ui.js without data-js.
     Mark them before proto.js sees the click so it doesn't show its "not built" note over our toast. */
  document.addEventListener('click',function(e){
    var el=e.target.closest&&e.target.closest('a,button');
    if(el&&el.closest('.ui-ov,.ui-pop,.ui-dr-ov'))el.setAttribute('data-js','');
  },true);

  var KEY='rl-state';
  function all(){try{return JSON.parse(sessionStorage.getItem(KEY))||{};}catch(e){return {};}}
  RL.get=function(k,d){var v=all()[k];return v===undefined?d:v;};
  RL.set=function(k,v){var s=all();s[k]=v;try{sessionStorage.setItem(KEY,JSON.stringify(s));}catch(e){}};
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
  RL.needs=function(){return RL.get('needs',{dev:null,mia:null});};
  RL.openNeeds=function(){var n=RL.needs(),c=0;if(!n.dev)c++;if(!n.mia)c++;return c;};
  function setNeed(k,v){var n=RL.needs();n[k]=v;RL.set('needs',n);}

  RL.reviewDev=function(done){
    UI.modal({title:'Extra time for Dev Kapoor',body:
      '<p>Dev asked for extra time on his scored call for Account Executive, Mid-Market (Req 114). His scored call opens Nov 30.</p>'+
      '<div style="border:1px solid rgba(28,28,24,.08);border-radius:8px;padding:10px 12px;margin:0 0 10px;background:#FAFAF9"><div style="font-size:12px;color:#68685D">His note · 8:40 am</div>"I process spoken questions more slowly and would like a few extra minutes on the call."</div>'+
      '<label for="rlDevMin">Call length if approved</label><select id="rlDevMin"><option value="10" selected>10 minutes (7 plus 3)</option><option value="12">12 minutes (7 plus 5)</option><option value="14">14 minutes (double time)</option></select>'+
      '<p style="margin-top:10px;color:#68685D;font-size:12px">Only recruiters see this request. The hiring team sees the scores, never the accommodation. Scoring uses the same skills and weights as everyone else.</p>',
      actions:[{label:'Cancel'},{label:'Decline',onClick:function(){setNeed('dev',{ok:false});UI.toast('Declined. Dev gets an email that his call stays at 7 minutes.');if(done)done();}},
        {label:'Approve',primary:true,onClick:function(md){var m=md.querySelector('#rlDevMin').value;setNeed('dev',{ok:true,min:m});UI.toast('Approved. Dev\'s scored call is now '+m+' minutes. He gets an email.');if(done)done();}}]});
  };
  RL.assignMia=function(done){
    UI.modal({title:'Human interviewer for Mia Brandt',body:
      '<p>Mia asked for a person to run her call in place of the AI buyer. The interviewer plays the same buyer and scores the same three skills.</p>'+
      '<label for="rlMiaWho">Interviewer</label><select id="rlMiaWho"><option>Dana Whitfield</option><option>Marcus Lee</option><option>Alex Romero</option></select>'+
      '<label for="rlMiaWhen">Time</label><select id="rlMiaWhen"><option>Fri, Nov 20 · 11:00 am</option><option>Fri, Nov 20 · 2:30 pm</option><option>Mon, Nov 23 · 10:00 am</option></select>'+
      '<p style="margin-top:10px;color:#68685D;font-size:12px">Mia gets a calendar invite and the buyer brief. The interviewer gets the script for Jordan Ellis and the scoring guide.</p>',
      actions:[{label:'Cancel'},{label:'Assign',primary:true,onClick:function(md){var w=md.querySelector('#rlMiaWho').value,t=md.querySelector('#rlMiaWhen').value;setNeed('mia',{who:w,when:t});UI.toast('Assigned '+w+'. Mia gets an invite for '+t.replace(' · ',' at ')+'.');if(done)done();}}]});
  };

  /* Invite link and invite modal */
  RL.copyLink=function(slug){
    var url='https://pm.app/i/'+(slug||'northwind-ae');
    function ok(){UI.toast('Copied the invite link: '+url.replace('https://',''));}
    try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(ok,ok);return;}}catch(e){}
    ok();
  };
  RL.inviteModal=function(role,done){
    role=role||RL.ROLES['114'];
    var md=UI.modal({title:'Invite candidates',wide:true,body:
      '<p>Invite people to '+RL.esc(role.t)+'. Each one gets the notice first, then practice opens. The scored call opens after 10 business days.</p>'+
      '<label>From the applicant tracker <span style="color:#68685D">· at Phone screen, not invited yet</span></label>'+
      '<div id="rlInvList" style="border:1px solid rgba(28,28,24,.08);border-radius:8px">'+
      [['Lena Ortiz','lena.ortiz@gmail.com'],['Marco Silva','marco.silva@outlook.com'],['Hannah Cole','hcole@proton.me']].map(function(p,i){
        return '<label style="display:flex;align-items:center;gap:8px;margin:0;padding:8px 12px;font-size:13px;color:#1C1C18;'+(i?'border-top:1px solid rgba(28,28,24,.08)':'')+'"><input type="checkbox" checked style="width:auto" data-n="'+p[0]+'">'+p[0]+'<span style="margin-left:auto;color:#68685D;font-size:12px">'+p[1]+'</span></label>';}).join('')+
      '</div><label for="rlInvEm">Or add email addresses</label><textarea id="rlInvEm" placeholder="One per line" style="min-height:64px"></textarea>',
      actions:[{label:'Cancel'},{label:'Send invites',primary:true,onClick:function(m){
        var n=m.querySelectorAll('#rlInvList input:checked').length;
        var extra=m.querySelector('#rlInvEm').value.split(/[\s,;]+/).filter(function(x){return /@/.test(x);});
        var bad=m.querySelector('#rlInvEm').value.split(/[\s,;]+/).filter(function(x){return x&&!/@/.test(x);});
        if(bad.length){UI.toast('"'+bad[0]+'" is not an email address.');return false;}
        n+=extra.length;if(!n){UI.toast('Pick at least one person to invite.');return false;}
        UI.toast('Sent '+n+' invite'+(n>1?'s':'')+' from Dana Whitfield.');if(done)done(n);}}]});
    return md;
  };

  /* Roles created on the New role screen this session */
  RL.newRoles=function(){return RL.get('newRoles',[]);};
  RL.addRole=function(r){var l=RL.newRoles().filter(function(x){return x.req!==r.req;});l.push(r);RL.set('newRoles',l);};
  RL.roleState=function(req,k,d){var s=RL.get('role-'+req,{});return s[k]===undefined?d:s[k];};
  RL.setRoleState=function(req,k,v){var s=RL.get('role-'+req,{});s[k]=v;RL.set('role-'+req,s);};
})();
