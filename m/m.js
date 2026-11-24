/* m.js: shared code for the PM phone screens (window.M).
   - Wraps each page in a phone screen. On a laptop (700px and wider) the screen sits in a phone frame
     with a tour panel beside it. On a phone it fills the window, with a thin tour strip on top.
   - Screen states: elements with data-when="a b" show only in those states. ?s=<state> picks one.
   - M.get / M.set keep demo data in localStorage under "pmm:", so the manager's rating and decision
     carry across screens. M.reset() clears it. */
(function(){
  var SCREENS=[
    ['invite.html','Candidate','Sam gets the invite','Mon, Nov 2','10:14',
      'Dana’s email, as it looks in Mail on Sam’s phone. One button opens the interview. No account, no app to install.'],
    ['notice.html','Candidate','Sam reads how it works and agrees','Tue, Nov 3','8:02',
      'What’s scored, what never is and who decides, in short blocks. The agree button stays at the bottom of the screen, so it never scrolls away.'],
    ['ask.html','Candidate','Sam asks for live captions','Tue, Nov 3','8:05',
      'Asking takes one sheet. It says who answers and by when, and that asking doesn’t touch the score.',
      [['form','Asking'],['sent','Sent']]],
    ['buyer.html','Candidate','Sam meets Jordan and checks his mic','Tue, Nov 3','8:09',
      'Phones fail in ways laptops don’t. The mic check covers the browser’s permission prompt, a blocked mic and no sound, and says how to fix each one.',
      [['idle','Not checked'],['asking','Permission prompt'],['ok','Working'],['blocked','Mic blocked'],['silent','No sound']]],
    ['practice.html','Candidate','Sam takes a practice call','Tue, Nov 3','8:12',
      'Big buttons and live captions. Locking the phone or switching apps ends a browser call, so Sam is told before he starts and gets a clear way back if it happens.',
      [['before','Before'],['connecting','Connecting'],['live','On the call'],['away','Came back from another app'],['dropped','Call dropped']]],
    ['notes.html','Candidate','Sam reads his practice notes','Tue, Nov 3','8:20',
      'Three notes, each tied to a moment in the call. They’re his only. Northwind never sees them.'],
    ['ready.html','Candidate','Sam gets ready for the scored call','Tue, Nov 17','9:01',
      'One attempt, so the screen slows him down: a short checklist, then he holds the button to start. A tap by accident can’t start it.'],
    ['scored.html','Candidate','Sam takes the scored call','Tue, Nov 17','9:06',
      'Same call screen as practice, marked Scored. If the call drops, he gets one reconnect and picks up where he left off.',
      [['live','On the call'],['dropped','Dropped, 1 reconnect left'],['last','Dropped again']]],
    ['done.html','Candidate','Sam is done and knows when he’ll hear back','Tue, Nov 17','9:12',
      'Who reviews the call and the date he’ll hear back. Nothing about a score.'],
    ['outcome.html','Candidate','Sam hears back from Dana','Mon, Nov 23','4:40',
      'The decision comes from Dana, a person. Both versions give a date or a reason to stay in touch, and never a score.',
      [['adv','Advanced'],['dec','Declined']]],
    ['join-email.html','Hiring manager','Marcus is added to the role','Mon, Nov 16','7:48',
      'Dana adds Marcus Lee, the hiring manager, as a Reviewer. He gets one email with a link that works once.'],
    ['join.html','Hiring manager','Marcus joins from his phone','Mon, Nov 16','7:49',
      'The page says who added him, the role and what he can do. A new person sets a password. Someone with an account just signs in.',
      [['new','New to PM'],['has','Has an account']]],
    ['home.html','Hiring manager','Marcus opens PM between meetings','Tue, Nov 17','12:31',
      'On a phone, Home shows only what Marcus can do there: calls to rate and decisions to make.'],
    ['shortlist.html','Hiring manager','Marcus sees the shortlist','Tue, Nov 17','12:32',
      'Cards in place of the desktop table. Calls he hasn’t rated come first, by name, with PM’s score hidden, so the order doesn’t give the score away.'],
    ['review.html','Hiring manager','Marcus listens and rates Sam’s call','Tue, Nov 17','12:33',
      'The player stays pinned while the transcript scrolls. He rates before he sees PM’s score. Saving the rating shows the ranges and the moments behind them.',
      [['blind','Before rating'],['rated','After rating']]],
    ['decide.html','Hiring manager','Marcus advances Sam','Tue, Nov 17','12:41',
      'One sheet names the decision and who made it. A decline needs a reason, which only the hiring team sees. Dana sends the message to Sam.',
      [['adv','Advance'],['dec','Decline']]]
  ];
  var file=location.pathname.split('/').pop()||'index.html';
  var idx=-1;SCREENS.forEach(function(s,k){if(s[0]===file)idx=k;});
  var SC=idx>=0?SCREENS[idx]:null;
  var qs=new URLSearchParams(location.search);

  /* ---------- storage ---------- */
  var NS='pmm:';
  function get(k,d){try{var v=localStorage.getItem(NS+k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
  function set(k,v){try{if(v==null)localStorage.removeItem(NS+k);else localStorage.setItem(NS+k,JSON.stringify(v));}catch(e){}return v;}
  function reset(){try{for(var i=localStorage.length-1;i>=0;i--){var k=localStorage.key(i);if(k&&k.indexOf(NS)===0)localStorage.removeItem(k);}}catch(e){}}

  /* ---------- states ---------- */
  var states=SC&&SC[6]?SC[6]:null,cur=null,subs=[];
  function applyState(s){
    cur=s;document.body.setAttribute('data-state',s||'');
    document.querySelectorAll('[data-when]').forEach(function(el){el.hidden=el.getAttribute('data-when').split(/\s+/).indexOf(s)<0;});
    document.querySelectorAll('[data-st]').forEach(function(b){var on=b.getAttribute('data-st')===s;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
    subs.forEach(function(fn){try{fn(s);}catch(e){if(window.console)console.error(e);}});
    if(states){var u=new URL(location.href);if(s===states[0][0])u.searchParams.delete('s');else u.searchParams.set('s',s);history.replaceState(null,'',u);}
  }
  function state(s,silent){if(s===undefined)return cur;if(silent){cur=s;return s;}applyState(s);return s;}

  /* ---------- toast and sheets ---------- */
  var toastEl,tm;
  function toast(msg){if(!toastEl){toastEl=document.createElement('div');toastEl.className='mtoast';toastEl.setAttribute('role','status');(document.querySelector('.m-scr')||document.body).appendChild(toastEl);}
    toastEl.textContent=msg;toastEl.classList.add('on');clearTimeout(tm);tm=setTimeout(function(){toastEl.classList.remove('on');},2400);}
  function sheet(id,open){var sh=document.getElementById(id);if(!sh)return;var on=open===undefined?!sh.classList.contains('on'):open;
    sh.classList.toggle('on',on);var sc=sh.nextElementSibling;if(sc&&sc.classList.contains('scrim'))sc.classList.toggle('on',on);
    if(on){var f=sh.querySelector('button,input,textarea,a');if(f)setTimeout(function(){f.focus({preventScroll:true});},250);}}
  document.addEventListener('click',function(e){
    var t=e.target.closest('[data-sheet]');if(t){e.preventDefault();sheet(t.getAttribute('data-sheet'));return;}
    var sc=e.target.closest('.scrim');if(sc){var sh=sc.previousElementSibling;if(sh&&sh.classList.contains('sheet'))sheet(sh.id,false);return;}
    var a=e.target.closest('a[href="#"],button[data-note]');if(a){e.preventDefault();toast(a.getAttribute('data-note')||'Not part of this prototype yet.');}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){var on=document.querySelector('.sheet.on');if(on)sheet(on.id,false);}});

  /* ---------- wrap the page ---------- */
  var ICON={
    prev:'<svg class="i sm" viewBox="0 0 16 16"><path d="m10 3.5-4.5 4.5 4.5 4.5"/></svg>',
    next:'<svg class="i sm" viewBox="0 0 16 16"><path d="m6 3.5 4.5 4.5-4.5 4.5"/></svg>',
    more:'<svg class="i sm" viewBox="0 0 16 16"><circle cx="3.5" cy="8" r=".6"/><circle cx="8" cy="8" r=".6"/><circle cx="12.5" cy="8" r=".6"/></svg>',
    sig:'<svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>',
    bat:'<svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="18" height="9" rx="2" fill="currentColor"/><path d="M25 4.5v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".4"/></svg>'
  };
  var framed=window.innerWidth>=700&&!qs.has('bare');
  var body=document.body;
  var kids=[].slice.call(body.childNodes).filter(function(n){return !(n.tagName==='SCRIPT');});
  var dev=document.createElement('div');dev.className='m-dev';
  var scr=document.createElement('div');scr.className='m-scr';
  var view=document.createElement('div');view.className='m-view';
  kids.forEach(function(n){view.appendChild(n);});
  var sb=document.createElement('div');sb.className='m-sb'+(body.classList.contains('sb-dim')?' dim':'');
  sb.innerHTML='<span>'+(SC?SC[4]:'9:41')+'</span><span>'+ICON.sig+ICON.bat+'</span>';
  scr.appendChild(sb);scr.appendChild(view);
  var home=document.createElement('div');home.className='m-home';scr.appendChild(home);
  dev.appendChild(scr);

  function href(k){return SCREENS[k]?SCREENS[k][0]:'#';}
  function stBtns(){return states?'<div class="t-st"><span>Screen states</span><div>'+states.map(function(s){return '<button type="button" data-st="'+s[0]+'">'+s[1]+'</button>';}).join('')+'</div></div>':'';}

  if(framed){
    body.classList.add('m-framed');
    var stage=document.createElement('main');stage.className='m-stage';
    var tour=document.createElement('aside');tour.className='m-tour';
    if(SC){
      tour.innerHTML='<div class="t-g"><span class="tag '+(SC[1]==='Candidate'?'blue':'beige')+'">'+SC[1]+'</span><span>'+SC[3]+' · '+(idx+1)+' of '+SCREENS.length+'</span></div>'+
        '<h1>'+SC[2]+'</h1><p>'+SC[5]+'</p>'+stBtns()+
        '<div class="t-nav"><a class="'+(idx>0?'':'dis')+'" href="'+href(idx-1)+'">← Back</a><a class="pri '+(idx<SCREENS.length-1?'':'dis')+'" href="'+href(idx+1)+'">Next →</a></div>'+
        '<p class="t-small">Use the arrow keys to move. <a href="index.html">All phone screens</a> · <a href="../home.html?desktop=1">Desktop prototype</a> · <a href="#" id="m-reset">Start over</a></p>';
    }
    var fit=document.createElement('div');fit.className='m-fit';fit.appendChild(dev);
    var list=document.createElement('nav');list.className='m-list';list.setAttribute('aria-label','All phone screens');
    var g='';list.innerHTML=SCREENS.map(function(s,k){var h=(s[1]!==g?'<b>'+(s[1]==='Candidate'?'Candidate, Sam Rivera':'Hiring manager, Marcus Lee')+'</b>':'');g=s[1];
      return h+'<a href="'+s[0]+'"'+(k===idx?' class="on" aria-current="page"':'')+'><em>'+(k+1)+'</em>'+s[2]+'</a>';}).join('');
    stage.appendChild(tour);stage.appendChild(fit);stage.appendChild(list);
    body.insertBefore(stage,body.firstChild);
    function scale(){var h=window.innerHeight-40,s=Math.min(1,h/868);dev.style.transform='scale('+s+')';fit.style.width=(414*s)+'px';fit.style.height=(868*s)+'px';}
    scale();window.addEventListener('resize',scale);
    document.addEventListener('keydown',function(e){if(e.target.closest('input,textarea'))return;
      if(e.key==='ArrowRight'&&idx>=0&&idx<SCREENS.length-1)location.href=href(idx+1);
      if(e.key==='ArrowLeft'&&idx>0)location.href=href(idx-1);});
  }else{
    body.insertBefore(dev,body.firstChild);
    if(SC&&!qs.has('bare')){
      body.classList.add('m-stripped');
      var strip=document.createElement('nav');strip.className='m-strip';strip.setAttribute('aria-label','Prototype tour');
      strip.innerHTML='<a class="'+(idx>0?'':'dis')+'" href="'+href(idx-1)+'" aria-label="Previous screen">'+ICON.prev+'</a>'+
        '<button type="button" class="s-t" aria-expanded="false" aria-controls="m-stmenu"><span>'+(idx+1)+'/'+SCREENS.length+'</span><b>'+SC[2]+'</b>'+(states?'<span>· '+states.length+' states</span>':'')+'</button>'+
        '<a class="'+(idx<SCREENS.length-1?'':'dis')+'" href="'+href(idx+1)+'" aria-label="Next screen">'+ICON.next+'</a>';
      body.insertBefore(strip,body.firstChild);
      var menu=document.createElement('div');menu.className='m-stmenu';menu.id='m-stmenu';menu.hidden=true;
      menu.innerHTML='<p>'+SC[5]+'</p>'+stBtns()+'<a href="index.html">All phone screens</a>';
      body.appendChild(menu);
      var tb=strip.querySelector('.s-t');
      tb.onclick=function(){menu.hidden=!menu.hidden;tb.setAttribute('aria-expanded',!menu.hidden);};
      document.addEventListener('click',function(e){if(!menu.hidden&&!e.target.closest('.m-stmenu,.m-strip')){menu.hidden=true;tb.setAttribute('aria-expanded','false');}});
    }
  }
  document.addEventListener('click',function(e){var b=e.target.closest('[data-st]');if(b){applyState(b.getAttribute('data-st'));var mn=document.getElementById('m-stmenu');if(mn)mn.hidden=true;}});

  var rs=document.getElementById('m-reset');if(rs)rs.onclick=function(e){e.preventDefault();e.stopPropagation();reset();location.href=SCREENS[0][0];};
  window.M={get:get,set:set,reset:reset,state:state,onState:function(fn){subs.push(fn);},toast:toast,sheet:sheet,screens:SCREENS,index:idx,framed:framed,
    next:function(){return href(idx+1);},view:view};

  /* first state: ?s= if it names one, else the first */
  function first(){var want=qs.get('s');
    if(cur!==null&&!want)return;
    if(states)applyState(states.some(function(s){return s[0]===want;})?want:states[0][0]);
    else document.querySelectorAll('[data-when]').forEach(function(el){el.hidden=true;});}
  document.querySelectorAll('[data-when]').forEach(function(el){el.hidden=true;});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',first);else setTimeout(first,0);
})();
