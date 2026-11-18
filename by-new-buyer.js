/* by-new-buyer.html: create (or edit) a draft buyer, saved to localStorage pm-by-new */
(function(){
  var esc=UI.esc,$=function(id){return document.getElementById(id)};
  var MOODS=['Cold','Rushed','Neutral','Open','Warm'];
  var SUGG=['Price is too high','We tried a tool like this','No time to switch','Drivers won’t use it','Need sign-off from finance','Happy with what we have'];
  var GUARD=['Ends the call politely at the time limit; never mid-sentence.','Does not invent numbers beyond the brief.','Never asks about age, family or background.','Never uses personal insults.','Never comments on the candidate’s voice, accent or pauses.'];
  var LOCK='<svg class="i" viewBox="0 0 16 16"><rect x="4" y="7.5" width="8" height="6" rx="1"/><path d="M5.5 7.5V5.5a2.5 2.5 0 0 1 5 0v2"/></svg>';
  var all=BYC.get('pm-by-new',[]);
  var m=location.search.match(/id=([\w-]+)/),editing=null;
  if(m)all.forEach(function(n){if(n.id===m[1])editing=n;});
  var st=editing?JSON.parse(JSON.stringify(editing)):{name:'',role:'',company:'',size:'',persona:'',start:1,best:2,voice:'lena',objections:[]};

  $('byStart').innerHTML=MOODS.map(function(x,i){return '<option value="'+i+'">'+x+'</option>'}).join('');
  $('byBest').innerHTML=$('byStart').innerHTML;
  ['byName','byRole','byCo','bySize','byPersona'].forEach(function(id,i){var k=['name','role','company','size','persona'][i];$(id).value=st[k]||'';
    $(id).addEventListener('input',function(){st[k]=$(id).value;if(id==='byName'||id==='byRole'){$(id).classList.remove('by-err');$(id+'Err').classList.remove('on');}dirty();draw();});});
  $('byStart').value=st.start;$('byBest').value=st.best;
  $('byStart').addEventListener('change',function(){st.start=+this.value;if(st.best<st.start){st.best=st.start;$('byBest').value=st.best;}dirty();draw();});
  $('byBest').addEventListener('change',function(){st.best=+this.value;if(st.best<st.start){st.start=st.best;$('byStart').value=st.start;}dirty();draw();});

  if(editing){$('byH1').textContent='Edit '+editing.name;$('byCrumb').textContent=editing.name;document.title=editing.name+' · Edit buyer · PM';$('byMeta').textContent='Saved today';$('bySave').textContent='Save changes';}

  /* voices */
  function voices(){
    $('byVoices').innerHTML=BYC.VOICES.map(function(v){return '<label class="by-vo'+(st.voice===v.id?' on':'')+'" data-v="'+v.id+'"><input type="radio" name="byVoice" value="'+v.id+'"'+(st.voice===v.id?' checked':'')+'>'+
      '<button class="by-play" type="button" data-js aria-label="Play '+v.name+' sample">'+BYC.PLAY+'</button><span><b>'+v.name+'</b><small>'+v.desc+'</small></span>'+
      '<span class="by-vt"><span><i></i></span><em style="font-style:normal">0:00 / '+BYC.fmt(v.len)+'</em></span></label>';}).join('');
    $('byVoices').querySelectorAll('.by-vo').forEach(function(row){
      var v=BYC.voice(row.getAttribute('data-v'));
      row.querySelector('input').addEventListener('change',function(){st.voice=v.id;$('byVoices').querySelectorAll('.by-vo').forEach(function(r){r.classList.toggle('on',r===row)});dirty();draw();});
      row.querySelector('.by-play').addEventListener('click',function(e){e.preventDefault();e.stopPropagation();BYC.play(this,v.len,{bar:row.querySelector('.by-vt i'),time:row.querySelector('.by-vt em')});});
    });
  }
  /* objections */
  function objs(){
    $('byObj').innerHTML=st.objections.length?st.objections.map(function(o,i){return '<div class="by-oi"><span>'+esc(o)+'</span>'+(i===0?'<span class="tag gray">Main concern</span>':'')+'<button type="button" data-js data-i="'+i+'" aria-label="Remove '+esc(o)+'">×</button></div>';}).join(''):'<div class="help" style="margin:0">No objections yet. Add at least one so the buyer has something to push back on.</div>';
    $('byObj').querySelectorAll('button').forEach(function(b){b.onclick=function(){st.objections.splice(+b.getAttribute('data-i'),1);dirty();objs();draw();};});
    $('bySugg').innerHTML=SUGG.filter(function(s){return st.objections.indexOf(s)<0}).map(function(s){return '<button type="button" data-js>+ '+esc(s)+'</button>'}).join('');
    $('bySugg').querySelectorAll('button').forEach(function(b){b.onclick=function(){st.objections.push(b.textContent.slice(2));dirty();objs();draw();};});
  }
  function addObj(){var v=$('byObjIn').value.trim();if(!v){$('byObjIn').focus();return;}st.objections.push(v);$('byObjIn').value='';dirty();objs();draw();}
  $('byObjAdd').addEventListener('click',addObj);
  $('byObjIn').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();addObj();}});

  function draw(){
    var bar='',lbl='';for(var k=0;k<5;k++){bar+='<i class="'+(k===st.start?'st':(k>st.start&&k<=st.best?'on':''))+'"></i>';lbl+='<span>'+MOODS[k]+'</span>';}
    $('byMoodBar').innerHTML=bar;$('byMoodLbl').innerHTML=lbl;
    $('byMoodHelp').textContent=st.start===st.best?'Stays '+MOODS[st.start].toLowerCase()+' the whole call.':'Starts '+MOODS[st.start].toLowerCase()+'. Good questions can move them to '+MOODS[st.best].toLowerCase()+', never past it.';
    var nm=st.name.trim();
    $('pvAv').textContent=nm?nm.split(/\s+/).map(function(w){return w.charAt(0)}).join('').slice(0,2).toUpperCase():'?';
    $('pvName').textContent=nm||'Unnamed buyer';
    $('pvRole').textContent=[st.role.trim()||'Role not set',st.size.trim()].filter(Boolean).join(' · ');
    $('pvPersona').textContent=st.persona.trim()||'No persona yet.';
    $('pvMood').textContent=MOODS[st.start]+(st.best>st.start?' to '+MOODS[st.best]:'');
    var v=BYC.voice(st.voice);$('pvVoice').textContent=v.name+' · '+v.desc.split(' · ')[0];
    $('pvConcern').textContent=st.objections[0]||'None yet';
  }
  var isDirty=false;function dirty(){isDirty=true;$('byMeta').textContent='Unsaved changes';}
  $('pvGuard').innerHTML=GUARD.concat(BYC.get('pm-by-wsg',[]).filter(function(g){return !g.lock}).map(function(g){return g.t})).map(function(g){return '<li>'+LOCK+'<span>'+esc(g)+'</span></li>'}).join('');

  function save(then){
    var ok=true;
    ['byName','byRole'].forEach(function(id){if(!$(id).value.trim()){$(id).classList.add('by-err');$(id+'Err').classList.add('on');if(ok)$(id).focus();ok=false;}});
    if(!ok){UI.toast('Add a name and role before you save.');return;}
    var rec={id:editing?editing.id:'n'+Date.now().toString(36),name:st.name.trim(),role:st.role.trim(),company:st.company.trim(),size:st.size.trim(),persona:st.persona.trim(),
      start:st.start,best:st.best,voice:st.voice,objections:st.objections.slice(),t:new Date().toTimeString().slice(0,5)};
    all=BYC.get('pm-by-new',[]);
    if(editing)all=all.map(function(n){return n.id===rec.id?rec:n});else all.unshift(rec);
    BYC.set('pm-by-new',all);isDirty=false;
    location.href=then==='test'?'test-call.html':'buyers.html?new='+rec.id;
  }
  $('bySave').addEventListener('click',function(){save();});
  $('bySaveTest').addEventListener('click',function(){save('test');});
  voices();objs();draw();
  if(!editing)$('byName').focus();
})();
