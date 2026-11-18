/* Shared data for the Automations screens (automations.html, au-new.html, au-templates.html). */
(function(){
  var TRIGGERS={
    stage:{label:'Candidate moves to a stage',kind:'Trigger: stage',short:'When a candidate moves to {stage}',help:'Checks your applicant tracker every 15 minutes.'},
    before:{label:'Before the scored call opens',kind:'Trigger: date',short:'{days} days before the scored call opens',help:'Counted in business days from the end of the notice period.'},
    finished:{label:'Candidate finishes the scored call',kind:'Trigger: call',short:'When a candidate finishes the scored call',help:'Runs once the ranges are ready, about 2 minutes after the call ends.'},
    accom:{label:'Candidate asks for an accommodation',kind:'Trigger: request',short:'When a candidate asks for an accommodation',help:'Extra time, captions, a text version or a human interviewer. Only recruiters see these requests.'},
    decision:{label:'Hiring team advances or declines',kind:'Trigger: decision',short:'When the hiring team makes a decision',help:'A person makes every decision. This runs after they do.'},
    dropped:{label:'Call drops and does not reconnect',kind:'Trigger: call',short:'When a scored call drops for more than 2 minutes',help:'Short drops reconnect on their own and do not trigger this.'},
    withdraw:{label:'Candidate withdraws',kind:'Trigger: candidate',short:'When a candidate withdraws',help:'From the invite link or by replying to an email.'}
  };
  var STEPS={
    email:{label:'Send email',cls:'act',tag:'Email',tagc:'blue'},
    wait:{label:'Wait',cls:'wait',tag:'Wait',tagc:'beige'},
    cond:{label:'Condition',cls:'cond',tag:'Condition',tagc:'au-amber'},
    task:{label:'Team task',cls:'act',tag:'Team task',tagc:'pink'},
    ats:{label:'Update applicant tracker',cls:'act',tag:'Applicant tracker',tagc:'green'},
    pause:{label:'Pause emails',cls:'exit',tag:'Pause',tagc:'gray'}
  };
  var EMAILS=['AE invite, v2','Gentle reminder','Last reminder','Notice period ending','New time for your call','Outcome: next round','Outcome: not this time','Hiring team digest'];
  var STAGES=['Phone screen','Review','Final round','Offer','Declined'];
  var TPL=[
    {id:'invite',cat:'Invites',name:'Invite at a stage',desc:'When a candidate reaches a stage you pick, send the notice and the interview invite.',trigger:'stage',topt:{stage:'Phone screen'},
      steps:[{t:'email',v:'AE invite, v2',x:'Includes the candidate notice'},{t:'wait',v:'10',x:'Notice period. Practice is open the whole time.'},{t:'email',v:'Gentle reminder',x:'Only if they have not started a call'}]},
    {id:'remind',cat:'Reminders',name:'Remind before the notice period ends',desc:"Two days before the scored call opens, remind candidates who haven't started practice.",trigger:'before',topt:{days:'2'},
      steps:[{t:'cond',v:'Has not started practice'},{t:'email',v:'Notice period ending',x:'From the recruiter'},{t:'task',v:'Dana Whitfield',x:'Call candidates who still have not opened the invite'}]},
    {id:'accom',cat:'Accommodations',name:'Notify recruiter about accommodation requests',desc:'When a candidate asks for extra time or a human interviewer, pause their emails and tell the recruiter.',trigger:'accom',topt:{},
      steps:[{t:'pause',v:'This candidate',x:'Until the recruiter answers'},{t:'task',v:'Dana Whitfield',x:'Answer the request within 1 business day'}]},
    {id:'sync',cat:'Applicant tracker',name:'Sync decisions to the applicant tracker',desc:'When the hiring team advances or declines a candidate, update the stage in your applicant tracker.',trigger:'decision',topt:{},
      steps:[{t:'ats',v:'Final round',x:'Or Declined, to match the decision'},{t:'task',v:'Dana Whitfield',x:'Send the outcome email'}]},
    {id:'review',cat:'Applicant tracker',name:'Move finished calls to Review stage',desc:'When a scored call finishes, move the candidate to Review and tell the hiring manager.',trigger:'finished',topt:{},
      steps:[{t:'ats',v:'Review',x:'In your applicant tracker'},{t:'task',v:'Marcus Lee',x:'Review the call before the debrief'}]},
    {id:'outcome',cat:'Hiring team',name:'Draft the outcome email after a decision',desc:'After a person decides, draft the outcome email for the recruiter to check and send.',trigger:'decision',topt:{},
      steps:[{t:'wait',v:'1',x:'Gives the hiring team time to change their mind'},{t:'task',v:'Dana Whitfield',x:'Check and send the drafted outcome email'},{t:'ats',v:'Declined',x:'Only for declined candidates'}]},
    {id:'dropped',cat:'Reminders',name:'Offer a new time after a dropped call',desc:'If a scored call drops and does not reconnect, offer a new time and tell the recruiter.',trigger:'dropped',topt:{},
      steps:[{t:'email',v:'New time for your call',x:'The dropped call is not scored'},{t:'task',v:'Dana Whitfield',x:'Check the candidate got a new link'}]},
    {id:'withdraw',cat:'Applicant tracker',name:'Stop emails when a candidate withdraws',desc:'When a candidate withdraws, stop every reminder and update the applicant tracker.',trigger:'withdraw',topt:{},
      steps:[{t:'pause',v:'All automations',x:'For this candidate only'},{t:'ats',v:'Declined',x:'Reason: withdrew'}]},
    {id:'debrief',cat:'Hiring team',name:'Send the shortlist before the debrief',desc:'The day before the debrief, email the hiring team a link to the shortlist.',trigger:'before',topt:{days:'1'},
      steps:[{t:'email',v:'Hiring team digest',x:'To the hiring team, not candidates'},{t:'task',v:'Marcus Lee',x:'Read the top 9 calls'}]},
    {id:'stale',cat:'Hiring team',name:'Nudge about unreviewed calls',desc:'If a finished call has not been reviewed in 3 business days, remind the hiring manager.',trigger:'finished',topt:{},
      steps:[{t:'wait',v:'3',x:'Business days after the call'},{t:'cond',v:'Call not reviewed yet'},{t:'task',v:'Marcus Lee',x:'Review the call'}]}
  ];
  function stepTitle(s){
    if(s.t==='email')return 'Send "'+s.v+'"';
    if(s.t==='wait')return 'Wait '+s.v+' business day'+(s.v==='1'?'':'s');
    if(s.t==='cond')return 'Only if: '+s.v.charAt(0).toLowerCase()+s.v.slice(1);
    if(s.t==='task')return 'Task for '+s.v;
    if(s.t==='ats')return 'Move to '+s.v+' in the applicant tracker';
    if(s.t==='pause')return 'Pause emails: '+s.v.toLowerCase();
    return s.v;
  }
  function triggerText(t,o){var T=TRIGGERS[t];if(!T)return '';return T.short.replace('{stage}',(o&&o.stage)||'Phone screen').replace('{days}',(o&&o.days)||'2');}
  function load(){try{return JSON.parse(localStorage.getItem('pm-au-new')||'[]')}catch(e){return []}}
  function save(list){try{localStorage.setItem('pm-au-new',JSON.stringify(list))}catch(e){}}
  window.AU={TRIGGERS:TRIGGERS,STEPS:STEPS,EMAILS:EMAILS,STAGES:STAGES,TPL:TPL,stepTitle:stepTitle,triggerText:triggerText,load:load,save:save,
    tpl:function(id){for(var i=0;i<TPL.length;i++)if(TPL[i].id===id)return TPL[i];return null;}};
})();
