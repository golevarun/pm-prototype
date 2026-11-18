/* scenarios.html wiring (prefix by-) */
(function(){
  var esc=UI.esc;
  var UPD={s114:'2026-10-26',s117:'2026-11-02',s109:'2026-09-18'};
  var st={role:'all',sort:'upd',q:''};
  var ROLES=[['Req 114','Account Executive, Mid-Market'],['Req 117','SDR, Inbound'],['Req 109','Account Executive, Enterprise'],['Req 120','SDR, Outbound (draft)']];
  var BUYERS=[['JE','c1','Jordan Ellis','Head of operations, 120 vans. The last routing tool failed.'],['RL','c2','Rosa Lin','Fleet manager, 45 vans. Short on time.'],['TB','c3','Tom Becker','Finance director, 300 vans. Price first.'],
    ['MC','c4','Maya Chen','Support lead at an online retailer.'],['PS','c5','Priya Shah','Clinic manager, 12 clinics.']];
  BYC.get('pm-by-new',[]).forEach(function(n){BUYERS.push([n.name.split(/\s+/).map(function(w){return w.charAt(0)}).join('').slice(0,2).toUpperCase(),'c5',n.name,(n.role||'Buyer')+(n.objections[0]?'. '+n.objections[0]+'.':'.')]);});
  function toSC(n){return {id:n.id,isNew:true,name:n.name,product:n.product,buyer:n.buyerType,req:n.req,role:n.roleName,ver:1,upd:'Nov 17',prep:false,
    selling:n.selling,goal:n.goal,goalNote:'',buyers:BUYERS.filter(function(b){return n.buyers.indexOf(b[2])>=0}),
    notes:[['What you sell',n.selling],['Who buys it',n.buyerType]],files:[],hist:[['v1','Written by Dana Whitfield','Nov 17']],calls:'No calls yet. This scenario is a draft.'};}
  BYC.get('pm-by-scn',[]).forEach(function(n){if(!scFind(n.id)){SC.unshift(toSC(n));UPD[n.id]='2026-11-17'+(n.t||'');}});

  function visible(){var q=st.q.toLowerCase();
    var L=SC.filter(function(s){if(st.role!=='all'&&s.req!==st.role)return false;
      if(q&&(s.name+' '+s.product+' '+s.buyer+' '+s.req+' '+s.role+' '+s.buyers.map(function(b){return b[2]}).join(' ')).toLowerCase().indexOf(q)<0)return false;return true;});
    L.sort(function(a,b){if(st.sort==='name')return a.name.localeCompare(b.name);if(st.sort==='role')return a.req.localeCompare(b.req);return (UPD[b.id]||'').localeCompare(UPD[a.id]||'');});
    return L;}
  window.scRows=function(){var L=visible(),h='';
    L.forEach(function(s){var av=s.buyers.map(function(b){return '<span class="sc-av '+b[1]+'" title="'+esc(b[2])+'">'+esc(b[0])+'</span>';}).join('');
      h+='<tr tabindex="0" data-js data-id="'+s.id+'" class="'+(s.id===scCur?'sc-sel':'')+'" onclick="scSel(\''+s.id+'\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();scSel(\''+s.id+'\')}" aria-selected="'+(s.id===scCur)+'">'+
      '<td class="sc-nm">'+esc(s.name)+'</td><td class="sc-cl">'+esc(s.product)+'</td><td class="sc-cl">'+esc(s.buyer)+'</td><td class="sc-req">'+esc(s.req)+'<small>'+esc(s.role)+'</small></td>'+
      '<td><div class="sc-avs">'+(av||'<span class="sc-dim">None</span>')+'</div></td>'+
      '<td><span class="sc-ver">v'+s.ver+'</span>'+(s.isNew?'<small class="sc-dr">Draft</small>':(scDraft[s.id]?'<small class="sc-dr">v'+(s.ver+1)+' draft</small>':''))+'</td><td class="sc-dim">'+esc(s.upd)+'</td></tr>';});
    if(!L.length)h='<tr><td colspan="7" class="by-none">No scenarios match. <button class="by-link" data-js onclick="byScClear()">Clear filters</button></td></tr>';
    document.getElementById('scRows').innerHTML=h;
  };
  window.byScClear=function(){st.role='all';st.q='';document.getElementById('bySq').value='';roleLbl();scRows();};
  var _panel=scPanel;
  window.scPanel=function(s){_panel(s);if(!s.isNew)return;var P=document.getElementById('scPanel');
    var t=P.querySelector('.sc-tags');t.innerHTML='<span class="tag beige">Draft · v1</span><span class="tag gray">'+s.buyers.length+(s.buyers.length===1?' buyer':' buyers')+'</span><span class="tag gray">Created Nov 17</span>';
    var src=P.querySelector('.sc-src .sc-files');if(src)src.innerHTML='<span class="meta">No files yet. Add call notes or recordings in Interview setup.</span>';
    var h=P.querySelectorAll('.sc-hist .tag');h.forEach(function(x){x.className='tag beige';x.textContent='Draft';});
    P.querySelector('.sc-gen').insertAdjacentHTML('afterend','<div class="sc-draft"><span>Not used yet. Switch '+esc(s.req)+' to this scenario in Interview setup. Every candidate in the role then gets it.</span></div>');};

  /* search */
  var sb=document.querySelector('.sc-srch');
  sb.innerHTML='<svg class="i" viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg><input id="bySq" type="search" placeholder="Search scenarios" aria-label="Search scenarios" autocomplete="off">';
  document.getElementById('bySq').addEventListener('input',function(e){st.q=e.target.value.trim();scRows();});
  /* role filter */
  var rb=UI.byText('Role: All',document.querySelector('.sc-bar'))[0];
  function roleLbl(){rb.childNodes.forEach(function(n){if(n.nodeType===3&&n.textContent.trim())n.textContent='Role: '+(st.role==='all'?'All':st.role);});rb.classList.toggle('by-act',st.role!=='all');}
  UI.wire(rb,function(){UI.menu(rb,[{label:'All roles',check:st.role==='all',small:String(SC.length),onClick:function(){st.role='all';roleLbl();scRows();}}].concat(ROLES.map(function(r){
    var c=SC.filter(function(s){return s.req===r[0]}).length;return {label:r[0]+' · '+r[1],check:st.role===r[0],small:String(c),onClick:function(){st.role=r[0];roleLbl();scRows();}};})),{align:'left'});});
  /* sort */
  var sbt=UI.byText('Last updated',document.querySelector('.sc-bar'))[0];
  var SORTS=[['upd','Last updated'],['name','Name, A to Z'],['role','Role']];
  UI.wire(sbt,function(){UI.menu(sbt,[{header:'Sort by'}].concat(SORTS.map(function(x){return {label:x[1],check:st.sort===x[0],onClick:function(){st.sort=x[0];
    sbt.childNodes.forEach(function(n){if(n.nodeType===3&&n.textContent.trim())n.textContent=x[1];});scRows();}};})));});

  /* new scenario */
  function form(){return '<div class="by-two"><div><label for="byScN">Scenario name</label><input id="byScN" placeholder="For example: Cold-chain tracking for grocers"></div>'+
    '<div><label for="byScR">Role</label><select id="byScR">'+ROLES.map(function(r){return '<option value="'+r[0]+'">'+r[0]+' · '+r[1]+'</option>'}).join('')+'</select></div></div>'+
    '<div class="by-two"><div><label for="byScP">Product</label><input id="byScP" placeholder="For example: Route-planning software"></div><div><label for="byScB">Buyer type</label><input id="byScB" placeholder="For example: Fleet operations, 40–400 vans"></div></div>'+
    '<label for="byScS">What the candidate is selling</label><textarea id="byScS" style="min-height:64px" placeholder="One or two sentences candidates read on the prep page."></textarea>'+
    '<label for="byScG">Candidate’s goal</label><input id="byScG" placeholder="For example: Find out what the buyer needs and agree on a next step, if there is one.">'+
    '<label>Buyers <span class="by-dim">· every candidate in the role meets the same mix</span></label><div class="by-bl">'+
    BUYERS.map(function(b,i){return '<label class="by-bo"><input type="checkbox" value="'+esc(b[2])+'"><span class="sc-av '+b[1]+'">'+esc(b[0])+'</span><span><b>'+esc(b[2])+'</b><small>'+esc(b[3])+'</small></span></label>'}).join('')+'</div>'+
    '<p class="by-err" id="byScErr"></p>';}
  UI.wire(UI.byText('New scenario')[0],function(){
    UI.modal({title:'New scenario',wide:true,body:form(),actions:[{label:'Cancel'},{label:'Save as draft',primary:true,onClick:function(m){
      var g=function(id){return m.querySelector('#'+id).value.trim()};var miss=[];
      if(!g('byScN'))miss.push('a name');if(!g('byScP'))miss.push('the product');
      var bs=[].map.call(m.querySelectorAll('.by-bo input:checked'),function(x){return x.value});if(!bs.length)miss.push('at least one buyer');
      if(miss.length){var e=m.querySelector('#byScErr');e.textContent='Add '+miss.join(', ').replace(/, ([^,]*)$/,' and $1')+'.';e.scrollIntoView({block:'nearest'});return false;}
      var r=g('byScR'),rn=ROLES.filter(function(x){return x[0]===r})[0][1].replace(' (draft)','');
      var rec={id:'x'+Date.now().toString(36),name:g('byScN'),req:r,roleName:rn,product:g('byScP'),buyerType:g('byScB')||'Not set',selling:g('byScS')||g('byScP')+'.',goal:g('byScG')||'Find out what the buyer needs and agree on a next step, if there is one.',buyers:bs};
      var all=BYC.get('pm-by-scn',[]);all.unshift(rec);BYC.set('pm-by-scn',all);
      var s=toSC(rec);SC.unshift(s);UPD[s.id]='2026-11-17z';st.role='all';st.q='';document.getElementById('bySq').value='';roleLbl();scSel(s.id);
      UI.toast('Saved “'+s.name+'” as a draft for '+r+'. Calls keep their current scenario.');}}]});
  });
  scRows();
})();
