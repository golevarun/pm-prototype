/* Calls list: rows from data, filters, search, sort, columns, selection, pagination, drawers, export. */
(function(){
  var D=document,E=UI.esc;
  var ROLE={114:'Account Executive, Mid-Market',117:'SDR, Inbound',109:'Account Executive, Enterprise'};
  var BUY={'Jordan Ellis':['JE','cl-b1','Head of operations'],'Rosa Lin':['RL','cl-b2','Fleet manager'],'Tom Becker':['TB','cl-b3','Finance director'],'Maya Chen':['MC','cl-b4','Office manager'],'Priya Shah':['PS','cl-b5','VP of operations']};
  function dt(m,d,h,mi){return new Date(2026,m-1,d,h,mi);}
  /* [name, req, buyer, start, lo, hi, status, shortlist anchor] */
  var calls=[
    {n:'Kai Morgan',r:114,b:'Rosa Lin',t:dt(11,17,10,5),live:true},
    {n:'Lena Ortiz',r:117,b:'Maya Chen',t:dt(11,17,9,55),lo:6.5,hi:7.5},
    {n:'Sam Rivera',r:114,b:'Jordan Ellis',t:dt(11,17,9,5),lo:7.0,hi:8.0,go:'call-review.html',sl:'sam'},
    {n:'Ama Owusu',r:114,b:'Tom Becker',t:dt(11,17,8,48),lo:6.0,hi:7.5,sl:'ama'},
    {n:'Priya Nair',r:114,b:'Rosa Lin',t:dt(11,16,16,31),lo:6.5,hi:8.0,sl:'priya'},
    {n:'Marta Silva',r:109,b:'Priya Shah',t:dt(11,16,11,20),lo:6.0,hi:7.0},
    {n:'Rhea Das',r:114,b:'Jordan Ellis',t:dt(11,14,14,15),lo:6.0,hi:7.0,sl:'rhea'},
    {n:'Nia Brooks',r:114,b:'Tom Becker',t:dt(11,14,10,40),lo:5.5,hi:7.0,sl:'nia',drop:'Back in 40 s at 3:18'},
    {n:'Ben Carter',r:114,b:'Rosa Lin',t:dt(11,13,18,2),lo:5.5,hi:7.0,sl:'ben'},
    {n:'Theo Grant',r:114,b:'Jordan Ellis',t:dt(11,13,13,10),lo:5.5,hi:6.5,sl:'theo'},
    {n:'Jon Reyes',r:117,b:'Maya Chen',t:dt(11,12,9,30),lo:5.0,hi:6.5},
    {n:'Carmen Ruiz',r:114,b:'Tom Becker',t:dt(11,12,8,15),lo:5.0,hi:6.5,sl:'carmen',drop:'Back in 1 min at 5:02'},
    {n:'Ian Walsh',r:114,b:'Rosa Lin',t:dt(11,11,15,40),lo:5.0,hi:6.0,sl:'ian'}
  ];
  /* Older calls, generated the same way every time so counts stay fixed:
     Req 114 has 39 finished, Req 117 has 21, Req 109 has 12 (72 in the last 30 days, 38 in the last 7). */
  var seed=7;function rnd(){seed=(seed*9301+49297)%233280;return seed/233280;}
  function pick(a){return a[Math.floor(rnd()*a.length)];}
  var FN=['Alex','Jamie','Morgan','Taylor','Riley','Casey','Jordan','Avery','Quinn','Drew','Sky','Rowan','Elena','Marco','Hana','Tariq','Lucia','Noah','Zara','Felix','Ines','Owen','Maya','Arjun','Chloe','Diego','Freya','Hugo','Leila','Mateo','Nora','Ravi','Sofia','Tomas','Yara','Kofi','Lior','Mina','Pablo','Rosa'];
  var LN=['Bennett','Choi','Diaz','Evans','Fischer','Gupta','Hale','Ibarra','Jensen','Kim','Lopez','Mensah','Novak','Okafor','Price','Quinn','Rossi','Sato','Torres','Usman','Vance','Wright','Young','Zhou','Abbott','Brandt','Cole','Duarte','Ellis','Flores'];
  var used={};calls.forEach(function(c){used[c.n]=1});
  function nm(){var n;do{n=pick(FN)+' '+pick(LN);}while(used[n]);used[n]=1;return n;}
  function gen(req,count,days,lohi){
    for(var i=0;i<count;i++){var d=days[i%days.length],h=8+Math.floor(rnd()*9),mi=Math.floor(rnd()*12)*5;
      var lo=lohi[0]+Math.floor(rnd()*lohi[1])*.5,w=req===114?(lo>=5?.5:1+Math.floor(rnd()*2)*.5):1+Math.floor(rnd()*2)*.5,hi=Math.min(10,lo+w);
      if(req===114&&(lo+hi)/2>=5.5)hi=lo+.5;
      calls.push({n:nm(),r:req,b:req===114?pick(['Jordan Ellis','Rosa Lin','Tom Becker']):req===117?'Maya Chen':'Priya Shah',t:dt(d[0],d[1],h,mi),lo:lo,hi:hi,drop:rnd()<.07?'Back in '+(20+Math.floor(rnd()*40))+' s at '+(1+Math.floor(rnd()*5))+':'+('0'+Math.floor(rnd()*60)).slice(-2):null});}
  }
  gen(114,24,[[11,11],[11,12],[11,13],[11,14],[11,16]],[4,3]);
  gen(114,6,[[11,10]],[4,3]);
  gen(117,2,[[11,13],[11,16]],[4.5,4]);
  gen(117,17,[[11,10],[11,9],[11,6],[11,5],[11,3],[11,2],[10,30],[10,28],[10,26],[10,22],[10,20]],[4.5,4]);
  gen(109,11,[[11,9],[11,4],[10,29],[10,27],[10,23],[10,21],[10,19]],[4.5,4]);
  calls.forEach(function(c,i){c.id=i;});
  var TESTS=[
    {n:'Dana Whitfield',who:'Recruiter',r:114,b:'Rosa Lin',t:dt(11,17,8,20),len:'4:36',go:'test-call.html'},
    {n:'Dana Whitfield',who:'Recruiter',r:114,b:'Tom Becker',t:dt(11,16,15,5),len:'7:00'},
    {n:'Marcus Lee',who:'Hiring manager',r:114,b:'Jordan Ellis',t:dt(11,16,14,40),len:'6:12'},
    {n:'Alex Romero',who:'Head of sales',r:109,b:'Priya Shah',t:dt(11,13,17,30),len:'7:00'},
    {n:'Dana Whitfield',who:'Recruiter',r:117,b:'Maya Chen',t:dt(11,12,16,10),len:'3:48'}
  ];
  var NOW=dt(11,17,10,20),DAY=864e5;
  function tm(d){var h=d.getHours(),m=d.getMinutes();return (h%12||12)+':'+('0'+m).slice(-2)+' '+(h<12?'am':'pm');}
  function when(d){var mo=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];return d.getDate()===17&&d.getMonth()===10?'Today '+tm(d):mo[d.getMonth()]+' '+d.getDate()+', '+tm(d);}
  function initials(n){return n.split(' ').map(function(w){return w[0]}).join('');}
  function f1(x){return x.toFixed(1);}

  var st={tab:'scored',role:'all',buyer:'any',date:30,live:false,q:'',sort:'new',page:0,sel:{},cols:{role:1,buyer:1,diff:1,started:1,len:1,range:1,status:1},rev:{}};
  var PER=12;
  var SORTS={'new':'Started, newest','old':'Started, oldest','hi':'Range, highest','lo':'Range, lowest','az':'Candidate, A to Z'};
  function list(){
    var src=st.tab==='scored'?calls:TESTS;
    var out=src.filter(function(c){
      if(st.role!=='all'&&c.r!==st.role)return false;
      if(st.buyer!=='any'&&c.b!==st.buyer)return false;
      if(st.tab==='scored'){
        if(st.live&&!c.live)return false;
        var cut=st.date===1?dt(11,17,0,0):new Date(dt(11,17,0,0)-(st.date-1)*DAY);if(c.t<cut)return false;
      }
      if(st.q&&(c.n+' '+c.b).toLowerCase().indexOf(st.q)<0)return false;
      return true;
    });
    out.sort(function(a,b){
      if(st.sort==='old')return a.t-b.t;
      if(st.sort==='az')return a.n.localeCompare(b.n);
      if(st.sort==='hi'||st.sort==='lo'){var ma=a.live?-1:(a.lo+a.hi)/2,mb=b.live?-1:(b.lo+b.hi)/2;return st.sort==='hi'?mb-ma:ma-mb;}
      return b.t-a.t;
    });
    return out;
  }
  var CHK='<svg viewBox="0 0 16 16"><path d="m4 8 3 3 5-6"/></svg>';
  function rowHtml(c){
    var B=BUY[c.b],scored=st.tab==='scored',on=scored&&st.sel[c.id];
    var who=scored?'<b>'+E(c.n)+'</b>':'<b>'+E(c.n)+'</b><small>'+E(c.who)+' · test call</small>';
    var rng=!scored?'<span class="cl-pend">Not scored</span>':c.live?'<span class="cl-pend">Pending</span>':'<div class="cl-rng" title="Overall '+f1(c.lo)+' to '+f1(c.hi)+' on a 4 to 10 scale"><span class="cl-track"><i style="left:'+((c.lo-4)/6*100).toFixed(2)+'%;width:'+((c.hi-c.lo)/6*100).toFixed(2)+'%"></i></span><span>'+f1(c.lo)+'–'+f1(c.hi)+'</span></div>';
    var end=new Date(+c.t+7*6e4);
    var status=!scored?'<div class="cl-st"><i></i><div>Finished<small>Not saved to a candidate</small></div></div>':c.live?'<div class="cl-st cl-on"><i></i><div>In progress<small>Scores after it ends</small></div></div>':
      c.drop?'<div class="cl-st cl-re"><i></i><div>Dropped and reconnected<small>'+E(c.drop)+'</small></div></div>':'<div class="cl-st"><i></i><div>Finished<small>'+(st.rev[c.id]?'Second review requested':'Ended '+tm(end))+'</small></div></div>';
    var cols={role:'<td data-col="role"><div class="cl-role"><b>'+ROLE[c.r]+'</b><small>Req '+c.r+'</small></div></td>',buyer:'<td data-col="buyer"><div class="cl-buyer"><span class="cl-bav '+B[1]+'">'+B[0]+'</span>'+E(c.b)+'</div></td>',
      diff:'<td data-col="diff">'+(c.r===109?'<span class="tag pink">Hard</span>':'<span class="tag beige">Medium</span>')+'</td>',started:'<td data-col="started" class="mono">'+when(c.t)+'</td>',
      len:'<td data-col="len" class="mono">'+(scored?(c.live?'<span class="dim">Live</span>':'7:00'):c.len)+'</td>',range:'<td data-col="range">'+rng+'</td>',status:'<td data-col="status">'+status+'</td>'};
    var btn=scored?(c.live?'<button class="btn sm ghost" data-js data-a="open" title="Opens when the call ends">Review</button>':'<button class="btn sm" data-js data-a="open"'+(c.go?' data-go="'+c.go+'"':'')+'>Review</button>'):'<button class="btn sm" data-js data-a="open"'+(c.go?' data-go="'+c.go+'"':'')+'>Open</button>';
    return '<tr data-id="'+(scored?c.id:'t'+TESTS.indexOf(c))+'" class="'+(c.live?'cl-now':'')+(on?' au-sel':'')+'"><td class="cbx">'+(scored?'<span class="box'+(on?' on':'')+'" role="checkbox" tabindex="0" aria-checked="'+!!on+'" aria-label="Select '+E(c.n)+'">'+CHK+'</span>':'<span class="box" style="visibility:hidden"></span>')+'</td>'+
      '<td><div class="person"><span class="pav">'+initials(c.n)+'</span><div>'+who+'</div></div></td>'+['role','buyer','diff','started','len','range','status'].map(function(k){return cols[k]}).join('')+'<td class="act">'+btn+'</td></tr>';
  }
  var sc=D.getElementById('clScored'),te=D.getElementById('clTest');
  function render(){
    var l=list(),pages=Math.max(1,Math.ceil(l.length/PER));if(st.page>=pages)st.page=pages-1;
    var pg=l.slice(st.page*PER,st.page*PER+PER),body=st.tab==='scored'?sc:te;
    sc.classList.toggle('cl-hide',st.tab!=='scored');te.classList.toggle('cl-hide',st.tab!=='test');
    body.innerHTML=pg.length?pg.map(rowHtml).join(''):'<tr class="cl-empty"><td colspan="10">No calls match these filters. <button class="btn sm" data-js data-a="clear" style="margin-left:6px">Clear all</button></td></tr>';
    var dl=st.date===1?'today':st.date===7?'last 7 days':'last 30 days';
    D.getElementById('clCount').textContent=l.length?(st.page*PER+1)+'–'+(st.page*PER+pg.length)+' of '+l.length+(st.tab==='scored'?' · '+dl:''):'0 calls';
    D.getElementById('clFoot').textContent=st.tab==='test'?'Test calls by the hiring team. Not scored.':'Ranges use the scored skills only. A person decides.';
    D.getElementById('clPrev').disabled=st.page===0;D.getElementById('clNext').disabled=st.page>=pages-1;
    var lv=D.getElementById('clLive');lv.classList.toggle('on',st.live);lv.setAttribute('aria-pressed',st.live);
    D.querySelectorAll('[data-tab]').forEach(function(a){var m=a.getAttribute('data-tab')===st.tab;a.classList.toggle('on',m);if(m)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    lab('clFRole',st.role==='all'?'All roles':'Req '+st.role,st.role!=='all');lab('clFBuyer',st.buyer==='any'?'Any':st.buyer,st.buyer!=='any');lab('clFDate',st.date===1?'Today':st.date===7?'Last 7 days':'Last 30 days',st.date!==30);
    D.getElementById('clFDate').disabled=st.tab==='test';
    D.getElementById('clClear').hidden=!(st.role!=='all'||st.buyer!=='any'||st.date!==30||st.live||st.q);
    D.getElementById('clSortL').textContent=SORTS[st.sort];
    Object.keys(st.cols).forEach(function(k){D.querySelectorAll('.cl-tbl [data-col="'+k+'"]').forEach(function(el){el.style.display=st.cols[k]?'':'none';});});
    selBar(pg);
  }
  function lab(id,t,on){var b=D.getElementById(id);b.querySelector('span').textContent=t;b.classList.toggle('au-fon',on);}
  function selIds(){return Object.keys(st.sel).filter(function(k){return st.sel[k]});}
  function selBar(pg){
    var n=selIds().length,bar=D.getElementById('clSel');bar.hidden=!n||st.tab!=='scored';
    D.getElementById('clSelN').textContent=n+' selected';
    var all=D.getElementById('clAll'),onPage=pg.filter(function(c){return st.sel[c.id]}).length;
    all.classList.toggle('on',st.tab==='scored'&&pg.length>0&&onPage===pg.length);all.classList.toggle('au-mix',onPage>0&&onPage<pg.length);
    all.setAttribute('aria-checked',onPage===pg.length&&pg.length?'true':onPage?'mixed':'false');
    all.innerHTML=all.classList.contains('on')?CHK:'';
  }
  function menuOf(btn,items,cur,set){UI.menu(btn,items.map(function(it){return {label:it[1],check:cur===it[0],onClick:function(){set(it[0]);st.page=0;render();}};}),{align:'left'});}
  UI.wire('#clFRole',function(b){menuOf(b,[['all','All roles'],[114,'Req 114 · '+ROLE[114]],[117,'Req 117 · '+ROLE[117]],[109,'Req 109 · '+ROLE[109]]],st.role,function(v){st.role=v;if(st.buyer!=='any'){var ok={114:['Jordan Ellis','Rosa Lin','Tom Becker'],117:['Maya Chen'],109:['Priya Shah']};if(v!=='all'&&ok[v].indexOf(st.buyer)<0)st.buyer='any';}});});
  UI.wire('#clFBuyer',function(b){var bs=st.role===117?['Maya Chen']:st.role===109?['Priya Shah']:st.role===114?['Jordan Ellis','Rosa Lin','Tom Becker']:Object.keys(BUY);
    menuOf(b,[['any','Any buyer']].concat(bs.map(function(x){return [x,x+' · '+BUY[x][2]]})),st.buyer,function(v){st.buyer=v;});});
  UI.wire('#clFDate',function(b){menuOf(b,[[1,'Today'],[7,'Last 7 days'],[30,'Last 30 days']],st.date,function(v){st.date=v;});});
  UI.wire('#clLive',function(){st.live=!st.live;if(st.live){st.tab='scored';}st.page=0;render();});
  function clearAll(){st.role='all';st.buyer='any';st.date=30;st.live=false;st.q='';D.getElementById('clQ').value='';st.page=0;render();}
  UI.wire('#clClear',clearAll);
  D.getElementById('clQ').addEventListener('input',function(){st.q=this.value.trim().toLowerCase();st.page=0;render();});
  D.querySelectorAll('[data-tab]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();st.tab=a.getAttribute('data-tab');if(st.tab==='test')st.live=false;st.page=0;render();});});
  UI.wire('#clSort',function(b){UI.menu(b,Object.keys(SORTS).map(function(k){return {label:SORTS[k],check:st.sort===k,onClick:function(){st.sort=k;st.page=0;render();}};}));});
  UI.wire('#clCols',function(b){var N={role:'Role',buyer:'Buyer',diff:'Difficulty',started:'Started',len:'Length',range:'Overall range',status:'Status'};
    UI.menu(b,[{header:'Show columns'}].concat(Object.keys(N).map(function(k){return {label:N[k],check:!!st.cols[k],onClick:function(){var shown=Object.keys(st.cols).filter(function(x){return st.cols[x]}).length;if(st.cols[k]&&shown===1){UI.toast('Keep at least one column.');return;}st.cols[k]=st.cols[k]?0:1;render();UI.toast((st.cols[k]?'Showing ':'Hid ')+N[k].toLowerCase()+'.');}};})).concat([{sep:true},{label:'Show all',onClick:function(){Object.keys(st.cols).forEach(function(k){st.cols[k]=1});render();}}]));});
  UI.wire('#clPrev',function(){if(st.page>0){st.page--;render();D.querySelector('.cl-scroll').scrollTop=0;}});
  UI.wire('#clNext',function(){st.page++;render();D.querySelector('.cl-scroll').scrollTop=0;});
  function csv(rows){return 'candidate,role,req,buyer,difficulty,started,length,overall_low,overall_high,status\n'+rows.map(function(c){return ['"'+c.n+'"','"'+ROLE[c.r]+'"',c.r,'"'+c.b+'"',c.r===109?'Hard':'Medium','"'+when(c.t)+'"',c.live?'live':'7:00',c.live?'':f1(c.lo),c.live?'':f1(c.hi),c.live?'In progress':c.drop?'Dropped and reconnected':'Finished'].join(',');}).join('\n');}
  UI.wire('#clExport',function(){
    if(st.tab==='test'){UI.download('test-calls.csv','person,role,buyer,started,length\n'+list().map(function(c){return ['"'+c.n+'"','"'+ROLE[c.r]+'"','"'+c.b+'"','"'+when(c.t)+'"',c.len].join(',')}).join('\n'));return;}
    UI.download('scored-calls.csv',csv(list()));});
  UI.wire('#clSelX',function(){UI.download('selected-calls.csv',csv(calls.filter(function(c){return st.sel[c.id]})));});
  UI.wire('#clSelC',function(){var n=selIds().length;try{navigator.clipboard&&navigator.clipboard.writeText(selIds().map(function(i){return location.origin+'/call-review.html?call='+i}).join('\n'));}catch(e){}UI.toast('Copied links to '+n+' call'+(n===1?'':'s')+'. Only people on the hiring team can open them.');});
  UI.wire('#clSelZ',function(){st.sel={};render();});
  UI.wire('#clSelR',function(){var ids=selIds(),live=ids.filter(function(i){return calls[i].live}).length;
    UI.modal({title:'Ask for a second review',body:'<p>A second person listens to '+ids.length+' call'+(ids.length===1?'':'s')+' and checks the moments behind the scores. The ranges stay as they are until they finish.</p>'+(live?'<p>Kai Morgan\'s call is still running. It is added when it ends.</p>':'')+
      '<label for="clRv">Reviewer</label><select id="clRv"><option>Marcus Lee · Hiring manager</option><option>Alex Romero · Head of sales</option><option>Dana Whitfield · Recruiter</option></select><label for="clRn">Note (optional)</label><textarea id="clRn" placeholder="For example: check the Handling doubt moments"></textarea>',
      actions:[{label:'Cancel'},{label:'Send request',primary:true,onClick:function(m){var who=m.querySelector('#clRv').value.split(' · ')[0];ids.forEach(function(i){st.rev[i]=1;});st.sel={};render();UI.toast('Asked '+who+' to review '+ids.length+' call'+(ids.length===1?'':'s')+'.');}}]});});
  D.getElementById('clAll').addEventListener('click',function(){if(st.tab!=='scored')return;var l=list(),pg=l.slice(st.page*PER,st.page*PER+PER),all=pg.every(function(c){return st.sel[c.id]});pg.forEach(function(c){st.sel[c.id]=!all;});render();});
  D.getElementById('clAll').addEventListener('keydown',function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();this.click();}});

  function drawer(c){
    var scored=c.lo!==undefined;
    if(c.live){UI.toast("Kai Morgan's call is still running. The review opens when it ends.");return;}
    var B=BUY[c.b];
    var body='<dl class="au-dl"><dt>Role</dt><dd>'+ROLE[c.r]+' · Req '+c.r+'</dd><dt>Buyer</dt><dd>'+E(c.b)+', '+B[2]+'</dd><dt>Difficulty</dt><dd>'+(c.r===109?'Hard':'Medium')+'</dd><dt>Started</dt><dd>'+when(c.t)+'</dd><dt>Length</dt><dd>'+(scored?'7:00':c.len)+'</dd>'+(c.drop?'<dt>Connection</dt><dd>Dropped and reconnected. '+E(c.drop)+'</dd>':'')+'</dl>';
    if(scored){body+='<div style="font-size:var(--fs-sm);color:var(--mute);margin-bottom:2px">Overall range</div><div class="au-big">'+f1(c.lo)+'–'+f1(c.hi)+' <span style="font-size:var(--fs-sm);color:var(--mute);font-weight:var(--fw-regular)">out of 10</span></div>'+
      '<p style="margin-top:12px;color:var(--ink2)">Skill ranges, the moments behind them and the transcript open from the candidate\'s record. Voice, accent, pauses and face are never scored.</p>'+(st.rev[c.id]?'<p><b>Second review requested.</b></p>':'');}
    else body+='<p style="color:var(--ink2)">Test calls are not scored and are not saved to any candidate. They help the hiring team hear what candidates hear.</p>';
    var go=scored?(c.sl?'shortlist.html#'+c.sl:c.r===114?'candidates.html':'shortlists.html'):'test-call.html';
    UI.drawer({title:scored?c.n+' · scored call':c.n+' · test call',width:440,body:body,actions:[{label:'Close'},{label:scored?(c.sl?'Open in shortlist':c.r===114?'Open in candidates':'Open shortlists'):'Start another test call',primary:true,onClick:function(){location.href=go;}}]});
  }
  function rowData(tr){var id=tr.getAttribute('data-id');if(id==null)return null;return id.charAt(0)==='t'?TESTS[+id.slice(1)]:calls[+id];}
  function onBody(e){
    var a=e.target.closest('[data-a]');if(a&&a.getAttribute('data-a')==='clear'){clearAll();return;}
    var tr=e.target.closest('tr');if(!tr)return;var c=rowData(tr);if(!c)return;
    var bx=e.target.closest('.box');if(bx){if(st.tab!=='scored')return;st.sel[c.id]=!st.sel[c.id];render();return;}
    if(a&&a.hasAttribute('data-go'))return; /* proto.js navigates */
    if(c.go&&!a){location.href=c.go;return;}
    drawer(c);
  }
  sc.addEventListener('click',onBody);te.addEventListener('click',onBody);
  sc.addEventListener('keydown',function(e){if((e.key===' '||e.key==='Enter')&&e.target.classList.contains('box')){e.preventDefault();e.target.click();}});
  render();
})();
