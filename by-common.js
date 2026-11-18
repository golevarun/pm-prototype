/* Shared helpers for buyer, scenario, insights, fairness and settings screens (prefix by-). */
var BYC=(function(){
  var VOICES=[
    {id:'lena',name:'Lena',desc:'Quick, even pace · American English',len:8},
    {id:'owen',name:'Owen',desc:'Low, steady · American English, Midwest',len:9},
    {id:'hal',name:'Hal',desc:'Even, measured · American English',len:8},
    {id:'iris',name:'Iris',desc:'Warm, quick · American English, West Coast',len:7},
    {id:'ruth',name:'Ruth',desc:'Calm, careful · American English',len:9},
    {id:'sol',name:'Sol',desc:'Bright, relaxed · American English, South',len:8}
  ];
  function get(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
  function set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  function fmt(s){s=Math.max(0,Math.floor(s));return Math.floor(s/60)+':'+(s%60<10?'0':'')+(s%60);}
  /* Voice sample player. btn: play button; opts.bar: element whose width shows progress; opts.time: element for time; len seconds */
  var cur=null;
  function stop(){if(!cur)return;clearInterval(cur.t);cur.btn.classList.remove('by-playing');cur.btn.innerHTML=PLAY;cur.btn.setAttribute('aria-label',cur.label);if(cur.bar)cur.bar.style.width='0%';if(cur.time)cur.time.textContent='0:00 / '+fmt(cur.len);if(cur.onEnd)cur.onEnd();cur=null;}
  var PLAY='<svg class="i" viewBox="0 0 16 16" style="width:12px;height:12px"><path d="M5.5 3.5v9l7-4.5z"/></svg>';
  var PAUSE='<svg class="i" viewBox="0 0 16 16" style="width:12px;height:12px"><path d="M5.5 3.5v9M10.5 3.5v9"/></svg>';
  function play(btn,len,opts){
    opts=opts||{};
    if(cur&&cur.btn===btn){stop();return;}
    stop();
    var st={btn:btn,len:len,bar:opts.bar,time:opts.time,onEnd:opts.onEnd,label:btn.getAttribute('aria-label')||'Play voice sample',start:Date.now()};
    btn.classList.add('by-playing');btn.innerHTML=PAUSE;btn.setAttribute('aria-label','Pause voice sample');
    st.t=setInterval(function(){var e=(Date.now()-st.start)/1000;if(e>=len){stop();return;}
      if(st.bar)st.bar.style.width=(e/len*100)+'%';if(st.time)st.time.textContent=fmt(e)+' / '+fmt(len);},100);
    cur=st;
  }
  function voice(id){for(var i=0;i<VOICES.length;i++)if(VOICES[i].id===id||VOICES[i].name===id)return VOICES[i];return VOICES[0];}
  function today(){return 'Nov 17';}
  return {VOICES:VOICES,get:get,set:set,play:play,stop:stop,voice:voice,fmt:fmt,PLAY:PLAY,today:today};
})();
