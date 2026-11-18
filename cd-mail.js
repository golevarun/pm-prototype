/* Sam's mail client on email.html and outcome-email.html: folders, stars, archive with undo,
   opening other messages, and attachment previews. Owned by the candidate-journey pages (cd- prefix). */
(function(){
  /* ui.js modal, menu and popover buttons have no data-js, so proto.js shows its "not built" note after they run. Mark them. */
  new MutationObserver(function(){document.querySelectorAll('.ui-ov button:not([data-js]),.ui-dr-ov button:not([data-js]),.ui-pop button:not([data-js])').forEach(function(b){b.setAttribute('data-js','');});}).observe(document.body,{childList:true,subtree:true});
  var PAGE=document.body.getAttribute('data-cd-mail')||'invite';
  var OUT=PAGE==='outcome';
  function $(id){return document.getElementById(id)}
  var esc=UI.esc;

  var DANA_INVITE_BODY='<p>Hi Sam,</p><p>Thanks for applying. The next step is a short practice call, then a 7-minute call with an AI buyer. You can do both on your own time, on a laptop or a phone.</p><p>Practice opens today and is never scored. The scored call opens on Mon, Nov 16. Before it starts, you’ll read how it works and agree to it.</p><p>If you’d like extra time, captions, a text version or a person to interview you, reply to this email.</p><p>Dana</p>'+
    '<div class="cta"><div class="row"><div><small>Practice</small>Open now, as often as you like</div><div><small>Scored call</small>Opens Mon, Nov 16 · 7 minutes</div><div><small>No account needed</small>The link is just for you</div></div><a class="btn yellow lg" href="consent.html">Open your interview</a></div>'+
    '<button class="att cd-att" type="button" data-js data-cd-att="notice"><svg class="i" viewBox="0 0 16 16"><path d="M4 2.5h5.5L12.5 5.5V13a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5z"/><path d="M9.5 2.5v3h3"/></svg>Candidate notice.pdf <small>· 1 page</small></button>'+
    '<div class="sig">Dana Whitfield · Recruiter, Northwind Freight · Sent with PM</div>';

  var M=[];
  if(OUT){
    M.push({id:'dana-outcome',primary:true,f:'inbox',from:'Dana Whitfield',av:'DW',unread:true,star:false});
    M.push({id:'receipt',f:'inbox',from:'Northwind Freight interviews',addr:'interviews@northwindfreight.com',av:'NF',avc:'#E3ECFC;color:#2A4F99',subj:'We got your scored call',prev:'Your call with Jordan Ellis finished at 9:12 am. Here’s what happens next…',time:'9:13 am',full:'Tue, Nov 17, 9:13 am',
      body:'<p>Hi Sam,</p><p>Your call with Jordan Ellis finished at 9:12 am. Nothing else is needed from you.</p><p>Marcus Lee, the hiring manager, will listen to the parts of the call behind your score. Dana Whitfield will write to you with the decision by Nov 24. Either way, you’ll get notes from the call.</p><p>Northwind Freight</p><div class="sig">Sent with PM for Northwind Freight</div>'});
    M.push({id:'dana-invite',f:'inbox',from:'Dana Whitfield',addr:'dana@northwindfreight.com',av:'DW',subj:'Your first interview for Account Executive at Northwind',prev:'Thanks for applying. The next step is a short practice call…',time:'Nov 2',full:'Mon, Nov 2, 10:14 am',star:true,body:DANA_INVITE_BODY});
  }else{
    M.push({id:'dana-invite',primary:true,f:'inbox',from:'Dana Whitfield',av:'DW',unread:true,star:false,subj:'Your first interview for Account Executive at Northwind',prev:'Thanks for applying. The next step is a short practice call…',time:'10:14 am'});
  }
  M.push({id:'brightline',f:'inbox',from:'Brightline Logistics Talent',addr:'talent@brightlinelogistics.com',av:'BL',avc:'#FBE7DE;color:#9A4320',subj:'Thanks for applying to Sales Executive',prev:'We’ve got your application. Our team reviews every one…',time:OUT?'Nov 2':'9:02 am',full:'Mon, Nov 2, 9:02 am',unread:!OUT,
    body:'<p>Hi Sam,</p><p>We’ve got your application for Sales Executive. Our team reviews every one and will reply within three weeks.</p><p>Brightline Logistics Talent Team</p>'});
  M.push({id:'alex',f:'inbox',from:'Alex Rivera',addr:'alex.rivera@gmail.com',av:'AR',avc:'#F9E3F1;color:#8A2D6B',subj:'Sunday dinner?',prev:'Mom wants to know if you’re coming Sunday. 6 pm, same as usual…',time:'Nov 1',full:'Sun, Nov 1, 6:40 pm',unread:!OUT,
    body:'<p>Hey,</p><p>Mom wants to know if you’re coming Sunday. 6 pm, same as usual. Also, good luck with the interviews.</p><p>Alex</p>'});
  M.push({id:'careers',f:'inbox',from:'Northwind Freight Careers',addr:'careers@northwindfreight.com',av:'NF',avc:'#E3ECFC;color:#2A4F99',subj:'We received your application',prev:'Thanks for applying to Account Executive, Mid-Market…',time:'Oct 30',full:'Fri, Oct 30, 4:21 pm',
    body:'<p>Hi Sam,</p><p>Thanks for applying to Account Executive, Mid-Market at Northwind Freight. Dana Whitfield, our recruiter, will be in touch within a week if your background fits the role.</p><p>You don’t need to do anything else right now.</p><p>Northwind Freight Careers</p>'});
  M.push({id:'bank',f:'inbox',from:'Maple Street Bank',addr:'alerts@maplestreetbank.com',av:'MS',avc:'#E8E2D8;color:#493B2C',subj:'Your statement is ready',prev:'Your October statement is now available…',time:'Oct 28',full:'Wed, Oct 28, 7:00 am',
    body:'<p>Your October statement is now available in online banking.</p><p>This is an automated message. Please don’t reply.</p><p>Maple Street Bank</p>'});
  M.push({id:'s-alex',f:'sent',from:'Me',to:'Alex Rivera',addr:'to alex.rivera@gmail.com',av:'SR',subj:'Re: Sunday dinner?',prev:'I’m in. I’ll bring dessert…',time:'Nov 1',full:'Sun, Nov 1, 7:05 pm',
    body:'<p>I’m in. I’ll bring dessert.</p><p>Thanks. One of them sent a practice call link, so I’ll try that this week.</p><p>Sam</p>'});
  M.push({id:'s-jen',f:'sent',from:'Me',to:'Jen Park',addr:'to jen.park@harborsupply.com',av:'SR',subj:'Would you be a reference?',prev:'I’m applying for account executive roles and wanted to ask…',time:'Oct 27',full:'Tue, Oct 27, 8:15 am',star:true,
    body:'<p>Hi Jen,</p><p>I’m applying for account executive roles and wanted to ask if you’d be a reference. You saw most of my work on the regional accounts.</p><p>Happy to send you the job posts first.</p><p>Thanks,<br>Sam</p>'});
  M.push({id:'s-brightline',f:'sent',from:'Me',to:'Brightline Logistics Talent',addr:'to talent@brightlinelogistics.com',av:'SR',subj:'Application: Sales Executive',prev:'Attached are my resume and a short note on my last two years…',time:'Oct 26',full:'Mon, Oct 26, 9:40 pm',
    body:'<p>Hello,</p><p>Attached are my resume and a short note on my last two years selling to regional carriers. I’d be glad to talk.</p><p>Sam Rivera</p>'});
  M.push({id:'a-transit',f:'archive',from:'Metro Transit',addr:'receipts@metrotransit.org',av:'MT',avc:'#E2F2E6;color:#2B6B3E',subj:'Your monthly pass receipt',prev:'Thanks for your purchase. Your November pass starts Nov 1…',time:'Oct 25',full:'Sun, Oct 25, 11:02 am',
    body:'<p>Thanks for your purchase. Your November monthly pass starts Nov 1 and ends Nov 30.</p><p>Metro Transit</p>'});
  M.push({id:'a-news',f:'archive',from:'Sales Builders',addr:'hello@salesbuilders.co',av:'SB',avc:'#F4F4F2;color:#535347',subj:'This week: asking for the next step',prev:'Most calls end with “I’ll send some info.” Here’s what to ask instead…',time:'Oct 12',full:'Mon, Oct 12, 6:00 am',
    body:'<p>Most calls end with “I’ll send some info.” This week, three readers share what they ask instead, and how they pick a date the buyer can say yes to.</p><p>Sales Builders</p>'});
  M.forEach(function(m){m.home=m.f;});

  var FOLDERS={inbox:'Inbox',starred:'Starred',sent:'Sent',archive:'Archive'};
  var folder='inbox',cur=null;
  var list=document.querySelector('.list'),read=document.querySelector('.read'),fold=document.querySelector('.fold');

  /* keep the original reading pane for the primary message */
  var orig=document.createElement('div');orig.id='cd-orig';
  while(read.firstChild)orig.appendChild(read.firstChild);
  var tools=document.createElement('div');tools.className='cd-tools';
  tools.innerHTML='<button type="button" class="cd-tb" data-js data-t="star"><svg class="i" viewBox="0 0 16 16"><path d="m8 2.5 1.7 3.5 3.8.5-2.8 2.6.7 3.8L8 11.1l-3.4 1.8.7-3.8-2.8-2.6 3.8-.5z"/></svg><span>Star</span></button>'+
    '<button type="button" class="cd-tb" data-js data-t="archive"><svg class="i" viewBox="0 0 16 16"><rect x="2.5" y="3" width="11" height="3" rx=".8"/><path d="M3.5 6v6.5h9V6M6.5 8.5h3"/></svg><span>Archive</span></button>'+
    '<button type="button" class="cd-tb" data-js data-t="unread"><svg class="i" viewBox="0 0 16 16"><rect x="2.5" y="3.5" width="11" height="9" rx="1.5"/><path d="m3 4.5 5 4 5-4"/></svg><span>Mark as unread</span></button>'+
    '<span class="cd-pos" id="cd-pos"></span>';
  var gen=document.createElement('div');gen.id='cd-gen';
  var empty=document.createElement('div');empty.className='cd-empty';empty.id='cd-rempty';
  read.appendChild(tools);read.appendChild(orig);read.appendChild(gen);read.appendChild(empty);
  /* hidden holders so the outcome view switch keeps working when its list row isn't shown */
  var hold=document.createElement('div');hold.hidden=true;hold.id='cd-hold';document.body.appendChild(hold);

  /* attachment in the original pane */
  var att=orig.querySelector('span.att');
  if(att){var b=document.createElement('button');b.type='button';b.className='att cd-att';b.setAttribute('data-js','');b.setAttribute('data-cd-att',OUT?'notes':'notice');b.innerHTML=att.innerHTML;att.replaceWith(b);}

  function primaryRowParts(){
    /* read the live values (the outcome page can switch between advanced and declined) */
    var s=$('oe-lsubj'),p=$('oe-lprev'),t=$('oe-ltime');
    return {s:s?s.textContent:M[0].subj,p:p?p.textContent:M[0].prev,t:t?t.textContent:M[0].time};
  }
  function inFolder(m){if(folder==='starred')return m.star;return m.f===folder;}
  function visible(){return M.filter(inFolder);}
  function starSvg(on){return '<svg class="i" viewBox="0 0 16 16"'+(on?' style="fill:#C9821E;stroke:#C9821E"':'')+'><path d="m8 2.5 1.7 3.5 3.8.5-2.8 2.6.7 3.8L8 11.1l-3.4 1.8.7-3.8-2.8-2.6 3.8-.5z"/></svg>';}

  function drawFolders(){
    var n=M.filter(function(m){return m.f==='inbox'&&m.unread;}).length;
    fold.querySelectorAll('a').forEach(function(a){
      var k=a.getAttribute('data-cd-f');a.classList.toggle('on',k===folder);a.setAttribute('aria-current',k===folder?'page':'false');
      var sp=a.querySelector('span');if(k==='inbox'){if(!sp){sp=document.createElement('span');a.appendChild(sp);}sp.textContent=n?n:'';}
    });
  }
  function drawList(){
    var pp=OUT?primaryRowParts():null;
    var rows=visible();
    var h='<div class="h">'+FOLDERS[folder]+'<small class="cd-cnt">'+rows.length+(rows.length===1?' message':' messages')+'</small></div>';
    if(!rows.length)h+='<div class="cd-lempty">'+(folder==='starred'?'No starred messages. Star a message to find it here.':folder==='archive'?'Nothing archived.':'Nothing here.')+'</div>';
    rows.forEach(function(m){
      var subj=m.subj,prev=m.prev,time=m.time;
      var ids=m.primary&&OUT;
      if(ids){subj=pp.s;prev=pp.p;time=pp.t;}
      var name=m.f==='sent'?'To: '+m.to:m.from;
      h+='<div class="it cd-it'+(m.id===cur?' on':'')+(m.unread?' cd-unread':'')+(m.primary&&OUT&&m.unread?' oe-new':'')+'" role="button" tabindex="0" data-id="'+m.id+'">'+
        '<div class="r"><'+(m.unread?'b':'span')+'>'+(m.primary&&OUT&&m.unread?'<i class="oe-dot"></i>':'')+esc(name)+'</'+(m.unread?'b':'span')+'><span class="cd-rt"><time'+(ids?' id="oe-ltime"':'')+'>'+esc(time)+'</time>'+
        '<button type="button" class="cd-star'+(m.star?' on':'')+'" data-js data-star="'+m.id+'" aria-pressed="'+!!m.star+'" aria-label="'+(m.star?'Unstar':'Star')+'">'+starSvg(m.star)+'</button></span></div>'+
        '<div class="s"'+(ids?' id="oe-lsubj"':'')+'>'+esc(subj)+'</div><div class="p"'+(ids?' id="oe-lprev"':'')+'>'+esc(prev)+'</div></div>';
    });
    /* keep the outcome view switch targets alive when the primary row isn't listed */
    hold.innerHTML='';
    if(OUT&&!rows.some(function(m){return m.primary;})){hold.innerHTML='<span id="oe-ltime">'+esc(pp.t)+'</span><span id="oe-lsubj">'+esc(pp.s)+'</span><span id="oe-lprev">'+esc(pp.p)+'</span>';}
    list.innerHTML=h;
    list.querySelectorAll('.cd-it').forEach(function(el){
      el.addEventListener('click',function(e){if(e.target.closest('.cd-star'))return;openMsg(el.getAttribute('data-id'));});
      el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openMsg(el.getAttribute('data-id'));}});
    });
    list.querySelectorAll('.cd-star').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();toggleStar(find(b.getAttribute('data-star')));});});
  }
  function find(id){for(var i=0;i<M.length;i++)if(M[i].id===id)return M[i];return null;}
  function drawRead(){
    var m=cur&&find(cur);
    var rows=visible();
    tools.hidden=!m;orig.hidden=!(m&&m.primary);gen.hidden=!(m&&!m.primary);empty.hidden=!!m;
    if(!m){empty.innerHTML='<p>'+(rows.length?'Pick a message to read it.':'No messages in '+FOLDERS[folder]+'.')+'</p>';return;}
    var sb=tools.querySelector('[data-t="star"]');sb.querySelector('span').textContent=m.star?'Starred':'Star';sb.classList.toggle('on',!!m.star);sb.setAttribute('aria-pressed',!!m.star);
    sb.querySelector('svg').outerHTML=starSvg(m.star);
    var ab=tools.querySelector('[data-t="archive"] span');ab.textContent=m.f==='archive'?'Move to '+(m.home==='archive'?'Inbox':FOLDERS[m.home]):'Archive';
    var idx=rows.indexOf(m);$('cd-pos').textContent=idx>=0?(idx+1)+' of '+rows.length:'';
    if(!m.primary){
      gen.innerHTML='<h1>'+esc(m.subj)+'</h1><div class="from"><span class="av"'+(m.avc?' style="background:'+m.avc+'"':'')+'>'+m.av+'</span><div><b>'+esc(m.f==='sent'||m.home==='sent'?'Sam Rivera':m.from)+'</b><small>'+esc(m.home==='sent'?'sam.rivera@gmail.com · '+m.addr:m.addr+' · to me')+'</small></div><time>'+esc(m.full)+'</time></div><div class="body">'+m.body+'</div>';
      gen.querySelectorAll('[data-cd-att]').forEach(wireAtt);
    }
    read.scrollTop=0;
  }
  function draw(){drawFolders();drawList();drawRead();}
  function openMsg(id){
    var prev=cur&&find(cur);if(prev)prev.unread=false;
    cur=id;var m=find(id);if(m)m.unread=false;draw();
  }
  function setFolder(k){
    var prev=cur&&find(cur);if(prev)prev.unread=false;
    folder=k;var rows=visible();cur=rows.length?rows[0].id:null;if(cur)find(cur).unread=false;draw();
  }
  function toggleStar(m){m.star=!m.star;draw();UI.toast(m.star?'Starred “'+(m.primary&&OUT?primaryRowParts().s:m.subj)+'”.':'Removed the star.');}

  /* toast with Undo (the shared toast can't take clicks) */
  var tt=document.createElement('div');tt.className='cd-toast';tt.setAttribute('role','status');document.body.appendChild(tt);var ttm;
  function undoToast(msg,undo){
    tt.innerHTML='<span>'+esc(msg)+'</span><button type="button" data-js>Undo</button>';tt.classList.add('on');
    tt.querySelector('button').onclick=function(){tt.classList.remove('on');undo();};
    clearTimeout(ttm);ttm=setTimeout(function(){tt.classList.remove('on');},6000);
  }
  function archive(m){
    var rows=visible(),i=rows.indexOf(m),was=m.f;
    var label=m.primary&&OUT?primaryRowParts().s:m.subj;
    if(m.f==='archive'){m.f=m.home==='archive'?'inbox':m.home;}else{m.f='archive';}
    m.unread=false;
    var left=visible();
    if(!inFolder(m)){cur=left.length?left[Math.min(i,left.length-1)].id:null;}
    draw();
    undoToast(was==='archive'?'Moved “'+label+'” to '+FOLDERS[m.f]+'.':'Archived “'+label+'”.',function(){m.f=was;folder=folder;cur=m.id;draw();UI.toast(was==='archive'?'Moved back to Archive.':'Moved back to '+FOLDERS[was]+'.');});
  }
  tools.querySelector('[data-t="star"]').addEventListener('click',function(){var m=find(cur);if(m)toggleStar(m);});
  tools.querySelector('[data-t="archive"]').addEventListener('click',function(){var m=find(cur);if(m)archive(m);});
  tools.querySelector('[data-t="unread"]').addEventListener('click',function(){var m=find(cur);if(!m)return;m.unread=true;var keep=m;cur=null;draw();UI.toast('Marked “'+(keep.primary&&OUT?primaryRowParts().s:keep.subj)+'” as unread.');});

  /* folders */
  var keys=['inbox','starred','sent','archive'];
  fold.querySelectorAll('a').forEach(function(a,i){a.setAttribute('data-cd-f',keys[i]);UI.wire(a,function(){setFolder(keys[i]);});});

  /* keep the outcome list row in step with the view switch */
  document.querySelectorAll('[data-oe]').forEach(function(b){b.addEventListener('click',function(){drawFolders();});});

  /* attachments */
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
    var rows=ms.map(function(x){return '<div class="cd-pm"><time>'+esc(x.querySelector('time').textContent)+'</time><div><b>'+esc(x.querySelector('b').textContent)+'</b><p>'+esc(x.querySelector('span').textContent)+'</p></div></div>';}).join('');
    return '<div class="cd-pdf"><div class="cd-pdfh"><span class="lg">N</span><div><b>Northwind Freight</b><small>Your call notes · Account Executive, Mid-Market</small></div></div>'+
      '<h3>Your call with Jordan Ellis</h3><p>Tue, Nov 17, 9:05–9:12 am · 7 minutes · medium difficulty</p>'+
      '<h3>'+(adv?'The three moments Marcus listened to':'The two moments that stood out')+'</h3>'+rows+
      '<h3>What was scored</h3><p>Discovery, handling doubt and getting a next step. Your voice, accent, pauses and face were not scored. Marcus Lee made the decision.</p>'+
      '<p class="cd-pdff">Page 1 of 2 · Page 2 has the full transcript.</p></div>';
  }
  function txt(html){var d=document.createElement('div');d.innerHTML=html.replace(/<\/(h3|p|div)>/g,'\n');return d.textContent.replace(/\n{3,}/g,'\n\n').trim()+'\n';}
  function wireAtt(b){
    if(b._cd)return;b._cd=1;
    b.addEventListener('click',function(){
      var k=b.getAttribute('data-cd-att'),isN=k==='notice',html=isN?notice():notesDoc(),fn=isN?'Candidate notice.txt':'Your call notes.txt';
      UI.modal({title:isN?'Candidate notice.pdf':'Your call notes.pdf',wide:true,body:html,actions:[{label:'Close'},{label:'Download',primary:true,onClick:function(){UI.download(fn,txt(html),'text/plain');return false;}}]});
    });
  }
  document.querySelectorAll('[data-cd-att]').forEach(wireAtt);

  cur=M[0].id;draw();
})();
