/* Automation editor (automation.html): step selection and settings, add steps, zoom, pause, test run, run history, settings. */
(function(){
  var D=document,E=UI.esc;
  var flow=D.getElementById('auFlow'),rp=D.getElementById('auRp'),rpB=D.getElementById('auRpB'),body2=D.getElementById('auEditor');
  var CHEV='<svg class="i end" viewBox="0 0 16 16"><path d="m4.5 6.5 3.5 3.5 3.5-3.5"/></svg>';
  var IC={email:'<svg class="i" viewBox="0 0 16 16"><rect x="2.5" y="3.5" width="11" height="9" rx="1.5"/><path d="m3 4.5 5 4 5-4"/></svg>',
    wait:'<svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/></svg>',
    task:'<svg class="i" viewBox="0 0 16 16"><circle cx="6" cy="5.5" r="2.2"/><path d="M2 13c.4-2.2 2-3.4 4-3.4s3.6 1.2 4 3.4"/></svg>'};
  var PEOPLE={'Dana Whitfield':'dana@northwindfreight.com','Marcus Lee':'marcus@northwindfreight.com'};
  var DD={
    stage:['Phone screen','Review','Final round'],freq:['Every 15 minutes','Every hour'],
    from:['Dana Whitfield','Marcus Lee'],tpl:['AE invite, v2','AE invite, v1'],days:['Weekdays','Every day'],hours:['9:00 am – 5:00 pm','8:00 am – 6:00 pm'],
    q:['Has the candidate started a call?','Has the candidate started practice?','Has the candidate opened the invite?'],
    rtpl:['Gentle reminder','Last reminder','Notice period ending'],who:['Dana Whitfield','Marcus Lee'],owner:['Dana Whitfield','Marcus Lee']
  };
  var S={
    trigger:{type:'trigger',stage:'Phone screen',freq:'Every 15 minutes'},
    invite:{type:'invite',from:'Dana Whitfield',tpl:'AE invite, v2',days:'Weekdays',hours:'9:00 am – 5:00 pm',stopReply:true,ccHM:false},
    wait:{type:'wait',n:10},
    cond:{type:'cond',q:'Has the candidate started a call?'},
    rem1:{type:'rem',k:1,rtpl:'Gentle reminder',n:2},
    rem2:{type:'rem',k:2,rtpl:'Last reminder',n:4},
    exitY:{type:'exit',br:'Yes'},
    exitN:{type:'exit',br:'No',keep:true}
  };
  var KIND={trigger:'Trigger',invite:'Send email',wait:'Wait',cond:'Condition',rem:'Send email',exit:'Exit',email:'Send email',task:'Team task'};
  var sel='invite',draft=null,tab='setup',dirty=false,added=0;

  function node(id){return flow.querySelector('[data-step="'+id+'"]');}
  function nodes(){return [].slice.call(flow.querySelectorAll('.node'));}
  function stepNo(id){
    var list=nodes(),n=0,total=list.filter(function(x){return !x.classList.contains('exit')}).length+1;
    for(var i=0;i<list.length;i++){if(!list[i].classList.contains('exit'))n++;if(list[i].getAttribute('data-step')===id)break;}
    return {n:S[id].type==='exit'?total:n,total:total};
  }
  function title(id,d){d=d||S[id];
    switch(d.type){
      case 'trigger':return 'When a candidate moves to a stage';
      case 'invite':return 'Send the candidate notice and invite';
      case 'wait':return 'Hold the scored call for '+d.n+' business days';
      case 'cond':return d.q;
      case 'rem':return 'Reminder '+d.k+', after '+d.n+(d.k===2?' more':'')+' days';
      case 'exit':return d.br==='Yes'?'Leave this automation':'Stop. No more emails';
      case 'email':return 'Send "'+d.tpl+'"';
      case 'task':return 'Task for '+d.who;
      case 'xwait':return 'Wait '+d.n+' business day'+(d.n==1?'':'s');
    }
  }
  /* ---------- field helpers ---------- */
  function dd(k,label,v,help,pre){return '<div class="fld"><span class="lab">'+label+'</span><div class="inp" data-dd="'+k+'" role="button" tabindex="0" aria-label="'+E(label)+': '+E(v)+'">'+(pre||'')+'<span class="t">'+E(v)+'</span>'+CHEV+'</div>'+(help?'<div class="help">'+help+'</div>':'')+'</div>';}
  function num(k,label,v,min,max,help){return '<div class="fld"><label class="lab" for="au-f-'+k+'">'+label+'</label><input class="inp" id="au-f-'+k+'" type="number" data-k="'+k+'" min="'+min+'" max="'+max+'" value="'+v+'">'+(help?'<div class="help">'+help+'</div>':'')+'</div>';}
  function tg(k,label,small,on,locked){return '<div class="optrow"><span class="sw'+(locked?' locked':'')+(on?' on':'')+'" role="switch" tabindex="0" aria-checked="'+!!on+'" aria-label="'+E(label)+'" data-sw="'+k+'"></span><div><b>'+label+'</b><small>'+small+'</small></div></div>';}
  function note(t){return '<div class="note"><svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5"/><path d="M8 7.2v3.3M8 5.3v.1"/></svg><span>'+t+'</span></div>';}
  function mail(d){
    var v1=d.tpl==='AE invite, v1';
    return '<div class="mail"><div class="mail-s"><span>Subject</span>'+(v1?'Next step for Account Executive at Northwind':'Your first interview for Account Executive at Northwind')+'</div><div class="mail-b">'+
      '<p>Hi <span class="var">first name</span>,</p>'+
      (v1?'<p>Thanks for applying. The next step is a 7-minute call with an AI buyer. You can practice first as many times as you like.</p>':'<p>Thanks for applying. The next step is a short practice call, then a 7-minute call with an AI buyer. You can do both on your own time, on a laptop or a phone.</p>')+
      '<p>Practice opens today and is never scored. The scored call opens on <span class="var">scored call date</span>. Before it starts, you\'ll read how it works and agree to it.</p>'+
      '<p>If you\'d like extra time, captions, a text version or a person to interview you, reply to this email.</p><p>'+E(d.from.split(' ')[0])+'</p></div>'+
      '<div class="mail-f"><span class="att"><svg class="i" viewBox="0 0 16 16"><path d="M4 2.5h5.5L12.5 5.5V13a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5z"/><path d="M9.5 2.5v3h3"/></svg>Candidate notice<svg class="i lock" viewBox="0 0 16 16"><rect x="4" y="7.5" width="8" height="6" rx="1"/><path d="M5.5 7.5V5.5a2.5 2.5 0 0 1 5 0v2"/></svg></span><span class="att"><svg class="i" viewBox="0 0 16 16"><path d="M7 9a2.5 2.5 0 0 0 3.5 0l2-2a2.5 2.5 0 0 0-3.5-3.5l-.6.6M9 7a2.5 2.5 0 0 0-3.5 0l-2 2A2.5 2.5 0 0 0 7 12.5l.6-.6"/></svg>Interview link</span></div></div>';
  }
  var REM={'Gentle reminder':['Your practice call is still open','Hi <span class="var">first name</span>, your invite for Account Executive at Northwind is still open. Practice takes about 10 minutes and is never scored.'],
    'Last reminder':['Last reminder: your interview link','Hi <span class="var">first name</span>, this is the last reminder we\'ll send. Your link keeps working until the role closes.'],
    'Notice period ending':['Your scored call opens soon','Hi <span class="var">first name</span>, your scored call opens in 2 days. Practice is open until then, and after.']};
  function remMail(t,from){var r=REM[t]||REM['Gentle reminder'];return '<div class="mail"><div class="mail-s"><span>Subject</span>'+r[0]+'</div><div class="mail-b"><p>'+r[1]+'</p><p>If you\'d like extra time or a person to interview you, reply to this email.</p><p>'+E(from.split(' ')[0])+'</p></div></div>';}

  /* ---------- panel renderers ---------- */
  function setupHtml(id,d){
    switch(d.type){
      case 'trigger':return dd('stage','Stage is',d.stage,'The stage in your applicant tracker that starts this automation.')+
        '<div class="fld"><span class="lab">Role is</span><div class="inp"><span class="t">Account Executive, Mid-Market</span><span class="s">Req 114</span></div><div class="help">Change roles in the Settings tab.</div></div>'+
        dd('freq','Check for new candidates',d.freq,'Candidates who reach the stage between checks enroll at the next check.')+note('Candidates who were already at this stage before Oct 27 were not enrolled.');
      case 'invite':return dd('from','From',d.from,'Replies go to '+E(d.from.split(' ')[0])+'\'s inbox.','<span class="mini-av">'+d.from.split(' ').map(function(w){return w[0]}).join('')+'</span>').replace('<span class="t">'+E(d.from)+'</span>','<span class="t">'+E(d.from)+'</span><span class="s">'+PEOPLE[d.from]+'</span>')+
        dd('tpl','Email template',d.tpl)+mail(d)+
        '<div class="fld"><span class="lab">Send window</span><div class="row2"><div class="inp" data-dd="days" role="button" tabindex="0"><span class="t">'+E(d.days)+'</span>'+CHEV+'</div><div class="inp" data-dd="hours" role="button" tabindex="0"><span class="t">'+E(d.hours)+'</span>'+CHEV+'</div></div><div class="help">In the candidate\'s time zone, from the address in your applicant tracker.</div></div>'+
        '<div>'+tg('notice','Attach the candidate notice','Required for every invite. Edit the text in Interview setup.',true,true)+tg('stopReply','Stop if the candidate replies',E(d.from.split(' ')[0])+' handles the reply. No reminders go out after it.',d.stopReply)+tg('ccHM','Copy the hiring manager','Marcus Lee gets a copy of each invite.',d.ccHM)+'</div>'+
        note('Accommodation requests pause this automation for that candidate until Dana answers.');
      case 'wait':return num('n','Business days',d.n,5,20,'Every candidate in this role gets the same notice period. Changes apply to candidates who enroll after you save.')+
        '<div>'+tg('prac','Keep practice open during the wait','Candidates can practice as often as they like. Practice is never scored or shared.',true,true)+'</div>';
      case 'cond':return dd('q','Check',d.q,'Checked once, when the scored call opens.')+note('Yes leaves the automation. No gets up to 2 reminders.');
      case 'rem':return dd('rtpl','Email template',d.rtpl)+num('n',d.k===1?'Days after the scored call opens':'Days after reminder 1',d.n,1,10)+remMail(d.rtpl,S.invite.from)+note('Sent from '+E(S.invite.from)+'. Stops if the candidate starts a call, replies or asks for an accommodation.');
      case 'exit':return (d.br==='Yes'?'<p style="margin:0;color:var(--ink2)">Candidates who started a practice or scored call leave here. They carry on in PM and get no more reminders from this automation.</p>':
        '<p style="margin:0;color:var(--ink2)">Candidates who did not start a call after both reminders leave here. No more emails go out.</p><div>'+tg('keep','Keep the invite link working','The link works until the role closes, so a late candidate can still take part.',d.keep)+'</div>');
      case 'email':return dd('from','From',d.from)+dd('rtpl','Email template',d.tpl)+remMail(d.tpl,d.from);
      case 'task':return dd('who','Assign to',d.who)+'<div class="fld"><label class="lab" for="au-f-txt">Task</label><textarea class="au-ta" id="au-f-txt" data-k="txt">'+E(d.txt)+'</textarea></div>'+note('Tasks go to the person\'s PM inbox. Candidates never see them.');
      case 'xwait':return num('n','Business days',d.n,1,20);
    }
  }
  var ACT={
    trigger:[['212 candidates enrolled','Since Oct 27'],['3 enrolled today','Last check 9:14 am'],['0 errors','Applicant tracker connected']],
    invite:[['212 sent · 0 bounced','Since Oct 27'],['Sam Rivera','Invite sent Oct 28, 9:14 am'],['Leo Park','Invite sent Nov 4, 10:00 am'],['Jo Tanaka','Invite sent Nov 5, 9:30 am']],
    wait:[['23 waiting now','Notice period'],['Leo Park','Day 9 of 10'],['Jo Tanaka','Day 8 of 10']],
    cond:[['189 checked','128 yes · 61 no']],
    rem1:[['61 sent · 0 bounced','Since Nov 12'],['Grace Liu','Sent Nov 16, 9:00 am']],
    rem2:[['34 sent · 0 bounced','Since Nov 14'],['Omar Haddad','Sent Nov 16, 9:00 am']],
    exitY:[['128 left here','Started a practice or scored call']],
    exitN:[['34 left here','No call after 2 reminders']]
  };
  function previewHtml(id,d){
    if(d.type==='invite')return mail(d)+'<a class="btn" href="email.html" style="text-decoration:none;color:inherit;align-self:flex-start">Open the email as the candidate sees it</a>';
    if(d.type==='rem')return remMail(d.rtpl,S.invite.from);
    if(d.type==='email')return remMail(d.tpl,d.from);
    return '<p style="margin:0;color:var(--ink2)">This step does not send anything to candidates.</p><p style="margin:0;color:var(--mute)">'+E(title(id,d))+'.</p>';
  }
  function activityHtml(id){var a=ACT[id]||[['No activity yet','Added today. Runs for candidates who enroll after you save.']];
    return '<div class="au-act">'+a.map(function(x){return '<div>'+E(x[0])+'<small>'+E(x[1])+'</small></div>';}).join('')+'</div>';}
  function drawPanel(){
    var d=draft,no=stepNo(sel);
    D.getElementById('auRpT').textContent=title(sel,d);
    D.getElementById('auRpS').textContent=(d.type==='exit'?'Exit · '+d.br+' branch':'Step '+no.n+' of '+no.total+' · '+KIND[d.type==='xwait'?'wait':d.type]);
    rp.querySelectorAll('[data-rp]').forEach(function(a){a.classList.toggle('on',a.getAttribute('data-rp')===tab);});
    rpB.innerHTML=tab==='setup'?setupHtml(sel,d):tab==='preview'?previewHtml(sel,d):activityHtml(sel);
    var m=D.getElementById('auRpM');m.textContent=dirty?'Unsaved changes':'Changes apply to new candidates';m.classList.toggle('au-dirty',dirty);
    var rm=D.getElementById('auRpDel');
    if(/^x/.test(sel)){if(!rm){rm=D.createElement('button');rm.className='btn';rm.id='auRpDel';rm.textContent='Remove step';rm.setAttribute('data-js','');rm.style.color='#B42318';D.getElementById('auRpCancel').before(rm);rm.addEventListener('click',removeStep);}}
    else if(rm)rm.remove();
  }
  function select(id){
    if(dirty&&id!==sel){commit(true);}
    sel=id;draft=JSON.parse(JSON.stringify(S[id]));dirty=false;tab='setup';
    nodes().forEach(function(n){var on=n.getAttribute('data-step')===id;n.classList.toggle('sel',on);if(on)n.setAttribute('aria-current','true');else n.removeAttribute('aria-current');});
    body2.classList.remove('au-norp');drawPanel();
  }
  function updateNode(id){
    var n=node(id),d=S[id];if(!n)return;var h=n.querySelector('h3'),p=n.querySelector('.nb p'),ch=n.querySelector('.chips');
    h.textContent=title(id);
    if(d.type==='trigger'){p.textContent='Checks your applicant tracker '+d.freq.toLowerCase()+'.';ch.firstChild.innerHTML='<em>Stage is</em> '+E(d.stage);}
    if(d.type==='invite'){p.textContent='From '+d.from+', '+(d.days==='Weekdays'?'on weekdays':'every day')+' between '+d.hours.replace(' – ',' and ')+" in the candidate's time zone.";ch.firstChild.innerHTML='<em>Template</em> '+E(d.tpl);}
    if(d.type==='rem'){ch.firstChild.innerHTML='<em>Template</em> '+E(d.rtpl);}
    if(d.type==='exit'&&d.br==='No'){p.textContent=d.keep?'The invite link keeps working until the role closes.':'The invite link stops working when this step runs.';}
    if(d.type==='email'){ch.innerHTML='<span class="chipk"><em>From</em> '+E(d.from)+'</span>';}
    if(d.type==='task'){p.textContent=d.txt;}
  }
  function commit(quiet){S[sel]=JSON.parse(JSON.stringify(draft));dirty=false;updateNode(sel);if(!quiet)UI.toast('Saved "'+title(sel)+'". Changes apply to new candidates.');}
  function setDirty(){dirty=true;var m=D.getElementById('auRpM');m.textContent='Unsaved changes';m.classList.add('au-dirty');}

  /* ---------- right panel events ---------- */
  rpB.addEventListener('click',function(e){
    var f=e.target.closest('[data-dd]');
    if(f){var k=f.getAttribute('data-dd'),key=(k==='rtpl'&&draft.type==='email')?'tpl':k;
      UI.menu(f,DD[k].map(function(o){return {label:o,check:draft[key]===o,small:PEOPLE[o]&&(k==='from')?PEOPLE[o]:undefined,onClick:function(){if(draft[key]!==o){draft[key]=o;dirty=true;}drawPanel();}};}),{align:'left'});return;}
    var s=e.target.closest('[data-sw]');
    if(s){if(s.classList.contains('locked')){UI.toast(s.getAttribute('data-sw')==='notice'?'The candidate notice is required on every invite.':'Practice is always open during the notice period.');return;}
      var k2=s.getAttribute('data-sw');draft[k2]=!draft[k2];s.classList.toggle('on',draft[k2]);s.setAttribute('aria-checked',draft[k2]);setDirty();}
  });
  rpB.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-dd],[data-sw]')){e.preventDefault();e.target.click();}});
  rpB.addEventListener('input',function(e){var k=e.target.getAttribute('data-k');if(!k)return;draft[k]=e.target.type==='number'?(+e.target.value||0):e.target.value;setDirty();
    D.getElementById('auRpT').textContent=title(sel,draft);});
  rp.querySelectorAll('[data-rp]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();tab=a.getAttribute('data-rp');drawPanel();});});
  UI.wire('#auRpSave',function(){
    if(draft.n!==undefined){var lim=draft.type==='wait'?[5,20]:draft.type==='rem'?[1,10]:[1,20];if(draft.n<lim[0]||draft.n>lim[1]){UI.toast('Pick a number from '+lim[0]+' to '+lim[1]+'.');return;}}
    commit(false);drawPanel();});
  UI.wire('#auRpCancel',function(){var had=dirty;draft=JSON.parse(JSON.stringify(S[sel]));dirty=false;drawPanel();UI.toast(had?'Changes discarded.':'Nothing to discard.');});
  UI.wire('#auRpX',function(){if(dirty)commit(true);body2.classList.add('au-norp');nodes().forEach(function(n){n.classList.remove('sel');n.removeAttribute('aria-current');});});

  /* ---------- canvas events ---------- */
  flow.addEventListener('click',function(e){
    var p=e.target.closest('.plus');
    if(p){e.preventDefault();var cs=p.closest('.cstack');
      UI.menu(p,[{header:'Add a step here'},{label:'Send email',onClick:function(){addStep(cs,'email')}},{label:'Wait',onClick:function(){addStep(cs,'xwait')}},{label:'Team task',onClick:function(){addStep(cs,'task')}}],{align:'left'});return;}
    var n=e.target.closest('.node');if(n)select(n.getAttribute('data-step'));
  });
  function addStep(cs,type){
    added++;var id='x'+added;
    S[id]=type==='email'?{type:'email',from:'Dana Whitfield',tpl:'Gentle reminder'}:type==='task'?{type:'task',who:'Dana Whitfield',txt:'Check in with the candidate.'}:{type:'xwait',n:2};
    var cls=type==='xwait'?'wait':'act',lab=type==='xwait'?'Wait':type==='task'?'Team task':'Send email';
    var n=D.createElement('div');n.className='node';n.setAttribute('data-step',id);
    n.innerHTML='<div class="nh"><span class="nk '+cls+'">'+IC[type==='xwait'?'wait':type]+lab+'</span><span class="ncount">New</span></div><div class="nb"><h3></h3><p>'+(type==='task'?E(S[id].txt):type==='email'?'Sent in the same window as the invite.':'Waits before the next step.')+'</p><div class="chips">'+(type==='email'?'<span class="chipk"><em>From</em> Dana Whitfield</span>':'')+'</div></div>';
    var c=D.createElement('div');c.className='cstack';c.innerHTML='<div class="conn"></div><button class="plus" data-js aria-label="Add a step here"><svg class="i" viewBox="0 0 16 16"><path d="M8 3.5v9M3.5 8h9"/></svg></button><div class="conn"></div>';
    cs.after(n);n.after(c);updateNode(id);select(id);
    n.scrollIntoView({block:'center',behavior:'smooth'});
    UI.toast('Added a '+lab.toLowerCase()+' step. Set it up on the right, then save.');
  }
  function removeStep(){
    var n=node(sel),c=n.nextElementSibling,t=title(sel);
    UI.confirm('Remove this step?','"'+t+'" will be removed. Candidates already past it are not affected.','Remove',function(){c.remove();n.remove();delete S[sel];dirty=false;select('invite');UI.toast('Removed "'+t+'".');},true);
  }
  /* zoom */
  var z=1,zl=D.getElementById('auZl');
  function setZ(v){z=Math.max(.4,Math.min(1.5,Math.round(v*100)/100));flow.style.transform='scale('+z+')';zl.textContent=Math.round(z*100)+'%';}
  D.querySelectorAll('[data-z]').forEach(function(b){b.addEventListener('click',function(){var k=b.getAttribute('data-z'),cv=D.querySelector('.canvas');
    if(k==='in')setZ(z+.1);else if(k==='out')setZ(z-.1);
    else{var h=flow.offsetHeight-120,w=flow.offsetWidth,avail=cv.clientHeight-flow.offsetTop-56;setZ(Math.floor(Math.min(1,avail/h,(cv.clientWidth-20)/w)*100)/100);cv.scrollTop=0;}});});
  /* collapse */
  UI.wire('#auCollapse',function(b){var c=flow.classList.toggle('au-col');b.textContent=c?'Expand all':'Collapse all';});

  /* ---------- status ---------- */
  var status='Active';try{status=localStorage.getItem('pm-au-inv-status')||'Active';}catch(e){}
  if(status==='Draft')status='Active';
  var pb=D.getElementById('auPause');
  var PI='<svg class="i" viewBox="0 0 16 16"><path d="M5.5 3.5v9M10.5 3.5v9"/></svg>',RI='<svg class="i" viewBox="0 0 16 16"><path d="M5 3.5v9l7-4.5z"/></svg>';
  function drawStatus(){var t=D.getElementById('auStatus');
    if(status==='Archived'){t.className='tag gray';t.textContent='Archived';pb.disabled=true;pb.innerHTML=RI+'Resume';return;}
    var on=status==='Active';t.className=on?'tag green':'tag beige';t.innerHTML=on?'<span class="dot" style="margin-right:2px"></span>Active':'Paused';pb.innerHTML=(on?PI+'Pause':RI+'Resume');
    var st=D.querySelectorAll('.cv-stat')[1];if(st)st.innerHTML=on?'<span class="dot"></span>Last run 9:14 am':'<span class="dot" style="background:#C9821E"></span>Paused · last run 9:14 am';}
  UI.wire(pb,function(){status=status==='Active'?'Paused':'Active';try{localStorage.setItem('pm-au-inv-status',status)}catch(e){}drawStatus();
    UI.toast(status==='Paused'?'Paused. No invites or reminders go out until you resume.':'Resumed. Sending picks up in working hours.');});
  UI.wire('#auSaveAll',function(){if(dirty){commit(true);drawPanel();}D.querySelector('.ph .meta').textContent='Edited by Dana Whitfield, just now';UI.toast('Saved. Changes apply to new candidates.');});

  /* ---------- test with a candidate ---------- */
  UI.wire('#auTest',function(){
    var md=UI.modal({title:'Test with a candidate',body:'<p>Runs a test candidate through every step right now. Waits are skipped. Emails go to the address you pick, and no real candidate is enrolled.</p>'+
      '<label for="auTW">Send test emails to</label><select id="auTW"><option value="Dana Whitfield">Dana Whitfield (you) · dana@northwindfreight.com</option><option value="Marcus Lee">Marcus Lee · marcus@northwindfreight.com</option></select>'+
      '<label for="auTP">Test candidate</label><select id="auTP"><option value="no">Does not start a call (gets the reminders)</option><option value="yes">Starts a practice call</option></select>',
      actions:[{label:'Cancel'},{label:'Run test',primary:true,onClick:function(m){run(m);return false;}}]});
  });
  function pathNodes(br){
    var list=[].slice.call(flow.children).filter(function(x){return x.classList.contains('node')});
    var col=flow.querySelectorAll('.bcol')[br==='yes'?0:1];return list.concat([].slice.call(col.querySelectorAll('.node')));
  }
  function logText(id,to){var d=S[id];
    switch(d.type){case 'trigger':return ['Test candidate added at '+d.stage,'Req 114 · Account Executive, Mid-Market'];
      case 'invite':return ['Sent "'+d.tpl+'" to '+PEOPLE[to],'From '+d.from+'. Candidate notice attached.'];
      case 'wait':return ['Skipped the '+d.n+'-day wait','Tests do not wait.'];
      case 'cond':return [d.q+' '+(run.br==='yes'?'Yes':'No'),run.br==='yes'?'Practice call started':'No call started'];
      case 'rem':return ['Sent "'+d.rtpl+'" to '+PEOPLE[to],'Reminder '+d.k];
      case 'exit':return [d.br==='Yes'?'Left the automation':'Stopped. No more emails','Test finished'];
      case 'email':return ['Sent "'+d.tpl+'" to '+PEOPLE[to],'From '+d.from];
      case 'task':return ['Created a test task for '+d.who,'Marked as a test'];
      case 'xwait':return ['Skipped the '+d.n+'-day wait','Tests do not wait.'];}
  }
  function run(m){
    var to=m.querySelector('#auTW').value;run.br=m.querySelector('#auTP').value;
    var list=pathNodes(run.br),ids=list.map(function(n){return n.getAttribute('data-step')});
    var b=m.querySelector('.ui-md-b'),f=m.querySelector('.ui-md-f');
    b.innerHTML='<p id="auTS">Running the test…</p><ol class="au-log">'+ids.map(function(id){var t=logText(id,to);return '<li data-l="'+id+'"><i></i><div>'+E(t[0])+'<small>'+E(t[1])+'</small></div></li>';}).join('')+'</ol>';
    f.innerHTML='';var i=0,sent=0;
    nodes().forEach(function(n){n.classList.remove('au-run','au-done')});
    var tm=setInterval(function(){
      if(i>0)list[i-1].classList.replace('au-run','au-done');
      if(i>=ids.length){clearInterval(tm);
        b.querySelector('#auTS').textContent='Test finished. '+sent+' email'+(sent===1?'':'s')+' sent to '+PEOPLE[to]+'. No real candidate was enrolled.';
        var c=D.createElement('button');c.className='ui-b';c.textContent='Close';c.onclick=function(){nodes().forEach(function(n){n.classList.remove('au-done')});m.close();};
        var o=D.createElement('button');o.className='ui-b pri';o.textContent='See the invite email';o.onclick=function(){location.href='email.html';};
        f.appendChild(c);f.appendChild(o);UI.toast('Test finished. '+sent+' emails sent to '+PEOPLE[to]+'.');return;}
      var d=S[ids[i]];if(d.type==='invite'||d.type==='rem'||d.type==='email')sent++;
      list[i].classList.add('au-run');list[i].scrollIntoView({block:'nearest',behavior:'smooth'});b.querySelector('[data-l="'+ids[i]+'"]').classList.add('on');i++;
    },550);
  }

  /* ---------- tabs: run history and settings ---------- */
  var CANDS=[['Sam Rivera','Oct 28','Exited','Started practice Nov 3'],['Ben Carter','Oct 28','Exited','Started practice Nov 2'],['Priya Nair','Oct 28','Exited','Started practice Nov 4'],
    ['Ama Owusu','Oct 29','Exited','Started practice Nov 5'],['Nia Brooks','Oct 29','Exited','Started practice Nov 6'],['Rhea Das','Oct 29','Exited','Started practice Nov 4'],
    ['Kai Morgan','Oct 30','Exited','Started practice Nov 7'],['Dev Kapoor','Oct 30','Paused','Asked for extra time. Dana to answer.'],['Omar Haddad','Oct 30','Stopped','No call after 2 reminders'],
    ['Mia Brandt','Oct 31','Paused','Asked for a human interviewer. Dana to answer.'],['Grace Liu','Oct 31','Reminders','Reminder 1 sent Nov 16'],['Theo Grant','Oct 31','Exited','Started practice Nov 5'],
    ['Carmen Ruiz','Nov 2','Exited','Started practice Nov 6'],['Ian Walsh','Nov 2','Exited','Started practice Nov 8'],['Leo Park','Nov 4','Waiting','Notice period, day 9 of 10'],['Jo Tanaka','Nov 5','Waiting','Notice period, day 8 of 10']];
  var RUNS=[['Today, 9:14 am',3,3,2,0],['Today, 9:00 am',0,4,6,0],['Nov 16, 4:45 pm',2,2,0,0],['Nov 16, 11:30 am',4,4,1,0],['Nov 16, 9:00 am',0,7,9,0],['Nov 13, 2:15 pm',5,5,0,0],['Nov 13, 9:00 am',1,6,4,0]];
  var hf='All',hq='';
  function drawHist(){
    var el=D.getElementById('auHist');
    if(!el.innerHTML){
      el.innerHTML='<div class="au-pw"><div class="au-kpis">'+[['Enrolled',212],['Waiting',23],['Started a call',128],['Reminders sent',95],['Stopped, no call',34],['Failed sends',0]].map(function(k){return '<div class="au-kpi"><small>'+k[0]+'</small><b>'+k[1]+'</b></div>';}).join('')+'</div>'+
      '<section class="card"><div class="au-bar"><h2>Runs</h2><span class="meta">Checks every 15 minutes. Only runs with activity are listed.</span></div><table class="au-ht"><thead><tr><th>Run</th><th class="n">Entered</th><th class="n">Emails sent</th><th class="n">Left</th><th class="n">Failed</th></tr></thead><tbody>'+
      RUNS.map(function(r){return '<tr><td>'+r[0]+'</td><td class="n">'+r[1]+'</td><td class="n">'+r[2]+'</td><td class="n">'+r[3]+'</td><td class="n">'+r[4]+'</td></tr>';}).join('')+'</tbody></table></section>'+
      '<section class="card"><div class="au-bar"><h2>Candidates</h2><label class="au-srch"><svg class="i" viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg><input id="auHQ" placeholder="Search candidates" aria-label="Search candidates"></label>'+
      '<div class="au-seg" id="auHF">'+['All','Waiting','Reminders','Exited','Stopped','Paused'].map(function(x){return '<button data-js data-hf="'+x+'">'+x+'</button>';}).join('')+'</div>'+
      '<button class="btn" id="auHDl" data-js style="margin-left:auto"><svg class="i" viewBox="0 0 16 16"><path d="M8 2.5v8M5 7.5l3 3 3-3M3 12.5h10"/></svg>Download CSV</button></div>'+
      '<table class="au-ht"><thead><tr><th>Candidate</th><th>Entered</th><th>Where they are</th><th>Detail</th></tr></thead><tbody id="auHB"></tbody></table><div class="au-bar" style="border-top:1px solid var(--line);border-bottom:0"><span class="meta" id="auHC"></span></div></section></div>';
      D.getElementById('auHQ').addEventListener('input',function(){hq=this.value.trim().toLowerCase();drawHist();});
      D.getElementById('auHF').addEventListener('click',function(e){var b=e.target.closest('[data-hf]');if(b){hf=b.getAttribute('data-hf');drawHist();}});
      UI.wire('#auHDl',function(){UI.download('invite-after-phone-screen-candidates.csv','candidate,entered,status,detail\n'+filt().map(function(c){return c.map(function(x){return '"'+x+'"'}).join(',')}).join('\n'));});
    }
    D.querySelectorAll('#auHF [data-hf]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-hf')===hf)});
    var l=filt();
    D.getElementById('auHB').innerHTML=l.length?l.map(function(c){return '<tr><td>'+E(c[0])+'</td><td class="au-dim" style="color:var(--mute)">'+c[1]+'</td><td>'+(c[2]==='Reminders'?'Getting reminders':c[2])+'</td><td style="color:var(--mute)">'+E(c[3])+'</td></tr>';}).join(''):'<tr><td colspan="4" class="au-empty">No candidates match.</td></tr>';
    D.getElementById('auHC').textContent='Showing '+l.length+' recent candidates of 212 enrolled';
  }
  function filt(){return CANDS.filter(function(c){return (hf==='All'||c[2]===hf)&&(!hq||c[0].toLowerCase().indexOf(hq)>=0);});}
  var SET={name:'Invite after phone screen',desc:'Sends the notice and invite at Phone screen, then up to 2 reminders.',owner:'Dana Whitfield',reenroll:false,failed:true};
  function drawSet(){
    var el=D.getElementById('auSet');
    el.innerHTML='<div class="au-pw"><section class="card"><div class="au-bar"><h2>Automation settings</h2><span class="meta">Saved settings apply right away</span></div><div class="au-form">'+
      '<label class="lab" for="auSN">Name</label><input class="inp" id="auSN" value="'+E(SET.name)+'">'+
      '<label class="lab" for="auSD">Description</label><textarea class="au-ta" id="auSD" style="max-width:420px">'+E(SET.desc)+'</textarea>'+
      '<span class="lab">Owner</span><div><div class="inp" id="auSO" role="button" tabindex="0" style="max-width:420px;cursor:pointer"><span class="mini-av">'+SET.owner.split(' ').map(function(w){return w[0]}).join('')+'</span><span class="t">'+E(SET.owner)+'</span>'+CHEV+'</div><div class="help">The owner gets failed-send alerts. Each email step picks its own sender.</div></div>'+
      '<span class="lab">Roles</span><div><span class="tag gray">Req 114 · Account Executive, Mid-Market</span><div class="help">Add roles from <a href="setup.html" style="color:inherit">Interview setup</a> for each role.</div></div>'+
      '<span class="lab">Enrollment</span><div>'+tg('reenroll','Let candidates enroll again','If a candidate leaves the stage and comes back, they start over.',SET.reenroll)+tg('failed','Email the owner about failed sends','Sent once a day if any email bounced.',SET.failed)+tg('acc','Pause for accommodation requests','Always on. The candidate\'s emails wait until the recruiter answers.',true,true)+tg('wd','Stop when a candidate withdraws','Always on.',true,true)+'</div>'+
      '<span></span><div style="display:flex;gap:8px"><button class="btn yellow" id="auSS" data-js>Save settings</button><button class="btn" id="auSA" data-js style="color:#B42318">Archive automation</button></div>'+
      '</div></section></div>';
    UI.wire('#auSO',function(b){UI.menu(b,DD.owner.map(function(o){return {label:o,check:SET.owner===o,onClick:function(){SET.owner=o;keep();drawSet();}};}),{align:'left'});});
    el.querySelectorAll('[data-sw]').forEach(function(s){s.addEventListener('click',function(){if(s.classList.contains('locked')){UI.toast('This rule is always on.');return;}var k=s.getAttribute('data-sw');SET[k]=!SET[k];s.classList.toggle('on',SET[k]);s.setAttribute('aria-checked',SET[k]);});});
    function keep(){SET.name=D.getElementById('auSN').value;SET.desc=D.getElementById('auSD').value;}
    UI.wire('#auSS',function(){keep();if(!SET.name.trim()){D.getElementById('auSN').focus();UI.toast('Give the automation a name.');return;}
      D.getElementById('auName').textContent=SET.name;document.title=SET.name+' · PM';UI.toast('Saved settings for '+SET.name+'.');});
    UI.wire('#auSA',function(){if(status==='Archived'){UI.toast('Already archived.');return;}UI.confirm('Archive this automation?','It stops right away. The 23 candidates in the notice period keep their invite links, but get no reminders. You can restore it from Automations for 90 days.','Archive',function(){status='Archived';drawStatus();UI.toast('Archived '+SET.name+'. No more emails go out.');},true);});
  }
  function setTab(t){
    D.querySelectorAll('[data-au-tab]').forEach(function(a){var on=a.getAttribute('data-au-tab')===t;a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    body2.hidden=t!=='editor';body2.style.display=t==='editor'?'':'none';
    D.getElementById('auHist').hidden=t!=='history';D.getElementById('auSet').hidden=t!=='settings';
    if(t==='history')drawHist();if(t==='settings')drawSet();
    if(history.replaceState)history.replaceState(null,'',t==='editor'?location.pathname:'#'+t);
  }
  D.querySelectorAll('[data-au-tab]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();setTab(a.getAttribute('data-au-tab'));});});

  drawStatus();select('invite');
  var h=location.hash.slice(1);if(h==='history'||h==='settings')setTab(h);
})();
