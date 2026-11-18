/* store.js: one shared store for the hiring side of the PM prototype (window.PMStore).
   Everything lives in localStorage under the "pm:" namespace, so every screen agrees
   across pages, reloads and tabs. PMStore.reset() puts the story back to its start.

   Core API
     PMStore.get(key, fallback)      read a value (JSON)
     PMStore.set(key, value)         write a value and fire a change
     PMStore.update(key, fn, fb)     fn(current) returns the new value
     PMStore.remove(key)
     PMStore.on(fn)                  fn(key, value, remote) on every change; remote is true when another tab made it; returns an off()
     PMStore.reset()                 clear all demo data
   Shared state helpers (all built on get/set)
     decisions() / decide(id, 'adv'|'dec', reason) / undecide(id) / decisionMeta() / decided(ids)
     acc() / setAcc('dev'|'mia', value|null) / openNeeds()
     role(req) / setRole(req, key, value) / newRoles() / addRole(r) / isLive(req)
     au(id) / setAu(id, patch)
     invited(req) / invitedCount(req) / addInvites(req, names) / pool(req)
     members() / notice()
*/
(function(){
  var NS='pm:';
  var LEGACY=['pm-au-inv-status','pm-au-new','pm-by-wsg','pm-by-rosa','pm-by-new','pm-by-notice','pm-by-exports','pm-by-scn','pm-notes-seen'];
  var subs=[];
  function raw(k){try{return localStorage.getItem(NS+k);}catch(e){return null;}}
  function get(k,d){var v=raw(k);if(v==null)return d;try{return JSON.parse(v);}catch(e){return d;}}
  function fire(k,v,remote){subs.slice().forEach(function(fn){try{fn(k,v,!!remote);}catch(e){if(window.console)console.error(e);}});
    try{window.dispatchEvent(new CustomEvent('pmstore',{detail:{key:k,value:v,remote:!!remote}}));}catch(e){}}
  function set(k,v){try{if(v===undefined||v===null)localStorage.removeItem(NS+k);else localStorage.setItem(NS+k,JSON.stringify(v));}catch(e){}fire(k,v);return v;}
  function update(k,fn,d){var cur=get(k,d);var nv=fn(cur===undefined?d:cur);return set(k,nv===undefined?cur:nv);}
  function remove(k){set(k,null);}
  function keys(){var out=[];try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf(NS)===0)out.push(k.slice(NS.length));}}catch(e){}return out;}
  function on(fn){subs.push(fn);return function(){var i=subs.indexOf(fn);if(i>=0)subs.splice(i,1);};}
  function reset(){
    keys().forEach(function(k){try{localStorage.removeItem(NS+k);}catch(e){}});
    LEGACY.forEach(function(k){try{localStorage.removeItem(k);}catch(e){}});
    try{['rl-state','cx-people','cx-dec','cx-notes'].forEach(function(k){sessionStorage.removeItem(k);});
      for(var i=sessionStorage.length-1;i>=0;i--){var k=sessionStorage.key(i);if(k&&k.indexOf('cx-views-')===0)sessionStorage.removeItem(k);}}catch(e){}
    fire('*',null);
  }
  /* another tab changed something */
  window.addEventListener('storage',function(e){
    if(e.key===null){fire('*',null,true);return;}
    if(e.key&&e.key.indexOf(NS)===0){var v=null;try{v=e.newValue==null?null:JSON.parse(e.newValue);}catch(x){}fire(e.key.slice(NS.length),v,true);}
  });

  /* ---------- shortlist decisions (Req 114) ---------- */
  function decisions(){return get('decisions',{})||{};}
  function decisionMeta(){return get('decisionMeta',{})||{};}
  function decide(id,d,reason){
    update('decisionMeta',function(m){m=m||{};m[id]={d:d,reason:reason||'',by:'Marcus Lee',at:Date.now()};return m;},{});
    update('decisions',function(x){x=x||{};x[id]=d;return x;},{});
  }
  function undecide(id){
    update('decisionMeta',function(m){m=m||{};delete m[id];return m;},{});
    update('decisions',function(x){x=x||{};delete x[id];return x;},{});
  }
  var REC9=['sam','priya','ama','rhea','nia','ben','theo','carmen','ian'];
  var NAMES={sam:'Sam Rivera',priya:'Priya Nair',ama:'Ama Owusu',rhea:'Rhea Das',nia:'Nia Brooks',ben:'Ben Carter',theo:'Theo Grant',carmen:'Carmen Ruiz',ian:'Ian Walsh'};
  /* counts for a set of ids (default: the 9 recommended) */
  function decided(ids){var D=decisions(),o={adv:0,dec:0,left:0,advNames:[],decNames:[]};ids=ids||REC9;
    ids.forEach(function(id){if(D[id]==='adv'){o.adv++;o.advNames.push(NAMES[id]||id);}else if(D[id]==='dec'){o.dec++;o.decNames.push(NAMES[id]||id);}else o.left++;});
    o.all={adv:0,dec:0};Object.keys(D).forEach(function(k){if(D[k]==='adv')o.all.adv++;else if(D[k]==='dec')o.all.dec++;});
    return o;}

  /* ---------- accommodation requests on Req 114 ----------
     dev: null | {state:'approved', min:'10'} | {state:'declined', reason}
     mia: null | {state:'assigned', who:'Dana Whitfield', date:'Fri, Nov 20', time:'11:00 am'} */
  function acc(){var a=get('acc',{})||{};return {dev:a.dev||null,mia:a.mia||null};}
  function setAcc(k,v){update('acc',function(a){a=a||{};if(v)a[k]=v;else delete a[k];return a;},{});}
  function openNeeds(){var a=acc();return (a.dev?0:1)+(a.mia?0:1);}

  /* ---------- roles ---------- */
  function role(req){var r=get('roles',{})||{};return r[req]||{};}
  function setRole(req,k,v){update('roles',function(r){r=r||{};r[req]=r[req]||{};if(v===null||v===undefined)delete r[req][k];else r[req][k]=v;return r;},{});}
  function newRoles(){return get('newRoles',[])||[];}
  function addRole(x){update('newRoles',function(l){l=(l||[]).filter(function(y){return y.req!==x.req;});l.push(x);return l;},[]);}
  function isLive(req){return !!role(req).published;}

  /* ---------- automations ----------
     au(id) returns saved overrides for a built-in automation: {status, name, desc, owner, archived} */
  function au(id){var a=get('au',{})||{};return a[id]||{};}
  function setAu(id,patch){update('au',function(a){a=a||{};a[id]=Object.assign({},a[id]||{},patch);return a;},{});}

  /* ---------- invites ---------- */
  var POOL={
    '114':[['Maya Chen','maya.chen@gmail.com','Nov 15'],['Tariq Aziz','tariq.aziz@outlook.com','Nov 15'],['Sofia Lindqvist','sofia.lindqvist@gmail.com','Nov 16'],['Jamal Price','jamal.price@icloud.com','Nov 16'],['Erin Walsh','erin.walsh@gmail.com','Nov 16'],['Ravi Menon','ravi.menon@gmail.com','Nov 17']],
    '117':[['Kim Nguyen','kim.nguyen@gmail.com','Nov 14'],['Diego Alvarez','diego.alvarez@hey.com','Nov 16'],['Hannah Cole','hannah.cole@gmail.com','Nov 16'],['Victor Osei','victor.osei@outlook.com','Nov 17']],
    '109':[['Paul Novak','paul.novak@gmail.com','Nov 13'],['Lucy Grant','lucy.grant@icloud.com','Nov 16'],['Arjun Rao','arjun.rao@gmail.com','Nov 17']]
  };
  function people(){return get('people',{})||{};}
  function invited(req){return (people().added||[]).filter(function(p){return !req||p.req===req;});}
  function invitedCount(req){return invited(req).length;}
  function pool(req){var done=people().invited||[];return (POOL[req]||[]).filter(function(a){return done.indexOf(a[0])<0;});}
  /* adds invited people in the same shape cx.js uses for its candidate rows */
  function addInvites(req,names,extraEmails){
    var locs=['chi','rem','chi','rem','rem','chi'],k=0;
    var add=names.map(function(n){var a=(POOL[req]||[]).filter(function(x){return x[0]===n;})[0]||[n,n.toLowerCase().replace(/\s+/g,'.')+'@gmail.com'];
      return mk(n,a[1]);});
    (extraEmails||[]).forEach(function(e){var nm=e.split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();});add.push(mk(nm,e));});
    function mk(n,email){return {id:'inv-'+n.toLowerCase().replace(/[^a-z]+/g,'-'),name:n,email:email,req:req,st:'inv',stx:'Invited',cls:'wait',pr:'n',call:'Opens Dec 1',lt:0,lastTxt:'Just now',invD:0,loc:locs[(k++)%6],acc:[],rem:0,named:0,fresh:1};}
    update('people',function(S){S=S||{};S.invited=(S.invited||[]).concat(names);S.added=add.concat(S.added||[]);return S;},{});
    return add;
  }

  /* ---------- workspace settings ---------- */
  function members(){var m=get('members',{})||{};return {added:m.added||[],removed:m.removed||[],roles:m.roles||{}};}
  function notice(){return get('by-notice',null);}

  window.PMStore={NS:NS,get:get,set:set,update:update,remove:remove,keys:keys,on:on,reset:reset,
    decisions:decisions,decisionMeta:decisionMeta,decide:decide,undecide:undecide,decided:decided,REC9:REC9,
    acc:acc,setAcc:setAcc,openNeeds:openNeeds,
    role:role,setRole:setRole,newRoles:newRoles,addRole:addRole,isLive:isLive,
    au:au,setAu:setAu,
    POOL:POOL,invited:invited,invitedCount:invitedCount,pool:pool,addInvites:addInvites,
    members:members,notice:notice};
})();
