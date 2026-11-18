/* Sam's iPhone Mail on email.html and outcome-email.html (cd- prefix, styles in cd-ios.css).
   Navigation stack: Mailboxes > message list > message, with iOS push/pop slides.
   Works: folders and counts, search, unread filter, open/next/previous, flag, mark unread,
   archive with undo, move, reply/forward/compose (adds to Sent), attachment previews. */
(function(){
  var PAGE=document.body.getAttribute('data-cd-mail')||'invite';
  var OUT=PAGE==='outcome';
  function $(id){return document.getElementById(id)}
  var esc=UI.esc;
  var screen=$('cd-screen'),holder=$('cd-primary'),pbody=$('cd-pbody');

  /* ---------- icons ---------- */
  var I={
    back:'<svg viewBox="0 0 12 21" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 2.5 10.5 10 19"/></svg>',
    cv:'<svg class="cv" viewBox="0 0 8 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m1.5 1.5 5 5-5 5"/></svg>',
    up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 15 7-7 7 7"/></svg>',
    down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 9 7 7 7-7"/></svg>',
    compose:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.5H6.5a2.5 2.5 0 0 0-2.5 2.5v10.5a2.5 2.5 0 0 0 2.5 2.5H17a2.5 2.5 0 0 0 2.5-2.5V13"/><path d="M17.8 3.7a1.9 1.9 0 0 1 2.7 2.7L12.3 14.6 9 15.5l.9-3.3z"/></svg>',
    filter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M7.5 9h9M9.3 12.2h5.4M11 15.4h2"/></svg>',
    archive:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="5" rx="1.2"/><path d="M4.5 9v9.5A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4"/></svg>',
    folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4.3l2 2h8.7A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/></svg>',
    reply:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 6 4 11.5 9.5 17"/><path d="M4.5 11.5H14a6 6 0 0 1 6 6v1"/></svg>',
    fwd:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 6 20 11.5 14.5 17"/><path d="M19.5 11.5H10a6 6 0 0 0-6 6v1"/></svg>',
    flag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 21V4M5.5 4.5h12l-2.5 4.5 2.5 4.5h-12"/></svg>',
    flagF:function(s){s=s||14;return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="#FF9500" stroke="#FF9500" stroke-width="1.6" stroke-linejoin="round" aria-label="Flagged"><path d="M5.5 21V4" fill="none" stroke-linecap="round"/><path d="M5.5 4.5h12l-2.5 4.5 2.5 4.5h-12z"/></svg>';},
    unread:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6.5L20.5 7"/></svg>',
    tray:'<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="20" height="16" rx="3"/><path d="M3.5 14H9l1.5 2.5h5L17 14h5.5"/></svg>',
    sent:'<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M22 4 3.5 11.5l7.5 3 3 7.5z"/><path d="m11 14.5 5-5" stroke-linecap="round"/></svg>',
    flagBox:'<svg viewBox="0 0 26 26" fill="none" stroke="#FF9500" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 22.5V4.5M6.5 5h13l-2.7 4.8 2.7 4.8h-13"/></svg>',
    boxA:'<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="20" height="5.5" rx="1.3"/><path d="M4.5 10v10A1.5 1.5 0 0 0 6 21.5h14a1.5 1.5 0 0 0 1.5-1.5V10M11 14h4"/></svg>',
    chevD:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    mag:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>',
    mic:'<svg width="15" height="18" viewBox="0 0 16 22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="4.5" y="1.5" width="7" height="12" rx="3.5"/><path d="M1.5 10a6.5 6.5 0 0 0 13 0M8 16.5v4"/></svg>',
    x:'<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m2 2 8 8M10 2 2 10"/></svg>',
    clip:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(60,60,67,.6)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-label="Attachment"><path d="m20 11.5-8.2 8.2a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8"/></svg>',
    sendUp:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V5M5.5 11 12 4.5l6.5 6.5"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>'
  };

  /* ---------- messages (same folder data as before) ---------- */
  var DANA_INVITE_BODY='<p>Hi Sam,</p><p>Thanks for applying. The next step is a short practice call, then a 7-minute call with an AI buyer. You can do both on your own time, on a laptop or a phone.</p><p>Practice opens today and is never scored. The scored call opens on Mon, Nov 16. Before it starts, you’ll read how it works and agree to it.</p><p>If you’d like extra time, captions, a text version or a person to interview you, reply to this email.</p><p>Dana</p>'+
    '<div class="cd-ios-cta"><dl><div><dt>Practice</dt><dd>Open now, as often as you like</dd></div><div><dt>Scored call</dt><dd>Opens Mon, Nov 16 · 7 minutes</dd></div><div><dt>No account needed</dt><dd>The link is just for you</dd></div></dl><div class="cd-ios-btnw"><a class="cd-ios-btn" href="consent.html">Open your interview</a></div></div>'+
    '<button class="cd-ios-att" type="button" data-js data-cd-att="notice"><span class="pdf"><i>PDF</i></span><span><b>Candidate notice.pdf</b><small>1 page</small></span></button>'+
    '<div class="cd-ios-sig">Dana Whitfield · Recruiter, Northwind Freight · Sent with PM</div>';

  var M=[];
  var DANA={from:'Dana Whitfield',addr:'dana@northwindfreight.com',av:'DW',avc:'linear-gradient(#7FC59A,#4E9A6B)'};
  function dana(o){for(var k in DANA)o[k]=DANA[k];return o;}
  if(OUT){
    M.push(dana({id:'dana-outcome',primary:true,f:'inbox',unread:true,star:false,att:true}));
    M.push({id:'receipt',f:'inbox',from:'Northwind Freight interviews',addr:'interviews@northwindfreight.com',av:'NF',avc:'linear-gradient(#7FA2E0,#4D74C2)',subj:'We got your scored call',prev:'Your call with Jordan Ellis finished at 9:12 am. Here’s what happens next…',time:'9:13 am',full:'Tue, Nov 17, 9:13 am',
      body:'<p>Hi Sam,</p><p>Your call with Jordan Ellis finished at 9:12 am. Nothing else is needed from you.</p><p>Marcus Lee, the hiring manager, will listen to the parts of the call behind your score. Dana Whitfield will write to you with the decision by Nov 24. Either way, you’ll get notes from the call.</p><p>Northwind Freight</p><div class="cd-ios-sig">Sent with PM for Northwind Freight</div>'});
    M.push(dana({id:'dana-invite',f:'inbox',subj:'Your first interview for Account Executive at Northwind',prev:'Thanks for applying. The next step is a short practice call…',time:'Nov 2',full:'Mon, Nov 2, 10:14 am',star:true,att:true,body:DANA_INVITE_BODY}));
  }else{
    M.push(dana({id:'dana-invite',primary:true,f:'inbox',unread:true,star:false,att:true,subj:'Your first interview for Account Executive at Northwind',prev:'Thanks for applying. The next step is a short practice call…',time:'10:14 am',full:'Mon, Nov 2, 10:14 am'}));
  }
  M.push({id:'brightline',f:'inbox',from:'Brightline Logistics Talent',addr:'talent@brightlinelogistics.com',av:'BL',avc:'linear-gradient(#F2A27E,#D86F45)',subj:'Thanks for applying to Sales Executive',prev:'We’ve got your application. Our team reviews every one…',time:OUT?'Nov 2':'9:02 am',full:'Mon, Nov 2, 9:02 am',unread:!OUT,
    body:'<p>Hi Sam,</p><p>We’ve got your application for Sales Executive. Our team reviews every one and will reply within three weeks.</p><p>Brightline Logistics Talent Team</p>'});
  M.push({id:'alex',f:'inbox',from:'Alex Rivera',addr:'alex.rivera@gmail.com',av:'AR',avc:'linear-gradient(#E59BCB,#C2639F)',subj:'Sunday dinner?',prev:'Mom wants to know if you’re coming Sunday. 6 pm, same as usual…',time:'Nov 1',full:'Sun, Nov 1, 6:40 pm',unread:!OUT,
    body:'<p>Hey,</p><p>Mom wants to know if you’re coming Sunday. 6 pm, same as usual. Also, good luck with the interviews.</p><p>Alex</p>'});
  M.push({id:'careers',f:'inbox',from:'Northwind Freight Careers',addr:'careers@northwindfreight.com',av:'NF',avc:'linear-gradient(#7FA2E0,#4D74C2)',subj:'We received your application',prev:'Thanks for applying to Account Executive, Mid-Market…',time:'Oct 30',full:'Fri, Oct 30, 4:21 pm',
    body:'<p>Hi Sam,</p><p>Thanks for applying to Account Executive, Mid-Market at Northwind Freight. Dana Whitfield, our recruiter, will be in touch within a week if your background fits the role.</p><p>You don’t need to do anything else right now.</p><p>Northwind Freight Careers</p>'});
  M.push({id:'bank',f:'inbox',from:'Maple Street Bank',addr:'alerts@maplestreetbank.com',av:'MS',avc:'linear-gradient(#BFAE95,#8E7A5E)',subj:'Your statement is ready',prev:'Your October statement is now available…',time:'Oct 28',full:'Wed, Oct 28, 7:00 am',
    body:'<p>Your October statement is now available in online banking.</p><p>This is an automated message. Please don’t reply.</p><p>Maple Street Bank</p>'});
  M.push({id:'s-alex',f:'sent',from:'Me',to:'Alex Rivera',addr:'alex.rivera@gmail.com',av:'SR',subj:'Re: Sunday dinner?',prev:'I’m in. I’ll bring dessert…',time:'Nov 1',full:'Sun, Nov 1, 7:05 pm',
    body:'<p>I’m in. I’ll bring dessert.</p><p>Thanks. One of them sent a practice call link, so I’ll try that this week.</p><p>Sam</p>'});
  M.push({id:'s-jen',f:'sent',from:'Me',to:'Jen Park',addr:'jen.park@harborsupply.com',av:'SR',subj:'Would you be a reference?',prev:'I’m applying for account executive roles and wanted to ask…',time:'Oct 27',full:'Tue, Oct 27, 8:15 am',star:true,
    body:'<p>Hi Jen,</p><p>I’m applying for account executive roles and wanted to ask if you’d be a reference. You saw most of my work on the regional accounts.</p><p>Happy to send you the job posts first.</p><p>Thanks,<br>Sam</p>'});
  M.push({id:'s-brightline',f:'sent',from:'Me',to:'Brightline Logistics Talent',addr:'talent@brightlinelogistics.com',av:'SR',subj:'Application: Sales Executive',prev:'Attached are my resume and a short note on my last two years…',time:'Oct 26',full:'Mon, Oct 26, 9:40 pm',
    body:'<p>Hello,</p><p>Attached are my resume and a short note on my last two years selling to regional carriers. I’d be glad to talk.</p><p>Sam Rivera</p>'});
  M.push({id:'a-transit',f:'archive',from:'Metro Transit',addr:'receipts@metrotransit.org',av:'MT',avc:'linear-gradient(#86CB98,#4F9A65)',subj:'Your monthly pass receipt',prev:'Thanks for your purchase. Your November pass starts Nov 1…',time:'Oct 25',full:'Sun, Oct 25, 11:02 am',
    body:'<p>Thanks for your purchase. Your November monthly pass starts Nov 1 and ends Nov 30.</p><p>Metro Transit</p>'});
  M.push({id:'a-news',f:'archive',from:'Sales Builders',addr:'hello@salesbuilders.co',av:'SB',subj:'This week: asking for the next step',prev:'Most calls end with “I’ll send some info.” Here’s what to ask instead…',time:'Oct 12',full:'Mon, Oct 12, 6:00 am',
    body:'<p>Most calls end with “I’ll send some info.” This week, three readers share what they ask instead, and how they pick a date the buyer can say yes to.</p><p>Sales Builders</p>'});
  M.forEach(function(m){m.home=m.f;});

  var FOLDERS={inbox:'Inbox',starred:'Flagged',sent:'Sent',archive:'Archive'};
  var CLOCK=screen.getAttribute('data-clock')||'10:14';
  var NOW=OUT?{time:CLOCK+' pm',full:'Tue, Nov 17, '+CLOCK+' pm'}:{time:'10:14 am',full:'Mon, Nov 2, 10:14 am'};
  var S={folder:'inbox',cur:null,depth:2,q:'',unreadOnly:false,details:false,gmailOpen:true};

  function find(id){for(var i=0;i<M.length;i++)if(M[i].id===id)return M[i];return null;}
  function P(m){ /* live parts of a message (the outcome email can switch versions) */
    if(m.primary&&OUT){var v=OE.cur();return {subj:v.s,time:v.lt,full:v.t};}
    return {subj:m.subj,time:m.time,full:m.full};
  }
  function txt(html){var d=document.createElement('div');d.innerHTML=html.replace(/<\/(p|div|dd|dt|h3)>/g,' ');return d.textContent.replace(/\s+/g,' ').trim();}
  function preview(m){
    if(m.primary){var c=pbody.cloneNode(true);[].slice.call(c.querySelectorAll('[hidden],.cd-ios-cta,.cd-ios-att,.oe-notes,.cd-ios-sig')).forEach(function(x){x.remove();});return txt(c.innerHTML);}
    return txt((m.body||'').replace(/<div class="cd-ios-(cta|sig)".*$/,''))||m.prev;
  }
  function ampm(t){return String(t).replace(/ (am|pm)\b/g,function(a,b){return ' '+b.toUpperCase();});}
  function inFolder(m){return S.folder==='starred'?!!m.star:m.f===S.folder;}
  function rows(){
    var q=S.q.trim().toLowerCase();
    return M.filter(function(m){
      if(!inFolder(m))return false;
      if(S.unreadOnly&&!m.unread)return false;
      if(q){var p=P(m),hay=(m.from+' '+(m.to||'')+' '+p.subj+' '+preview(m)).toLowerCase();if(hay.indexOf(q)<0)return false;}
      return true;
    });
  }
  function count(k){
    if(k==='inbox')return M.filter(function(m){return m.f==='inbox'&&m.unread;}).length;
    if(k==='starred')return M.filter(function(m){return m.star;}).length;
    return M.filter(function(m){return m.f===k;}).length;
  }

  /* ---------- shell ---------- */
  screen.innerHTML=
    '<div class="cd-ios-di"></div>'+
    '<div class="cd-ios-sb" aria-hidden="true"><span class="cd-ios-clock">'+esc(CLOCK)+'</span><span class="cd-ios-sbr">'+
      '<svg width="19" height="12" viewBox="0 0 19 12"><rect x="0" y="8" width="3.2" height="4" rx="1"/><rect x="5.2" y="5.5" width="3.2" height="6.5" rx="1"/><rect x="10.4" y="3" width="3.2" height="9" rx="1"/><rect x="15.6" y="0" width="3.2" height="12" rx="1"/></svg>'+
      '<svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 2.3c2.4 0 4.6.9 6.3 2.5l1.2-1.2A10.6 10.6 0 0 0 8.5.6 10.6 10.6 0 0 0 1 3.6l1.2 1.2a9 9 0 0 1 6.3-2.5zm0 3.4c1.5 0 2.9.6 4 1.5l1.2-1.2a7.4 7.4 0 0 0-10.4 0l1.2 1.2c1.1-.9 2.5-1.5 4-1.5zm0 3.4c.7 0 1.3.3 1.8.7L8.5 11.6 6.7 9.8c.5-.4 1.1-.7 1.8-.7z"/></svg>'+
      '<svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" opacity=".35"/><rect x="2" y="2" width="16" height="9" rx="2.5"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" opacity=".4"/></svg>'+
    '</span></div>'+
    '<section class="cd-ios-v grp" id="cd-v0" aria-label="Mailboxes"></section>'+
    '<section class="cd-ios-v" id="cd-v1" aria-label="Message list"></section>'+
    '<section class="cd-ios-v" id="cd-v2" aria-label="Message"></section>'+
    '<div class="cd-ios-scrim" id="cd-scrim"></div><div class="cd-ios-sheet" id="cd-sheet" role="dialog" aria-modal="true"></div>'+
    '<div class="cd-ios-toast" id="cd-toast" role="status"></div><div class="cd-ios-home"></div>';
  var V0=$('cd-v0'),V1=$('cd-v1'),V2=$('cd-v2'),VIEWS=[V0,V1,V2];

  function setDepth(d){
    S.depth=d;
    VIEWS.forEach(function(v,i){v.classList.toggle('on',i===d);v.classList.toggle('left',i<d);v.setAttribute('aria-hidden',i===d?'false':'true');if('inert' in v)v.inert=i!==d;});
  }
  function top(nav,title,big){
    return '<div class="cd-ios-top">'+'<div class="cd-ios-nav">'+nav[0]+'<span class="cd-ios-nt">'+esc(title)+'</span>'+nav[1]+'</div></div>';
  }
  function backBtn(label,act){return '<span class="cd-ios-nl"><button type="button" class="cd-ios-back" data-js data-a="'+act+'">'+I.back+'<span>'+esc(label)+'</span></button></span>';}
  function collapse(v){
    var sc=v.querySelector('.cd-ios-sc'),tp=v.querySelector('.cd-ios-top');if(!sc||!tp)return;
    var big=v.querySelector('.cd-ios-lt');
    function f(){tp.classList.toggle('sm',big?sc.scrollTop>34:sc.scrollTop>4);}
    sc.addEventListener('scroll',f);f();
  }
  function status(){
    var n=count('inbox');
    if(S.unreadOnly)return 'Filtered by:<small><span class="bl">Unread</span></small>';
    return 'Updated Just Now<small>'+(S.folder==='inbox'?(n?n+' Unread':'No Unread'):rows().length+(rows().length===1?' Message':' Messages'))+'</small>';
  }

  /* ---------- Mailboxes ---------- */
  function drawBoxes(){
    var boxes=[['inbox',I.tray],['starred',I.flagBox],['sent',I.sent],['archive',I.boxA]];
    V0.innerHTML=top(['<span></span>','<span class="cd-ios-nr"></span>'],'Mailboxes')+
      '<div class="cd-ios-sc"><h1 class="cd-ios-lt">Mailboxes</h1>'+
      '<button type="button" class="cd-ios-sech'+(S.gmailOpen?'':' shut')+'" data-js data-a="gmail" aria-expanded="'+S.gmailOpen+'"><span>Gmail</span>'+I.chevD+'</button>'+
      (S.gmailOpen?'<div class="cd-ios-grp">'+boxes.map(function(b){var n=count(b[0]);return '<button type="button" class="cd-ios-box" data-js data-box="'+b[0]+'">'+b[1]+'<span class="bx"><span>'+FOLDERS[b[0]]+'</span><em>'+(n||'')+'</em>'+I.cv+'</span></button>';}).join('')+'</div>':'')+
      '<div class="cd-ios-shp" style="text-align:left;padding:0 20px">sam.rivera@gmail.com</div></div>'+
      '<div class="cd-ios-tb"><span class="cd-ios-tbs"></span><span class="cd-ios-tbc">Updated Just Now<small>'+(count('inbox')?count('inbox')+' Unread':'No Unread')+'</small></span><button type="button" class="cd-ios-ib" data-js data-a="compose" aria-label="New message">'+I.compose+'</button></div>';
    collapse(V0);
  }

  /* ---------- message list ---------- */
  function rowHtml(m){
    var p=P(m),name=m.f==='sent'||m.home==='sent'?m.to:m.from;
    return '<button type="button" class="cd-ios-row" data-js data-id="'+m.id+'"><span class="cd-ios-dc">'+(m.unread?'<span class="cd-ios-dot" aria-label="Unread"></span>':'')+'</span>'+
      '<span class="cd-ios-rb"><span class="cd-ios-r1"><b>'+esc(name)+'</b><time>'+esc(ampm(p.time))+'</time>'+I.cv+'</span>'+
      '<span class="cd-ios-r2"><span>'+esc(p.subj)+'</span>'+(m.att?I.clip:'')+(m.star?I.flagF(13):'')+'</span>'+
      '<span class="cd-ios-r3">'+esc(preview(m))+'</span></span></button>';
  }
  function drawList(keepFocus){
    var title=FOLDERS[S.folder],rs=rows();
    var had=document.activeElement&&document.activeElement.id==='cd-q';
    var sc0=V1.querySelector('.cd-ios-sc'),st=sc0?sc0.scrollTop:0;
    var empty=S.q?'<div class="cd-ios-empty"><b>No Results</b>Nothing in '+esc(title)+' matches “'+esc(S.q)+'”.</div>':
      S.unreadOnly?'<div class="cd-ios-empty"><b>No Unread Mail</b>Tap the filter button to see all mail.</div>':
      '<div class="cd-ios-empty"><b>No Mail</b>'+(S.folder==='starred'?'Messages you flag show up here.':S.folder==='archive'?'Messages you archive show up here.':'This mailbox is empty.')+'</div>';
    V1.innerHTML=top([backBtn('Mailboxes','boxes'),'<span class="cd-ios-nr"></span>'],title)+
      '<div class="cd-ios-sc"><h1 class="cd-ios-lt">'+esc(title)+'</h1>'+
      '<label class="cd-ios-srch">'+I.mag+'<input id="cd-q" type="search" placeholder="Search" autocomplete="off" value="'+esc(S.q)+'" aria-label="Search '+esc(title)+'">'+(S.q?'<button type="button" class="cd-ios-clr" data-js data-a="clear" aria-label="Clear search">'+I.x+'</button>':I.mic)+'</label>'+
      (rs.length?'<div class="cd-ios-rows">'+rs.map(rowHtml).join('')+'</div>':empty)+'</div>'+
      '<div class="cd-ios-tb"><button type="button" class="cd-ios-ib'+(S.unreadOnly?' on':'')+'" data-js data-a="filter" aria-pressed="'+S.unreadOnly+'" aria-label="Show only unread">'+I.filter+'</button><span class="cd-ios-tbc">'+status()+'</span><button type="button" class="cd-ios-ib" data-js data-a="compose" aria-label="New message">'+I.compose+'</button></div>';
    var q=$('cd-q');
    q.addEventListener('input',function(){S.q=q.value;drawList(true);});
    if(had||keepFocus){q.focus();q.setSelectionRange(q.value.length,q.value.length);}
    var sc=V1.querySelector('.cd-ios-sc');sc.scrollTop=st;
    collapse(V1);
  }

  /* ---------- message ---------- */
  function drawMsg(){
    if(pbody.parentNode!==holder)holder.appendChild(pbody);
    var m=find(S.cur);if(!m){V2.innerHTML='';return;}
    var p=P(m),rs=rows(),i=rs.indexOf(m),mine=m.home==='sent';
    var fromName=mine?'Sam Rivera':m.from,fromAddr=mine?'sam.rivera@gmail.com':m.addr;
    var toName=mine?m.to:'Sam Rivera',toAddr=mine?m.addr:'sam.rivera@gmail.com';
    V2.innerHTML=top([backBtn(FOLDERS[S.folder],'list'),'<span class="cd-ios-nr"><button type="button" class="cd-ios-ib" data-js data-a="prev" aria-label="Previous message"'+(i>0?'':' disabled')+'>'+I.up+'</button><button type="button" class="cd-ios-ib" data-js data-a="next" aria-label="Next message"'+(i>=0&&i<rs.length-1?'':' disabled')+'>'+I.down+'</button></span>'],'')+
      '<div class="cd-ios-sc">'+
      '<div class="cd-ios-mh"><span class="cd-ios-av"'+(m.avc&&!mine?' style="background:'+m.avc+'"':'')+'>'+esc(mine?'SR':m.av)+'</span><div class="cd-ios-mhb">'+
        '<div class="cd-ios-mh1"><b>'+esc(fromName)+'</b><time>'+esc(ampm(p.time))+'</time></div>'+
        '<div class="cd-ios-mh2"><span>To: '+esc(toName)+'</span><button type="button" data-js data-a="details" aria-expanded="'+S.details+'">'+(S.details?'Hide':'Details')+'</button></div>'+
        (S.details?'<div class="cd-ios-det"><div>From: <b>'+esc(fromName)+'</b> '+esc(fromAddr)+'</div><div>To: <b>'+esc(toName)+'</b> '+esc(toAddr)+'</div><div>'+esc(ampm(p.full))+'</div></div>':'')+
      '</div></div>'+
      '<h2 class="cd-ios-subj">'+esc(p.subj)+(m.star?I.flagF(16):'')+'<small>'+esc(ampm(p.full))+'</small></h2>'+
      '<div class="cd-ios-body" id="cd-body">'+(m.primary?'':m.body)+'</div></div>'+
      '<div class="cd-ios-tb">'+
        '<button type="button" class="cd-ios-ib" data-js data-a="archive" aria-label="'+(m.f==='archive'?'Move to Inbox':'Archive')+'">'+(m.f==='archive'?I.tray:I.archive)+'</button>'+
        '<button type="button" class="cd-ios-ib" data-js data-a="move" aria-label="Move message">'+I.folder+'</button>'+
        '<button type="button" class="cd-ios-ib" data-js data-a="flag" aria-pressed="'+!!m.star+'" aria-label="'+(m.star?'Unflag':'Flag')+'">'+(m.star?I.flagF(24):I.flag)+'</button>'+
        '<button type="button" class="cd-ios-ib" data-js data-a="reply" aria-label="Reply, forward and more">'+I.reply+'</button>'+
        '<button type="button" class="cd-ios-ib" data-js data-a="compose" aria-label="New message">'+I.compose+'</button></div>';
    if(m.primary)$('cd-body').appendChild(pbody);
    V2.querySelectorAll('[data-cd-att]').forEach(wireAtt);
    collapse(V2);
  }
  function drawAll(){drawBoxes();drawList();drawMsg();}

  /* ---------- actions ---------- */
  function openMsg(id){var m=find(id);if(!m)return;S.cur=id;m.unread=false;S.details=false;drawMsg();V2.querySelector('.cd-ios-sc').scrollTop=0;setDepth(2);setTimeout(function(){drawList();drawBoxes();},60);}
  function openFolder(k){S.folder=k;S.q='';S.unreadOnly=false;drawList();V1.querySelector('.cd-ios-sc').scrollTop=0;setDepth(1);}
  function label(m){return P(m).subj;}
  function archive(m){
    var was=m.f,to=was==='archive'?(m.home==='archive'?'inbox':m.home):'archive';
    m.f=to;m.unread=false;drawAll();setDepth(1);
    toast(to==='archive'?'Archived “'+label(m)+'”.':'Moved “'+label(m)+'” to '+FOLDERS[to]+'.',function(){m.f=was;drawAll();toast('Moved back to '+FOLDERS[was]+'.');});
  }
  function flag(m){m.star=!m.star;drawAll();toast(m.star?'Flagged “'+label(m)+'”.':'Removed the flag.');}
  function markUnread(m){m.unread=true;drawAll();setDepth(1);toast('Marked “'+label(m)+'” as unread.');}
  function step(d){var rs=rows(),i=rs.indexOf(find(S.cur));var n=rs[i+d];if(!n)return;S.cur=n.id;n.unread=false;S.details=false;drawMsg();drawList();drawBoxes();}

  /* toast inside the phone, with optional Undo */
  var tEl=$('cd-toast'),tTm;
  function toast(msg,undo){
    tEl.innerHTML='<span>'+esc(msg)+'</span>'+(undo?'<button type="button" data-js>Undo</button>':'');
    tEl.classList.add('on');
    if(undo)tEl.querySelector('button').onclick=function(){tEl.classList.remove('on');undo();};
    clearTimeout(tTm);tTm=setTimeout(function(){tEl.classList.remove('on');},undo?6000:2600);
  }

  /* sheets */
  var scrim=$('cd-scrim'),sheet=$('cd-sheet'),sheetClose=null;
  function openSheet(html,cls,onClose){
    sheet.className='cd-ios-sheet'+(cls?' '+cls:'');sheet.innerHTML=html;sheetClose=onClose||null;
    requestAnimationFrame(function(){scrim.classList.add('on');sheet.classList.add('on');});
  }
  function closeSheet(){scrim.classList.remove('on');sheet.classList.remove('on');var f=sheetClose;sheetClose=null;if(f)f();}
  scrim.addEventListener('click',function(){var c=sheet.querySelector('[data-a="cancel"]');if(c)c.click();else closeSheet();});
  function sheetHead(m){var p=P(m);return '<div class="cd-ios-grab"></div><div class="cd-ios-shh"><span class="cd-ios-av"'+(m.avc&&m.home!=='sent'?' style="background:'+m.avc+'"':'')+'>'+esc(m.home==='sent'?'SR':m.av)+'</span><div><b>'+esc(m.home==='sent'?m.to:m.from)+'</b><small>'+esc(p.subj)+'</small></div><button type="button" class="cd-ios-x" data-js data-a="close" aria-label="Close">'+I.x+'</button></div>';}
  function replySheet(m){
    openSheet(sheetHead(m)+'<div class="cd-ios-acts">'+
      act('s-reply','Reply',I.reply)+act('s-fwd','Forward',I.fwd)+'</div><div style="height:12px"></div><div class="cd-ios-acts">'+
      act('s-flag',m.star?'Unflag':'Flag',m.star?I.flagF(22):I.flag)+act('s-unread','Mark as Unread',I.unread)+act('s-move','Move Message…',I.folder)+act('s-archive',m.f==='archive'?'Move to Inbox':'Archive Message',I.archive)+'</div>');
  }
  function act(a,t,ic,dis){return '<button type="button" class="cd-ios-act" data-js data-a="'+a+'"'+(dis?' disabled':'')+'><span>'+esc(t)+'</span>'+ic+'</button>';}
  function moveSheet(m){
    var cur=m.f;
    openSheet(sheetHead(m)+'<div class="cd-ios-shp">Move this message to a new mailbox.</div><div class="cd-ios-acts">'+
      [['inbox',I.tray],['archive',I.boxA]].map(function(b){var on=cur===b[0];return '<button type="button" class="cd-ios-act" data-js data-mv="'+b[0]+'"'+(on?' disabled':'')+'><span>'+FOLDERS[b[0]]+(on?' (current)':'')+'</span>'+(on?I.check:b[1])+'</button>';}).join('')+'</div>');
  }
  function compose(kind,m){
    var to='',subj='',p=m&&P(m);
    if(kind==='reply'){to=m.home==='sent'?m.to:m.from;subj='Re: '+p.subj.replace(/^Re: /,'');}
    if(kind==='fwd'){subj='Fwd: '+p.subj;}
    var title=kind==='reply'?subj:kind==='fwd'?subj:'New Message';
    openSheet('<div class="cd-ios-cmph"><button type="button" class="cd-ios-tx" data-js data-a="cancel">Cancel</button><b>'+esc(title)+'</b><button type="button" class="cd-ios-send" data-js data-a="send" aria-label="Send"'+(to?'':' disabled')+'>'+I.sendUp+'</button></div>'+
      '<label class="cd-ios-fld">To:<input id="cd-cto" value="'+esc(to)+'" autocomplete="off"></label>'+
      '<label class="cd-ios-fld">Cc/Bcc, From:<span class="v">sam.rivera@gmail.com</span></label>'+
      '<label class="cd-ios-fld">Subject:<input id="cd-csub" value="'+esc(subj)+'" autocomplete="off"></label>'+
      '<textarea id="cd-cbody" aria-label="Message">\n\nSent from my iPhone'+(kind==='fwd'?'\n\nBegin forwarded message:\nFrom: '+(m.home==='sent'?'Sam Rivera':m.from)+'\nSubject: '+p.subj+'\n\n'+(m.primary?preview(m):txt(m.body)):'')+'</textarea>','cd-ios-cmp');
    var ti=$('cd-cto'),sb=sheet.querySelector('.cd-ios-send'),bd=$('cd-cbody');
    var start=bd.value;
    ti.addEventListener('input',function(){sb.disabled=!ti.value.trim();});
    setTimeout(function(){(to?bd:ti).focus();if(to)bd.setSelectionRange(0,0);},400);
    sheet._dirty=function(){return bd.value!==start||(!to&&ti.value.trim());};
    sheet._ctx={kind:kind,m:m};
  }
  function send(){
    var to=$('cd-cto').value.trim(),sub=$('cd-csub').value.trim()||'(No Subject)',body=$('cd-cbody').value;
    if(!to)return;
    var ctx=sheet._ctx,addr=to.indexOf('@')>0?to:(ctx.m&&ctx.kind==='reply'?(ctx.m.home==='sent'?ctx.m.addr:ctx.m.addr):to);
    var html=body.split(/\n{2,}/).map(function(x){return x.trim()?'<p>'+esc(x).replace(/\n/g,'<br>')+'</p>':'';}).join('');
    var nm={id:'new-'+Date.now(),f:'sent',home:'sent',from:'Me',to:to,addr:addr,av:'SR',subj:sub,prev:txt(html).slice(0,80),time:NOW.time,full:NOW.full,body:html||'<p></p>'};
    M.splice(0,0,nm);
    closeSheet();drawAll();
    toast(ctx.kind==='reply'?'Sent your reply to '+to+'.':'Sent “'+sub+'” to '+to+'.');
  }

  /* one click handler for everything inside the phone */
  screen.addEventListener('click',function(e){
    var row=e.target.closest('[data-id]');if(row&&screen.contains(row)){openMsg(row.getAttribute('data-id'));return;}
    var bx=e.target.closest('[data-box]');if(bx){openFolder(bx.getAttribute('data-box'));return;}
    var mv=e.target.closest('[data-mv]');
    var m=find(S.cur);
    if(mv){var k=mv.getAttribute('data-mv');closeSheet();if(!m||m.f===k)return;var was=m.f;m.f=k;drawAll();setDepth(1);
      toast('Moved “'+label(m)+'” to '+FOLDERS[k]+'.',function(){m.f=was;drawAll();toast('Moved back to '+FOLDERS[was]+'.');});return;}
    var b=e.target.closest('[data-a]');if(!b)return;
    var a=b.getAttribute('data-a');
    switch(a){
      case 'boxes':drawBoxes();setDepth(0);break;
      case 'list':drawList();setDepth(1);break;
      case 'gmail':S.gmailOpen=!S.gmailOpen;drawBoxes();break;
      case 'filter':S.unreadOnly=!S.unreadOnly;drawList();break;
      case 'clear':S.q='';drawList(true);break;
      case 'prev':step(-1);break;
      case 'next':step(1);break;
      case 'details':S.details=!S.details;drawMsg();break;
      case 'archive':if(m)archive(m);break;
      case 'flag':if(m)flag(m);break;
      case 'move':if(m)moveSheet(m);break;
      case 'reply':if(m)replySheet(m);break;
      case 'compose':closeSheet();setTimeout(function(){compose('new');},S.depth===2&&sheet.classList.contains('on')?380:0);break;
      case 'close':closeSheet();break;
      case 'cancel':var dirty=sheet._dirty&&sheet._dirty();closeSheet();if(dirty)toast('Deleted the draft.');break;
      case 'send':send();break;
      case 's-reply':closeSheet();setTimeout(function(){compose('reply',m);},380);break;
      case 's-fwd':closeSheet();setTimeout(function(){compose('fwd',m);},380);break;
      case 's-flag':closeSheet();if(m)flag(m);break;
      case 's-unread':closeSheet();if(m)markUnread(m);break;
      case 's-move':closeSheet();setTimeout(function(){if(m)moveSheet(m);},380);break;
      case 's-archive':closeSheet();if(m)archive(m);break;
    }
  });
  /* the row tap highlight, like iOS */
  screen.addEventListener('pointerdown',function(e){var r=e.target.closest('.cd-ios-row');if(r){r.classList.add('hit');setTimeout(function(){r.classList.remove('hit');},260);}});

  /* ---------- attachments (PDF preview in the shared modal) ---------- */
  function notice(){
    return '<div class="cd-pdf"><div class="cd-pdfh"><span class="lg">N</span><div><b>Northwind Freight</b><small>Candidate notice · Account Executive, Mid-Market · version 2, Oct 30</small></div></div>'+
      '<h3>How your first interview works</h3><p>Northwind Freight uses PM for the first interview for this role. You’ll talk with an AI buyer for about 7 minutes. PM scores three skills: discovery, handling doubt and getting a next step.</p>'+
      '<h3>What never gets scored</h3><p>Your voice, your accent, pauses and “um”, your face (there’s no video) and practice calls.</p>'+
      '<h3>Who decides</h3><p>A person on our hiring team reviews every result and makes the decision. For this role that’s Marcus Lee, hiring manager, with Dana Whitfield, recruiter.</p>'+
      '<h3>What you can ask for</h3><p>Extra time, live captions, a text version of the call, or a person to interview you instead. Asking doesn’t affect your score, and the hiring manager never sees the request.</p>'+
      '<h3>Your recording</h3><p>Kept 12 months, then deleted. Ask Dana to delete it sooner at dana@northwindfreight.com.</p>'+
      '<p class="cd-pdff">Page 1 of 1 · You’ll agree to this notice before your scored call.</p></div>';
  }
  function notesDoc(){
    var adv=!$('oe-adv')||!$('oe-adv').hidden;
    var ms=[].slice.call(document.querySelectorAll('.oe-m')).filter(function(x){return !x.hidden;});
    var rws=ms.map(function(x){return '<div class="cd-pm"><time>'+esc(x.querySelector('time').textContent)+'</time><div><b>'+esc(x.querySelector('b').textContent)+'</b><p>'+esc(x.querySelector('span').textContent)+'</p></div></div>';}).join('');
    return '<div class="cd-pdf"><div class="cd-pdfh"><span class="lg">N</span><div><b>Northwind Freight</b><small>Your call notes · Account Executive, Mid-Market</small></div></div>'+
      '<h3>Your call with Jordan Ellis</h3><p>Tue, Nov 17, 9:05–9:12 am · 7 minutes · medium difficulty</p>'+
      '<h3>'+(adv?'The three moments Marcus listened to':'The two moments that stood out')+'</h3>'+rws+
      '<h3>What was scored</h3><p>Discovery, handling doubt and getting a next step. Your voice, accent, pauses and face were not scored. Marcus Lee made the decision.</p>'+
      '<p class="cd-pdff">Page 1 of 2 · Page 2 has the full transcript.</p></div>';
  }
  function docTxt(html){var d=document.createElement('div');d.innerHTML=html.replace(/<\/(h3|p|div)>/g,'\n');return d.textContent.replace(/\n{3,}/g,'\n\n').trim()+'\n';}
  function wireAtt(b){
    if(b._cd)return;b._cd=1;
    b.addEventListener('click',function(){
      var k=b.getAttribute('data-cd-att'),isN=k==='notice',html=isN?notice():notesDoc(),fn=isN?'Candidate notice.txt':'Your call notes.txt';
      UI.modal({title:isN?'Candidate notice.pdf':'Your call notes.pdf',wide:true,body:html,actions:[{label:'Close'},{label:'Download',primary:true,onClick:function(){UI.download(fn,docTxt(html),'text/plain');return false;}}]});
    });
  }
  pbody.querySelectorAll('[data-cd-att]').forEach(wireAtt);

  /* ---------- fit the phone in the window, above the step bar ---------- */
  var phone=$('cd-phone'),fit=$('cd-fit');
  function size(){
    var avail=window.innerHeight-16-58-36-18; /* top gap, step bar offset and height, breathing room */
    var s=Math.max(.55,Math.min(1,avail/868));
    phone.style.transform='scale('+s+')';fit.style.width=(414*s)+'px';fit.style.height=(868*s)+'px';
  }
  window.addEventListener('resize',size);size();
  /* focusing or scrolling-into-view must never shift the device glass itself */
  [screen,phone,fit].forEach(function(el){el.addEventListener('scroll',function(){if(el.scrollTop||el.scrollLeft){el.scrollTop=0;el.scrollLeft=0;}});});

  /* outcome page: the prototype switch re-renders the decision email */
  window.cdMailRefresh=function(){drawAll();};

  /* open straight to the primary message, with the list behind it */
  S.cur=M[0].id;M[0].unread=false;
  drawAll();setDepth(2);
  requestAnimationFrame(function(){requestAnimationFrame(function(){screen.classList.add('cd-ios-anim');});});
})();
