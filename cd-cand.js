/* Candidate journey (consent → prep → practice → lookback → scored → done).
   Shared state in localStorage, the step control at the top, and each page's controls. Prefix: cd-. */
(function(){
  var KEY='cd-journey';
  var file=(location.pathname.split('/').pop()||'').replace('.html','');
  function load(){try{return JSON.parse(localStorage.getItem(KEY))||{};}catch(e){return {};}}
  var S=load();
  function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
  function $(id){return document.getElementById(id)}
  var esc=UI.esc;
  S.practices=S.practices||[];
  /* pages imply where Sam is in the story, so the demo step bar still makes sense */
  if(/^(prep|practice|lookback)$/.test(file)&&!S.agreed){S.agreed='Nov 3';}
  if(file==='scored'){S.agreed=S.agreed||'Nov 3';S.open=true;S.held=false;}
  if(file==='done'){S.agreed=S.agreed||'Nov 3';S.open=true;S.held=false;S.scoredDone=S.scoredDone||'9:12 am';}
  save();
  window.CD={S:S,save:save};

  /* ---------- locks ---------- */
  function lockFor(step){
    if(step==='practice'){if(!S.agreed)return {why:'Practice opens after you agree to the notice.',fix:{label:'Read the notice',go:'consent.html'}};return null;}
    if(step==='scored'){
      if(!S.agreed)return {why:'Agree to the notice before your scored call.',fix:{label:'Read the notice',go:'consent.html'}};
      if(S.scoredDone)return {why:'You’ve taken your scored call. There’s one attempt.',fix:{label:'See what happens next',go:'done.html'}};
      if(S.held)return {why:'Dana is looking at your request. Your scored call opens once she replies, usually within one working day.',proto:{label:'Prototype: Dana replies',fn:function(){S.held=false;save();UI.toast('Dana replied. Your scored call is open.');refresh();}}};
      if(!S.open)return {why:'Your scored call opens on Mon, Nov 16. Practice as often as you like until then.',proto:{label:'Prototype: skip ahead to Nov 17',fn:function(){S.open=true;save();UI.toast('Skipped ahead to Tue, Nov 17. Your scored call is open.');refresh();}}};
      return null;
    }
    if(step==='done'){if(!S.scoredDone)return {why:'This step opens after your scored call.'};return null;}
    return null;
  }
  window.CD.lockFor=lockFor;
  function showLock(anchor,l){
    var h='<div class="cd-lockpop"><b>Locked</b><p>'+esc(l.why)+'</p>'+(l.fix?'<a class="cd-lb" href="'+l.fix.go+'">'+esc(l.fix.label)+'</a>':'')+(l.proto?'<button type="button" class="cd-lb ghost" data-js data-p>'+esc(l.proto.label)+'</button>':'')+'</div>';
    var pop=UI.popover(anchor,h,{width:280,align:'left'});
    if(pop&&l.proto)pop.querySelector('[data-p]').addEventListener('click',function(){UI.close();l.proto.fn();});
  }
  window.CD.showLock=showLock;

  /* ---------- step control ---------- */
  var STEPS=[['notice','consent.html'],['practice',null],['scored','scored.html'],['done','done.html']];
  var LOCKI='<svg class="cd-lk" viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg>';
  var spans=[].slice.call(document.querySelectorAll('.steps > span:not(.ln)'));
  function drawSteps(){
    spans.forEach(function(sp,i){
      var st=STEPS[i][0],l=lockFor(st),now=sp.classList.contains('now');
      sp.classList.toggle('cd-locked',!!l&&!now);
      var showI=l&&!now&&!sp.classList.contains('done');var lk=sp.querySelector('.cd-lk');if(showI&&!lk)sp.insertAdjacentHTML('beforeend',LOCKI);if(!showI&&lk)lk.remove();
      sp.title=now?'You’re on this step':l?l.why:'Go to '+sp.textContent.replace(/^\S+/,'').trim();
      sp.setAttribute('aria-disabled',l&&!now?'true':'false');
      if(now)sp.setAttribute('aria-current','step');
    });
  }
  spans.forEach(function(sp,i){
    sp.setAttribute('role','button');sp.setAttribute('tabindex','0');sp.classList.add('cd-step');
    function go(){
      var st=STEPS[i][0];
      if(sp.classList.contains('now')){UI.toast('You’re on this step.');return;}
      var l=lockFor(st);if(l){showLock(sp,l);return;}
      location.href=STEPS[i][1]||(S.practices.length?'lookback.html':'prep.html');
    }
    sp.addEventListener('click',go);sp.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
  });
  var hooks=[];function refresh(){drawSteps();hooks.forEach(function(f){f();});}
  window.CD.onChange=function(f){hooks.push(f);};
  drawSteps();
  /* direction of travel: the body slides in from the left when this step comes before the last one seen */
  (function(){var now=-1;spans.forEach(function(sp,i){if(sp.classList.contains('now'))now=i;});if(now<0)return;
    var prev=-1;try{prev=+(sessionStorage.getItem('pm-cand-step')||-1);sessionStorage.setItem('pm-cand-step',now);}catch(e){}
    if(prev>now&&window.UISlide){var b=document.querySelector('.cd-body');if(b){b.style.animation='none';void b.offsetWidth;b.style.animation='';UISlide(b,'mv-back');}}})();

  /* ---------- scored-call button used on prep and lookback ---------- */
  function scoredButton(el){
    el.setAttribute('data-js','');
    function draw(){
      var l=lockFor('scored');
      el.classList.remove('locked');el.classList.toggle('cd-lockbtn',!!l);el.classList.toggle('yellow',!l&&el.hasAttribute('data-cd-yellow'));
      var sh=el.hasAttribute('data-cd-short');el.innerHTML=l?LOCKI.replace('cd-lk','cd-lk i')+(sh?(S.scoredDone?'Taken':S.held?'Waiting':'Locked'):(S.scoredDone?'Scored call taken':S.held?'Waiting for Dana':!S.open?'Scored call opens Mon, Nov 16':'Locked')):(sh?'Start call':'Go to scored call');
      el.setAttribute('aria-disabled',!!l);
    }
    el.addEventListener('click',function(e){e.preventDefault();var l=lockFor('scored');if(l){showLock(el,l);return;}location.href='scored.html';});
    draw();hooks.push(draw);
  }
  function swapToButton(span){var b=document.createElement('button');b.type='button';b.className=span.className;b.setAttribute('style',span.getAttribute('style')||'');span.replaceWith(b);return b;}

  var PAGES={};
  var CKI='<svg viewBox="0 0 10 10"><path d="m2.5 5.2 1.7 1.7 3.3-3.4"/></svg>';
  var DLI='<svg class="i" viewBox="0 0 16 16"><path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13h10"/></svg>';

  /* "Your calls" rows, used on lookback (clickable) and done (read-only) */
  function callRows(box,view,onPick){
    box.innerHTML=S.practices.map(function(x,i){
      var tx='<div class="tx"><b>Practice '+x.n+'</b><small>'+esc(x.date)+' · '+esc(x.dur)+'</small></div>';
      if(!onPick)return '<div class="row">'+tx+'<span class="end">Notes kept</span></div>';
      return '<button type="button" class="row cd-prow'+(i===view?' on':'')+'" data-js data-i="'+i+'" aria-pressed="'+(i===view)+'">'+tx+'<span class="end">'+(i===view?'Showing':'Show notes')+'</span></button>';
    }).join('')+
      '<div class="row"><div class="tx"><b>Scored call</b><small>'+(S.scoredDone?'Nov 17 · '+(S.scoredLen&&S.scoredLen!=='07:00'?S.scoredLen:'7 min'):lockFor('scored')?(S.held?'Waiting for Dana':'Opens Mon, Nov 16'):'Open now')+'</small></div><span class="end">'+(S.scoredDone?'Submitted':'One attempt')+'</span></div>';
    if(onPick)box.querySelectorAll('.cd-prow').forEach(function(b){b.addEventListener('click',function(){onPick(+b.getAttribute('data-i'));});});
  }

  /* ---------- consent ---------- */
  PAGES.consent=function(){
    var ok=$('ok'),go=$('go'),tag=$('cd-agtag');
    function drawTag(){if(S.agreed){tag.className='tag green';tag.innerHTML=CKI+' Agreed, '+esc(S.agreed);}else{tag.className='tag gray';tag.textContent='About 3 minutes to read';}}
    if(S.agreed){ok.checked=true;go.disabled=false;}
    ok.addEventListener('change',function(){go.disabled=!ok.checked;});
    go.addEventListener('click',function(){S.agreed=S.agreed||'Nov 3';save();});
    drawTag();
    var acc=$('cd-acc'),boxes=[].slice.call(acc.querySelectorAll('input[type=checkbox]'));
    var send=$('cd-send'),sent=$('sent');send.setAttribute('data-js','');
    var edit=document.createElement('button');edit.type='button';edit.className='cd-textbtn';edit.setAttribute('data-js','');edit.textContent='Change request';edit.hidden=true;sent.after(edit);
    function labels(){return boxes.filter(function(b){return b.checked;}).map(function(b){return b.parentNode.textContent.trim();});}
    function draw(){
      var on=!!S.req;
      boxes.forEach(function(b){b.disabled=on;b.parentNode.classList.toggle('cd-dis',on);});
      send.disabled=on||!labels().length;
      send.textContent=on?'Request sent':'Send to Dana';
      sent.hidden=!on;
      if(on)sent.innerHTML='<b>Request sent to Dana</b> · '+esc(S.req.date)+'<br>'+esc(S.req.items.join(', '))+'.<br>Dana usually replies within one working day. Your scored call opens once she does. Practice stays open.';
      edit.hidden=!on;
    }
    if(S.req){boxes.forEach(function(b){b.checked=S.req.items.indexOf(b.parentNode.textContent.trim())>=0;});}
    boxes.forEach(function(b){b.addEventListener('change',draw);});
    send.addEventListener('click',function(){
      var ls=labels();if(!ls.length)return;
      UI.modal({title:'Send this request to Dana?',body:'<p>Dana Whitfield, the recruiter, gets this:</p><ul class="cd-ul">'+ls.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul><label for="cd-note">Anything Dana should know? (optional)</label><textarea id="cd-note" placeholder="For example: I use a screen reader."></textarea><p class="cd-fine">Marcus Lee, the hiring manager, never sees this. It doesn’t affect your score.</p>',
        actions:[{label:'Cancel'},{label:'Send to Dana',primary:true,onClick:function(m){S.req={items:ls,note:m.querySelector('textarea').value.trim(),date:'Sent Nov 3'};S.held=true;save();draw();refresh();UI.toast('Sent your request to Dana.');}}]});
    });
    UI.wire(edit,function(){UI.confirm('Change your request?','Your current request is withdrawn. Pick what you need and send it again.','Change request',function(){S.req=null;S.held=false;save();draw();refresh();UI.toast('Withdrew your request. Pick what you need and send it again.');});});
    draw();
  };

  /* ---------- prep ---------- */
  PAGES.prep=function(){
    /* buyer intro */
    var box=$('cd-introbox');
    var intro=document.createElement('div');intro.className='cd-intro';
    intro.innerHTML='<button type="button" class="cd-play" data-js aria-label="Play Jordan’s intro"><svg class="i" viewBox="0 0 16 16"><path d="M5 3.5v9l7-4.5z"/></svg></button><div class="cd-ib"><b>Hear Jordan say hello</b><div class="cd-track"><i id="cd-ph"></i></div></div><span class="cd-it" id="cd-itime">0:00 / 0:09</span>';
    box.appendChild(intro);
    var cap=document.createElement('p');cap.className='cd-icap';cap.id='cd-icap';cap.hidden=true;intro.after(cap);
    var IL=[[0,'Hi. Jordan Ellis, I run operations here.'],[3,'We’ve got about 120 vans on the road.'],[6,'I’ve got ten minutes, so let’s see what you’ve got.']];
    var pb=intro.querySelector('.cd-play'),ph=$('cd-ph'),it=$('cd-itime'),t=0,iv=null,DUR=9;
    var PLAY='<svg class="i" viewBox="0 0 16 16"><path d="M5 3.5v9l7-4.5z"/></svg>',PAUSE='<svg class="i" viewBox="0 0 16 16"><path d="M5.5 3.5v9M10.5 3.5v9"/></svg>';
    function tick(){t+=0.1;if(t>=DUR){t=DUR;stop();cap.textContent='Jordan: '+IL[2][1];}
      ph.style.width=(t/DUR*100)+'%';it.textContent='0:0'+Math.floor(t)+' / 0:09';
      var l=IL.filter(function(x){return x[0]<=t;}).pop();if(l&&iv)cap.textContent='Jordan: '+l[1];}
    function stop(){clearInterval(iv);iv=null;pb.innerHTML=PLAY;pb.setAttribute('aria-label','Play Jordan’s intro');intro.classList.remove('on');}
    pb.addEventListener('click',function(){
      if(iv){stop();return;}
      if(t>=DUR)t=0;cap.hidden=false;intro.classList.add('on');pb.innerHTML=PAUSE;pb.setAttribute('aria-label','Pause');iv=setInterval(tick,100);tick();
    });
    /* mic check */
    var bars=[].slice.call(document.querySelectorAll('#meter i')),pass=document.querySelector('.pass'),mic=document.querySelector('.mic');
    var selB=$('cd-sel'),nameNode=$('cd-micname');
    var MICS=['MacBook microphone','AirPods Pro','USB headset (Jabra Evolve2)'];
    S.mic=S.mic||null;var device=S.micDevice||MICS[0];nameNode.textContent=device;
    var tb=document.createElement('button');tb.type='button';tb.className='btn cd-testb';tb.setAttribute('data-js','');mic.appendChild(tb);
    var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,mv=null,mode='idle';
    function meter(level){bars.forEach(function(x,k){var on=k<level;x.classList.toggle('on',on);x.style.height=on?(30+Math.random()*70)+'%':'20%';});}
    function run(kind){clearInterval(mv);mv=null;mode=kind;
      if(kind==='idle'){meter(0);return;}
      if(reduce){meter(kind==='test'?12:5);return;}
      mv=setInterval(function(){meter(kind==='test'?Math.floor(7+Math.random()*10):Math.floor(1+Math.random()*4));},140);}
    function drawMic(){
      if(mode==='test'){pass.className='pass cd-listen';pass.innerHTML='<span class="cd-dotl"></span>Listening… say a sentence out loud.';tb.textContent='Stop';return;}
      if(S.mic){pass.className='pass';pass.innerHTML='<span>'+CKI+'</span>Your mic sounds clear on '+esc(device)+'.';tb.textContent='Test again';}
      else{pass.className='pass cd-idle';pass.innerHTML='Not checked yet. Press Test mic, then say a sentence.';tb.textContent='Test mic';}
    }
    var tmo;
    function test(){clearTimeout(tmo);run('test');drawMic();tmo=setTimeout(function(){S.mic=true;save();run('live');drawMic();UI.toast('Mic check passed.');},2600);}
    tb.addEventListener('click',function(){if(mode==='test'){clearTimeout(tmo);run(S.mic?'live':'idle');drawMic();return;}test();});
    selB.addEventListener('click',function(){UI.menu(selB,MICS.map(function(m){return {label:m,check:m===device,onClick:function(){if(m===device)return;device=m;S.micDevice=m;S.mic=false;save();nameNode.textContent=m;UI.toast('Switched to '+m+'. Test it once more.');test();}};}),{align:'left'});});
    run(S.mic?'live':'idle');drawMic();
    /* start buttons */
    var start=$('cd-startp');
    start.addEventListener('click',function(e){
      if(S.mic)return;e.preventDefault();
      UI.modal({title:'Start without a mic check?',body:'<p>A 10-second check tells you if Jordan can hear you clearly. You can still start now.</p>',actions:[{label:'Test mic first',onClick:function(){test();}},{label:'Start practice',primary:true,onClick:function(){location.href='practice.html';}}]});
    });
    start.setAttribute('data-js','');
    scoredButton($('cd-scoredbtn'));
    var srow=$('cd-srow');
    function drawRow(){srow.textContent=S.scoredDone?'Taken on Nov 17. There’s one attempt.':lockFor('scored')?'One call, 7 minutes. Opens Mon, Nov 16.':'One call, 7 minutes. Open now.';}
    drawRow();hooks.push(drawRow);
  };

  /* ---------- the call engine (practice and scored) ----------
     Each line has its call time in seconds. The clock runs 4x faster than real time for the demo,
     but every time shown is call time. The scored call is the exact call Marcus reviews
     (call-review.html): same 28 lines, same timestamps, moments at 03:12, 05:40 and 06:55. */
  function callPage(kind){
    var scored=kind==='scored';
    var n=S.practices.length+1;
    var P1=[
      [4,'J','So what is this about? I have about ten minutes.'],
      [10,'Y','Thanks for making time. I work with fleets on route planning. Can I tell you a bit about what we do?'],
      [24,'J','Go ahead. Quickly.'],
      [30,'Y','We help regional fleets cut the time drivers lose to re-routing. Most teams save about an hour per van each week.'],
      [65,'J','Everyone says that.'],
      [74,'Y','Fair. Can I ask how your drivers plan routes today?'],
      [128,'J','We had a tool for that. Last year.'],
      [139,'Y','Had? What happened with it?','disc'],
      [146,'J','The drivers stopped using it. It sent them down roads they knew were blocked.'],
      [153,'Y','Okay. Um, so the tool didn’t know what your drivers know.','doubt'],
      [161,'J','Pretty much.'],
      [210,'J','So why would yours be any different?'],
      [218,'Y','Ours lets drivers flag roads they know are bad.'],
      [260,'J','Hm. Maybe. I’d need to think about it.'],
      [275,'Y','It also works with the routes you already have.'],
      [320,'J','We’re busy until spring, honestly.'],
      [370,'Y','Sure. I’ll send some info.','next'],
      [376,'J','Okay. Thanks.']];
    var P2=P1.slice(0,12).concat([
      [218,'Y','Drivers flag a road from the van, and the routes change that day. Would that have helped last year?'],
      [232,'J','It might have. I’d want my ops manager to see it.'],
      [270,'Y','Could we look at it with your ops manager on Tuesday?','next'],
      [278,'J','Tuesday could work. Send something over.']]);
    var SC=[[4, "J", "Jordan Ellis. You've got the call, go ahead."],
      [9, "Y", "Thanks, Jordan. I'm Sam with Northwind Freight. I'll keep this short. Is now still a good time?"],
      [16, "J", "I have ten minutes. Maybe less."],
      [21, "Y", "Fair. I saw you're running about 120 vans out of two depots. How are you planning routes today?"],
      [31, "J", "A spreadsheet and two dispatchers who've been here longer than me."],
      [47, "Y", "And when a route goes wrong, who hears about it first?"],
      [53, "J", "Me. Usually from a customer."],
      [80, "J", "Look, we tried a routing tool last year. It didn't stick. So I'm skeptical."],
      [94, "Y", "That's useful to know. How long did you run it?"],
      [100, "J", "About four months. Then the drivers stopped using it."],
      [135, "Y", "I'd like to understand what you need before I say anything about what we do. Is that okay?"],
      [161, "J", "Okay. You have my attention for a few minutes."],
      [192, "Y", "Before I tell you about us, what went wrong with the one you tried?", "disc"],
      [200, "J", "Honestly? It didn't listen to the drivers. They know which roads flood."],
      [211, "Y", "So if a driver could flag a road and the routes changed that day, would they trust it?"],
      [219, "J", "Maybe. If it actually listened to them."],
      [242, "Y", "How often does flooding change a route in a normal month?"],
      [249, "J", "In spring, every week. We lose half a day each time."],
      [288, "J", "Every vendor says their system is smart. The last one said that too."],
      [302, "Y", "I hear that. What would you need to see to believe this one is different?"],
      [311, "J", "Drivers using it after the first month. That's it."],
      [340, "Y", "Then let's start there. Your drivers flag the roads they know, and the routes update the same day. You told me that's where the last tool lost them, so that's what we'd prove first.", "doubt"],
      [358, "J", "That I could take to my team. I'm not signing anything this week, though."],
      [366, "Y", "Understood. Who else would need to see it work?"],
      [372, "J", "Our ops manager, Kim. She runs the depots day to day."],
      [400, "J", "Send me something and I'll pass it on."],
      [415, "Y", "I'd rather show Kim directly. Could we do 30 minutes with her on Tuesday at 10?", "next"],
      [420, "J", "Tuesday at 10 works. Put it on my calendar and copy her."]];

    var L=scored?SC:(n>1?P2:P1);
    var LIMIT=420,SPEED=4;
    var tm=$('tm'),cap=$('cap'),orb=$('orb'),st=$('state'),stt=$('stt'),lines=$('lines');
    var cbs=document.querySelectorAll('.ctrls .cb'),muteB=cbs[0],capB=cbs[1],endB=document.querySelector('.endb');
    muteB.setAttribute('data-js','');capB.setAttribute('data-js','');
    muteB.querySelector('svg').insertAdjacentHTML('beforeend','<path class="cd-slash" d="M3 2.5l10 11"/>');
    var sec=0,k=0,running=false,muted=false,caps=true,clock=null,stamps={},ended=false,talkT=null;
    function fmt(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
    tm.firstChild.textContent=fmt(0)+' ';
    if(!scored){var meta=$('cd-meta');if(meta)meta.textContent='Practice '+n+' with Jordan Ellis. Nobody at Northwind hears it or sees how it went.';}
    /* pre-call panel */
    var pre=document.createElement('div');pre.className='cd-pre';
    if(scored&&S.scoredDone){
      pre.innerHTML='<p class="cd-pret">You’ve already taken your scored call</p><p class="muted small">You finished it on Nov 17 at '+esc(S.scoredDone)+'. There’s one attempt per candidate.</p><div class="cd-prer"><a class="btn yellow" href="done.html">See what happens next</a><button type="button" class="btn" data-js id="cd-reset">Prototype: reset the journey</button></div>';
    }else{
      pre.innerHTML='<p class="cd-pret">'+(scored?'Ready for your scored call?':'Ready when you are')+'</p><p class="muted small">'+(scored?'This call counts. You get one attempt, up to 7 minutes. Jordan waits through pauses.':'Practice '+n+'. Not scored, not shared. End it whenever you like.')+'</p><div class="cd-prer"><button type="button" class="btn yellow" data-js id="cd-start">'+(scored?'Start scored call':'Start practice call')+'</button></div>';
    }
    cap.after(pre);
    stt.textContent=scored&&S.scoredDone?'Call taken':'Not started';st.classList.add('cd-idle');
    endB.hidden=true;
    var startB=$('cd-start');
    var empty=document.createElement('p');empty.className='cd-txe';empty.textContent='Captions show here once the call starts.';lines.appendChild(empty);
    if($('cd-reset'))UI.wire($('cd-reset'),function(){UI.confirm('Reset the journey?','This clears the demo: agreement, practice calls, requests and the scored call. Use it to walk through again.','Reset',function(){localStorage.removeItem(KEY);location.href='consent.html';});});
    function setState(txt,them){stt.textContent=txt;st.classList.toggle('them',!!them);st.classList.remove('cd-idle');st.classList.toggle('cd-muted',muted&&!them);}
    function speak(l){
      var them=l[1]==='J';
      if(empty.parentNode)empty.remove();
      var d=document.createElement('div');d.className='ln2 new'+(them?'':' you');d.setAttribute('data-t',l[0]);
      d.innerHTML='<small><span>'+(them?'Jordan':'You')+'</span><span>'+fmt(l[0])+'</span></small>'+esc(l[2]);
      lines.appendChild(d);lines.scrollTop=1e5;
      if(l[3])stamps[l[3]]=fmt(l[0]);
      cap.textContent=(them?'Jordan: ':'You: ')+l[2];
      orb.classList.toggle('talk',them);setState(them?'Jordan is speaking':'Jordan is listening',them);
      clearTimeout(talkT);talkT=setTimeout(function(){if(running){orb.classList.remove('talk');setState(muted?'You’re muted':'Jordan is listening');}},Math.min(2600,Math.max(1200,l[2].length*40)));
    }
    function tick(){
      /* lines due at this call time */
      while(L[k]&&L[k][0]<=sec){
        if(L[k][1]==='Y'&&muted){setState('You’re muted. Jordan can’t hear you.');orb.classList.remove('talk');return;} /* Jordan waits; the call clock holds */
        speak(L[k]);k++;
      }
      if(!L[k]&&k&&!cap.dataset.end){cap.dataset.end=1;setTimeout(function(){if(!running)return;
        cap.textContent=scored?'That’s the end of the call. It closes at 07:00.':'That’s the end of Jordan’s part. End the call to get your notes.';},2400);}
      if(sec>=LIMIT){finish(true);return;}
      sec++;tm.firstChild.textContent=fmt(sec)+' ';
      if(sec===LIMIT-60)UI.toast('One minute left.');
    }
    function start(){
      running=true;pre.remove();endB.hidden=false;
      setState('Jordan is joining…');
      clock=setInterval(tick,1000/SPEED);
      UI.toast(scored?'Your scored call has started.':'Practice call started.');
    }
    if(startB)startB.addEventListener('click',start);
    muteB.setAttribute('aria-pressed','false');capB.setAttribute('aria-pressed','true');
    muteB.addEventListener('click',function(){muted=!muted;muteB.classList.toggle('on',muted);muteB.setAttribute('aria-pressed',muted);muteB.setAttribute('aria-label',muted?'Unmute':'Mute');
      if(running)setState(muted?'You’re muted. Jordan can’t hear you.':'Jordan is listening');
      UI.toast(muted?'You’re muted. Jordan can’t hear you.':'Unmuted.');});
    var off=document.createElement('p');off.className='cd-txe';off.textContent='Captions are off. Turn them on with the captions button.';off.hidden=true;lines.before(off);
    capB.addEventListener('click',function(){caps=!caps;capB.classList.toggle('on',caps);capB.setAttribute('aria-pressed',caps);cap.style.visibility=caps?'visible':'hidden';lines.hidden=!caps;off.hidden=caps;UI.toast(caps?'Captions on.':'Captions off.');});
    function finish(auto){
      if(ended)return;ended=true;running=false;clearInterval(clock);clearTimeout(talkT);
      if(auto){setState('Call ended');orb.classList.remove('talk');UI.toast('The call ended at 07:00.');}
      setTimeout(function(){
        if(scored){S.scoredDone=(S.scoredDone||'9:12 am');S.scoredLen=fmt(Math.min(sec,LIMIT));save();location.href='done.html';return;}
        var rec=n===1?{n:1,date:'Nov 3',dur:'6 min',canon:true}:{n:n,date:S.open?'Nov 17':'Nov 3',dur:Math.max(1,Math.round(sec/60))+' min',len:fmt(sec),stamps:stamps};
        S.practices.push(rec);S.view=S.practices.length-1;save();location.href='lookback.html';
      },auto?1400:0);
    }
    window.CD.call={get sec(){return sec;},finish:finish};
    UI.wire(endB,function(){
      if(scored){
        UI.modal({title:'End your scored call?',body:'<p>You have one attempt. If you end now, Northwind gets the call as it is.</p><p class="muted">You’ve been talking for '+fmt(sec)+' of 07:00.</p>',actions:[{label:'Keep talking'},{label:'End and submit',danger:true,onClick:function(){finish(false);}}]});
      }else{
        UI.modal({title:'End practice call?',body:'<p>You’ll get notes on this call. Practice stays open, so you can go again.</p>',actions:[{label:'Keep going'},{label:'End call',primary:true,onClick:function(){finish(false);}}]});
      }
    });
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){orb.classList.add('cd-still');}
  }
  PAGES.practice=function(){callPage('practice');};
  PAGES.scored=function(){callPage('scored');};

  /* ---------- lookback ---------- */
  PAGES.lookback=function(){
    if(!S.practices.length){S.practices.push({n:1,date:'Nov 3',dur:'6 min',canon:true});S.view=0;save();}
    var view=S.view!=null&&S.practices[S.view]?S.view:S.practices.length-1;
    var notes=$('cd-notes'),canonHTML=notes.innerHTML,tag=$('cd-ptag');
    function notesFor(p){
      if(p.canon)return canonHTML;
      var s=p.stamps||{};
      function row(ok,title,when,skill,body,q){return '<div class="note"><span class="nb '+(ok?'g':'t')+'">'+(ok?'✓':'→')+'</span><div><b>'+title+'<span class="when">'+(when?when+' · ':'')+skill+'</span></b><p>'+body+'</p>'+(q?'<q>'+q+'</q>':'')+'</div></div>';}
      return (s.disc?row(1,'You asked about the last tool before pitching',s.disc,'Discovery','“Had? What happened with it?” got Jordan talking about the real problem again.'):row(0,'Ask about the last tool early','','Discovery','The call ended before you got there. Jordan opens up when you ask what happened last time.'))+
        (s.doubt?row(1,'You named what Jordan meant',s.doubt,'Handling doubt','Then you explained how drivers flag roads and asked if it would have helped. That kept the focus on Jordan’s problem.'):row(0,'Stay with Jordan’s doubt','','Handling doubt','The call ended before Jordan raised a doubt. Try a longer call to practice this part.'))+
        (s.next?row(1,'You asked for a dated next step',s.next,'Getting a next step','You asked for Tuesday with the ops manager. That’s the change your last notes suggested, and Jordan said yes.'):row(0,'Ask for a next step with a date','','Getting a next step','The call ended before a next step. Jordan says yes to something specific, like a call with the ops manager on Tuesday.','Try: “Could we look at this with your ops manager on Tuesday?”'));
    }
    var callsBox=$('cd-calls');
    function draw(){
      var p=S.practices[view];
      notes.innerHTML=notesFor(p);
      tag.textContent='Practice '+p.n+' · '+p.date+' · '+p.dur;
      callRows(callsBox,view,function(i){view=i;S.view=i;save();draw();});
    }
    draw();hooks.push(draw);
    var r=document.querySelector('.cd-ph-r');
    var dl=document.createElement('button');dl.type='button';dl.className='btn';dl.setAttribute('data-js','');dl.innerHTML=DLI+'Download notes';r.prepend(dl);
    dl.addEventListener('click',function(){var p=S.practices[view],d=document.createElement('div');d.innerHTML=notesFor(p);
      var t='Your practice notes · Northwind Freight, Account Executive, Mid-Market\nPractice '+p.n+' · '+p.date+' · '+p.dur+' · with Jordan Ellis\nThese notes are yours. They aren’t scores, and Northwind never sees them.\n\n'+
        [].map.call(d.querySelectorAll('.note'),function(nn){return '- '+nn.querySelector('b').firstChild.textContent+' ('+nn.querySelector('.when').textContent+')\n  '+nn.querySelector('p').textContent+(nn.querySelector('q')?'\n  '+nn.querySelector('q').textContent:'');}).join('\n\n')+'\n';
      UI.download('Practice '+p.n+' notes.txt',t,'text/plain');});
    var again=UI.byText('Practice again')[0];
    UI.wire(again,function(){UI.toast('Starting practice '+(S.practices.length+1)+'.');setTimeout(function(){location.href='practice.html';},400);});
    scoredButton($('cd-lbscored'));
  };

  /* ---------- done ---------- */
  PAGES.done=function(){
    if(!S.practices.length){S.practices.push({n:1,date:'Nov 3',dur:'6 min',canon:true});save();}
    var np=S.practices.length,after=np?', after '+(np===1?'one practice call':np+' practice calls'):'';
    if($('cd-dlen'))$('cd-dlen').textContent=S.scoredLen&&S.scoredLen!=='07:00'?S.scoredLen+' with Jordan Ellis'+after+'. You ended the call early.':'7 minutes with Jordan Ellis'+after;
    callRows($('cd-calls'));
    var rate=$('rate'),bs=[].slice.call(rate.querySelectorAll('button'));
    var host=rate.parentNode;
    var fb=document.createElement('div');fb.className='cd-fb';fb.hidden=true;
    fb.innerHTML='<label class="cd-fbl" for="cd-fbt">What made you pick that? (optional)</label><textarea id="cd-fbt" class="cd-ta" rows="3" placeholder="For example: the buyer let me finish my thoughts."></textarea><div class="cd-fbr"><span class="sub">Goes to PM only. Northwind never sees it.</span><button type="button" class="btn yellow" data-js id="cd-fbs">Send</button></div>';
    host.appendChild(fb);
    var thanks=document.createElement('div');thanks.className='cd-thx';thanks.hidden=true;host.appendChild(thanks);
    var W=['Not fair','Somewhat unfair','Neither','Mostly fair','Very fair'];
    function draw(){
      bs.forEach(function(b,i){var on=S.rating===i+1;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',(i+1)+' of 5, '+W[i]);});
      fb.hidden=!S.rating||!!S.fbSent;
      thanks.hidden=!S.fbSent;
      if(S.fbSent)thanks.innerHTML='<p><b>Thanks, Sam.</b> You rated this interview '+S.rating+' of 5 ('+W[S.rating-1].toLowerCase()+').'+(S.fb?' Your note went with it.':'')+'</p><button type="button" class="cd-textbtn" data-js id="cd-fbe">Change answer</button>';
      var e=$('cd-fbe');if(e)e.addEventListener('click',function(){S.fbSent=false;save();draw();$('cd-fbt').focus();});
      rate.classList.toggle('cd-dim',!!S.fbSent);
    }
    bs.forEach(function(b,i){b.setAttribute('data-js','');b.addEventListener('click',function(){if(S.fbSent)return;S.rating=i+1;save();draw();});});
    $('cd-fbt').value=S.fb||'';
    $('cd-fbs').addEventListener('click',function(){S.fb=$('cd-fbt').value.trim();S.fbSent=true;save();draw();UI.toast('Sent your answer to PM.');});
    draw();
  };

  if(PAGES[file])PAGES[file]();
})();
