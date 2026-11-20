/* Generic role overview: rl-role.html?req=117 | 109 | 120 | 101. Req 114 has its own screen (overview.html). */
(function(){
  var req=(location.search.match(/req=([^&]+)/)||[])[1]||'117';
  if(req==='114'){location.replace('overview.html'+location.hash);return;}
  var E=RL.esc,$=function(id){return document.getElementById(id);};
  var OK='<span class="ok"><svg viewBox="0 0 10 10"><path d="M2 5.2 4 7.2 8 3"/></svg></span>',TODO='<span class="todo"></span>';
  var ARROW='<svg class="i" viewBox="0 0 16 16"><path d="m6 4 4 4-4 4"/></svg>';

  var D={
    '117':{t:'SDR, Inbound',st:'live',loc:'Chicago',pub:'Oct 13',hm:'Alex Romero',hmIni:'AR',hmRole:'Head of sales',
      enr:96,prac:48,notice:9,fin:21,rec:5,adv:0,invited:30,stopped:14,withdrew:22,today:1,
      weeks:[['Oct 12',0],['Oct 19',0],['Oct 26',6],['Nov 2',7],['Nov 9',6],['Nov 16',2]],
      next:'Review 21 finished calls',
      buyers:[['NP','Nina Park','Operations coordinator · 30 vans · filled in a demo form'],['CH','Carl Hayes','Owner · 12 vans · curious, short on time'],['MD','Megan Doyle','Dispatch lead · 80 vans · downloaded a pricing guide']],
      skills:[['Qualifying the lead',40],['Handling doubt',30],['Booking the meeting',30]],len:'5 minutes',diff:'Easy',auto:'Invite after application review'},
    '109':{t:'Account Executive, Enterprise',st:'live',loc:'Remote (US)',pub:'Oct 20',hm:'Marcus Lee',hmIni:'ML',hmRole:'Hiring manager',
      enr:44,prac:25,notice:6,fin:12,rec:3,adv:1,invited:11,stopped:7,withdrew:8,today:0,
      weeks:[['Oct 19',0],['Oct 26',0],['Nov 2',4],['Nov 9',6],['Nov 16',2]],
      next:'Invite the next batch from the applicant tracker',
      buyers:[['DF','Diane Foster','VP of logistics · 1,200 vans · runs a formal buying process'],['RM','Raj Mehta','IT director · security review first'],['GC','Gloria Chen','CFO · wants a multi-year number']],
      skills:[['Discovery',35],['Handling doubt',35],['Bringing in other buyers',30]],len:'10 minutes',diff:'Hard',auto:'Invite after phone screen'},
    '120':{t:'SDR, Outbound',st:'draft',loc:'Remote (US)',pub:null,hm:'Alex Romero',hmIni:'AR',hmRole:'Head of sales',
      next:'Finish interview setup and publish',
      buyers:[['SK','Sean Kelly','Fleet manager · 60 vans · did not ask for the call'],['AW','Ana Wright','Operations director · 150 vans · happy with her current tool']],
      skills:[['Opening a cold call',40],['Handling doubt',35],['Booking the meeting',25]],len:'5 minutes',diff:'Medium',auto:'Not set up'},
    '101':{t:'Sales Manager, Central',st:'closed',loc:'Chicago',pub:'Sep 8',closed:'Oct 30',hm:'Alex Romero',hmIni:'AR',hmRole:'Head of sales',
      enr:58,prac:31,notice:0,fin:19,rec:4,adv:4,hired:2,invited:0,stopped:21,withdrew:18,today:0,
      weeks:[['Sep 21',3],['Sep 28',6],['Oct 5',5],['Oct 12',3],['Oct 19',2],['Oct 26',0]],
      next:'Export the audit log for the annual bias audit',
      buyers:[['WB','Will Burke','Regional ops VP · 500 vans · managing a team that missed target'],['JT','Joy Tran','Sales rep on your team · behind on quota']],
      skills:[['Coaching a rep',40],['Pipeline review',35],['Handling doubt',25]],len:'10 minutes',diff:'Medium',auto:'Turned off when the role closed'}
  };
  var R=D[req];
  if(!R){var nr=RL.newRoles().filter(function(x){return x.req===req;})[0];
    if(nr){R={t:nr.t,st:'draft',loc:nr.loc||'',pub:null,hm:nr.hm||'Not set',hmIni:(nr.hm||'?').split(' ').map(function(w){return w[0]}).join(''),hmRole:'Hiring manager',next:'Finish interview setup and publish',buyers:[],skills:[],len:'7 minutes',diff:'Medium',auto:'Not set up'};}
    else{req='117';R=D['117'];}}
  /* published from interview setup in this demo */
  if(R.st==='draft'&&PMStore.isLive(req)){R=Object.assign({},R,{st:'live',pub:'Nov 17',enr:0,prac:0,notice:0,fin:0,rec:0,adv:0,invited:0,stopped:0,withdrew:0,today:0,weeks:[['Nov 16',0]],next:'Invite candidates from the applicant tracker',auto:req==='120'?'Invite SDR Outbound applicants':'Invite after phone screen'});}
  /* invites sent from PM in this demo */
  if(R.st==='live'){var nInv=PMStore.invitedCount(req);R.enr=(R.enr||0)+nInv;R.invited=(R.invited||0)+nInv;}
  if(R.st==='live'&&RL.roleState(req,'paused'))R.paused=true;

  /* Finished candidates. Ranges are ranked by midpoint; the first R.rec are recommended. */
  var NAMES=['Jalen Brooks','Maya Chen','Omar Haddad','Sofia Marino','Grace Kim','Luca Bianchi','Aisha Bello','Ethan Ward','Zoe Turner','Noah Patel','Ivy Collins','Diego Alvarez','Hana Sato','Ryan Price','Leah Stone','Mateo Cruz','Elena Popov','Sean Murphy','Tara Singh','Owen Fisher','Chloe Martin'];
  var cands=[];
  (function(){var n=R.fin||0;
    for(var i=0;i<n;i++){var mid=i<R.rec?7.5-i*0.35:6.0-(i-R.rec)*0.12;var lo=Math.round((mid-0.6)*2)/2,hi=Math.round((mid+0.6)*2)/2;if(hi-lo<1)hi=lo+1;
      var day=req==='101'?['Sep 23','Sep 29','Oct 2','Oct 7','Oct 14','Oct 20'][i%6]:['Nov 16','Nov 13','Nov 12','Nov 10','Nov 6','Nov 4'][i%6];
      var dec=null;
      if(req==='101'){dec=i<2?'Hired':i<R.rec?'Final round, not hired':'Declined';}
      if(req==='109'&&i===0)dec='Advanced';
      var saved=RL.roleState(req,'dec-'+i);if(saved)dec=saved;
      cands.push({i:i,name:NAMES[i%NAMES.length],ini:NAMES[i%NAMES.length].split(' ').map(function(w){return w[0]}).join(''),range:lo.toFixed(1)+'–'+hi.toFixed(1),rec:i<R.rec,day:day,dec:dec});}
  })();
  function advanced(){return cands.filter(function(c){return c.dec==='Advanced'||c.dec==='Hired'||c.dec==='Final round, not hired';}).length;}
  function undecided(){return cands.filter(function(c){return !c.dec;}).length;}

  function statusTag(){
    if(R.st==='live')return R.paused?'<span class="tag rl-paused">Invites paused</span>':'<span class="tag green"><span class="dot" style="margin-right:2px"></span>Live</span>';
    if(R.st==='draft')return '<span class="tag beige">Draft</span>';
    return '<span class="tag gray">Closed '+R.closed+'</span>';
  }
  function header(){
    document.title=R.t+' · PM';
    $('rlCrumb').textContent=/^\d+$/.test(req)?'Req '+req:'New role';$('rlTitle').textContent=R.t;$('rlTag').innerHTML=statusTag();
    var a='';
    if(R.st==='live')a='<span class="meta">Published '+R.pub+' · '+E(R.loc)+'</span><button class="btn" data-js id="rlCopy"><svg class="i" viewBox="0 0 16 16"><path d="M7 9a2.5 2.5 0 0 0 3.5 0l2-2a2.5 2.5 0 0 0-3.5-3.5l-.6.6M9 7a2.5 2.5 0 0 0-3.5 0l-2 2A2.5 2.5 0 0 0 7 12.5l.6-.6"/></svg>Copy invite link</button><button class="btn yellow" data-js id="rlInvite">Invite candidates</button>';
    if(R.st==='draft')a='<span class="meta">Set up by Dana Whitfield · not published</span><button class="btn" data-go="setup.html?req='+encodeURIComponent(req)+'">Open interview setup</button><button class="btn yellow" data-js id="rlPublish">Publish role</button>';
    if(R.st==='closed')a='<span class="meta">Published '+R.pub+' · closed '+R.closed+' · '+R.hired+' hired</span><button class="btn" data-js id="rlAudit"><svg class="i" viewBox="0 0 16 16"><path d="M8 2.5v8M5 7.5l3 3 3-3M3 12.5h10"/></svg>Export audit log</button>';
    $('rlActs').innerHTML=a;
    if($('rlCopy'))$('rlCopy').onclick=function(){RL.copyLink(RL.ROLES[req]&&RL.ROLES[req].slug);};
    if($('rlInvite'))$('rlInvite').onclick=invite;
    if($('rlPublish'))$('rlPublish').onclick=publish;
    if($('rlAudit'))$('rlAudit').onclick=audit;
  }
  function invite(){if(R.paused){UI.toast('Invites are paused for this role. Resume them in Settings first.');return;}
    RL.inviteModal({t:R.t,req:req},function(n){R.enr+=n;R.invited+=n;render();});}
  function publish(){
    var left=R.buyers.length?'<li>'+R.buyers.length+' buyers drafted, none tested yet</li>':'<li>No buyers drafted yet</li>';
    UI.modal({title:'Finish setup before you publish',body:'<p>'+E(R.t)+' isn\'t ready for candidates yet. These sections still need you:</p><ul style="margin:0 0 10px;padding-left:18px">'+left+'<li>Call settings: pick the call length and accommodations</li><li>Candidate notice: send to Legal for review</li></ul><p style="color:var(--mute);font-size:var(--fs-sm)">Nothing goes to candidates until you publish. Every candidate then gets the same buyer mix and difficulty.</p>',
      actions:[{label:'Cancel'},{label:'Open interview setup',primary:true,onClick:function(){location.href='setup.html?req='+encodeURIComponent(req);}}]});
  }
  function audit(){
    var rows=['candidate_id,role,req,notice_version,consent_logged,buyer,difficulty,call_length,skills_scored,overall_range,decision,decided_by'];
    cands.forEach(function(c){rows.push(['C-'+req+'-'+('00'+(c.i+1)).slice(-3),'"'+R.t+'"',req,'Workspace notice v1','yes',R.buyers[c.i%R.buyers.length][1],R.diff.toLowerCase(),R.len,'"'+R.skills.map(function(s){return s[0]}).join('; ')+'"',c.range,c.dec||'',c.dec?'Alex Romero':''].join(','));});
    UI.download('audit-log-req-'+req+'.csv',rows.join('\n'));
  }

  function card(id,title,right,body){return '<section class="card" aria-labelledby="'+id+'"><div class="ch"><h2 id="'+id+'">'+title+'</h2>'+(right?'<div class="r">'+right+'</div>':'')+'</div>'+body+'</section>';}
  function pct(a,b){return b?Math.round(a/b*1000)/10:0;}

  function overview(){
    if(R.st==='draft')return draftOverview();
    var adv=advanced(),h='';
    var fs=[['Enrolled',R.enr,100,'100%'],['Started practice',R.prac,pct(R.prac,R.enr),Math.round(pct(R.prac,R.enr))+'% of enrolled'],
      ['Finished',R.fin,pct(R.fin,R.enr),Math.round(pct(R.fin,R.enr))+'% of enrolled'],['Recommended',R.rec,pct(R.rec,R.enr),R.rec+' of '+R.fin+' finished'],
      [R.st==='closed'?'Advanced':'Advanced',adv,pct(adv,R.enr),R.st==='closed'?R.hired+' hired':(undecided()+' not decided yet')]];
    if(R.st==='live')fs.splice(2,0,['In notice period',R.notice,pct(R.notice,R.enr),'Scored call not open yet']);
    var rest=R.enr-R.fin-R.notice;
    h+=card('rl-fn','Candidates <span class="ov-chsub" style="margin-left:6px;font-weight:var(--fw-regular)">Counts since '+R.pub+'</span>','<button class="btn sm" data-js data-p="candidates">Open candidates</button>',
      '<div class="ov-funnel'+(fs.length===5?' rl-f5':'')+'">'+fs.map(function(f){return '<div class="ov-fs"><small>'+f[0]+'</small><b>'+f[1]+'</b><div class="ov-bar"><i style="width:'+f[2]+'%"></i></div><span class="meta">'+f[3]+'</span></div>';}).join('')+'</div>'+
      '<div class="ov-fnote">'+(R.st==='closed'?'The other '+rest+' enrolled: '+R.stopped+' had open invites stopped when the role closed, '+R.withdrew+' withdrew.':'The other '+rest+' enrolled: '+R.invited+' invited, '+R.stopped+' with reminders stopped, '+R.withdrew+' withdrew.')+'</div>');
    var max=Math.max.apply(null,R.weeks.map(function(w){return w[1]}))||1;
    var chart='<div class="cb"><div class="ov-chart" role="img" aria-label="Scored calls finished by week"><div class="ov-plot" style="grid-template-columns:repeat('+R.weeks.length+',1fr)">'+
      R.weeks.map(function(w,i){var now=R.st==='live'&&i===R.weeks.length-1;return '<div class="ov-wk'+(now?' ov-now':'')+'"><span class="ov-v">'+w[1]+'</span><i style="height:'+(w[1]/max*100)+'%;width:40px"></i></div>';}).join('')+
      '</div><div class="ov-xl" style="grid-template-columns:repeat('+R.weeks.length+',1fr)">'+R.weeks.map(function(w,i){return '<span>'+w[0]+(R.st==='live'&&i===R.weeks.length-1?'<em> · to date</em>':'')+'</span>';}).join('')+'</div></div></div>';
    var left=card('rl-wk','Scored calls finished by week','<span class="meta">'+R.fin+' total</span>',chart);
    var nx=R.st==='closed'?'<div class="ov-li"><div class="ov-who"><b>'+E(R.next)+'</b><small>NYC Local Law 144 asks for an annual independent audit. The export has every candidate\'s notice, consent, buyer, difficulty and decision.</small></div><button class="btn sm" data-js data-a="audit">Export audit log</button></div>':
      req==='109'?'<div class="ov-li"><div class="ov-who"><b>'+E(R.next)+'</b><small>3 candidates reached Phone screen and haven\'t been invited</small></div><button class="btn sm" data-js data-a="invite">Invite candidates</button></div>':
      '<div class="ov-li"><div class="ov-who"><b>'+(undecided()?'Review '+undecided()+' finished call'+(undecided()>1?'s':''):'Every finished call has a decision')+'</b><small>'+R.rec+' recommended · a person records every decision</small></div><button class="btn sm" data-js data-p="candidates">Open candidates</button></div>';
    left+=card('rl-nx','Next action','','<div class="ov-list">'+nx+'</div>');
    left+=interviewCard(true);
    var right=card('rl-au','Automation','','<div class="cb"><div class="ov-auto"><svg class="i" viewBox="0 0 16 16"><path d="M9 2 4 9h4l-1 5 5-7H8z"/></svg><div class="ov-who"><b>'+E(R.auto)+'</b><small>'+(R.st==='closed'?'Stopped Oct 30':R.paused?'Paused by you':R.invited+' invited · '+R.stopped+' reminders stopped')+'</small></div>'+(R.st==='closed'?'<span class="tag gray">Off</span>':R.paused?'<span class="tag rl-paused">Paused</span>':'<span class="tag green">Active</span>')+'</div><a class="ov-link" href="automations.html">Open automations'+ARROW+'</a></div>');
    right+=card('rl-fa','Fairness','','<div class="cb"><div class="ov-check">'+OK+'<p>All '+R.fin+' finished calls used the same buyer mix and '+R.diff.toLowerCase()+' difficulty. The draw ran in code and is logged.</p></div><div class="ov-check">'+OK+'<p>Every candidate read the notice and agreed before the scored call. Consent is logged with the notice version.</p></div><a class="ov-link" href="fairness.html">Open fairness checks'+ARROW+'</a></div>');
    right+=teamCard();
    return '<div style="display:flex;flex-direction:column;gap:12px">'+h+'<div class="ov-cols"><div class="ov-col">'+left+'</div><div class="ov-col">'+right+'</div></div></div>';
  }
  function draftOverview(){
    var steps=[[1,'Job','Synced from the applicant tracker'],[1,'Product and buyer','Notes saved Nov 16'],[0,'Buyers',R.buyers.length?R.buyers.length+' drafted, none tested':'None drafted'],[1,'Skills and weights',R.skills.length?R.skills.map(function(s){return s[0]+' '+s[1]+'%'}).join(' · '):'Workspace defaults'],[0,'Call settings','Pick the call length and accommodations'],[0,'Candidate notice','Needs review by Legal']];
    if(!R.buyers.length)steps[1]=[0,'Product and buyer','Add what the role sells and who buys it'];
    var done=steps.filter(function(s){return s[0]}).length;
    var left=card('rl-st','Setup','<span class="meta">'+done+' of 6 sections done</span>','<div class="cb rl-steps">'+steps.map(function(s){return '<div class="ov-check">'+(s[0]?OK:TODO)+'<p><b>'+s[1]+'</b> · '+E(s[2])+'</p></div>';}).join('')+'<a class="ov-link" href="setup.html?req='+encodeURIComponent(req)+'">Open interview setup'+ARROW+'</a></div>');
    left+=interviewCard(true);
    var right=card('rl-pb','Before you publish','','<div class="cb"><div class="ov-check">'+TODO+'<p>Take a test call with each buyer.</p></div><div class="ov-check">'+TODO+'<p>Send the candidate notice to Jess Park (Legal).</p></div><div class="ov-check"><span class="ov-info"><svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5"/><path d="M8 7.2v3.3M8 5.3v.1"/></svg></span><p>Nothing goes to candidates until you publish.</p></div></div>');
    right+=teamCard();
    return '<div class="ov-cols"><div class="ov-col">'+left+'</div><div class="ov-col">'+right+'</div></div>';
  }
  function interviewCard(short){
    var body='<div class="ov-rows"><div class="ov-row"><small>Buyers</small><div class="ov-buyers">'+(R.buyers.length?R.buyers.map(function(b,i){return '<span class="ov-by"><span class="av a'+(i%3+1)+'">'+b[0]+'</span><span><b>'+E(b[1])+'</b><em>'+E(b[2])+'</em></span></span>';}).join(''):'<span class="dim">No buyers yet</span>')+'</div></div>'+
      '<div class="ov-row"><small>Skills and weights</small><div class="ov-skills">'+(R.skills.length?R.skills.map(function(s){return '<div class="ov-sk"><span>'+E(s[0])+'</span><div class="ov-bar"><i style="width:'+s[1]+'%"></i></div><span class="mono">'+s[1]+'%</span></div>';}).join(''):'<span class="dim">Not set</span>')+'</div></div>'+
      '<div class="ov-row"><small>Scored call</small><span>'+R.len+' · '+R.diff.toLowerCase()+' difficulty</span></div>'+
      (short?'':'<div class="ov-row"><small>Practice</small><span>Unlimited. Never scored or shared with the team.</span></div><div class="ov-row"><small>Notice period</small><span>10 business days before the scored call opens</span></div><div class="ov-row"><small>Recordings</small><span>Kept 12 months</span></div><div class="ov-row"><small>Not scored</small><span>Voice, accent, face, pauses and personality. Only the skills above are scored.</span></div>')+'</div>';
    var right=short?'<button class="btn sm" data-js data-p="interview">View interview</button>':(R.st==='draft'?'<a class="btn sm" href="setup.html?req='+encodeURIComponent(req)+'">Open interview setup</a>':'<span class="meta">'+(R.st==='closed'?'Locked when the role closed':'Changes apply to candidates invited after you save')+'</span>');
    return card(short?'rl-iv':'rl-iv2','Interview',right,body);
  }
  function teamCard(){
    return card('rl-tm','Team','','<div class="ov-list"><div class="ov-li"><span class="avatar">DW</span><div class="ov-who"><b>Dana Whitfield <span class="dim">(you)</span></b><small>Recruiter · editor</small></div></div><div class="ov-li"><span class="avatar ov-ml">'+E(R.hmIni)+'</span><div class="ov-who"><b>'+E(R.hm)+'</b><small>'+E(R.hmRole)+' · reviewer</small></div></div></div>');
  }

  /* Candidates tab */
  var CF='all',page=0,PER=8;
  function candidates(){
    if(R.st==='draft')return card('rl-c0','Candidates','','<div class="cb"><p class="help" style="margin:0">No candidates yet. Candidates are invited after you publish.</p></div>');
    var l=cands.filter(function(c){return CF==='all'||(CF==='rec'&&c.rec)||(CF==='open'&&!c.dec);});
    var pages=Math.max(1,Math.ceil(l.length/PER));if(page>=pages)page=pages-1;
    var sl=l.slice(page*PER,page*PER+PER);
    var chips='<div class="rl-chips">'+[['all','All finished',cands.length],['rec','Recommended',R.rec],['open','No decision',undecided()]].map(function(c){return '<button class="rl-chip'+(CF===c[0]?' on':'')+'" data-js data-cf="'+c[0]+'">'+c[1]+' · '+c[2]+'</button>';}).join('')+'<button class="btn sm" data-js data-a="csv" style="margin-left:8px"><svg class="i" viewBox="0 0 16 16" style="width:14px;height:14px"><path d="M8 2.5v8M5 7.5l3 3 3-3M3 12.5h10"/></svg>Export CSV</button></div>';
    var rows=sl.map(function(c){return '<tr><td><div class="rl-person"><span class="pav">'+c.ini+'</span><div><b>'+c.name+'</b><small>Scored call '+c.day+' · '+E(R.buyers[c.i%R.buyers.length][1])+'</small></div></div></td><td class="n">'+(c.i+1)+'</td><td class="mono">'+c.range+'</td><td>'+(c.rec?'<span class="tag green">Recommended</span>':'<span class="tag gray">Not recommended</span>')+'</td><td>'+(c.dec?'<span class="rl-dec">'+c.dec+'</span>':'<span class="dim">Not decided</span>')+'</td><td>'+(R.st==='closed'?'<span class="dim">Role closed</span>':'<button class="btn sm'+(c.dec?' ghost':'')+'" data-js data-dec="'+c.i+'">'+(c.dec?'Change':'Record decision')+'</button>')+'</td></tr>';}).join('')||'<tr><td colspan="6" class="dim" style="text-align:center">No candidates match.</td></tr>';
    return '<section class="card"><div class="ch"><h2>Finished candidates <span class="tag gray">'+cands.length+'</span></h2><div class="r">'+chips+'</div></div>'+
      '<div class="rl-ctbl"><table><thead><tr><th>Candidate</th><th class="n">Rank</th><th>Overall range</th><th>Shortlist</th><th>Decision</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
      '<div class="rl-pager"><span class="meta">Ranked by the weighted midpoint of each range. A person makes every decision.</span><span class="meta" style="margin-right:0">'+(l.length?(page*PER+1)+'–'+Math.min(l.length,page*PER+PER):'0')+' of '+l.length+'</span><button class="rl-pg" data-js data-pg="-1" aria-label="Previous page"'+(page===0?' disabled':'')+'><svg class="i" viewBox="0 0 16 16" style="width:14px;height:14px"><path d="m10 4-4 4 4 4"/></svg></button><button class="rl-pg" data-js data-pg="1" aria-label="Next page"'+(page>=pages-1?' disabled':'')+'><svg class="i" viewBox="0 0 16 16" style="width:14px;height:14px"><path d="m6 4 4 4-4 4"/></svg></button></div></section>';
  }
  function decide(i){var c=cands[i];
    UI.modal({title:'Decision for '+c.name,body:'<p>'+c.name+' finished the scored call on '+c.day+'. Overall range '+c.range+(c.rec?', recommended.':', not recommended.')+'</p><label for="rlDec">Decision</label><select id="rlDec"><option>Advanced</option><option>Declined</option></select><p style="margin-top:10px;color:var(--mute);font-size:var(--fs-sm)">The decision email goes out from Dana Whitfield after you save. The stage changes in the applicant tracker right away.</p>',
      actions:[{label:'Cancel'}].concat(c.dec?[{label:'Clear decision',onClick:function(){c.dec=null;RL.setRoleState(req,'dec-'+i,null);render();UI.toast('Cleared the decision for '+c.name+'.');}}]:[]).concat([{label:'Save decision',primary:true,onClick:function(md){var v=md.querySelector('#rlDec').value;c.dec=v;RL.setRoleState(req,'dec-'+i,v);render();UI.toast((v==='Advanced'?'Advanced ':'Declined ')+c.name+'. The email goes out from Dana.');}}])});
  }
  function csv(){var rows=['rank,candidate,scored_call,overall_range,recommended,decision'];cands.forEach(function(c){rows.push([c.i+1,c.name,c.day,c.range,c.rec?'yes':'no',c.dec||''].join(','));});UI.download('candidates-req-'+req+'.csv',rows.join('\n'));}

  /* Settings tab */
  function settings(){
    var kv='<div class="rl-kv"><div><small>Title</small>'+E(R.t)+'</div><div><small>Req</small>'+(/^\d+$/.test(req)?req:'Not linked')+'</div><div><small>Location</small>'+E(R.loc||'Not set')+'</div><div><small>Hiring manager</small>'+E(R.hm)+'</div><div><small>Recruiter</small>Dana Whitfield</div><div><small>'+(R.st==='draft'?'Created':'Published')+'</small>'+(R.pub?R.pub+', 2026':'Nov 16, 2026')+'</div></div>';
    var h=card('rl-sd','Role details','<span class="sync"><span class="dot"></span>Synced 9:02 am</span>','<div class="cb">'+kv+'<p class="help">Synced from the applicant tracker. Change these there.</p></div>');
    var act='';
    if(R.st==='live')act=card('rl-si','Invites',R.paused?'<button class="btn sm" data-js data-a="resume">Resume invites</button>':'<button class="btn sm" data-js data-a="pause">Pause invites</button>','<div class="cb"><p class="help" style="margin:0">'+(R.paused?'Invites are paused. Candidates already invited keep their links and can still take the scored call.':'Pausing stops new invites. Candidates already invited keep their links.')+'</p></div>');
    if(R.st==='closed')act=card('rl-sa','Audit record','<button class="btn sm" data-js data-a="audit">Export audit log</button>','<div class="cb"><p class="help" style="margin:0">Recordings and the audit log are kept 12 months after the role closed, until Oct 30, 2027.</p></div>');
    if(R.st==='draft')act=card('rl-sx','Delete draft','<button class="btn sm" data-js data-a="delete" style="color:var(--danger)">Delete draft</button>','<div class="cb"><p class="help" style="margin:0">Nothing has gone to candidates. The req stays open in the applicant tracker.</p></div>');
    return h+teamCard()+act;
  }

  var P='overview';
  function render(){
    header();
    $('rl-overview').innerHTML=overview();
    $('rl-interview').innerHTML=interviewCard(false);
    $('rl-candidates').innerHTML=candidates();
    $('rl-settings').innerHTML=settings();
    ['overview','interview','candidates','settings'].forEach(function(k){$('rl-'+k).hidden=k!==P;});
    document.querySelectorAll('.rl-tabs a').forEach(function(a){var on=a.getAttribute('data-p')===P;a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  }
  function go(p){P=p;if(history.replaceState)history.replaceState(null,'','#'+p);render();document.querySelector('.content').scrollTop=0;}
  document.addEventListener('click',function(e){
    var el=e.target.closest('[data-p],[data-a],[data-cf],[data-dec],[data-pg]');if(!el||el.closest('.ui-ov'))return;
    e.preventDefault();
    if(el.hasAttribute('data-p'))return go(el.getAttribute('data-p'));
    if(el.hasAttribute('data-cf')){CF=el.getAttribute('data-cf');page=0;return render();}
    if(el.hasAttribute('data-dec'))return decide(+el.getAttribute('data-dec'));
    if(el.hasAttribute('data-pg')){page+=+el.getAttribute('data-pg');return render();}
    var a=el.getAttribute('data-a');
    if(a==='audit')audit();if(a==='invite')invite();if(a==='csv')csv();
    if(a==='pause')UI.confirm('Pause invites for '+R.t+'?','New invites stop going out. Candidates already invited keep their links.','Pause invites',function(){R.paused=true;RL.setRoleState(req,'paused',true);render();UI.toast('Paused invites for '+R.t+'.');});
    if(a==='resume'){R.paused=false;RL.setRoleState(req,'paused',false);render();UI.toast('Invites are going out again for '+R.t+'.');}
    if(a==='delete')UI.confirm('Delete '+R.t+'?','The draft and its buyers are deleted. The req stays open in the applicant tracker.','Delete draft',function(){var l=RL.newRoles().filter(function(x){return x.req!==req;});PMStore.set('newRoles',l);RL.setRoleState(req,'deleted',true);UI.toast('Deleted the draft.');setTimeout(function(){location.href='roles.html';},600);},true);
  });
  var h=(location.hash||'').slice(1);if(['overview','interview','candidates','settings'].indexOf(h)>-1)P=h;
  render();
})();
