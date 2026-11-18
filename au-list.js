/* Automations list: filters, search, sort, row actions, created automations from au-new.html. */
(function(){
  var E=UI.esc;
  var IC={
    mail:'<svg class="i" viewBox="0 0 16 16"><rect x="2.5" y="3.5" width="11" height="9" rx="1.5"/><path d="m3 4.5 5 4 5-4"/></svg>',
    clock:'<svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/></svg>',
    move:'<svg class="i" viewBox="0 0 16 16"><path d="M3 5.5h8.5L9.5 3.5M13 10.5H4.5l2 2"/></svg>',
    bolt:'<svg class="i" viewBox="0 0 16 16"><path d="M9 2 4 9h4l-1 5 5-7H8z"/></svg>'
  };
  var MORE='<svg class="i" viewBox="0 0 16 16"><circle cx="4" cy="8" r=".8"/><circle cx="8" cy="8" r=".8"/><circle cx="12" cy="8" r=".8"/></svg>';
  var rows=[
    {id:'inv',name:'Invite after phone screen',desc:'Sends the notice and invite at Phone screen, then up to 2 reminders.',roles:['Req 114'],status:'Active',enrolled:212,run:'Today, 9:14 am',rk:914,owner:'Dana Whitfield',icon:'mail',href:'automation.html',
      trigger:'stage',topt:{stage:'Phone screen'},steps:[{t:'email',v:'AE invite, v2',x:'Includes the candidate notice'},{t:'wait',v:'10',x:'Notice period'},{t:'cond',v:'Has not started a call'},{t:'email',v:'Gentle reminder',x:'After 2 days'},{t:'email',v:'Last reminder',x:'After 4 more days'}]},
    {id:'rem',name:'Remind before notice period ends',desc:'Reminds candidates 2 days before the scored call opens.',roles:['All roles'],status:'Active',enrolled:41,run:'Today, 9:00 am',rk:900,owner:'Dana Whitfield',icon:'clock',
      trigger:'before',topt:{days:'2'},steps:[{t:'cond',v:'Has not started practice'},{t:'email',v:'Notice period ending',x:'From Dana Whitfield'}]},
    {id:'rev',name:'Move finished calls to Review stage',desc:'Moves the candidate to Review in the applicant tracker.',roles:['Req 114','Req 117'],status:'Active',enrolled:60,run:'Today, 9:12 am',rk:912,owner:'Dana Whitfield',icon:'move',
      trigger:'finished',topt:{},steps:[{t:'ats',v:'Review',x:'In your applicant tracker'},{t:'task',v:'Marcus Lee',x:'Review the call before the debrief'}]},
    {id:'sdr',name:'Invite SDR Outbound applicants',desc:'Draft. Starts when Req 120 is published.',roles:['Req 120'],status:'Draft',enrolled:0,run:'Never',rk:0,owner:'Dana Whitfield',icon:'mail',locked:true,
      trigger:'stage',topt:{stage:'Phone screen'},steps:[{t:'email',v:'AE invite, v2',x:'Includes the candidate notice'},{t:'wait',v:'10',x:'Notice period'},{t:'email',v:'Gentle reminder',x:'Only if they have not started a call'}]}
  ];
  /* status of the main automation can be changed on automation.html */
  /* saved changes to the built-in automations (PMStore.au), from this list or automation.html */
  for(var bi=rows.length-1;bi>=0;bi--){var o=PMStore.au(rows[bi].id);if(o.archived){rows.splice(bi,1);continue;}['status','name','desc','owner','steps'].forEach(function(k){if(o[k]!==undefined)rows[bi][k]=o[k];});}
  rows.forEach(function(r){if(r.status==='Archived'){r.archivedNow=1;}});
  rows=rows.filter(function(r){return !r.archivedNow;});
  /* Req 120 published on interview setup: its automation can be turned on */
  rows.forEach(function(r){if(r.id==='sdr'&&PMStore.isLive('120')){r.locked=false;if(r.desc.indexOf('Draft. Starts')===0)r.desc='Req 120 is live. Turn this on to start sending invites.';}});
  var created=AU.load();
  created.forEach(function(a){rows.push({id:a.id,name:a.name,desc:a.desc||('Created '+a.created+'. '+a.steps.length+' step'+(a.steps.length===1?'':'s')+'.'),roles:a.roles||['All roles'],status:a.status,enrolled:0,run:'Never',rk:0,owner:a.owner||'Dana Whitfield',icon:'bolt',trigger:a.trigger,topt:a.topt||{},steps:a.steps,isNew:true});});
  var newId=(location.search.match(/[?&]new=([^&]+)/)||[])[1];

  var F={status:[],role:[],owner:[]},q='',sort='run-desc';
  var SORTS={'run-desc':['Last run','Last run, newest first'],'run-asc':['Last run','Last run, oldest first'],'enr-desc':['Enrolled','Most enrolled first'],'name':['Name','Name, A to Z']};
  var tb=document.getElementById('auRows');

  function visible(){
    var out=rows.filter(function(r){
      if(F.status.length&&F.status.indexOf(r.status)<0)return false;
      if(F.role.length&&!r.roles.some(function(x){return F.role.indexOf(x)>=0}))return false;
      if(F.owner.length&&F.owner.indexOf(r.owner)<0)return false;
      if(q&&(r.name+' '+r.desc+' '+r.roles.join(' ')).toLowerCase().indexOf(q)<0)return false;
      return true;
    });
    out.sort(function(a,b){
      if(sort==='run-desc')return b.rk-a.rk;
      if(sort==='run-asc')return a.rk-b.rk;
      if(sort==='enr-desc')return b.enrolled-a.enrolled;
      return a.name.localeCompare(b.name);
    });
    return out;
  }
  function swHtml(r){var on=r.status==='Active';return '<button class="au-st" data-js data-a="toggle" aria-pressed="'+on+'"><span class="sw'+(on?' on':'')+'"></span><span class="au-stl">'+r.status+'</span></button>';}
  function render(){
    var v=visible();
    tb.innerHTML=v.length?v.map(function(r){
      return '<tr data-id="'+r.id+'"'+(r.id===newId?' class="au-new"':'')+'><td><div class="au-nm"><span class="au-ic">'+IC[r.icon]+'</span><div><a href="'+(r.href||'#')+'" data-js data-a="open">'+E(r.name)+'</a><small>'+E(r.desc)+'</small></div></div></td>'+
        '<td><span class="au-roles">'+r.roles.map(function(x){return '<span class="tag gray">'+E(x)+'</span>'}).join('')+'</span></td>'+
        '<td>'+swHtml(r)+'</td><td class="au-n'+(r.enrolled?'':' au-dim')+'">'+r.enrolled+'</td><td class="au-dim">'+E(r.run)+'</td>'+
        '<td><div class="au-own"><span class="au-av">'+r.owner.split(' ').map(function(w){return w[0]}).join('')+'</span>'+E(r.owner)+'</div></td>'+
        '<td class="au-act"><button class="btn sm" data-js data-a="edit">Edit</button><button class="au-more" data-js data-a="more" aria-label="More actions">'+MORE+'</button></td></tr>';
    }).join(''):'<tr class="au-empty"><td colspan="7">No automations match these filters. <button class="btn sm" data-js data-a="clear" style="margin-left:6px">Clear all</button></td></tr>';
    var act=rows.filter(function(r){return r.status==='Active'}).length,dr=rows.filter(function(r){return r.status==='Draft'}).length,pa=rows.filter(function(r){return r.status==='Paused'}).length;
    document.getElementById('auSum').innerHTML='<span id="auActive">'+act+'</span> active'+(pa?' · '+pa+' paused':'')+' · '+dr+' draft'+(dr===1?'':'s');
    document.getElementById('auCount').textContent=v.length?('1–'+v.length+' of '+v.length+(v.length<rows.length?' · '+rows.length+' in total':'')):'0 of '+rows.length;
    [['auFStatus','Status','status'],['auFRole','Role','role'],['auFOwner','Owner','owner']].forEach(function(f){
      var b=document.getElementById(f[0]),n=F[f[2]];b.firstChild.textContent=n.length===1?f[1]+': '+n[0]:n.length?f[1]+' · '+n.length:f[1];b.classList.toggle('au-fon',n.length>0);
    });
    document.getElementById('auClear').hidden=!(F.status.length||F.role.length||F.owner.length||q);
    document.getElementById('auSortL').textContent=SORTS[sort][0]+(sort==='run-asc'?' ↑':'');
  }
  function byId(id){for(var i=0;i<rows.length;i++)if(rows[i].id===id)return rows[i];}
  function filterMenu(btn,key,opts){
    UI.menu(btn,opts.map(function(o){return {label:o,check:F[key].indexOf(o)>=0,onClick:function(){var i=F[key].indexOf(o);if(i<0)F[key].push(o);else F[key].splice(i,1);render();}};}).concat([{sep:true},{label:'Clear',onClick:function(){F[key]=[];render();}}]),{align:'left'});
  }
  UI.wire('#auFStatus',function(b){filterMenu(b,'status',['Active','Paused','Draft']);});
  UI.wire('#auFRole',function(b){filterMenu(b,'role',['Req 114','Req 117','Req 120','All roles']);});
  UI.wire('#auFOwner',function(b){filterMenu(b,'owner',['Dana Whitfield','Marcus Lee']);});
  function clearAll(){F={status:[],role:[],owner:[]};q='';document.getElementById('auQ').value='';render();}
  UI.wire('#auClear',clearAll);
  UI.wire('#auSort',function(b){UI.menu(b,Object.keys(SORTS).map(function(k){return {label:SORTS[k][1],check:sort===k,onClick:function(){sort=k;render();UI.toast('Sorted by '+SORTS[k][1].toLowerCase()+'.');}};}));});
  document.getElementById('auQ').addEventListener('input',function(){q=this.value.trim().toLowerCase();render();});

  UI.wire('#auHow',function(){UI.modal({title:'How sending works',body:
    '<p>Every email an automation sends comes from a real person on your team, picked in the step. Candidates see that person\'s name and address, and replies go to their inbox.</p>'+
    '<p>Emails go out on weekdays between 9:00 am and 5:00 pm in the candidate\'s time zone. If an automation runs at night or on a weekend, the email waits for the next window.</p>'+
    '<p>The first email always includes the candidate notice. The scored call stays closed until the candidate has read the notice and agreed to it.</p>'+
    '<p>If a candidate asks for an accommodation or replies to an email, their reminders stop until the recruiter answers. Only recruiters see accommodation requests.</p>'+
    '<p>Automations never advance or decline anyone. A person on the hiring team makes every decision.</p>'});});

  function stepsHtml(r){
    return '<div class="au-h4">Trigger</div><ol class="au-steps"><li><span class="au-sn">⚡</span><div>'+E(AU.triggerText(r.trigger,r.topt))+'<small>'+E((AU.TRIGGERS[r.trigger]||{}).help||'')+'</small></div></li></ol>'+
      '<div class="au-h4">Steps</div><ol class="au-steps">'+r.steps.map(function(s,i){return '<li><span class="au-sn">'+(i+1)+'</span><div>'+E(AU.stepTitle(s))+(s.x?'<small>'+E(s.x)+'</small>':'')+'</div></li>';}).join('')+'</ol>';
  }
  function view(r){
    if(r.href){location.href=r.href;return;}
    UI.drawer({title:r.name,width:480,body:
      '<dl class="au-dl"><dt>Status</dt><dd>'+r.status+'</dd><dt>Roles</dt><dd>'+E(r.roles.join(', '))+'</dd><dt>Owner</dt><dd>'+E(r.owner)+'</dd><dt>Enrolled</dt><dd>'+r.enrolled+' candidates</dd><dt>Last run</dt><dd>'+E(r.run)+'</dd></dl>'+stepsHtml(r)+
      '<p class="au-dim" style="font-size:12px">Emails send from '+E(r.owner)+' on weekdays, 9:00 am to 5:00 pm in the candidate\'s time zone.</p>',
      actions:[{label:'Close'},{label:'Edit',primary:true,onClick:function(){setTimeout(function(){edit(r)},0);}}]});
  }
  function optList(list,cur){return list.map(function(o){return '<option'+(o===cur?' selected':'')+'>'+E(o)+'</option>'}).join('');}
  function stepField(s,i){
    var lab=AU.STEPS[s.t].label,inp;
    if(s.t==='email')inp='<select data-i="'+i+'">'+optList(AU.EMAILS,s.v)+'</select>';
    else if(s.t==='wait')inp='<input type="number" min="1" max="30" data-i="'+i+'" value="'+E(s.v)+'">';
    else if(s.t==='task')inp='<select data-i="'+i+'">'+optList(['Dana Whitfield','Marcus Lee','Alex Romero'],s.v)+'</select>';
    else if(s.t==='ats')inp='<select data-i="'+i+'">'+optList(AU.STAGES,s.v)+'</select>';
    else inp='<input data-i="'+i+'" value="'+E(s.v)+'">';
    return '<label>Step '+(i+1)+' · '+lab+(s.t==='wait'?' (business days)':'')+'</label>'+inp;
  }
  function edit(r){
    if(r.href){location.href=r.href;return;}
    UI.drawer({title:'Edit '+r.name,width:480,body:
      '<label for="auEN">Name</label><input id="auEN" value="'+E(r.name)+'"><label for="auED">Description</label><input id="auED" value="'+E(r.desc)+'">'+
      '<label for="auEO">Owner and sender</label><select id="auEO">'+optList(['Dana Whitfield','Marcus Lee'],r.owner)+'</select>'+
      r.steps.map(stepField).join('')+'<p class="au-dim" style="font-size:12px;margin-top:12px">Changes apply to candidates who enroll after you save.</p>',
      actions:[{label:'Cancel'},{label:'Save',primary:true,onClick:function(d){
        var n=d.querySelector('#auEN');if(!n.value.trim()){n.style.borderColor='#B42318';n.focus();return false;}
        r.name=n.value.trim();r.desc=d.querySelector('#auED').value.trim();r.owner=d.querySelector('#auEO').value;
        d.querySelectorAll('[data-i]').forEach(function(el){r.steps[+el.getAttribute('data-i')].v=el.value;});
        persist(r);render();UI.toast('Saved changes to '+r.name+'.');}}]});
    // drawer body uses modal input styles
    var b=document.querySelector('.ui-dr .ui-md-b');if(b)b.classList.add('au-form');
  }
  function persist(r){
    if(!r.isNew){PMStore.setAu(r.id,{status:r.status,name:r.name,desc:r.desc,owner:r.owner,steps:r.steps});return;}var list=AU.load();list.forEach(function(a){if(a.id===r.id){a.name=r.name;a.desc=r.desc;a.status=r.status;a.owner=r.owner;a.steps=r.steps;}});AU.save(list);
  }
  function toggle(r){
    if(r.locked){UI.toast('Publish Req 120 before turning this on.');return;}
    var was=r.status;r.status=r.status==='Active'?'Paused':'Active';
    persist(r);render();
    UI.toast(r.status==='Active'?(was==='Draft'?r.name+' is on. Candidates enroll from now.':r.name+' is on again. New candidates enroll from now.'):r.name+' is paused. No new candidates enroll and no emails go out.');
  }
  function more(btn,r){
    var on=r.status==='Active';
    UI.menu(btn,[
      {label:'Open',onClick:function(){view(r)}},
      {label:'Rename',onClick:function(){UI.modal({title:'Rename automation',body:'<label for="auRn">Name</label><input id="auRn" value="'+E(r.name)+'">',actions:[{label:'Cancel'},{label:'Rename',primary:true,onClick:function(m){var v=m.querySelector('#auRn').value.trim();if(!v)return false;var old=r.name;r.name=v;persist(r);render();UI.toast('Renamed '+old+' to '+v+'.');}}]});}},
      {label:'Duplicate',onClick:function(){var c=JSON.parse(JSON.stringify(r));c.id=r.id+'-copy'+Date.now();c.name='Copy of '+r.name;c.status='Draft';c.enrolled=0;c.run='Never';c.rk=0;delete c.href;c.locked=false;c.isNew=false;c.desc=r.status==='Draft'?r.desc:'Draft copy. '+r.desc;c.isNew=true;c.icon='bolt';
        var L=AU.load();L.push({id:c.id,name:c.name,desc:c.desc,roles:c.roles,status:'Draft',owner:c.owner,trigger:c.trigger,topt:c.topt,steps:c.steps,created:'Nov 17'});AU.save(L);rows.splice(rows.indexOf(r)+1,0,c);render();UI.toast('Duplicated as '+c.name+'. It starts as a draft.');}},
      {label:on?'Pause':(r.status==='Draft'?'Turn on':'Resume'),onClick:function(){toggle(r)}},
      {label:'Download run log',onClick:function(){
        var lines=['automation,status,enrolled,last_run,owner',[r.name,r.status,r.enrolled,r.run,r.owner].map(function(x){return '"'+String(x).replace(/"/g,'""')+'"'}).join(',')];
        UI.download(r.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-runs.csv',lines.join('\n'));}},
      {sep:true},
      {label:'Archive',danger:true,onClick:function(){UI.confirm('Archive '+r.name+'?',on?'It stops right away. Candidates already in it get no more emails. You can find it in Archived for 90 days.':'It moves to Archived. You can restore it for 90 days.','Archive',function(){rows.splice(rows.indexOf(r),1);if(r.isNew){AU.save(AU.load().filter(function(a){return a.id!==r.id}));}else PMStore.setAu(r.id,{archived:true});render();UI.toast('Archived '+r.name+'.');},true);}}
    ]);
  }
  tb.addEventListener('click',function(e){
    var el=e.target.closest('[data-a]');if(!el)return;var tr=el.closest('tr'),r=tr&&byId(tr.getAttribute('data-id')),a=el.getAttribute('data-a');
    if(a==='clear'){e.preventDefault();clearAll();return;}
    if(!r)return;
    if(a==='open'){if(r.href)return;e.preventDefault();view(r);}
    else if(a==='edit'){e.preventDefault();edit(r);}
    else if(a==='toggle'){e.preventDefault();toggle(r);}
    else if(a==='more'){e.preventDefault();more(el,r);}
  });
  render();
  if(newId){var r=byId(newId);if(r)setTimeout(function(){UI.toast('Created '+r.name+'. It is '+(r.status==='Active'?'on and enrolling candidates.':'saved as a draft.'));},300);}
})();
