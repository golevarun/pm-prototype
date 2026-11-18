/* insights.html: date range switch, custom range, export (prefix by-) */
(function(){
  var R30=IN;
  function cp(o,x){return Object.assign({},o,x||{});}
  var R7={
    all:{name:'All live roles',sub:'All live roles · everyone invited Nov 11 – Nov 17',f:[46,35,24,0,0],wait:24,dana:0,live:0,rate:'0%',rateM:'None of the 46 invited this week has finished yet',rateF:'24 who consented are in the notice period',
      days:'17',daysM:'1 shortlist shared this week · Req 114 on Nov 13',daysW:18,fair:'4.4',fairM:'31 responses from 38 calls finished this week',fd:[0,1,3,10,17],
      agr:'100%',agrM:'2 of 2 advanced this week were in the top 9',agrW:100,agrF:'Both in Req 117 · Req 114 debrief Thu, Nov 19',h:[3,16,14,4,1],med:'1.0'},
    '114':{name:'Req 114',sub:'Account Executive, Mid-Market · invited Nov 11 – Nov 17',f:[28,21,15,0,0],wait:15,dana:0,live:0,rate:'0%',rateM:'None of the 28 invited this week has finished yet',rateF:'15 who consented are in the notice period',
      days:'17',daysM:'Shortlist shared Nov 13',daysW:18,fair:'4.4',fairM:'28 responses from 34 calls finished this week',fd:[0,1,3,9,15],
      agr:'–',agrM:'No candidates advanced yet',agrW:0,agrF:'Marcus Lee reviews the top 9 at the debrief, Thu, Nov 19',h:[3,14,12,4,1],med:'1.0'},
    '117':{name:'Req 117',sub:'SDR, Inbound · invited Nov 11 – Nov 17',f:[12,9,6,0,0],wait:6,dana:0,live:0,rate:'0%',rateM:'None of the 12 invited this week has finished yet',rateF:'6 who consented are in the notice period',
      days:'–',daysM:'No shortlist shared this week · last on Nov 4',daysW:0,fair:'4.5',fairM:'2 responses from 3 calls finished this week',fd:[0,0,0,1,1],
      agr:'100%',agrM:'2 of 2 advanced this week were in the top 9',agrW:100,agrF:'Alex Romero advanced both from the Nov 4 shortlist',h:[0,1,2,0,0],med:'1.0'},
    '109':{name:'Req 109',sub:'Account Executive, Enterprise · invited Nov 11 – Nov 17',f:[6,5,3,0,0],wait:3,dana:0,live:0,rate:'0%',rateM:'None of the 6 invited this week has finished yet',rateF:'3 who consented are in the notice period',
      days:'–',daysM:'No shortlist shared this week · last on Nov 12',daysW:0,fair:'5.0',fairM:'1 response from 1 call finished this week',fd:[0,0,0,0,1],
      agr:'–',agrM:'No advances this week',agrW:0,agrF:'All 3 advanced earlier were on the shortlist',h:[0,1,0,0,0],med:'1.0'}
  };
  var R90={
    all:{name:'All roles',sub:'All roles · everyone invited Aug 20 – Nov 17',f:[410,315,227,93,91],wait:33,dana:2,live:1,rate:'22%',rateM:'91 of 410 invited finished the scored call',rateF:'33 more are in the notice period',
      days:'17',daysM:'From role published to shortlist shared · 4 roles',daysW:18,fair:'4.2',fairM:'73 responses from 91 finished calls',fd:[0,4,10,25,34],
      agr:'85%',agrM:'11 of 13 advanced candidates were in the top 9',agrW:85,agrF:'Req 114 has no advances yet · debrief Thu, Nov 19',h:[8,39,33,9,2],med:'1.0'},
    '114':R30['114'],'117':R30['117'],'109':R30['109'],
    '101':{name:'Req 101',sub:'Sales Manager, Central · invited Sep 8 – Oct 30 (closed)',f:[58,45,33,20,19],wait:0,dana:0,live:0,rate:'33%',rateM:'19 of 58 invited finished the scored call',rateF:'Role closed Oct 30 · 2 hired',
      days:'17',daysM:'Published Sep 8 · shortlist shared Sep 25',daysW:18,fair:'4.2',fairM:'15 responses from 19 finished calls',fd:[0,1,2,5,7],
      agr:'75%',agrM:'3 of 4 advanced candidates were in the top 9',agrW:75,agrF:'2 hired · role closed Oct 30',h:[2,8,7,2,0],med:'1.0'}
  };
  var RANGES={7:{d:R7,lbl:'Last 7 days',dates:'Nov 11 – Nov 17',file:'7-days'},30:{d:R30,lbl:'Last 30 days',dates:'Oct 19 – Nov 17',file:'30-days'},90:{d:R90,lbl:'Last 90 days',dates:'Aug 20 – Nov 17',file:'90-days'}};
  var range=30,scope='all',custom=null;
  var $=function(id){return document.getElementById(id)};

  /* add Req 101 row and menu item (90-day range only) */
  var tb=document.querySelector('.in-t tbody');
  tb.insertAdjacentHTML('beforeend','<tr data-row="101" style="display:none"><td><b>Sales Manager, Central</b><small>Req 101 · closed Oct 30</small></td><td class="dim">Sep 8</td><td class="dim">Sep 22</td><td class="dim">Sep 25</td><td class="n">19</td><td class="n">9</td><td class="n"><b>17</b></td><td><div class="in-tb"><i class="in-ntc" style="width:58.3%"></i><i class="in-ink" style="width:12.5%"></i></div></td></tr>');
  var rm=$('inRole'),sep=rm.querySelectorAll('.in-sep')[1];
  sep.insertAdjacentHTML('beforebegin','<button role="menuitem" data-js data-scope="101" onclick="inScope(\'101\')" style="display:none">Sales Manager, Central<span class="meta">Req 101 · closed</span></button>');
  var tfoot=document.querySelector('.in-tfoot .meta'),tfoot30=tfoot.textContent;

  window.inRender=function(k){
    var D=RANGES[range].d;if(!D[k])k='all';scope=k;IN=D;var d=D[k],f=d.f,h='';
    for(var i=0;i<5;i++){var w=f[0]?f[i]/f[0]*100:0,stop='',extra='';
      if(i<4){var lost=f[i]-f[i+1];
        if(i===2){var wt=d.wait+d.dana;extra='<i class="w" style="width:'+(wt/f[0]*100)+'%"></i>';stop='<b>'+(lost-wt)+'</b>'+(wt?' <span>+ '+wt+' waiting</span>':'');}
        else if(i===3){stop='<b>'+(lost-d.live)+'</b>'+(d.live?' <span>+ '+d.live+' in call</span>':'');}
        else stop='<b>'+lost+'</b>';}
      else stop='–';
      h+='<div class="in-fr"><span class="lb">'+STEPS[i]+'</span><span class="tk"><i style="width:'+w+'%"></i>'+extra+'</span><span class="n">'+f[i]+'</span><span class="n">'+(i?pct(f[i],f[0]):'100%')+'</span><span class="n st2">'+stop+'</span></div>';}
    $('funnel').innerHTML=h;
    var sub=d.sub;if(custom)sub=sub.replace(/(invited|since) .*$/,'invited '+custom.lbl);
    $('dSub').textContent=sub;
    var biggest=f[2]-f[3]-d.wait-d.dana;
    $('dNote').textContent=f[3]===0?'Nobody invited in this range has reached the scored call yet. All '+d.wait+' who consented are still in the 10-business-day notice period. Practice is optional and not shown as a step.'
      :'The biggest drop is between consent and the scored call: '+biggest+' consented and did not start. '+(d.wait?d.wait+' are still in the 10-business-day notice period':'None are still waiting')+(d.dana?' and '+d.dana+' are waiting on Dana for an accommodation':'')+'. Practice is optional and not shown as a step.';
    $('kRate').textContent=d.rate;$('kRateM').textContent=d.rateM;$('kRateF').textContent=d.rateF;$('kRateBar').style.width=d.rate;
    $('kDays').textContent=d.days;$('kDaysM').textContent=d.daysM;$('kDaysBar').style.width=d.daysW+'%';
    document.querySelector('.in-split .in-ntc').style.width=(d.daysW?100-d.daysW:0)+'%';
    $('kFair').textContent=d.fair;$('kFairM').textContent=d.fairM;
    var mx=Math.max.apply(null,d.fd)||1,s='';for(var j=0;j<5;j++){s+='<div><em>'+d.fd[j]+'</em><i class="'+(j<2?'lo':'')+'" style="height:'+Math.max(1,d.fd[j]/mx*16)+'px"></i><span>'+(j+1)+'</span></div>';}
    $('kFairD').innerHTML=s;
    $('kAgr').textContent=d.agr;$('kAgrM').textContent=d.agrM;$('kAgrF').textContent=d.agrF;$('kAgrBar').style.width=d.agrW+'%';
    var hm=Math.max.apply(null,d.h)||1,hs='',tot=0;for(var q=0;q<5;q++){tot+=d.h[q];hs+='<div><b>'+d.h[q]+'</b><i class="'+(q>=3?'wd':'')+'" style="height:'+(d.h[q]/hm*112)+'px"></i></div>';}
    $('hist').innerHTML=hs;$('hMed').textContent=d.med;$('hWide').textContent=(d.h[3]+d.h[4])+' of '+tot;
    var inRange=range===7?['114']:(range===90?['117','114','109','101']:['117','114','109']);
    document.querySelectorAll('.in-t tbody tr').forEach(function(r){var id=r.getAttribute('data-row');
      r.style.display=(id==='101'&&range!==90)?'none':'';
      r.classList.toggle('in-dim',(k!=='all'&&id!==k)||inRange.indexOf(id)<0);});
    tfoot.textContent=range===7?'1 shortlist shared in this range: Req 114 on Nov 13, 17 days after it was published. Req 117 and Req 109 shared theirs earlier.'
      :range===90?'Median 17 days across 4 roles, including Sales Manager, Central (closed Oct 30). Every role waits 14 calendar days for the 10-business-day notice period.':tfoot30;
    $('inRoleLbl').textContent=d.name;
    rm.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-scope')===k);
      if(b.getAttribute('data-scope')==='101')b.style.display=range===90?'':'none';
      if(b.getAttribute('data-scope')==='all')b.firstChild.textContent=range===90?'All roles':'All live roles';
      if(b.getAttribute('data-scope')==='all')b.querySelector('.meta').textContent=range===90?'4 roles':'3 roles';});
    rm.querySelector('.in-mnote').textContent=range===90?'SDR, Outbound (draft) has no calls in this range.':'SDR, Outbound (draft) and Sales Manager, Central (closed Oct 30) have no calls in this range.';
  };

  /* date menu */
  var dateBtn=document.querySelector('[onclick="inToggle(\'inDate\')"]'),dm=$('inDate');
  function setLabel(lbl,dates){dateBtn.childNodes.forEach(function(n){if(n.nodeType===3&&n.textContent.trim())n.textContent=lbl;});dateBtn.querySelector('.in-dmeta').textContent=dates;}
  var CK='<svg class="i" viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7"/></svg>';
  function markMenu(which){dm.querySelectorAll('button').forEach(function(b){var on=b.textContent.trim()===which;b.classList.toggle('on',on);var s=b.querySelector('svg');if(s)s.remove();if(on)b.insertAdjacentHTML('beforeend',CK);});}
  function setRange(r){range=r;custom=null;setLabel(RANGES[r].lbl,RANGES[r].dates);markMenu(RANGES[r].lbl);inRender(scope);inClose();}
  dm.querySelectorAll('button').forEach(function(b){var t=b.textContent.trim();b.setAttribute('data-js','');b.removeAttribute('onclick');b.onclick=null;
    b.addEventListener('click',function(e){e.stopPropagation();
      if(t==='Last 7 days')setRange(7);else if(t==='Last 30 days')setRange(30);else if(t==='Last 90 days')setRange(90);else openCustom();});});

  function fmt(iso){var m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],p=iso.split('-');return m[+p[1]-1]+' '+(+p[2]);}
  function openCustom(){inClose();
    var pop=UI.popover(dateBtn,'<div class="by-cr"><b>Custom range</b><div class="by-crr"><label>From<input type="date" id="byFrom" min="2026-08-20" max="2026-11-17" value="'+(custom?custom.from:'2026-10-01')+'"></label>'+
      '<label>To<input type="date" id="byTo" min="2026-08-20" max="2026-11-17" value="'+(custom?custom.to:'2026-11-17')+'"></label></div>'+
      '<p>Data goes back to Aug 20. Funnel counts follow the invite date; calls and ratings follow the call date.</p><p class="by-crerr" id="byCrErr"></p>'+
      '<div class="by-cra"><button class="ui-b" data-js id="byCrCancel">Cancel</button><button class="ui-b pri" data-js id="byCrApply">Apply</button></div></div>',{width:300});
    if(!pop)return;
    pop.querySelector('#byCrCancel').onclick=function(){UI.close();};
    pop.querySelector('#byCrApply').onclick=function(){var a=pop.querySelector('#byFrom').value,b=pop.querySelector('#byTo').value;
      if(!a||!b||a>b){pop.querySelector('#byCrErr').textContent='Pick a start date on or before the end date.';return;}
      range=a>='2026-11-11'?7:(a>='2026-10-19'?30:90);custom={from:a,to:b,lbl:fmt(a)+' – '+fmt(b)};
      setLabel('Custom',custom.lbl);markMenu('Custom range');inRender(scope);UI.close();UI.toast('Showing '+custom.lbl+'.');};
  }

  /* export */
  UI.wire(UI.byText('Export',document.querySelector('.in-ph'))[0],function(){
    var d=RANGES[range].d[scope],L=[],rl=custom?custom.lbl:RANGES[range].dates;
    function row(a){L.push(a.map(function(x){x=String(x);return /[",]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x;}).join(','));}
    row(['PM insights','Northwind Freight']);row(['Scope',d.name]);row(['Range',rl]);row([]);
    row(['Metric','Value','Detail']);
    row(['Invite to finished call',d.rate,d.rateM]);row(['Median time to shortlist (days)',d.days,d.daysM]);row(['Candidate fairness rating (of 5)',d.fair,d.fairM]);row(['Hiring manager agreement',d.agr,d.agrM]);row([]);
    row(['Step','Reached','Of invited']);STEPS.forEach(function(s,i){row([s,d.f[i],d.f[0]?Math.round(d.f[i]/d.f[0]*100)+'%':'0%']);});row(['Still in notice period',d.wait,'']);row([]);
    row(['Range width (points)','Candidates']);['0.5','1.0','1.5','2.0','2.5+'].forEach(function(w,i){row([w,d.h[i]]);});row([]);
    row(['Fairness rating','Responses']);d.fd.forEach(function(n,i){row([i+1,n]);});
    UI.download('pm-insights-'+(scope==='all'?'all':'req-'+scope)+'-'+(custom?'custom':RANGES[range].file)+'.csv',L.join('\n'));
  });
  inRender('all');
})();
