/* New automation: pick a trigger, add steps, name it, save to localStorage (pm-au-new). */
(function(){
  var E=UI.esc,D=document;
  var st={trigger:'stage',topt:{stage:'Phone screen',days:'2'},steps:[]};
  var nameIn=D.getElementById('nwName');

  function opts(list,cur){return list.map(function(o){return '<option'+(o===cur?' selected':'')+'>'+E(o)+'</option>'}).join('');}
  function drawTrig(){
    D.getElementById('nwTrig').innerHTML=Object.keys(AU.TRIGGERS).map(function(k){var T=AU.TRIGGERS[k];
      return '<button class="au-trig'+(st.trigger===k?' on':'')+'" data-js data-trig="'+k+'" aria-pressed="'+(st.trigger===k)+'"><span class="au-rd"></span><span><b>'+E(T.label)+'</b><small>'+E(T.help)+'</small></span></button>';}).join('');
    var o=D.getElementById('nwTopt');
    if(st.trigger==='stage')o.innerHTML='<div><label class="lab" for="nwStage">Stage in your applicant tracker</label><select class="au-in" id="nwStage">'+opts(AU.STAGES,st.topt.stage)+'</select></div>';
    else if(st.trigger==='before')o.innerHTML='<div><label class="lab" for="nwDays">Business days before</label><input class="au-in" id="nwDays" type="number" min="1" max="9" value="'+E(st.topt.days)+'"></div>';
    else o.innerHTML='';
  }
  function field(s,i){
    if(s.t==='email')return '<select class="au-in" data-k="v" data-i="'+i+'" aria-label="Email template">'+opts(AU.EMAILS,s.v)+'</select>';
    if(s.t==='wait')return '<input class="au-in" type="number" min="1" max="30" data-k="v" data-i="'+i+'" value="'+E(s.v)+'" aria-label="Business days">';
    if(s.t==='task')return '<select class="au-in" data-k="v" data-i="'+i+'" aria-label="Assign to">'+opts(['Dana Whitfield','Marcus Lee','Alex Romero'],s.v)+'</select>';
    if(s.t==='ats')return '<select class="au-in" data-k="v" data-i="'+i+'" aria-label="Stage">'+opts(AU.STAGES,s.v)+'</select>';
    if(s.t==='cond')return '<select class="au-in" data-k="v" data-i="'+i+'" aria-label="Condition">'+opts(['Has not started practice','Has not started a call','Has not opened the invite','Call not reviewed yet'],s.v)+'</select>';
    return '<select class="au-in" data-k="v" data-i="'+i+'" aria-label="Pause">'+opts(['This candidate','All automations'],s.v)+'</select>';
  }
  var UP='<svg class="i" viewBox="0 0 16 16"><path d="m4.5 10 3.5-3.5 3.5 3.5"/></svg>',DN='<svg class="i" viewBox="0 0 16 16"><path d="m4.5 6.5 3.5 3.5 3.5-3.5"/></svg>',X='<svg class="i" viewBox="0 0 16 16"><path d="m4.5 4.5 7 7M11.5 4.5l-7 7"/></svg>';
  function drawSteps(){
    D.getElementById('nwSteps').innerHTML=st.steps.map(function(s,i){var S=AU.STEPS[s.t];
      return '<div class="au-step"><span class="au-sn">'+(i+1)+'</span><div><div class="au-sh2"><span class="tag '+S.tagc+'">'+S.tag+'</span><b>'+E(AU.stepTitle(s))+'</b></div>'+
        '<div class="au-sf">'+field(s,i)+'<input class="au-in" data-k="x" data-i="'+i+'" value="'+E(s.x||'')+'" placeholder="Note for your team (optional)" aria-label="Note"></div></div>'+
        '<div class="au-sa"><button class="au-ib" data-js data-mv="-1" data-i="'+i+'" aria-label="Move up"'+(i===0?' disabled':'')+'>'+UP+'</button><button class="au-ib" data-js data-mv="1" data-i="'+i+'" aria-label="Move down"'+(i===st.steps.length-1?' disabled':'')+'>'+DN+'</button><button class="au-ib" data-js data-rm data-i="'+i+'" aria-label="Remove step">'+X+'</button></div></div>';}).join('');
    drawSum();
  }
  function drawSum(){
    var items=['<li class="t"><span>⚡</span><div>'+E(AU.triggerText(st.trigger,st.topt))+'</div></li>'];
    st.steps.forEach(function(s,i){items.push('<li><span>'+(i+1)+'</span><div>'+E(AU.stepTitle(s))+(s.x?'<div class="help" style="margin-top:0">'+E(s.x)+'</div>':'')+'</div></li>');});
    if(!st.steps.length)items.push('<li><span>·</span><div class="au-dim" style="color:var(--mute)">No steps yet</div></li>');
    D.getElementById('nwSum').innerHTML=items.join('');
    var n=nameIn.value.trim();D.getElementById('nwTitle').textContent=n||'New automation';
  }
  function applyTpl(t){
    st.trigger=t.trigger;for(var k in t.topt)st.topt[k]=t.topt[k];
    st.steps=JSON.parse(JSON.stringify(t.steps));
    if(!nameIn.value.trim())nameIn.value=t.name;
    drawTrig();drawSteps();
  }
  D.getElementById('nwTrig').addEventListener('click',function(e){var b=e.target.closest('[data-trig]');if(!b)return;st.trigger=b.getAttribute('data-trig');drawTrig();drawSum();});
  D.getElementById('nwTopt').addEventListener('input',function(e){if(e.target.id==='nwStage')st.topt.stage=e.target.value;if(e.target.id==='nwDays')st.topt.days=e.target.value||'1';drawSum();});
  D.getElementById('nwTopt').addEventListener('change',function(e){if(e.target.id==='nwStage'){st.topt.stage=e.target.value;drawSum();}});
  var sl=D.getElementById('nwSteps');
  function onField(e){var el=e.target;if(!el.hasAttribute('data-k'))return;var s=st.steps[+el.getAttribute('data-i')];s[el.getAttribute('data-k')]=el.value;
    if(el.getAttribute('data-k')==='v'){var b=el.closest('.au-step').querySelector('.au-sh2 b');b.textContent=AU.stepTitle(s);}drawSum();}
  sl.addEventListener('input',onField);sl.addEventListener('change',onField);
  sl.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;var i=+b.getAttribute('data-i');
    if(b.hasAttribute('data-rm')){var s=st.steps.splice(i,1)[0];drawSteps();UI.toast('Removed step '+(i+1)+': '+AU.stepTitle(s)+'.');}
    else if(b.hasAttribute('data-mv')){var j=i+(+b.getAttribute('data-mv'));var t=st.steps[i];st.steps[i]=st.steps[j];st.steps[j]=t;drawSteps();}
  });
  var DEF={email:'Gentle reminder',wait:'2',cond:'Has not started a call',task:'Dana Whitfield',ats:'Review',pause:'This candidate'};
  UI.wire('#nwAdd',function(b){
    UI.menu(b,[{header:'Add a step'}].concat(Object.keys(AU.STEPS).map(function(k){return {label:AU.STEPS[k].label,onClick:function(){st.steps.push({t:k,v:DEF[k],x:''});drawSteps();var f=sl.querySelectorAll('.au-step');f=f[f.length-1].querySelector('[data-k="v"]');if(f)f.focus();D.getElementById('nwStepErr').hidden=true;}};})),{align:'left'});
  });
  UI.wire('#nwTpl',function(){
    var md=UI.modal({title:'Start from a template',wide:true,body:'<p>Picking a template replaces the trigger and steps below. Your name and roles stay.</p><div class="au-tg">'+AU.TPL.map(function(t){return '<button data-js data-t="'+t.id+'"><b>'+E(t.name)+'</b><small>'+t.steps.length+' steps · '+E(t.cat)+'</small></button>';}).join('')+'</div>',actions:[{label:'Cancel'}]});
    md.querySelectorAll('[data-t]').forEach(function(b){b.addEventListener('click',function(){applyTpl(AU.tpl(b.getAttribute('data-t')));md.close();UI.toast('Loaded the '+AU.tpl(b.getAttribute('data-t')).name+' template.');});});
  });
  nameIn.addEventListener('input',function(){nameIn.classList.remove('bad');D.getElementById('nwNameErr').hidden=true;drawSum();});
  D.getElementById('nwRoles').addEventListener('change',function(){D.getElementById('nwRoleErr').hidden=true;});

  function save(status){
    var name=nameIn.value.trim(),roles=[].map.call(D.querySelectorAll('#nwRoles input:checked'),function(c){return c.value;}),ok=true;
    if(!name){nameIn.classList.add('bad');D.getElementById('nwNameErr').hidden=false;nameIn.focus();ok=false;}
    if(!roles.length){D.getElementById('nwRoleErr').hidden=false;ok=false;}
    if(!st.steps.length){D.getElementById('nwStepErr').hidden=false;ok=false;}
    if(!ok){UI.toast('Fill in the highlighted fields before saving.');return;}
    if(status==='Active'&&roles.length===1&&roles[0]==='Req 120'){UI.toast('Req 120 is a draft. Save as draft, or add a live role.');return;}
    var a={id:'n'+Date.now(),name:name,roles:roles,owner:D.getElementById('nwOwner').value,status:status,trigger:st.trigger,topt:{stage:st.topt.stage,days:st.topt.days},steps:st.steps,created:'Nov 17'};
    a.desc=AU.triggerText(a.trigger,a.topt)+', '+st.steps.length+' step'+(st.steps.length===1?'':'s')+'.';
    var list=AU.load();list.push(a);AU.save(list);
    location.href='automations.html?new='+a.id;
  }
  UI.wire('#nwDraft',function(){save('Draft');});
  UI.wire('#nwOn',function(){save('Active');});

  var tp=(location.search.match(/[?&]tpl=([^&]+)/)||[])[1],t=tp&&AU.tpl(tp);
  drawTrig();
  if(t){applyTpl(t);}else{st.steps=[{t:'email',v:'AE invite, v2',x:'Includes the candidate notice'}];drawSteps();}
})();
