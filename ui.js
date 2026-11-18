/* Shared UI for the PM prototype: menus, modals, drawers, toasts, and the app chrome
   (sidebar collapse, search, notifications, account menu, "Write to Dana").
   Any element this file wires gets data-js so proto.js does not show "Not part of this prototype yet." */
(function(){
  var css=document.createElement('style');
  css.textContent=[
  '.ui-pop{position:fixed;z-index:200;min-width:200px;max-width:320px;background:#fff;border:1px solid rgba(28,28,24,.12);border-radius:8px;box-shadow:0 8px 24px rgba(28,28,24,.12);padding:4px;font:400 13px/20px Inter,system-ui,sans-serif;color:#1C1C18}',
  '.ui-pop .ui-it{display:flex;align-items:center;gap:8px;width:100%;height:30px;padding:0 10px;border:0;background:none;border-radius:6px;text-align:left;font:inherit;color:inherit;cursor:pointer;text-decoration:none}',
  '.ui-pop .ui-it:hover,.ui-pop .ui-it:focus-visible{background:#F4F4F2;outline:none}',
  '.ui-pop .ui-it.danger{color:#B42318}',
  '.ui-pop .ui-it .ck{width:14px;flex:none;color:#1C1C18}',
  '.ui-pop .ui-it small{margin-left:auto;color:#68685D;font-size:12px}',
  '.ui-pop .ui-sep{height:1px;background:rgba(28,28,24,.08);margin:4px 0}',
  '.ui-pop .ui-h{padding:6px 10px 2px;font-size:12px;color:#68685D}',
  '.ui-ov{position:fixed;inset:0;z-index:300;background:rgba(28,28,24,.32);display:flex;align-items:flex-start;justify-content:center;padding-top:12vh;font:400 13px/20px Inter,system-ui,sans-serif;color:#1C1C18}',
  '.ui-md{width:480px;max-width:calc(100vw - 48px);background:#fff;border-radius:12px;box-shadow:0 16px 48px rgba(28,28,24,.2);overflow:hidden}',
  '.ui-md.wide{width:640px}',
  '.ui-md-h{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid rgba(28,28,24,.08)}',
  '.ui-md-h b{font-size:15px;font-weight:550}',
  '.ui-md-b{padding:16px;max-height:60vh;overflow:auto}',
  '.ui-md-b p{margin:0 0 10px}',
  '.ui-md-b label{display:block;font-size:12px;color:#535347;margin:10px 0 4px}',
  '.ui-md-b input,.ui-md-b textarea,.ui-md-b select{width:100%;box-sizing:border-box;font:inherit;border:1px solid rgba(28,28,24,.12);border-radius:8px;padding:6px 10px;background:#fff;color:inherit}',
  '.ui-md-b textarea{min-height:96px;resize:vertical}',
  '.ui-md-f{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid rgba(28,28,24,.08);background:#FAFAF9}',
  '.ui-b{height:32px;padding:0 12px;border-radius:8px;border:1px solid rgba(28,28,24,.12);background:#fff;font:450 13px Inter,system-ui,sans-serif;color:#1C1C18;cursor:pointer}',
  '.ui-b:hover{background:#F4F4F2}',
  '.ui-b.pri{background:#1C1C18;border-color:#1C1C18;color:#fff}.ui-b.pri:hover{background:#2F2F27}',
  '.ui-b.danger{background:#B42318;border-color:#B42318;color:#fff}',
  '.ui-x{width:28px;height:28px;border:0;background:none;border-radius:6px;cursor:pointer;color:#68685D;font-size:18px;line-height:1}',
  '.ui-x:hover{background:#F4F4F2}',
  '.ui-dr-ov{position:fixed;inset:0;z-index:300;background:rgba(28,28,24,.2);font:400 13px/20px Inter,system-ui,sans-serif;color:#1C1C18}',
  '.ui-dr{position:absolute;top:0;right:0;bottom:0;width:440px;background:#fff;box-shadow:-8px 0 24px rgba(28,28,24,.12);display:flex;flex-direction:column;transform:translateX(16px);opacity:0;transition:transform .18s,opacity .18s}',
  '.ui-dr.on{transform:none;opacity:1}',
  '.ui-dr .ui-md-b{flex:1;max-height:none}',
  '.ui-pal{width:560px}',
  '.ui-pal input{width:100%;box-sizing:border-box;border:0;border-bottom:1px solid rgba(28,28,24,.08);padding:14px 16px;font:400 15px Inter,system-ui,sans-serif;outline:none}',
  '.ui-pal .ui-res{max-height:360px;overflow:auto;padding:4px}',
  '.ui-pal .ui-it{display:flex;gap:10px;align-items:center;padding:7px 12px;border-radius:6px;color:inherit;text-decoration:none}',
  '.ui-pal .ui-it.sel,.ui-pal .ui-it:hover{background:#F4F4F2}',
  '.ui-pal .ui-it small{margin-left:auto;color:#68685D;font-size:12px}',
  '.ui-pal .ui-empty{padding:16px;color:#68685D}',
  '.ui-nt{width:360px;max-width:360px;padding:0}',
  '.ui-nt .ui-nt-h{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid rgba(28,28,24,.08)}',
  '.ui-nt .ui-nt-h b{font-weight:550}',
  '.ui-nt a.n{display:block;padding:10px 12px;color:inherit;text-decoration:none;border-bottom:1px solid rgba(28,28,24,.06)}',
  '.ui-nt a.n:hover{background:#FAFAF9}',
  '.ui-nt a.n.new{box-shadow:inset 3px 0 0 #1C1C18}',
  '.ui-nt a.n small{display:block;color:#68685D;font-size:12px}',
  '.ui-badge-dot{position:absolute;top:6px;right:6px;width:6px;height:6px;border-radius:50%;background:#D97757}',
  '.app.ui-collapsed{grid-template-columns:56px minmax(0,1fr)!important}',
  '.app.ui-collapsed .side .nav a,.app.ui-collapsed .side .nav .grp{font-size:0;justify-content:center}',
  '.app.ui-collapsed .side .nav .sub,.app.ui-collapsed .side .hub,.app.ui-collapsed .side .logo,.app.ui-collapsed .side .nav .chev{display:none!important}',
  '.app.ui-collapsed .side .side-foot a{font-size:0;justify-content:center}',
  '.app.ui-collapsed .side .collapse svg{transform:scaleX(-1)}',
  '.side .grp{cursor:pointer;user-select:none}',
  '.side .grp.ui-shut .chev{transform:rotate(180deg)}',
  '.side .sub.ui-hide{display:none!important}',
  '.topbar .search{cursor:pointer}','[hidden]{display:none!important}'
  ].join('');
  document.head.appendChild(css);

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function toast(m){if(window.protoNote)window.protoNote(m);}
  var open=null;
  function closeAll(){if(open){open.remove();open=null;document.removeEventListener('keydown',onKey,true);}}
  function onKey(e){if(e.key==='Escape'){closeAll();}}
  function place(pop,anchor,align){
    document.body.appendChild(pop);
    var r=anchor.getBoundingClientRect(),w=pop.offsetWidth,h=pop.offsetHeight;
    var left=align==='left'?r.left:r.right-w; left=Math.max(8,Math.min(left,innerWidth-w-8));
    var top=r.bottom+4; if(top+h>innerHeight-8)top=Math.max(8,r.top-h-4);
    pop.style.left=left+'px';pop.style.top=top+'px';
  }
  /* UI.menu(anchor, items, opts). items: {label, onClick, go, check:true|false, small, danger, sep:true, header:'text'} */
  function menu(anchor,items,opts){
    opts=opts||{};
    if(open&&open._anchor===anchor){closeAll();return;}
    closeAll();
    var pop=document.createElement('div');pop.className='ui-pop'+(opts.cls?' '+opts.cls:'');pop.setAttribute('role','menu');pop._anchor=anchor;
    items.forEach(function(it){
      if(it.sep){var s=document.createElement('div');s.className='ui-sep';pop.appendChild(s);return;}
      if(it.header){var h=document.createElement('div');h.className='ui-h';h.textContent=it.header;pop.appendChild(h);return;}
      var b=document.createElement(it.go?'a':'button');b.className='ui-it'+(it.danger?' danger':'');b.setAttribute('role','menuitem');
      if(it.go)b.href=it.go;
      b.innerHTML=(it.check!==undefined?'<span class="ck">'+(it.check?'✓':'')+'</span>':'')+'<span>'+esc(it.label)+'</span>'+(it.small?'<small>'+esc(it.small)+'</small>':'');
      b.addEventListener('click',function(e){if(!it.go){e.preventDefault();}closeAll();if(it.onClick)it.onClick(it);});
      pop.appendChild(b);
    });
    place(pop,anchor,opts.align);open=pop;
    setTimeout(function(){document.addEventListener('keydown',onKey,true);},0);
    return pop;
  }
  /* UI.popover(anchor, html, opts) — free-form panel anchored to a control. Returns the element. */
  function popover(anchor,html,opts){
    opts=opts||{};
    if(open&&open._anchor===anchor){closeAll();return null;}
    closeAll();
    var pop=document.createElement('div');pop.className='ui-pop'+(opts.cls?' '+opts.cls:'');pop._anchor=anchor;pop.innerHTML=html;
    if(opts.width)pop.style.width=opts.width+'px',pop.style.maxWidth=opts.width+'px';
    place(pop,anchor,opts.align);open=pop;
    setTimeout(function(){document.addEventListener('keydown',onKey,true);},0);
    return pop;
  }
  document.addEventListener('mousedown',function(e){if(open&&!open.contains(e.target)&&!(open._anchor&&open._anchor.contains(e.target)))closeAll();});
  addEventListener('resize',closeAll);

  /* UI.modal({title, body (html), wide, actions:[{label, primary, danger, onClick(modalEl) -> return false to keep open}]}) */
  function modal(o){
    closeAll();
    var ov=document.createElement('div');ov.className='ui-ov';
    ov.innerHTML='<div class="ui-md'+(o.wide?' wide':'')+'" role="dialog" aria-modal="true" aria-label="'+esc(o.title)+'"><div class="ui-md-h"><b>'+esc(o.title)+'</b><button class="ui-x" aria-label="Close">×</button></div><div class="ui-md-b">'+(o.body||'')+'</div><div class="ui-md-f"></div></div>';
    var f=ov.querySelector('.ui-md-f'),md=ov.querySelector('.ui-md');
    function close(){ov.remove();document.removeEventListener('keydown',k,true);}
    function k(e){if(e.key==='Escape')close();}
    (o.actions||[{label:'Close'}]).forEach(function(a){
      var b=document.createElement('button');b.className='ui-b'+(a.primary?' pri':'')+(a.danger?' danger':'');b.textContent=a.label;
      b.addEventListener('click',function(){var r=a.onClick?a.onClick(md):undefined;if(r!==false)close();});f.appendChild(b);
    });
    if(o.actions===null)f.remove();
    ov.querySelector('.ui-x').onclick=close;
    ov.addEventListener('mousedown',function(e){if(e.target===ov)close();});
    document.addEventListener('keydown',k,true);
    document.body.appendChild(ov);
    var first=md.querySelector('input,textarea,select');if(first)first.focus();
    md.close=close;return md;
  }
  /* UI.drawer({title, body, width, actions}) — right side panel */
  function drawer(o){
    closeAll();
    var ov=document.createElement('div');ov.className='ui-dr-ov';
    ov.innerHTML='<div class="ui-dr" role="dialog" aria-modal="true" aria-label="'+esc(o.title)+'" style="width:'+(o.width||440)+'px"><div class="ui-md-h"><b>'+esc(o.title)+'</b><button class="ui-x" aria-label="Close">×</button></div><div class="ui-md-b">'+(o.body||'')+'</div><div class="ui-md-f"></div></div>';
    var dr=ov.querySelector('.ui-dr'),f=ov.querySelector('.ui-md-f');
    function close(){ov.remove();document.removeEventListener('keydown',k,true);}
    function k(e){if(e.key==='Escape')close();}
    (o.actions||[{label:'Close'}]).forEach(function(a){
      var b=document.createElement('button');b.className='ui-b'+(a.primary?' pri':'')+(a.danger?' danger':'');b.textContent=a.label;
      b.addEventListener('click',function(){var r=a.onClick?a.onClick(dr):undefined;if(r!==false)close();});f.appendChild(b);
    });
    ov.querySelector('.ui-x').onclick=close;
    ov.addEventListener('mousedown',function(e){if(e.target===ov)close();});
    document.addEventListener('keydown',k,true);
    document.body.appendChild(ov);requestAnimationFrame(function(){dr.classList.add('on')});
    dr.close=close;return dr;
  }
  function confirmBox(title,text,label,fn,danger){return modal({title:title,body:'<p>'+esc(text)+'</p>',actions:[{label:'Cancel'},{label:label,primary:!danger,danger:!!danger,onClick:fn}]});}
  /* UI.wire(selectorOrEl, handler) marks controls interactive and binds click */
  function wire(sel,fn,root){
    var els=typeof sel==='string'?(root||document).querySelectorAll(sel):(sel.length!==undefined?sel:[sel]);
    Array.prototype.forEach.call(els,function(el){el.setAttribute('data-js','');el.addEventListener('click',function(e){e.preventDefault();fn(el,e);});});
  }
  /* UI.byText(text, scope, tag) finds buttons/links by visible text */
  function byText(text,scope,tag){
    var out=[];(scope||document).querySelectorAll(tag||'a,button').forEach(function(el){if(el.closest('.protobar'))return;var t=(el.innerText||el.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ');if(t===text||t.indexOf(text)===0)out.push(el);});return out;
  }
  function download(name,text,type){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:type||'text/csv'}));a.download=name;document.body.appendChild(a);a.click();a.remove();toast('Downloaded '+name+'.');}

  window.UI={menu:menu,popover:popover,modal:modal,drawer:drawer,confirm:confirmBox,toast:toast,wire:wire,byText:byText,close:closeAll,esc:esc,download:download};

  /* ---------- App chrome (hiring side) ---------- */
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){return null;}}
  var app=document.querySelector('.app');
  var col=document.querySelector('.side .collapse');
  if(app&&col){
    if(store('pm-side')==='1')app.classList.add('ui-collapsed');
    wire(col,function(){var c=app.classList.toggle('ui-collapsed');store('pm-side',c?'1':'0');col.setAttribute('aria-label',c?'Expand sidebar':'Collapse sidebar');});
  }
  document.querySelectorAll('.side .grp').forEach(function(g){
    g.setAttribute('role','button');g.setAttribute('tabindex','0');
    g.addEventListener('click',function(){
      var shut=g.classList.toggle('ui-shut');var n=g.nextElementSibling;
      while(n&&n.classList.contains('sub')){if(!n.classList.contains('on'))n.classList.toggle('ui-hide',shut);n=n.nextElementSibling;}
    });
  });
  var SEARCH=[
    ['Screen','Home','home.html'],['Screen','Roles','roles.html'],['Screen','Candidates','all-candidates.html'],['Screen','Shortlists','shortlists.html'],
    ['Screen','Buyers','buyers.html'],['Screen','Calls','calls.html'],['Screen','Scenarios','scenarios.html'],['Screen','Automations','automations.html'],
    ['Screen','Insights','insights.html'],['Screen','Fairness checks','fairness.html'],['Screen','Admin settings','settings.html'],['Screen','New role','new-role.html'],
    ['Role','Account Executive, Mid-Market · Req 114','overview.html'],['Role','Interview setup · Req 114','setup.html'],['Role','Candidates · Req 114','candidates.html'],['Role','Shortlist · Req 114','shortlist.html'],
    ['Role','SDR, Inbound · Req 117','roles.html'],['Role','Account Executive, Enterprise · Req 109','roles.html'],['Role','SDR, Outbound · Req 120 (draft)','roles.html'],
    ['Candidate','Sam Rivera · 7.0–8.0','shortlist.html#sam'],['Candidate','Priya Nair · 6.5–8.0','shortlist.html#priya'],['Candidate','Ama Owusu · 6.0–7.5','shortlist.html#ama'],
    ['Candidate','Rhea Das','shortlist.html#rhea'],['Candidate','Nia Brooks','shortlist.html#nia'],['Candidate','Ben Carter','shortlist.html#ben'],['Candidate','Theo Grant','shortlist.html#theo'],
    ['Candidate','Carmen Ruiz','shortlist.html#carmen'],['Candidate','Ian Walsh','shortlist.html#ian'],['Candidate','Dev Kapoor · asked for extra time','candidates.html'],['Candidate','Mia Brandt · asked for a human interviewer','candidates.html'],
    ['Candidate','Kai Morgan · in a scored call','candidates.html'],
    ['Call','Sam Rivera with Jordan Ellis · Nov 17, 9:05 am','call-review.html'],['Call','Priya Nair with Jordan Ellis · Nov 16, 3:20 pm','calls.html'],['Call','Ama Owusu with Jordan Ellis · Nov 17, 8:48 am','calls.html'],
    ['Buyer','Jordan Ellis · Head of operations','buyers.html'],['Buyer','Rosa Lin · draft v3','buyer-edit.html'],['Automation','Invite after phone screen','automation.html']
  ];
  function palette(){
    var md=modal({title:'Search',body:'',actions:null});
    md.classList.add('ui-pal');md.querySelector('.ui-md-h').remove();
    var b=md.querySelector('.ui-md-b');b.style.padding='0';
    b.innerHTML='<input placeholder="Search roles, candidates or calls" aria-label="Search"><div class="ui-res"></div>';
    var inp=b.querySelector('input'),res=b.querySelector('.ui-res'),sel=0,list=[];
    function draw(){var q=inp.value.trim().toLowerCase();list=SEARCH.filter(function(r){return !q||(r[1]+' '+r[0]).toLowerCase().indexOf(q)>=0;}).slice(0,12);
      res.innerHTML=list.length?list.map(function(r,i){return '<a class="ui-it'+(i===sel?' sel':'')+'" href="'+r[2]+'"><span>'+esc(r[1])+'</span><small>'+r[0]+'</small></a>';}).join(''):'<div class="ui-empty">Nothing matches “'+esc(inp.value)+'”.</div>';}
    inp.addEventListener('input',function(){sel=0;draw();});
    inp.addEventListener('keydown',function(e){if(e.key==='ArrowDown'){sel=Math.min(sel+1,list.length-1);draw();e.preventDefault();}if(e.key==='ArrowUp'){sel=Math.max(sel-1,0);draw();e.preventDefault();}if(e.key==='Enter'&&list[sel]){var a=res.querySelectorAll('a')[sel];if(a)a.click();}});
    draw();inp.focus();
  }
  var sb=document.querySelector('.topbar .search');
  if(sb){sb.setAttribute('role','button');sb.setAttribute('tabindex','0');sb.addEventListener('click',palette);sb.addEventListener('keydown',function(e){if(e.key==='Enter')palette();});
    document.addEventListener('keydown',function(e){if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();palette();}});}
  var NOTES=[
    ['Dev Kapoor asked for extra time on his scored call','Req 114 · 8:40 am','candidates.html',1],
    ['Kai Morgan started his scored call','Req 114 · 10:05 am','calls.html',1],
    ['Sam Rivera finished his scored call','Req 114 · 9:12 am','call-review.html',0],
    ['Mia Brandt asked for a human interviewer','Req 114 · Yesterday','candidates.html',0],
    ['Fairness check passed for Req 114','Weekly check · Mon','fairness.html',0]
  ];
  var bell=document.querySelector('.topbar [aria-label="Notifications"]');
  if(bell){
    bell.style.position='relative';
    var seen=store('pm-notes-seen')==='1';
    if(!seen){var d=document.createElement('i');d.className='ui-badge-dot';bell.appendChild(d);}
    wire(bell,function(){
      var pop=popover(bell,'<div class="ui-nt-h"><b>Notifications</b><button class="ui-it" style="width:auto;height:24px;padding:0 8px;font-size:12px" data-mark>Mark all read</button></div>'+
        NOTES.map(function(n){return '<a class="n'+(n[3]&&!seen?' new':'')+'" href="'+n[2]+'">'+esc(n[0])+'<small>'+esc(n[1])+'</small></a>';}).join(''),{cls:'ui-nt',width:360});
      if(!pop)return;
      pop.querySelector('[data-mark]').onclick=function(){seen=true;store('pm-notes-seen','1');pop.querySelectorAll('.n.new').forEach(function(x){x.classList.remove('new')});var dd=bell.querySelector('.ui-badge-dot');if(dd)dd.remove();};
    });
  }
  var av=document.querySelector('.topbar .avatar');
  if(av){
    av.setAttribute('role','button');av.setAttribute('tabindex','0');av.style.cursor='pointer';
    var who=av.getAttribute('aria-label')||'';
    av.addEventListener('click',function(){menu(av,[{header:who+' · Northwind Freight'},{label:'Your settings',go:'settings.html'},{label:'Notification settings',go:'settings.html#notifications'},{label:'Help and docs',onClick:function(){modal({title:'Help',body:'<p>This is a prototype of PM. Use the step bar at the bottom of the screen to walk through the main flow, or open any screen from the sidebar.</p>'})}},{sep:true},{label:'Reset demo data',onClick:function(){confirmBox('Reset demo data?','Decisions, accommodation answers, invites, new roles, buyers, automation changes and settings go back to how the story starts. This can\'t be undone.','Reset demo data',function(){if(window.PMStore)PMStore.reset();else{try{localStorage.clear();sessionStorage.clear();}catch(e){}}location.reload();},true);}},{label:'Sign out',go:'signin.html'}]);});
  }
  /* ---------- Candidate side ---------- */
  UI.byText('Questions? Write to Dana').forEach(function(b){
    wire(b,function(){modal({title:'Write to Dana Whitfield',body:'<p>Dana is the recruiter for this role at Northwind Freight. Your message goes to her inbox. It doesn’t go to the hiring manager and doesn’t affect your score.</p><label for="ui-q">Your message</label><textarea id="ui-q" placeholder="For example: can I move my scored call to Friday?"></textarea>',
      actions:[{label:'Cancel'},{label:'Send',primary:true,onClick:function(m){var t=m.querySelector('textarea');if(!t.value.trim()){t.focus();t.style.borderColor='#B42318';return false;}toast('Sent to Dana. She usually replies within a day.');}}]});});
  });
})();
