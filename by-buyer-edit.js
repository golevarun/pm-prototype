/* buyer-edit.html wiring (prefix by-) */
(function(){
  var esc=UI.esc,q=function(s,r){return (r||document).querySelector(s)},qa=function(s,r){return (r||document).querySelectorAll(s)};
  var MOODS=['Cold','Rushed','Neutral','Warm'],POS=[0,33.333,66.667,100];
  if(BYC.get('pm-by-rosa','')==='discarded')BYC.set('pm-by-rosa','draft');
  var F={name:'#beName',role:'#beRole',company:'#beCo',size:'#beSize',concern:'#beConcern',decide:'textarea[aria-label="How she decides"]',
    sayyes:'textarea[aria-label="What makes her say yes"]',endearly:'textarea[aria-label="What makes her end the call early"]',opening:'input[aria-label="Sample opening line"]'};
  var LABEL={name:'Name',role:'Role',company:'Company',size:'Fleet size',concern:'Concern',decide:'How she decides',sayyes:'What makes her say yes',endearly:'What makes her end the call early',opening:'Sample opening line',mood:'Mood range',voice:'Voice',guard:'Guardrails'};
  function cur(){var o={};for(var k in F)o[k]=q(F[k]).value;o.mood=st.mood.slice();o.voice=st.voice;o.guard=st.guard.slice();return o;}
  var st={mood:[1,2],voice:'lena',guard:['Hangs up politely at the time limit; never mid-sentence.','Does not invent fleet numbers beyond the brief.']};
  var base={};for(var k in F)base[k]=q(F[k]).value;
  var V2=Object.assign({},base,{sayyes:'Agrees to a 20-minute demo if the rep keeps it under five minutes.',opening:'Hi, this is Rosa. I’m between route checks. What’s this about?',mood:[1,1],voice:'lena',guard:st.guard.slice()});
  var V1=Object.assign({},V2,{sayyes:'Agrees to a demo if the rep asks about her routes first.',opening:'Rosa Lin speaking. What can I do for you?',mood:[2,2],voice:'ruth',guard:['Hangs up politely at the time limit; never mid-sentence.']});
  var restored='';
  function moodTxt(m){return m[0]===m[1]?MOODS[m[0]]+' the whole call':'Starts '+MOODS[m[0]].toLowerCase()+', can move to '+MOODS[m[1]].toLowerCase();}
  function val(o,k){if(k==='mood')return moodTxt(o.mood);if(k==='voice'){var v=BYC.voice(o.voice);return v.name+' · '+v.desc.split(' · ')[0];}if(k==='guard')return o.guard.join(' / ');return o[k];}

  /* ---------- mood pickers ---------- */
  var knobS=q('.be-knob[aria-label^="Starting mood"]'),knobB=q('.be-knob[aria-label^="Best mood"]');
  var sels=qa('.be-rng .select');
  function drawMood(){
    var s=st.mood[0],b=st.mood[1];
    knobS.style.left=POS[s]+'%';knobB.style.left=POS[b]+'%';knobB.style.display=s===b?'none':'';
    knobS.setAttribute('aria-label','Starting mood: '+MOODS[s]);knobB.setAttribute('aria-label','Best mood: '+MOODS[b]);
    var fill=q('.be-fill');fill.style.left=POS[s]+'%';fill.style.width=(POS[b]-POS[s])+'%';
    q('.be-mood').setAttribute('aria-label','Mood range: '+MOODS[s]+' to '+MOODS[b]);
    qa('.be-ml span').forEach(function(x,i){x.classList.toggle('on',i===s||i===b)});
    sels[0].firstChild.textContent=MOODS[s];sels[1].firstChild.textContent=MOODS[b];
    var help=q('.be-rng').nextElementSibling;
    help.textContent=s===b?'She stays '+MOODS[s].toLowerCase()+' the whole call.':'She starts '+MOODS[s].toLowerCase()+'. Good questions can move her to '+MOODS[b].toLowerCase()+', never past it.';
  }
  function pick(anchor,which){
    UI.menu(anchor,[{header:which?'Best mood':'Starting mood'}].concat(MOODS.map(function(m,i){
      var dis=which?i<st.mood[0]:false;
      return {label:m,check:st.mood[which]===i,small:dis?'Below start':'',onClick:function(){
        if(dis){UI.toast('Best mood can’t be below the starting mood.');return;}
        st.mood[which]=i;if(!which&&st.mood[1]<i)st.mood[1]=i;drawMood();changed();}};})),{align:'left'});
  }
  UI.wire(knobS,function(){pick(knobS,0);});UI.wire(knobB,function(){pick(knobB,1);});
  sels.forEach(function(s,i){s.setAttribute('role','button');s.setAttribute('tabindex','0');s.style.cursor='pointer';
    s.addEventListener('click',function(){pick(s,i);});s.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(s,i);}});});
  [knobS,knobB].forEach(function(k,i){k.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();var d=e.key==='ArrowRight'?1:-1,n=st.mood[i]+d;
      if(n<0||n>3)return;if(i===1&&n<st.mood[0])return;st.mood[i]=n;if(i===0&&st.mood[1]<n)st.mood[1]=n;drawMood();changed();}});});

  /* ---------- saving + diff ---------- */
  var meta=q('.be-acts .meta'),edited=q('.be-sec .help');
  function changed(){meta.textContent='Draft saved just now';edited.textContent='Edited by Dana Whitfield, just now.';drawDiff();}
  for(var k2 in F)q(F[k2]).addEventListener('input',function(){clearTimeout(this._t);meta.textContent='Saving…';this._t=setTimeout(changed,500);});
  function drawDiff(){
    var c=cur(),keys=['name','role','company','size','concern','mood','decide','sayyes','endearly','opening','voice','guard'],h='',n=0;
    keys.forEach(function(k){if(val(c,k)===val(V2,k))return;n++;
      h+='<div><b>'+LABEL[k]+'</b><div class="be-dl be-old"><em>−</em><span>'+esc(val(V2,k))+'</span></div><div class="be-dl be-new"><em>+</em><span>'+esc(val(c,k))+'</span></div></div>';});
    var box=q('.be-diff');box.innerHTML=h||'<div class="by-nodiff">No changes from v2. Calls on v2 and this draft would be the same.</div>';
    q('.be-sech .meta').textContent=n===1?'1 change':n+' changes';
    // "Changed from v2" tags and was-lines on persona cards
    var map={'Mood range':'mood','What makes her say yes':'sayyes','Sample opening line':'opening'};
    qa('.be-wrap .card').forEach(function(card){var h2=q('.ch h2',card);if(!h2)return;var k=map[h2.textContent];if(!k)return;
      var diff=val(c,k)!==val(V2,k);var tag=q('.be-chg',card);if(tag)tag.style.display=diff?'':'none';var was=q('.be-was',card);if(was)was.style.display=diff?'':'none';});
    q('.be-vers .be-cur small').textContent='Today, Nov 17 · not tested'+(restored?' · restored from '+restored:'');
  }

  /* ---------- tabs ---------- */
  var tabs=qa('.be-tabs a'),main=q('.be-main'),wrap=q('.be-wrap');
  var vp=document.createElement('div');vp.className='be-wrap by-pane';vp.style.display='none';main.appendChild(vp);
  var gp=document.createElement('div');gp.className='be-wrap by-pane';gp.style.display='none';main.appendChild(gp);
  function show(name){
    tabs.forEach(function(t){var on=t.textContent.trim()===name;t.classList.toggle('on',on);if(on)t.setAttribute('aria-current','page');else t.removeAttribute('aria-current');});
    wrap.style.display=name==='Persona'?'':'none';vp.style.display=name==='Voice'?'':'none';gp.style.display=name==='Guardrails'?'':'none';
    if(name==='Voice')drawVoice();if(name==='Guardrails')drawGuard();main.scrollTop=0;BYC.stop();
  }
  tabs.forEach(function(t){UI.wire(t,function(){var n=t.textContent.trim();if(n==='Versions'){openVersions();return;}show(n);});});

  function drawVoice(){
    vp.innerHTML='<div class="card"><div class="ch"><div><h2>Voice</h2><p>How Rosa sounds on the call. Play a sample before you pick. PM never scores the candidate’s voice.</p></div></div><div class="cb"><div class="by-vl" role="radiogroup" aria-label="Voice">'+
      BYC.VOICES.map(function(v){return '<label class="by-vo'+(st.voice===v.id?' on':'')+'" data-v="'+v.id+'"><input type="radio" name="byV" value="'+v.id+'"'+(st.voice===v.id?' checked':'')+'>'+
      '<button class="by-play" type="button" data-js aria-label="Play '+v.name+' sample">'+BYC.PLAY+'</button><span><b>'+v.name+(v.id===V2.voice?' <span class="tag gray">v2</span>':'')+'</b><small>'+v.desc+'</small></span>'+
      '<span class="by-vt"><span><i></i></span><em>0:00 / '+BYC.fmt(v.len)+'</em></span></label>';}).join('')+'</div>'+
      '<div class="help">The voice applies to practice and scored calls on this version. Every candidate in Req 114 hears the same voice for Rosa.</div></div></div>';
    qa('.by-vo',vp).forEach(function(row){var v=BYC.voice(row.getAttribute('data-v'));
      q('input',row).addEventListener('change',function(){st.voice=v.id;qa('.by-vo',vp).forEach(function(r){r.classList.toggle('on',r===row)});changed();UI.toast('Voice set to '+v.name+'. Saved to the draft.');});
      q('.by-play',row).addEventListener('click',function(e){e.preventDefault();e.stopPropagation();BYC.play(this,v.len,{bar:q('.by-vt i',row),time:q('.by-vt em',row)});});});
  }
  var LOCK='<svg class="i" viewBox="0 0 16 16"><rect x="4" y="7.5" width="8" height="6" rx="1"/><path d="M5.5 7.5V5.5a2.5 2.5 0 0 1 5 0v2"/></svg>';
  var CHK='<svg class="i" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-6.5"/></svg>';
  function drawGuard(){
    var ws=BYC.get('pm-by-wsg',[{t:'Never asks about age, family or background.',lock:true},{t:'Never uses personal insults.',lock:true},{t:'Never asks about health or disability.',lock:true},{t:'Never comments on the candidate’s voice, accent or pauses.',lock:true}]);
    gp.innerHTML='<div class="card"><div class="ch"><div><h2>Rosa’s guardrails</h2><p>Rules this buyer keeps on every call.</p></div></div><div class="cb"><ul class="by-gl">'+
      (st.guard.length?st.guard.map(function(g,i){return '<li>'+CHK+'<span>'+esc(g)+'</span><button type="button" class="btn sm ghost" data-js data-i="'+i+'">Remove</button></li>'}).join(''):'<li class="by-gnone">No buyer guardrails. Workspace guardrails still apply.</li>')+
      '</ul><div class="by-gadd"><input class="be-in" id="byGIn" placeholder="For example: Mentions the 6 am deadline at least once."><button class="btn" type="button" data-js id="byGAdd">Add</button></div></div></div>'+
      '<div class="card"><div class="ch"><div><h2>Workspace guardrails</h2><p>Set by the admin for every buyer. A buyer can’t turn these off.</p></div><div class="r"><a class="btn sm" href="buyers.html">Manage in Buyers</a></div></div><div class="cb"><ul class="by-gl">'+
      ws.map(function(g){return '<li class="lk">'+LOCK+'<span>'+esc(g.t)+'</span><em>Workspace</em></li>'}).join('')+'</ul></div></div>';
    qa('[data-i]',gp).forEach(function(b){b.onclick=function(){var g=st.guard.splice(+b.getAttribute('data-i'),1)[0];drawGuard();changed();UI.toast('Removed “'+g.replace(/\.$/,'')+'” from the draft.');};});
    function add(){var i=q('#byGIn',gp),v=i.value.trim();if(!v){i.focus();return;}if(!/[.!?]$/.test(v))v+='.';st.guard.push(v);drawGuard();changed();UI.toast('Added a guardrail to the draft.');}
    q('#byGAdd',gp).onclick=add;q('#byGIn',gp).addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();add();}});
  }

  /* ---------- versions drawer ---------- */
  function apply(o,label){
    for(var k in F)q(F[k]).value=o[k];st.mood=o.mood.slice();st.voice=o.voice;st.guard=o.guard.slice();restored=label;drawMood();changed();
    if(vp.style.display!=='none')drawVoice();if(gp.style.display!=='none')drawGuard();
  }
  function summary(o){return '<dl class="by-vkv"><dt>Mood</dt><dd>'+esc(moodTxt(o.mood))+'</dd><dt>Says yes when</dt><dd>'+esc(o.sayyes)+'</dd><dt>Opening line</dt><dd>“'+esc(o.opening)+'”</dd><dt>Voice</dt><dd>'+esc(val(o,'voice'))+'</dd></dl>';}
  function openVersions(){
    var c=cur();
    var dr=UI.drawer({title:'Version history · Rosa Lin',width:480,body:
      '<p class="by-dp">Every call records which version ran. Restoring copies an old version into the draft. Req 114 keeps using v2 until a draft is tested and published.</p>'+
      '<div class="by-vh"><div class="by-vhh"><span class="be-vn">v3</span><b>Draft</b><span class="tag beige">Editing</span><span class="meta">Today, 8:31 am · Dana</span></div>'+summary(c)+'</div>'+
      '<div class="by-vh"><div class="by-vhh"><span class="be-vn">v2</span><b>Published</b><span class="tag green">In use, Req 114</span><span class="meta">Oct 26 · Dana</span></div>'+summary(V2)+
        '<div class="by-vha"><span class="meta">39 scored calls ran on v2</span><button class="btn sm" data-js data-r="v2">Restore into draft</button></div></div>'+
      '<div class="by-vh"><div class="by-vhh"><span class="be-vn">v1</span><b>Published</b><span class="tag gray">Retired</span><span class="meta">Sep 30 · Dana</span></div>'+summary(V1)+
        '<div class="by-vha"><span class="meta">Used for test calls only</span><button class="btn sm" data-js data-r="v1">Restore into draft</button></div></div>',
      actions:[{label:'Close'}]});
    qa('[data-r]',dr).forEach(function(b){b.onclick=function(){var v=b.getAttribute('data-r');
      UI.confirm('Restore '+v+' into the draft?','The draft’s persona, mood, opening line, voice and guardrails are replaced with '+v+'. It stays a draft, and Req 114 keeps using v2.','Restore '+v,function(){
        dr.close();apply(v==='v2'?V2:V1,v);show('Persona');UI.toast('Draft now matches '+v+'. Req 114 still uses v2.');});};});
  }

  /* ---------- discard ---------- */
  UI.wire(UI.byText('Discard draft')[0],function(){
    UI.confirm('Discard draft v3?','Your changes to Rosa Lin are deleted. Req 114 keeps using v2, and v2 stays as it is.','Discard draft',function(){
      BYC.set('pm-by-rosa','discarded');location.href='buyers.html?discarded=1';},true);});

  drawMood();
})();
