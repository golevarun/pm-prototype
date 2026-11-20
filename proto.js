/* Prototype helpers: demo step bar and a note for things outside this prototype. */
(function(){
  var STEPS=[
    ['home.html','Recruiter','Dana opens PM','Tue, Nov 17'],
    ['new-role.html','Recruiter','Dana creates the role from the applicant tracker','Mon, Oct 26'],
    ['setup.html','Recruiter','Dana sets up the interview','Mon, Oct 26'],
    ['automation.html','Recruiter','Dana checks the invite automation','Tue, Oct 27'],
    ['email.html','Candidate','Sam gets the invite','Mon, Nov 2'],
    ['consent.html','Candidate','Sam reads the notice and agrees','Tue, Nov 3'],
    ['prep.html','Candidate','Sam meets the buyer and checks his mic','Tue, Nov 3'],
    ['practice.html','Candidate','Sam takes a practice call','Tue, Nov 3'],
    ['lookback.html','Candidate','Sam reads his practice notes','Tue, Nov 3'],
    ['scored.html','Candidate','Sam takes the scored call','Tue, Nov 17'],
    ['done.html','Candidate','Sam is done and knows when he\'ll hear back','Tue, Nov 17'],
    ['candidates.html','Recruiter','Dana sees Sam finished and handles requests','Tue, Nov 17'],
    ['compare.html','Hiring manager','Marcus compares Sam and Priya','Tue, Nov 17'],
    ['shortlist.html','Hiring manager','Marcus reviews and advances Sam','Tue, Nov 17'],
    ['outcome-email.html','Candidate','Sam hears back from Dana','Tue, Nov 17']
  ];
  var file=(location.pathname.split('/').pop()||'index.html');if(file==='index.html')file='home.html';
  var i=-1;for(var k=0;k<STEPS.length;k++){if(STEPS[k][0]===file)i=k;}
  var css=document.createElement('style');
  css.textContent='.protobar{position:fixed;left:50%;transform:translateX(-50%);bottom:58px;z-index:100;display:flex;align-items:center;gap:4px;padding:4px;border-radius:var(--r-lg);background:var(--primary-hover);color:var(--on-primary);font-family:var(--font);font-size:var(--fs-sm);font-weight:var(--fw-medium);line-height:1;box-shadow:var(--shadow-menu)}'+
  '.protobar a{color:var(--on-primary);text-decoration:none;display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:var(--r-md)}.protobar a:hover{background:var(--on-dark-hover)}'+
  '.protobar .t{padding:0 10px;color:var(--track);white-space:nowrap}.protobar .t b{color:var(--on-primary);font-weight:var(--fw-strong)}.protobar .pd{display:inline-block;margin-right:10px;padding:3px 7px;border-radius:var(--r-box);background:var(--on-dark-hover);color:var(--on-primary);font-weight:var(--fw-strong)}.protobar .sep{width:1px;height:16px;background:var(--on-dark-active)}'+
  '.protobar .dis{opacity:.35;pointer-events:none}'+
  '.ptoast{position:fixed;left:50%;bottom:106px;transform:translateX(-50%) translateY(6px);z-index:101;background:var(--surface);color:var(--ink);border:1px solid var(--line2);border-radius:var(--r-md);padding:8px 12px;font-family:var(--font);font-size:var(--fs-md);font-weight:var(--fw-regular);line-height:18px;box-shadow:0 6px 20px var(--line2);opacity:0;transition:opacity .2s,transform .2s;pointer-events:none}.ptoast.on{opacity:1;transform:translateX(-50%)}'+
  '.off{color:var(--disabled)!important;cursor:default}.off:hover{background:transparent!important}';
  document.head.appendChild(css);
  var bar=document.createElement('nav');bar.className='protobar';bar.setAttribute('aria-label','Prototype steps');
  var prev=i>0?STEPS[i-1]:null,next=i>=0&&i<STEPS.length-1?STEPS[i+1]:null;
  bar.innerHTML=
    '<a class="'+(prev?'':'dis')+'" href="'+(prev?prev[0]:'#')+'" aria-label="Previous step">←</a>'+
    '<span class="t">'+(i>=0?'<span class="pd">'+STEPS[i][3]+'</span>Step <b>'+(i+1)+'</b> of '+STEPS.length+' · '+STEPS[i][1]+' · '+STEPS[i][2]:'Prototype')+'</span>'+
    '<a class="'+(next?'':'dis')+'" href="'+(next?next[0]:'#')+'">'+(next?'Next →':'End')+'</a>';
  document.body.appendChild(bar);
  var t=document.createElement('div');t.className='ptoast';t.setAttribute('role','status');document.body.appendChild(t);var tm;
  window.protoNote=function(msg){t.textContent=msg;t.classList.add('on');clearTimeout(tm);tm=setTimeout(function(){t.classList.remove('on')},2200);};
  document.addEventListener('click',function(e){
    var el=e.target.closest('a,button');if(!el||!document.contains(el)||el.closest('.protobar,.ui-pop,.ui-ov,.ui-dr-ov'))return;
    if(el.hasAttribute('data-go')){e.preventDefault();location.href=el.getAttribute('data-go');return;}
    if(el.hasAttribute('data-js'))return;
    var href=el.getAttribute('href');
    if(el.tagName==='A'&&href&&href!=='#'&&href.charAt(0)!=='#')return;
    if(el.tagName==='A'&&href&&href.length>1&&href.charAt(0)==='#')return;
    e.preventDefault();protoNote('Not part of this prototype yet.');
  });

  /* keep the step bar from covering the end of scrolling content */
  setTimeout(function(){document.querySelectorAll('.main *, body > *').forEach(function(el){var cs=getComputedStyle(el);if((cs.overflowY==='auto'||cs.overflowY==='scroll')&&el.scrollHeight>el.clientHeight&&!el.dataset.pbpad){el.dataset.pbpad='1';el.style.paddingBottom=(parseFloat(cs.paddingBottom)+64)+'px';}});},300);
})();
