/* Call review player: play/pause, speed, scrubbing, moments, transcript sync, transcript download. */
(function(){
  var D=document,LEN=420,M=[192,340,415];
  var head=D.getElementById('cr-head'),now=D.getElementById('cr-now'),bars=D.querySelectorAll('#cr-wave i'),left=D.getElementById('cr-left'),track=D.getElementById('cr-track');
  var playBtn=D.getElementById('cr-play'),pi=D.getElementById('cr-pi'),spdBtn=D.getElementById('cr-spd');
  var cur=192,tm=null,rate=1,lastLine=null,follow=true;
  var lines=[].slice.call(D.querySelectorAll('.cr-ln'));
  function fmt(s){s=Math.max(0,Math.round(s));return ('0'+Math.floor(s/60)).slice(-2)+':'+('0'+s%60).slice(-2);}
  function lineAt(s){var best=lines[0];for(var i=0;i<lines.length;i++){if(+lines[i].dataset.t<=s)best=lines[i];}return best;}
  function momentAt(s){var m=-1;for(var i=0;i<M.length;i++){if(s>=M[i]&&s<M[i]+15)m=i;}return m;}
  function scrollTo(l,smooth){
    var off=l.getBoundingClientRect().top-left.getBoundingClientRect().top+left.scrollTop-D.querySelector('.cr-player').offsetHeight-40;
    left.scrollTo({top:Math.max(0,off),behavior:smooth?'smooth':'auto'});
  }
  function paint(s,scroll){
    cur=Math.max(0,Math.min(LEN,s));head.style.left=(cur/LEN*100)+'%';now.textContent=fmt(cur);
    var n=Math.round(cur/LEN*bars.length);for(var i=0;i<bars.length;i++)bars[i].classList.toggle('p',i<n);
    var l=lineAt(cur);
    if(l!==lastLine){if(lastLine)lastLine.classList.remove('on');l.classList.add('on');lastLine=l;if(scroll)scrollTo(l,true);}
    var mi=momentAt(cur);
    D.querySelectorAll('.cr-mo').forEach(function(e,i){e.classList.toggle('on',i===mi);});
    D.querySelectorAll('.cr-mk').forEach(function(e,i){e.classList.toggle('on',i===mi);});
    track.setAttribute('aria-valuenow',Math.round(cur));track.setAttribute('aria-valuetext',fmt(cur)+' of 07:00');
  }
  var PLAY='<path d="M5 3.5v9l7-4.5z"/>',PAUSE='<rect x="4" y="3.5" width="2.6" height="9"/><rect x="9.4" y="3.5" width="2.6" height="9"/>';
  function tick(){var s=cur+0.25;if(s>=LEN){paint(LEN,follow);stop();return;}paint(s,follow);}
  function start(){if(tm)return;if(cur>=LEN)cur=0;pi.innerHTML=PAUSE;playBtn.setAttribute('aria-label','Pause');tm=setInterval(tick,250/rate);}
  function stop(){if(!tm)return;clearInterval(tm);tm=null;pi.innerHTML=PLAY;playBtn.setAttribute('aria-label','Play');}
  function restart(){if(tm){clearInterval(tm);tm=setInterval(tick,250/rate);}}
  function seek(s,keep){var was=!!tm;paint(s,false);if(lastLine)scrollTo(lastLine,true);if(!keep&&was){/* keep playing from new spot */}}
  playBtn.addEventListener('click',function(){if(tm)stop();else start();});
  D.addEventListener('click',function(e){var el=e.target.closest('[data-seek]');if(el){e.preventDefault();seek(+el.dataset.seek);}});
  /* scrub: click or drag on the waveform */
  track.setAttribute('role','slider');track.setAttribute('tabindex','0');track.setAttribute('aria-label','Call position');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax',String(LEN));
  function posToS(x){var r=track.getBoundingClientRect();return Math.round(Math.max(0,Math.min(1,(x-r.left)/r.width))*LEN);}
  var drag=false;
  track.addEventListener('mousedown',function(e){if(e.target.closest('[data-seek]'))return;drag=true;track.classList.add('au-drag');paint(posToS(e.clientX),false);e.preventDefault();});
  D.addEventListener('mousemove',function(e){if(drag)paint(posToS(e.clientX),false);});
  D.addEventListener('mouseup',function(){if(drag){drag=false;track.classList.remove('au-drag');if(lastLine)scrollTo(lastLine,true);}});
  track.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){seek(cur+5);e.preventDefault();}if(e.key==='ArrowLeft'){seek(cur-5);e.preventDefault();}if(e.key==='Home'){seek(0);e.preventDefault();}if(e.key==='End'){seek(LEN);e.preventDefault();}});
  D.addEventListener('keydown',function(e){
    if(e.target.closest('input,textarea,select,[contenteditable]')||e.metaKey||e.ctrlKey)return;
    if(e.key===' '&&!e.target.closest('button,a,[role=slider]')){e.preventDefault();playBtn.click();}
  });
  /* stop auto-follow while the reader scrolls the transcript by hand; it resumes on the next seek */
  left.addEventListener('wheel',function(){follow=false;clearTimeout(left._t);left._t=setTimeout(function(){follow=true;},4000);},{passive:true});
  /* speed */
  var RATES=[0.75,1,1.25,1.5,2];
  UI.wire(spdBtn,function(){UI.menu(spdBtn,[{header:'Playback speed'}].concat(RATES.map(function(r){return {label:r+'x',check:r===rate,onClick:function(){rate=r;spdBtn.textContent=r+'x';restart();UI.toast('Playing at '+r+'x.');}};})));});
  /* download transcript */
  UI.wire('#cr-dl',function(){
    var out=['Sam Rivera · scored call with Jordan Ellis (AI buyer)','Account Executive, Mid-Market · Req 114','Nov 17, 9:05–9:12 am · 7 min · medium difficulty','Overall range 7.0–8.0. Discovery 7.5–8.5, Handling doubt 6.5–7.5, Getting a next step 7.0–8.0.','Voice, accent, pauses and face are never scored. A person makes the hiring decision.',''];
    lines.forEach(function(l){var p=l.querySelector('p').cloneNode(true),tag=p.querySelector('.cr-skt'),mom=tag?tag.textContent:'';if(tag)tag.remove();
      out.push('['+l.querySelector('.cr-ts').textContent+'] '+l.querySelector('.cr-sp').textContent+': '+p.textContent.trim()+(mom?'  <- '+mom:''));});
    UI.download('sam-rivera-scored-call-transcript.txt',out.join('\n'),'text/plain');
  });
  paint(192,false);
})();
