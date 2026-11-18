/* fairness.html wiring (prefix by-) */
(function(){
  var esc=UI.esc,q=function(s,r){return (r||document).querySelector(s)},qa=function(s,r){return (r||document).querySelectorAll(s)};
  var OK='<span class="ok"><svg viewBox="0 0 10 10"><path d="M2.5 5.2 4.2 6.8 7.5 3.4"/></svg></span>Pass';
  var two=qa('.fc-two')[0],strip=q('.fc-strip'),logBody=q('.fc-log tbody'),meta=q('.ph-acts .meta'),rangeSel=q('#fc-export .select');
  var ORIG={strip:strip.innerHTML,two:two.innerHTML,log:logBody.innerHTML};
  var ROLES={
    '114':{name:'Account Executive, Mid-Market',req:'Req 114',meta:'212 enrolled · 39 finished · checked 9:15 am',range:'Oct 27 – Nov 17, 2026',enrolled:212,finished:39,draws:39,notice:'v1'},
    '117':{name:'SDR, Inbound',req:'Req 117',meta:'96 enrolled · 21 finished · checked 9:15 am',range:'Oct 19 – Nov 17, 2026',enrolled:96,finished:21,draws:21,notice:'v1',
      buyers:'1 buyer, easy difficulty, drawn in code',dec:['6 of 6','Alex Romero made each advance. PM can’t make one.'],acc:['0 open','3 answered within a day'],
      steps:[['Invited',96,22],['Opened the invite',74,22],['Consented',52,12],['Practiced',40,19],['Finished the scored call',21,null]],
      left:'The 75 who have not finished: 6 in the notice period, 22 invited and not opened, 15 with reminders stopped, 32 withdrew. Practice counts only whether it started.',
      hist:[0,1,3,5,6,4,2],since:'Oct 19'},
    '109':{name:'Account Executive, Enterprise',req:'Req 109',meta:'44 enrolled · 12 finished · checked 9:15 am',range:'Oct 22 – Nov 17, 2026',enrolled:44,finished:12,draws:12,notice:'v1',
      buyers:'1 buyer, hard difficulty, drawn in code',dec:['3 of 3','Marcus Lee made each advance. PM can’t make one.'],acc:['0 open','1 answered within a day'],
      steps:[['Invited',44,9],['Opened the invite',35,11],['Consented',24,5],['Practiced',19,7],['Finished the scored call',12,null]],
      left:'The 32 who have not finished: 4 in the notice period, 9 invited and not opened, 6 with reminders stopped, 13 withdrew. Practice counts only whether it started.',
      hist:[0,1,2,3,3,2,1],since:'Oct 22'}
  };
  var cur='114';
  var roleBtn=q('.fc-role');
  function chk(title,n,small,warn,state){return '<div class="fc-chk'+(warn?' fc-warn':'')+'"><div class="fc-st">'+(warn?'<span class="fc-wi">!</span>Needs review':OK)+'</div><b>'+title+'</b><div class="fc-n mono">'+n+'</div><small>'+small+'</small></div>';}
  function render(k){
    cur=k;var R=ROLES[k];
    roleBtn.innerHTML=roleBtn.innerHTML.replace(/<\/svg>[^<]*<span class="dim">[^<]*<\/span>/,'</svg>'+esc(R.name)+'<span class="dim">'+R.req+'</span>');
    meta.textContent=R.meta;rangeSel.childNodes.forEach(function(n){if(n.nodeType===3&&n.textContent.trim())n.textContent=R.range;});
    if(k==='114'){strip.innerHTML=ORIG.strip;two.innerHTML=ORIG.two;logBody.innerHTML=ORIG.log;}
    else{
      strip.innerHTML=chk('Notice shown before every scored call',R.finished+' of '+R.finished,'Notice v1, shown 10 business days before the call')+
        chk('Consent recorded before every scored call',R.finished+' of '+R.finished,'Time, notice version and candidate on each record')+
        chk('Same buyer mix and difficulty for every candidate',R.draws+' of '+R.draws+' draws logged',R.buyers)+
        chk('Human decision on every advance or decline',R.dec[0],R.dec[1])+
        chk('Accommodation requests answered within 1 working day',R.acc[0],R.acc[1]);
      var c=two.querySelectorAll('.card');
      var rows=R.steps.map(function(s,i){var p=Math.round(s[1]/R.enrolled*100),pv=i?Math.round(s[1]/R.steps[i-1][1]*100)+'%':'–';
        return '<tr><td>'+s[0]+'</td><td class="r mono">'+s[1]+'</td><td class="r"><span class="fc-bar"><i style="width:'+p+'%"></i></span><span class="mono">'+p+'%</span></td><td class="r mono'+(i?'':' dim')+'">'+pv+'</td><td class="r mono'+(s[2]===null?' dim':'')+'">'+(s[2]===null?'–':s[2])+'</td></tr>';}).join('');
      c[0].querySelector('.ch p').textContent='Everyone enrolled in this role since it was published on '+R.since+'.';
      c[0].querySelector('tbody').innerHTML=rows;c[0].querySelector('tfoot').innerHTML='<tr><td>Total</td><td class="r mono">'+R.enrolled+'</td><td></td><td></td><td class="r mono">'+(R.enrolled-R.finished)+'</td></tr>';
      c[0].querySelector('.help').textContent=R.left;
      c[1].querySelector('.r .meta').textContent=R.finished+' candidates';
      var mx=Math.max.apply(null,R.hist);c[1].querySelectorAll('.fc-hr').forEach(function(r,i){r.querySelector('.fc-hb i').style.width=(R.hist[i]/mx*100)+'%';r.querySelector('.mono').textContent=R.hist[i];});
      var ev=BY_LOG.filter(function(e){return e.role===R.req}).slice(0,7);
      logBody.innerHTML=ev.map(function(e){return '<tr><td class="mono dim">'+byFmtTime(e.t)+'</td><td>'+esc(e.ev)+'</td><td>'+esc(e.cand||'–')+'</td><td>'+esc(e.by)+'</td><td class="dim">'+esc(e.det)+'</td></tr>';}).join('');
    }
    bindTwo();
  }
  UI.wire(roleBtn,function(){UI.menu(roleBtn,[{header:'Live roles'}].concat(['114','117','109'].map(function(k){var R=ROLES[k];
    return {label:R.name,small:R.req,check:cur===k,onClick:function(){render(k);UI.toast('Showing fairness checks for '+R.req+'.');}};})).concat([{sep:true},{label:'Sales Manager, Central · closed',small:'Req 101',onClick:function(){
      UI.modal({title:'Req 101 is closed',body:'<p>Sales Manager, Central closed on Oct 30 with 2 hired. Its checks are frozen. The audit log and its exports are kept for 24 months.</p>',actions:[{label:'Close'},{label:'Open audit log',primary:true,onClick:function(){location.href='by-audit-log.html?role=Req%20101';}}]});}}]),{align:'left'});});
  function bindTwo(){var v=q('.fc-ai .btn');if(v)v.setAttribute('data-js','');}

  /* tabs */
  var tabs=qa('.ph .tabs a'),wrap=q('.fc-wrap');
  var panes=document.createElement('div');panes.className='fc-wrap by-fpane';panes.style.display='none';wrap.parentNode.appendChild(panes);
  function showTab(n){tabs.forEach(function(t){var on=t.textContent.trim()===n;t.classList.toggle('on',on);if(on)t.setAttribute('aria-current','page');else t.removeAttribute('aria-current');});
    wrap.style.display=n==='Checks'?'':'none';panes.style.display=n==='Checks'?'none':'';
    if(n==='Exports')drawExports();if(n==='Settings')drawSettings();history.replaceState(null,'',n==='Checks'?'fairness.html':'#'+n.toLowerCase());}
  tabs.forEach(function(t){var n=t.textContent.trim();
    if(n==='Audit log'){t.setAttribute('href','by-audit-log.html');return;}
    UI.wire(t,function(){showTab(n);});});
  UI.wire(UI.byText('View all',q('.fc-two-b'))[0],function(){location.href='by-audit-log.html?role='+encodeURIComponent(ROLES[cur].req);});

  /* exports */
  function exportsList(){return BY_LOG.filter(function(e){return e.type==='Export'});}
  function drawExports(){
    var L=exportsList();
    panes.innerHTML='<section class="card"><div class="ch"><div><h2>Exports</h2><p>Every audit export from this workspace. Each one is logged with who downloaded it and what it covered.</p></div><div class="r"><button class="btn sm yellow" data-js id="byNewExp">New export</button></div></div>'+
      '<table class="fc-t fc-log"><thead><tr><th>Downloaded</th><th>Role</th><th>Covers</th><th>By</th><th></th></tr></thead><tbody>'+
      L.map(function(e,i){return '<tr><td class="mono dim">'+byFmtTime(e.t)+'</td><td>'+esc(e.role)+'</td><td>'+esc(e.det)+'</td><td>'+esc(e.by)+'</td><td class="r"><button class="btn sm" data-js data-dl="'+i+'">Download again</button></td></tr>'}).join('')+
      '</tbody></table></section>';
    q('#byNewExp',panes).onclick=function(){showTab('Checks');document.getElementById('fc-export').scrollIntoView({behavior:'smooth'});};
    qa('[data-dl]',panes).forEach(function(b){b.onclick=function(){var e=L[+b.getAttribute('data-dl')];UI.download('pm-audit-'+e.role.replace(/\W+/g,'').toLowerCase()+'-'+e.t.slice(0,10)+'.csv',csvFor(e.role.replace('Req ','')));};});
  }
  /* settings */
  var SET={reply:'1 working day',day:'Monday',flag:true,alertD:true,alertJ:true,survey:false};
  function drawSettings(){
    var R=ROLES[cur];
    panes.innerHTML='<section class="card by-fs"><div class="ch"><div><h2>Fairness settings · '+R.req+'</h2><p>What PM checks for this role and who hears about it.</p></div></div><div class="cb">'+
      '<div class="by-fsr"><div><b>Weekly check runs on</b><small>PM reruns every check and logs the result.</small></div><select id="byDay">'+['Monday','Tuesday','Wednesday','Thursday','Friday'].map(function(d){return '<option'+(SET.day===d?' selected':'')+'>'+d+'</option>'}).join('')+'</select></div>'+
      '<div class="by-fsr"><div><b>Accommodation reply target</b><small>A request past this time shows as Needs review.</small></div><select id="byReply">'+['Same day','1 working day','2 working days'].map(function(d){return '<option'+(SET.reply===d?' selected':'')+'>'+d+'</option>'}).join('')+'</select></div>'+
      '<div class="by-fsr"><div><b>Flag wide score ranges for a listen</b><small>Calls with an overall range of 2.0 or wider show in Calls before the debrief.</small></div><button class="by-tg'+(SET.flag?' on':'')+'" data-js data-k="flag" role="switch" aria-checked="'+SET.flag+'" aria-label="Flag wide score ranges"></button></div>'+
      '<div class="by-fsr"><div><b>Email when a check needs review</b><small>Sent to the people you pick.</small></div><div class="by-fcks"><label><input type="checkbox" data-k="alertD"'+(SET.alertD?' checked':'')+'> Dana Whitfield</label><label><input type="checkbox" data-k="alertJ"'+(SET.alertJ?' checked':'')+'> Jess Park</label></div></div>'+
      '<div class="by-fsr"><div><b>Voluntary demographic survey</b><small>Off. Group comparisons need lawfully and voluntarily collected data. Turning this on asks candidates after the call, with consent, and never affects a score.</small></div><button class="by-tg'+(SET.survey?' on':'')+'" data-js data-k="survey" role="switch" aria-checked="'+SET.survey+'" aria-label="Voluntary demographic survey"></button></div>'+
      '<div class="by-fsr by-fixed"><div><b>Always on</b><small>Notice and consent before the scored call. A person makes every decision. Same buyer mix and difficulty for everyone in the role. Only the three skills are scored.</small></div><span class="tag gray">Can’t be turned off</span></div>'+
      '<div class="by-fsa"><span class="meta" id="byFsMeta">No unsaved changes</span><button class="btn" data-js id="byFsReset">Reset</button><button class="btn yellow" data-js id="byFsSave">Save settings</button></div></div></section>';
    var draft=JSON.parse(JSON.stringify(SET));
    function dirty(){q('#byFsMeta',panes).textContent='Unsaved changes';}
    q('#byDay',panes).onchange=function(){draft.day=this.value;dirty();};q('#byReply',panes).onchange=function(){draft.reply=this.value;dirty();};
    qa('.by-tg',panes).forEach(function(t){t.onclick=function(){var k=t.getAttribute('data-k');
      if(k==='survey'&&!draft.survey){UI.confirm('Turn on the voluntary survey?','After the scored call, candidates can choose to answer demographic questions. Answers are stored apart from scores, and the hiring team never sees them per person.','Turn on',function(){draft.survey=true;t.classList.add('on');t.setAttribute('aria-checked','true');dirty();});return;}
      draft[k]=!draft[k];t.classList.toggle('on',draft[k]);t.setAttribute('aria-checked',String(draft[k]));dirty();};});
    qa('.by-fcks input',panes).forEach(function(c){c.onchange=function(){draft[c.getAttribute('data-k')]=c.checked;dirty();};});
    q('#byFsReset',panes).onclick=function(){drawSettings();UI.toast('Reset to the saved settings.');};
    q('#byFsSave',panes).onclick=function(){SET=draft;q('#byFsMeta',panes).textContent='Saved just now';
      var ai=q('.fc-ai .tag');if(ai)ai.textContent=SET.survey?'Collecting':'Off';
      UI.toast('Saved fairness settings for '+R.req+'. The next weekly check runs '+SET.day+'.');};
  }

  /* notice versions */
  var NOTICE=['Northwind Freight uses PM for the first interview for this role. You’ll talk with an AI buyer for about 7 minutes. PM scores three skills: discovery, handling doubt and getting a next step. It doesn’t score your voice, accent or face.',
    'A person on our hiring team reviews every result and makes the decision. You can ask for extra time, captions, a text version or a person to interview you instead.'];
  UI.wire(UI.byText('Notice versions')[0],function(){
    var R=ROLES[cur],v2=BYC.get('pm-by-notice',null);
    var dr=UI.drawer({title:'Notice versions · '+R.req,width:480,body:
      (v2?'<div class="by-nv"><div class="by-nvh"><b>v2</b><span class="tag beige">Waiting for approval</span><span class="meta">Saved '+esc(v2.date)+' · Dana</span></div>'+v2.text.split('\n').map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+'<small>Not shown to candidates until Jess Park approves it in Admin settings.</small></div>':'')+
      '<div class="by-nv"><div class="by-nvh"><b>v1</b><span class="tag green">Current</span><span class="meta">Approved Oct 26 · Jess Park</span></div>'+NOTICE.map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+
      '<small>Shown to '+(cur==='114'?'161':cur==='117'?'74':'35')+' candidates in '+R.req+'. All '+R.finished+' who finished consented against v1.</small>'+
      '<div class="by-nva"><button class="btn sm" data-js id="byNvDl">Download v1</button><a class="btn sm" href="settings.html#notice">Edit in Admin settings</a></div></div>',
      actions:[{label:'Close'}]});
    q('#byNvDl',dr).onclick=function(){UI.download('pm-notice-v1-'+R.req.replace(' ','-').toLowerCase()+'.txt','Candidate notice v1 · '+R.req+'\nApproved Oct 26, 2026 by Jess Park\n\n'+NOTICE.join('\n\n')+'\n\n[ ] I’ve read this and I agree to take the scored call.\n','text/plain');};
  });

  /* export form */
  var incs=qa('.fc-inc>div');
  incs.forEach(function(d){d.setAttribute('role','checkbox');d.setAttribute('tabindex','0');d.setAttribute('aria-checked','true');d.style.cursor='pointer';
    function tog(){var b=q('.box',d),on=!b.classList.contains('on');b.classList.toggle('on',on);b.innerHTML=on?'<svg viewBox="0 0 10 10"><path d="M2.5 5.2 4.2 6.8 7.5 3.4"/></svg>':'';d.setAttribute('aria-checked',String(on));}
    d.addEventListener('click',tog);d.addEventListener('keydown',function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();tog();}});});
  rangeSel.setAttribute('role','button');rangeSel.setAttribute('tabindex','0');rangeSel.style.cursor='pointer';
  function rangeMenu(){var R=ROLES[cur],start=R.range.split(' – ')[0];
    var opts=[start+' – Nov 17, 2026','Nov 11 – Nov 17, 2026','Nov 1 – Nov 17, 2026','Oct 1 – Oct 31, 2026'];
    UI.menu(rangeSel,opts.map(function(o,i){return {label:i?o:o+' (whole role)',check:rangeSel.textContent.trim()===o,onClick:function(){rangeSel.childNodes.forEach(function(n){if(n.nodeType===3&&n.textContent.trim())n.textContent=o;});}};}),{align:'left'});}
  rangeSel.addEventListener('click',rangeMenu);rangeSel.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();rangeMenu();}});

  var SHORT=[['Sam Rivera','7.0–8.0','Jordan Ellis'],['Priya Nair','6.5–8.0','Jordan Ellis'],['Ama Owusu','6.0–7.5','Jordan Ellis'],['Rhea Das','6.0–7.0','Tom Becker'],['Nia Brooks','5.5–7.0','Rosa Lin'],['Ben Carter','5.5–7.0','Tom Becker'],['Theo Grant','5.5–6.5','Rosa Lin'],['Carmen Ruiz','5.0–6.5','Jordan Ellis'],['Ian Walsh','5.0–6.0','Tom Becker']];
  function csvFor(k){
    var R=ROLES[k]||ROLES['114'],inc=[].map.call(incs,function(d){return q('.box',d).classList.contains('on')});
    var head=['candidate_id','role','notice_version','notice_shown','consent_recorded'];if(inc[2])head.push('buyer_drawn','difficulty');if(inc[0])head.push('overall_range','discovery_w40','handling_doubt_w35','next_step_w25','decision','decided_by');
    var L=[head.join(',')],buyers=k==='114'?['Jordan Ellis','Rosa Lin','Tom Becker']:k==='117'?['Maya Chen']:['Priya Shah'],diff=k==='114'?'medium':k==='117'?'easy':'hard';
    for(var i=0;i<R.finished;i++){
      var id='C-'+k+'-'+String(1001+i),rng=k==='114'&&i<9?SHORT[i][1]:(4+((i*7)%30)/10).toFixed(1)+'–'+(5+((i*7)%30)/10).toFixed(1);
      var row=[id,R.req,'v1','2026-11-0'+(1+i%7),'2026-11-0'+(1+i%7)];
      if(inc[2])row.push(k==='114'&&i<9?SHORT[i][2]:buyers[i%buyers.length],diff);
      if(inc[0])row.push(rng,'','','',k==='114'?'pending':(i<(k==='117'?6:3)?'advanced':'pending'),k==='114'?'':(i<(k==='117'?6:3)?(k==='117'?'Alex Romero':'Marcus Lee'):''));
      L.push(row.join(','));}
    L.push('');L.push('# '+R.enrolled+' enrolled, '+R.finished+' finished. Scores cover the three defined skills only. Candidate names are replaced with IDs.');
    return L.join('\n');
  }
  window.fcExport=function(b){
    var inc=[].map.call(incs,function(d){return q('.box',d).classList.contains('on')});
    if(!inc.some(Boolean)){UI.toast('Pick at least one thing to include.');return;}
    var R=ROLES[cur],rg=rangeSel.textContent.trim();b.disabled=true;b.lastChild.textContent='Preparing…';
    setTimeout(function(){b.disabled=false;b.lastChild.textContent='Export';
      UI.download('pm-audit-'+R.req.replace(' ','-').toLowerCase()+'-2026-11-17.csv',csvFor(cur));
      var parts=[];if(inc[0])parts.push('CSV');if(inc[1])parts.push('notices');if(inc[2])parts.push(R.draws+' draw logs');
      var ex=BYC.get('pm-by-exports',[]);ex.unshift(['2026-11-17T10:'+String(20+Math.min(ex.length,39)),'Export','Audit export downloaded',R.req,'','Dana Whitfield',rg.replace(', 2026','')+' · '+parts.join(', ')]);BYC.set('pm-by-exports',ex);
      BY_LOG.unshift({id:'EV-'+(10481+ex.length),t:ex[0][0],type:'Export',ev:'Audit export downloaded',role:R.req,cand:'',by:'Dana Whitfield',det:ex[0][6]});
      logBody.insertAdjacentHTML('afterbegin','<tr class="by-new"><td class="mono dim">Nov 17, '+byFmtTime(ex[0][0]).split(', ')[1]+'</td><td>Audit export downloaded</td><td>–</td><td>Dana Whitfield</td><td class="dim">'+esc(ex[0][6])+'</td></tr>');
    },600);
  };

  if(/#exports/.test(location.hash))showTab('Exports');else if(/#settings/.test(location.hash))showTab('Settings');
})();
