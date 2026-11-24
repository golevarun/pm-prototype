#!/usr/bin/env python3
"""Writes the phone screens in m/ (everything except index.html, m.css, m.js and ios.css).
Edit the copy and markup here, then run `python3 m/build.py` and `node ds/check.mjs`."""
import os
OUT = os.path.dirname(os.path.abspath(__file__))

def head(title, ios=False, extra=''):
    return ('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
            '<meta name="theme-color" content="#FFFFFF">'
            f'<title>{title} · PM on a phone</title>'
            '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
            '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">'
            '<!-- Design tokens: shared with the PM app. Local copy first, live copy from the app second. -->'
            '<link rel="stylesheet" href="../ds/tokens.css"><link rel="stylesheet" href="https://pm-app-one-kappa.vercel.app/ds/tokens.css">'
            '<link rel="stylesheet" href="m.css?v=11241637">' + ('<link rel="stylesheet" href="ios.css?v=11241637">' if ios else '') + extra +
            '</head>')

def page(name, title, body, script='', ios=False, cls='', extra_head=''):
    html = head(title, ios, extra_head) + f'<body class="{cls}">' + body + '<script src="m.js?v=11241637"></script>' + (f'<script>{script}</script>' if script else '') + '</body></html>\n'
    open(os.path.join(OUT, name), 'w').write(html)

# ---------- icons ----------
def ic(path, cls='i', vb='0 0 20 20'):
    return f'<svg class="{cls}" viewBox="{vb}" aria-hidden="true">{path}</svg>'
I = {
 'back': ic('<path d="m12.5 4-6 6 6 6"/>'),
 'chev': ic('<path d="m7.5 4.5 5.5 5.5-5.5 5.5"/>', 'i sm chev'),
 'x': ic('<path d="m5 5 10 10M15 5 5 15"/>'),
 'mic': ic('<rect x="7" y="2.5" width="6" height="10" rx="3"/><path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v2.5"/>'),
 'micoff': ic('<path d="M7 7v2.5a3 3 0 0 0 5.2 2M13 9V5.5a3 3 0 0 0-5.6-1.5M4.5 9.5a5.5 5.5 0 0 0 9 4.2M15.5 9.5c0 .6-.1 1.2-.3 1.8M10 15v2.5M3 3l14 14"/>'),
 'phone': ic('<path d="M3.5 11.5c3.8-3.4 9.2-3.4 13 0l-1.6 2.3a1 1 0 0 1-1.3.3l-1.9-1a1 1 0 0 1-.5-.8l-.1-1.3a8.5 8.5 0 0 0-2.2 0l-.1 1.3a1 1 0 0 1-.5.8l-1.9 1a1 1 0 0 1-1.3-.3z"/>'),
 'call': ic('<path d="M5 3.5h2.5l1.5 3.5-1.8 1.2a9 9 0 0 0 4.6 4.6L13 11l3.5 1.5V15a1.5 1.5 0 0 1-1.5 1.5A12.5 12.5 0 0 1 3.5 5 1.5 1.5 0 0 1 5 3.5z"/>'),
 'cc': ic('<rect x="2.5" y="4.5" width="15" height="11" rx="2"/><path d="M8.5 8.4a2 2 0 1 0 0 3.2M14 8.4a2 2 0 1 0 0 3.2"/>'),
 'check': '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="m2.5 6.3 2.2 2.2L9.5 3.7"/></svg>',
 'info': ic('<circle cx="10" cy="10" r="7.5"/><path d="M10 9v4.5M10 6.5v.1"/>', 'i sm'),
 'alert': ic('<path d="M10 3 2.5 16.5h15z"/><path d="M10 8.5v3.5M10 14.2v.1"/>', 'i sm'),
 'lock': ic('<rect x="4.5" y="9" width="11" height="8" rx="2"/><path d="M7 9V6.5a3 3 0 0 1 6 0V9"/>', 'i sm'),
 'head': ic('<path d="M3.5 13v-2a6.5 6.5 0 0 1 13 0v2"/><rect x="3" y="12" width="3.5" height="5" rx="1.5"/><rect x="13.5" y="12" width="3.5" height="5" rx="1.5"/>', 'i sm'),
 'bat': ic('<rect x="2.5" y="6" width="13" height="8" rx="2"/><path d="M17.5 9v2M6 9.5h3"/>', 'i sm'),
 'moon': ic('<path d="M15.5 12.5A6.5 6.5 0 0 1 7.5 4.5a6.5 6.5 0 1 0 8 8z"/>', 'i sm'),
 'quiet': ic('<path d="M3.5 8v4h3l4 3.5v-11l-4 3.5zM14 7.5l4 5M18 7.5l-4 5"/>', 'i sm'),
 'play': '<svg viewBox="0 0 20 20" class="i" aria-hidden="true"><path d="M7 4.5v11l9-5.5z" fill="currentColor" stroke="none"/></svg>',
 'pause': '<svg viewBox="0 0 20 20" class="i" aria-hidden="true"><path d="M6 4.5h2.8v11H6zM11.2 4.5H14v11h-2.8z" fill="currentColor" stroke="none"/></svg>',
 'bell': ic('<path d="M5 14.5V9a5 5 0 0 1 10 0v5.5l1.5 1.5h-13z"/><path d="M8.5 17.5a1.6 1.6 0 0 0 3 0"/>'),
 'mail': ic('<rect x="2.5" y="4.5" width="15" height="11" rx="2"/><path d="m3 5.5 7 5.5 7-5.5"/>', 'i sm'),
 'laptop': ic('<rect x="4" y="4.5" width="12" height="8.5" rx="1.2"/><path d="M2 15.5h16"/>', 'i sm'),
 'clock': ic('<circle cx="10" cy="10" r="7.5"/><path d="M10 6v4l2.5 2"/>', 'i sm'),
 'note': ic('<path d="M5 3.5h7l3 3v10H5z"/><path d="M12 3.5v3h3M7.5 10h5M7.5 13h5"/>', 'i sm'),
}
OK = '<span class="ok">' + I['check'] + '</span>'

def cbar(step, label):
    segs = ''.join('<i class="%s"></i>' % ('d' if k < step else ('n' if k == step else '')) for k in range(4))
    return f'<div class="prog"><div class="segs" aria-hidden="true">{segs}</div><span>{label}</span></div>'

CTOP = ('<header class="abar"><span class="lg">N</span><div class="who"><b>Northwind Freight</b><small>Account Executive, Mid-Market · first interview</small></div>'
        '<div class="end"><a class="ibtn" href="#" data-note="Opens a reply to Dana Whitfield." aria-label="Write to Dana">' + I['mail'] + '</a></div></header>')

def ios_nav(back='Inbox'):
    return ('<div class="im-nav"><a class="im-back" href="#" data-note="Sam’s other mail isn’t part of the phone screens. The desktop prototype has the full inbox.">'
            '<svg viewBox="0 0 12 21" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 2.5 10.5 10 19"/></svg>' + back + '</a>'
            '<div class="im-arw"><span class="off"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 15 7-7 7 7"/></svg></span>'
            '<span><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 9 7 7 7-7"/></svg></span></div></div>')
IOS_TB = ('<div class="im-tb" aria-hidden="true">'
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 21V4M5.5 4.5h12l-2.5 4.5 2.5 4.5h-12"/></svg>'
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4.3l2 2h8.7A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/></svg>'
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="5" rx="1.2"/><path d="M4.5 9v9.5A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4"/></svg>'
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 6 4 11.5 9.5 17"/><path d="M4.5 11.5H14a6 6 0 0 1 6 6v1"/></svg>'
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.5H6.5a2.5 2.5 0 0 0-2.5 2.5v10.5a2.5 2.5 0 0 0 2.5 2.5H17a2.5 2.5 0 0 0 2.5-2.5V13"/><path d="M17.8 3.7a1.9 1.9 0 0 1 2.7 2.7L12.3 14.6 9 15.5l.9-3.3z"/></svg></div>')

# ======================================================================
# Candidate
# ======================================================================

page('invite.html', 'Sam gets the invite', ios=True, cls='ios', body=(
 '<div class="im">' + ios_nav() +
 '<div class="im-body">'
 '<div class="im-from"><span class="im-av">DW</span><div class="im-fm"><b>Dana Whitfield <span>10:14 am</span></b><small>To: Sam Rivera</small></div></div>'
 '<div class="im-subj">Your first interview for Account Executive at Northwind</div>'
 '<div class="im-txt"><p>Hi Sam,</p><p>Thanks for applying. The next step is a short practice call, then a 7-minute call with an AI buyer. You can do both on your own time, on a laptop or a phone.</p>'
 '<p>Practice opens today and is never scored. The scored call opens on Mon, Nov 16. Before it starts, you’ll read how it works and agree to it.</p>'
 '<p>If you’d like extra time, captions, a text version or a person to interview you, reply to this email.</p><p>Dana</p></div>'
 '<div class="im-cta"><dl><div><dt>Practice</dt><dd>Open now, as often as you like</dd></div><div><dt>Scored call</dt><dd>Opens Mon, Nov 16 · 7 min</dd></div><div><dt>No account needed</dt><dd>The link is just for you</dd></div></dl>'
 '<a class="im-btn" href="notice.html">Open your interview</a></div>'
 '<button class="im-att" type="button" data-note="The notice PDF has the same text as the next screen."><span class="pdf">PDF</span><span><b>Candidate notice.pdf</b><small>1 page</small></span></button>'
 '<div class="im-sig">Dana Whitfield · Recruiter, Northwind Freight · Sent with PM</div>'
 '</div>' + IOS_TB + '</div>'))

page('notice.html', 'How this interview works', body=(
 CTOP + cbar(0, 'Step 1 of 4 · Notice') +
 '<main class="pg has-bar">'
 '<div class="ph"><h1>How this interview works</h1><p>Hi Sam. Here’s what happens, what gets scored and who decides. It takes about 3 minutes to read.</p></div>'
 '<section class="card"><div class="ch"><h2>What happens</h2></div><div class="cb ink2">'
 '<p>You’ll talk with an AI buyer for about 7 minutes. Practice first, as often as you like. Then you take one scored call.</p>'
 '<p>A person on our hiring team reviews every result and makes the decision.</p></div></section>'
 '<section class="card"><div class="ch"><h2>What gets scored</h2><span class="meta">Same for everyone</span></div>'
 '<div class="row"><span class="num">1</span><div class="tx"><b>Discovery</b><small>Finds the real problem before pitching anything</small></div></div>'
 '<div class="row"><span class="num">2</span><div class="tx"><b>Handling doubt</b><small>Stays with a concern until the buyer says it’s answered</small></div></div>'
 '<div class="row"><span class="num">3</span><div class="tx"><b>Getting a next step</b><small>Asks for a specific, dated next step</small></div></div></section>'
 '<section class="card"><div class="ch"><h2>Never scored</h2></div><div class="cb"><div class="tags"><span class="tag">Your voice</span><span class="tag">Your accent</span><span class="tag">Pauses and “um”</span><span class="tag">Your face (there’s no video)</span><span class="tag">Practice calls</span></div></div></section>'
 '<section class="card"><div class="ch"><h2>What to know</h2></div>'
 '<div class="kv"><span>Practice</span><b>As many times as you like. Never scored, never shared.</b></div>'
 '<div class="kv"><span>Scored call</span><b>One call, 7 minutes. Opens Mon, Nov 16.</b></div>'
 '<div class="kv"><span>Who decides</span><b>Marcus Lee, the hiring manager, with Dana Whitfield</b></div>'
 '<div class="kv"><span>Your recording</span><b>Kept 12 months, then deleted. Ask Dana to delete it sooner.</b></div></section>'
 '<a class="card row" href="ask.html" style="border-top:1px solid var(--line)"><div class="tx"><b>Need something different?</b><small>Extra time, captions, a text version or a person to interview you</small></div>' + I['chev'] + '</a>'
 '<p class="foot">Interview run with PM for Northwind Freight.</p>'
 '</main>'
 '<div class="bbar"><label class="ck" id="okl"><input type="checkbox" id="ok"><span>I’ve read this and I agree to take the scored call.</span></label>'
 '<a class="btn pri block" id="go" href="buyer.html" aria-disabled="true">Continue to practice</a></div>'),
 script="""var ok=document.getElementById('ok'),go=document.getElementById('go'),l=document.getElementById('okl');
function u(){go.style.opacity=ok.checked?'':'.45';go.style.pointerEvents=ok.checked?'':'none';go.setAttribute('aria-disabled',!ok.checked);l.classList.toggle('on',ok.checked);if(ok.checked)M.set('agreed',1);}
ok.checked=!!M.get('agreed');ok.onchange=u;u();""")

page('ask.html', 'Ask for something different', body=(
 CTOP + cbar(0, 'Step 1 of 4 · Notice') +
 '<main class="pg has-bar">'
 '<div class="ph"><h1>Ask for something different</h1><p>Asking doesn’t affect your score. Marcus, the hiring manager, never sees it.</p></div>'
 '<div data-when="form" class="cks" role="group" aria-label="What you need">'
 '<label class="ck"><input type="checkbox" name="a" value="Extra time"><span>Extra time on the scored call<small>Up to 5 more minutes</small></span></label>'
 '<label class="ck on"><input type="checkbox" name="a" value="Live captions" checked><span>Live captions<small>On every call, practice and scored</small></span></label>'
 '<label class="ck"><input type="checkbox" name="a" value="A text version"><span>A text version of the call<small>You type, the buyer types back</small></span></label>'
 '<label class="ck"><input type="checkbox" name="a" value="A person"><span>A person to interview me instead<small>Dana sets up a call with someone on the team</small></span></label>'
 '<div class="field" style="margin-top:8px"><label class="lbl" for="why">Anything Dana should know? <span class="muted">Optional</span></label><textarea class="ta" id="why" placeholder="For example: I’m hard of hearing on calls."></textarea></div>'
 '</div>'
 '<div data-when="sent" style="display:flex;flex-direction:column;gap:12px">'
 '<div class="ban good">' + OK + '<div><b>Sent to Dana</b><span id="what">Live captions</span></div></div>'
 '<section class="card"><div class="ch"><h2>What happens now</h2></div>'
 '<div class="kv"><span>Who answers</span><b>Dana Whitfield, recruiter</b></div>'
 '<div class="kv"><span>By when</span><b>Wed, Nov 4. You’ll get an email.</b></div>'
 '<div class="kv"><span>Meanwhile</span><b>Practice is open. Your scored call waits until Dana answers.</b></div></section>'
 '</div>'
 '</main>'
 '<div class="bbar" data-when="form"><button class="btn pri block" id="send">Send to Dana</button><a class="btn ghost block" href="notice.html">Back to the notice</a></div>'
 '<div class="bbar" data-when="sent"><a class="btn pri block" href="notice.html">Back to the notice</a></div>'),
 script="""var bx=[].slice.call(document.querySelectorAll('input[name=a]')),send=document.getElementById('send');
function u(){var n=bx.filter(function(b){return b.checked});bx.forEach(function(b){b.closest('.ck').classList.toggle('on',b.checked)});send.disabled=!n.length;return n;}
bx.forEach(function(b){b.onchange=u});u();
send.onclick=function(){var n=u().map(function(b){return b.value});M.set('ask',n);document.getElementById('what').textContent=n.join(', ');M.state('sent');};
M.onState(function(s){if(s==='sent'){var n=M.get('ask',['Live captions']);document.getElementById('what').textContent=n.join(', ');}});""")

page('buyer.html', 'Meet your buyer', body=(
 CTOP + cbar(1, 'Step 2 of 4 · Practice') +
 '<main class="pg has-bar">'
 '<div class="ph"><h1>Meet your buyer</h1><p>You’ll sell to Jordan in practice and in your scored call.</p></div>'
 '<section class="card"><div class="row" style="min-height:72px"><span class="av blue" style="width:48px;height:48px">JE</span><div class="tx"><b>Jordan Ellis</b><small>Head of operations · regional delivery company · 120 vans</small></div></div>'
 '<div class="cb"><div class="tags"><span class="tag">Skeptical</span><span class="tag">Tried a tool before</span><span class="tag">Medium</span></div></div>'
 '<div class="kv"><span>You’re selling</span><b>Route-planning software for regional delivery fleets</b></div>'
 '<div class="kv"><span>Your goal</span><b>Find out what Jordan needs and agree on a next step, if there is one</b></div>'
 '<div class="kv"><span>How Jordan talks</span><b>Short answers. Waits for you to ask. Warms up if you listen.</b></div></section>'
 '<section class="card" id="mic"><div class="ch"><h2>Check your mic</h2>'
 '<span class="meta" data-when="ok"><span class="tag green">Working</span></span></div>'
 '<div class="cb">'
 '<div data-when="idle asking"><p class="ink2">Say a sentence out loud. Headphones in a quiet room work best.</p><button class="btn block" id="chk" style="margin-top:12px">' + I['mic'] + 'Check my mic</button></div>'
 '<div data-when="ok"><div style="display:flex;align-items:center;gap:12px"><div class="meter live" id="meter" aria-label="Mic level">' + '<i></i>'*14 + '</div><span class="small ink2">iPhone microphone</span></div><p class="small muted" style="margin-top:8px">We can hear you. Keep talking to see it move.</p></div>'
 '<div data-when="blocked" class="ban danger">' + I['alert'] + '<div><b>Your mic is blocked for this site</b>'
 '<span>On iPhone Safari: tap <b>aA</b> in the address bar, then Website Settings, then Microphone, then Allow.</span><br><span>On Android Chrome: tap the lock icon by the address, then Permissions, then Microphone.</span>'
 '<button class="btn sm" id="again">I changed it, check again</button></div></div>'
 '<div data-when="silent" class="ban warn">' + I['alert'] + '<div><b>We can’t hear anything</b>'
 '<span>Check that your headphones are connected and their mic isn’t muted. If you’re on a call in another app, end it first.</span>'
 '<button class="btn sm" id="again2">Check again</button></div></div>'
 '</div></section>'
 '<section class="card"><div class="ch"><h2>Good to know</h2></div><div class="cb ink2">'
 '<p>Jordan waits through pauses, “um” and “mm-hmm”. Take your time.</p><p>Keep this screen open during the call. Locking your phone or switching apps ends it.</p></div></section>'
 '</main>'
 # fake permission prompt
 '<div data-when="asking" style="position:fixed;inset:0;z-index:45;background:var(--overlay);display:grid;place-items:center;padding:24px">'
 '<div role="dialog" aria-label="Browser permission" style="background:var(--surface);border-radius:var(--r-lg);width:270px;text-align:center;overflow:hidden;box-shadow:var(--shadow-pop)">'
 '<div style="padding:18px 16px 14px"><b style="display:block">“pm-app-one-kappa.vercel.app” would like to use your microphone</b><p class="small muted" style="margin-top:4px">Your browser asks this, not PM.</p></div>'
 '<div style="display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--line2)"><button style="min-height:44px;color:var(--info)" id="deny">Don’t Allow</button><button style="min-height:44px;color:var(--info);font-weight:var(--fw-strong);border-left:1px solid var(--line2)" id="allow">Allow</button></div></div></div>'
 '<div class="bbar"><a class="btn pri block" id="start" href="practice.html">Start a practice call</a><p class="hint" id="hint">Check your mic first.</p></div>'),
 script="""var start=document.getElementById('start'),hint=document.getElementById('hint'),mt;
document.getElementById('chk').onclick=function(){M.state('asking')};
document.getElementById('allow').onclick=function(){M.state('ok')};
document.getElementById('deny').onclick=function(){M.state('blocked')};
document.getElementById('again').onclick=function(){M.state('asking')};
document.getElementById('again2').onclick=function(){M.state('ok')};
M.onState(function(s){if(s!=='idle'&&s!=='asking')document.getElementById('mic').scrollIntoView({block:'center'});var ok=s==='ok';start.style.opacity=ok?'':'.45';start.style.pointerEvents=ok?'':'none';hint.hidden=ok;if(ok)M.set('mic',1);
 clearInterval(mt);if(ok){var bars=document.querySelectorAll('#meter i'),t=0;mt=setInterval(function(){t++;bars.forEach(function(b,k){var v=Math.abs(Math.sin(t/3+k*.7))*(.35+.65*Math.abs(Math.sin(t/7)));b.style.height=Math.round(15+v*85)+'%';});},90);}});""")

# transcript (Sam's scored call) used for captions and the manager's review
TR = [
 ('00:04','Jordan',"Jordan Ellis. You've got the call, go ahead."),
 ('00:09','Sam',"Thanks, Jordan. I'm Sam with Northwind Freight. I'll keep this short. Is now still a good time?"),
 ('00:16','Jordan',"I have ten minutes. Maybe less."),
 ('00:21','Sam',"Fair. I saw you're running about 120 vans out of two depots. How are you planning routes today?"),
 ('00:31','Jordan',"A spreadsheet and two dispatchers who've been here longer than me."),
 ('00:47','Sam',"And when a route goes wrong, who hears about it first?"),
 ('00:53','Jordan',"Me. Usually from a customer."),
 ('01:20','Jordan',"Look, we tried a routing tool last year. It didn't stick. So I'm skeptical."),
 ('01:34','Sam',"That's useful to know. How long did you run it?"),
 ('01:40','Jordan',"About four months. Then the drivers stopped using it."),
 ('02:15','Sam',"I'd like to understand what you need before I say anything about what we do. Is that okay?"),
 ('02:41','Jordan',"Okay. You have my attention for a few minutes."),
 ('03:12','Sam',"Before I tell you about us, what went wrong with the one you tried?",'Discovery'),
 ('03:20','Jordan',"Honestly? It didn't listen to the drivers. They know which roads flood."),
 ('03:31','Sam',"So if a driver could flag a road and the routes changed that day, would they trust it?"),
 ('03:39','Jordan',"Maybe. If it actually listened to them."),
 ('04:02','Sam',"How often does flooding change a route in a normal month?"),
 ('04:09','Jordan',"In spring, every week. We lose half a day each time."),
 ('04:48','Jordan',"Every vendor says their system is smart. The last one said that too."),
 ('05:02','Sam',"I hear that. What would you need to see to believe this one is different?"),
 ('05:11','Jordan',"Drivers using it after the first month. That's it."),
 ('05:40','Sam',"Then let's start there. Your drivers flag the roads they know, and the routes update the same day. You told me that's where the last tool lost them, so that's what we'd prove first.",'Handling doubt'),
 ('05:58','Jordan',"That I could take to my team. I'm not signing anything this week, though."),
 ('06:06','Sam',"Understood. Who else would need to see it work?"),
 ('06:12','Jordan',"Our ops manager, Kim. She runs the depots day to day."),
 ('06:40','Jordan',"Send me something and I'll pass it on."),
 ('06:55','Sam',"I'd rather show Kim directly. Could we do 30 minutes with her on Tuesday at 10?",'Getting a next step'),
 ('07:00','Jordan',"Tuesday at 10 works. Put it on my calendar and copy her."),
]
import json
TRJS = json.dumps([[a, b, c.replace("'", '’')] + list(rest) for (a, b, c, *rest) in TR])

PRACTICE_LINES = json.dumps([
 ['Jordan','Jordan Ellis. You’ve got the call, go ahead.'],
 ['Sam','Hi Jordan, I’m Sam with Northwind Freight. Thanks for taking the call.'],
 ['Jordan','Sure. What’s this about?'],
 ['Sam','We help delivery fleets plan routes. How do you plan yours today?'],
 ['Jordan','Spreadsheets, mostly. We had a tool. It didn’t work out.'],
 ['Sam','Had? What happened with it?'],
 ['Jordan','The drivers stopped using it after a few months.'],
 ['Sam','So the tool didn’t know what the drivers know.'],
 ['Jordan','Pretty much. They know which roads flood.'],
])

def call_ui(kind):
    scored = kind == 'scored'
    tag = '<span class="tag dark">Scored</span>' if scored else '<span class="tag">Practice · not scored</span>'
    return (
 '<div class="call">' + tag +
 '<div class="bigav" id="av">JE</div>'
 '<div class="who"><b>Jordan Ellis</b><small>AI buyer · Head of operations · medium</small></div>'
 '<span class="cstat" id="cst"><span class="dot"></span><span id="cstt">Not started</span></span>'
 '<div class="timer" id="tmr">00:00 <small>/ 07:00</small></div><div class="tbar"><i id="tbar"></i></div>'
 '<div class="caps" id="caps" aria-live="polite"><div class="cl"><span>Live captions</span><span>Only you see these</span></div><p id="cap" class="muted">Captions show here once the call starts.</p></div>'
 '</div>')

CALL_JS = """
var TOTAL=420,t=0,tick=null,li=0,LINES=%s,av=document.getElementById('av'),cst=document.getElementById('cst'),cstt=document.getElementById('cstt'),tmr=document.getElementById('tmr'),tb=document.getElementById('tbar'),cap=document.getElementById('cap');
function mm(n){n=Math.max(0,Math.round(n));return (n<600?'0':'')+Math.floor(n/60)+':'+(n%%60<10?'0':'')+n%%60}
function draw(){tmr.firstChild.nodeValue=mm(t)+' ';tb.style.width=(t/TOTAL*100)+'%%';}
function setLine(){var l=LINES[li%%LINES.length];cap.className='';cap.innerHTML='<b>'+l[0]+'</b>'+l[1];av.classList.toggle('talk',l[0]==='Jordan');}
function stop(){clearInterval(tick);tick=null;av.classList.remove('talk');}
function run(){stop();tick=setInterval(function(){t+=1;if(t%%4===0){li++;setLine();}draw();if(t>=TOTAL){stop();onEnd();}},1000/%s);}
function status(cls,txt){cst.className='cstat '+(cls||'');cstt.textContent=txt;}
"""

page('practice.html', 'Practice call', body=(
 CTOP + cbar(1, 'Step 2 of 4 · Practice') +
 '<main class="pg" style="padding-bottom:150px">' +
 '<div data-when="before" class="ban info">' + I['info'] + '<div><b>Keep this screen open</b>Locking your phone or switching apps ends the call. Turn on Do Not Disturb so a phone call doesn’t cut in.</div></div>'
 '<div data-when="away" class="ban warn">' + I['alert'] + '<div><b>The call ended when you left this screen</b>It stopped at 02:41. Practice doesn’t count, so you can start a new one any time.<button class="btn sm" id="newc">Start a new practice call</button></div></div>'
 '<div data-when="dropped" class="ban warn">' + I['alert'] + '<div><b>The call dropped at 03:05</b>That’s usually a weak connection. Move closer to Wi-Fi and start again. Practice doesn’t count.<button class="btn sm" id="newd">Start again</button></div></div>' + call_ui('practice') +
 '</main>'
 '<div class="cctl">'
 '<div class="cb2" data-when="before away dropped"><button class="rb go" id="go" aria-label="Start practice call">' + I['call'] + '</button>Start</div>'
 '<div class="cb2" data-when="connecting live"><button class="rb" id="mute" aria-label="Mute" aria-pressed="false">' + I['mic'] + '</button><span id="mutel">Mute</span></div>'
 '<div class="cb2" data-when="connecting live"><button class="rb end" id="end" aria-label="End call">' + I['phone'] + '</button>End</div>'
 '<div class="cb2" data-when="live"><button class="rb on" id="cc" aria-label="Captions" aria-pressed="true">' + I['cc'] + '</button>Captions</div>'
 '</div>'),
 script=CALL_JS % (PRACTICE_LINES, 4) + """
function onEnd(){location.href='notes.html';}
document.getElementById('go').onclick=function(){M.state('connecting')};
document.getElementById('newc').onclick=document.getElementById('newd').onclick=function(){M.state('connecting')};
document.getElementById('end').onclick=function(){stop();location.href='notes.html'};
var muted=false,mb=document.getElementById('mute');mb.onclick=function(){muted=!muted;mb.classList.toggle('on',muted);mb.setAttribute('aria-pressed',muted);mb.innerHTML=muted?%s:%s;document.getElementById('mutel').textContent=muted?'Unmute':'Mute';};
var ccb=document.getElementById('cc'),cc=true;ccb.onclick=function(){cc=!cc;ccb.classList.toggle('on',cc);ccb.setAttribute('aria-pressed',cc);document.getElementById('caps').style.visibility=cc?'':'hidden';};
M.onState(function(s){stop();
 if(s==='before'){t=0;li=0;draw();status('','Not started');cap.className='muted';cap.textContent='Captions show here once the call starts.';}
 if(s==='connecting'){t=0;li=0;draw();status('','Connecting to Jordan…');cap.className='muted';cap.textContent='Connecting…';setTimeout(function(){if(M.state()==='connecting')M.state('live');},1400);}
 if(s==='live'){status('live','On the call');setLine();run();}
 if(s==='away'){t=161;draw();status('bad','Call ended');cap.className='muted';cap.textContent='The call ended at 02:41.';}
 if(s==='dropped'){t=185;draw();status('bad','Call dropped');cap.className='muted';cap.textContent='The call dropped at 03:05.';}
});""" % (json.dumps(I['micoff']), json.dumps(I['mic'])))

page('notes.html', 'Your practice notes', body=(
 CTOP + cbar(1, 'Step 2 of 4 · Practice') +
 '<main class="pg has-bar">'
 '<div class="ph"><span class="eyebrow">Practice 1 · Nov 3 · 6 min</span><h1 style="margin-top:4px">How your practice went</h1><p>These notes are yours. They aren’t scores, and Northwind never sees them.</p></div>'
 '<section class="card"><div class="row" style="align-items:flex-start">' + OK + '<div class="tx"><b>You asked about the last tool before pitching</b><small>02:19 · Discovery</small><p class="small ink2" style="margin-top:6px">“Had? What happened with it?” got Jordan talking about the real problem. Keep doing this.</p></div></div></section>'
 '<section class="card"><div class="row" style="align-items:flex-start">' + OK + '<div class="tx"><b>You named what Jordan meant</b><small>02:33 · Handling doubt</small><p class="small ink2" style="margin-top:6px">Saying the tool didn’t know what the drivers know showed you were listening.</p></div></div></section>'
 '<section class="card" style="border-color:var(--info-line-soft)"><div class="row" style="align-items:flex-start;background:var(--info-bg-soft)"><span class="num" style="width:20px;height:20px;background:var(--info);color:var(--on-primary)">→</span><div class="tx"><b>Try asking for a next step with a date</b><small>06:10 · Getting a next step</small><p class="small ink2" style="margin-top:6px">You ended with “I’ll send some info.” Jordan would have said yes to something specific. Next time, try: “Could we look at this with your ops manager on Tuesday?”</p></div></div></section>'
 '<section class="card"><div class="row"><div class="tx"><b>Practice 1</b><small>Nov 3 · 6 min</small></div><span class="end">Notes</span></div>'
 '<div class="row"><div class="tx"><b>Scored call</b><small>Opens Mon, Nov 16. We’ll email you.</small></div><span class="end">' + I['lock'] + '</span></div></section>'
 '</main>'
 '<div class="bbar"><a class="btn pri block" href="practice.html">Practice again</a><a class="btn ghost block" href="ready.html">See the scored call (opens Nov 16)</a></div>'))

page('ready.html', 'Before your scored call', body=(
 CTOP + cbar(2, 'Step 3 of 4 · Scored call') +
 '<main class="pg has-bar">'
 '<div class="ph"><div class="tags"><span class="tag dark">Scored</span><span class="tag">One attempt</span></div><h1>Before your scored call</h1><p>This call counts. You have one attempt, up to 7 minutes, with Jordan.</p></div>'
 '<section class="card"><div class="ch"><h2>Quick checks</h2><span class="meta">Tick each one</span></div><div class="cb cks">'
 '<label class="ck"><input type="checkbox" class="rq"><span>I’m somewhere quiet<small>Other voices can confuse the buyer</small></span></label>'
 '<label class="ck"><input type="checkbox" class="rq"><span>My phone has enough battery<small>Over 20%, or plugged in</small></span></label>'
 '<label class="ck"><input type="checkbox" class="rq"><span>Do Not Disturb is on<small>A phone call coming in would cut this one off</small></span></label>'
 '<label class="ck"><input type="checkbox" class="rq"><span>I’ll keep this screen open<small>Locking the phone or switching apps ends the call</small></span></label>'
 '</div></section>'
 '<section class="card"><div class="ch"><h2>What counts</h2></div>'
 '<div class="kv"><span>Scored</span><b>Discovery, handling doubt and getting a next step</b></div>'
 '<div class="kv"><span>Not scored</span><b>Your voice, accent, pauses and “um”</b></div>'
 '<div class="kv"><span>If the call drops</span><b>Reconnect once and pick up where you left off</b></div>'
 '<div class="kv"><span>Captions</span><b>On. Dana approved your request on Nov 4.</b></div></section>'
 '</main>'
 '<div class="bbar"><button class="btn pri block" id="hold" style="position:relative;overflow:hidden" disabled><span id="fill" style="position:absolute;left:0;top:0;bottom:0;width:0;background:var(--success)"></span><span style="position:relative" id="holdt">Hold to start your scored call</span></button>'
 '<p class="hint" id="hint">Tick the four checks first.</p></div>'),
 script="""var rq=[].slice.call(document.querySelectorAll('.rq')),hold=document.getElementById('hold'),fill=document.getElementById('fill'),hint=document.getElementById('hint'),ht=document.getElementById('holdt');
rq.forEach(function(r){r.onchange=u});
function u(){var n=rq.filter(function(r){r.closest('.ck').classList.toggle('on',r.checked);return r.checked}).length;hold.disabled=n<4;hint.textContent=n<4?'Tick the four checks first.':'Press and hold for a second. Letting go cancels.';}
u();var st=null,raf;
function down(e){if(hold.disabled)return;e.preventDefault();st=performance.now();ht.textContent='Keep holding…';(function f(){var p=Math.min(1,(performance.now()-st)/1200);fill.style.width=(p*100)+'%';if(p>=1){location.href='scored.html';return;}raf=requestAnimationFrame(f);})();}
function up(){if(st==null)return;cancelAnimationFrame(raf);st=null;fill.style.width='0';ht.textContent='Hold to start your scored call';}
hold.addEventListener('pointerdown',down);['pointerup','pointerleave','pointercancel'].forEach(function(ev){hold.addEventListener(ev,up)});
hold.addEventListener('keydown',function(e){if(e.key===' '||e.key==='Enter'){if(st==null)down(e)}});hold.addEventListener('keyup',up);""")

page('scored.html', 'Scored call', body=(
 CTOP + cbar(2, 'Step 3 of 4 · Scored call') +
 '<main class="pg" style="padding-bottom:150px">' +
 '<div data-when="dropped" class="ban warn">' + I['alert'] + '<div><b>The call dropped at 04:12</b>You have one reconnect. Jordan picks up where you left off, and the time you lost doesn’t count.<button class="btn sm pri" id="rec">Reconnect</button></div></div>'
 '<div data-when="last" class="ban danger">' + I['alert'] + '<div><b>The call dropped again at 05:50</b>You’ve used your reconnect, so your call is saved up to here. If the problem was on our side or your connection, write to Dana. She can open another call.<button class="btn sm" id="wd" data-note="Opens a reply to Dana with the time of both drops filled in.">Write to Dana</button></div></div>' + call_ui('scored') +
 '</main>'
 '<div class="cctl" data-when="live">'
 '<div class="cb2"><button class="rb" id="mute" aria-label="Mute" aria-pressed="false">' + I['mic'] + '</button><span id="mutel">Mute</span></div>'
 '<div class="cb2"><button class="rb end" data-sheet="endsh" aria-label="End call">' + I['phone'] + '</button>End</div>'
 '<div class="cb2"><button class="rb on" id="cc" aria-label="Captions" aria-pressed="true">' + I['cc'] + '</button>Captions</div></div>'
 '<div class="bbar" data-when="last"><a class="btn pri block" href="done.html">Finish</a></div>'
 '<div class="sheet" id="endsh" role="dialog" aria-label="End the scored call"><div class="grab"></div><div class="sh"><h2>End the scored call?</h2></div>'
 '<div class="sb"><p class="ink2">You can’t call again. Jordan has time for about <b id="left">3 minutes</b> more.</p></div>'
 '<div class="sf"><a class="btn danger block" href="done.html">End the call</a><button class="btn block" data-sheet="endsh">Keep talking</button></div></div><div class="scrim"></div>'),
 script=(CALL_JS % (TRJS, 3)).replace("var l=LINES[li%LINES.length];", "var l=LINES[li%LINES.length];l=[l[1],l[2]];") + """
function onEnd(){location.href='done.html';}
var muted=false,mb=document.getElementById('mute');mb.onclick=function(){muted=!muted;mb.classList.toggle('on',muted);mb.setAttribute('aria-pressed',muted);document.getElementById('mutel').textContent=muted?'Unmute':'Mute';};
var ccb=document.getElementById('cc'),cc=true;ccb.onclick=function(){cc=!cc;ccb.classList.toggle('on',cc);ccb.setAttribute('aria-pressed',cc);document.getElementById('caps').style.visibility=cc?'':'hidden';};
document.getElementById('rec').onclick=function(){M.set('recon',1);M.state('live');};
document.querySelector('[data-sheet=endsh]').addEventListener('click',function(){document.getElementById('left').textContent=Math.max(1,Math.round((TOTAL-t)/60))+' minute'+(Math.round((TOTAL-t)/60)===1?'':'s');});
function seek(sec){t=sec;li=0;while(li<LINES.length-1){var p=LINES[li+1][0].split(':');if(+p[0]*60+ +p[1]>t)break;li++;}draw();}
M.onState(function(s){stop();
 if(s==='live'){seek(M.get('recon')?252:200);status('live','On the call · scored');setLine();run();}
 if(s==='dropped'){seek(252);status('bad','Call dropped');cap.className='muted';cap.textContent='Reconnect to pick up where you left off.';}
 if(s==='last'){seek(350);status('bad','Call ended');cap.className='muted';cap.textContent='Your call is saved up to 05:50.';}
});""")

page('done.html', 'You’re done', body=(
 CTOP + cbar(4, 'Done') +
 '<main class="pg">'
 '<div class="ph"><span class="ok" style="width:40px;height:40px;margin-bottom:12px"><svg viewBox="0 0 12 12" style="width:20px;height:20px"><path d="m2.5 6.3 2.2 2.2L9.5 3.7"/></svg></span><h1 class="big">You’re done, Sam</h1><p>Your scored call with Jordan is in. You’ll hear back from Dana by Tue, Nov 24.</p></div>'
 '<section class="card"><div class="ch"><h2>What happens next</h2></div>'
 '<div class="row" style="align-items:flex-start">' + OK + '<div class="tx"><b>Scored call finished</b><small>Today, 9:12 am · 7 minutes with Jordan Ellis</small></div></div>'
 '<div class="row" style="align-items:flex-start"><span class="ring"></span><div class="tx"><b>A person reviews your call</b><small>Marcus Lee, the hiring manager, listens and makes the decision. This week.</small></div></div>'
 '<div class="row" style="align-items:flex-start"><span class="ring"></span><div class="tx"><b>Dana writes to you</b><small>With the decision and notes from your call. By Tue, Nov 24.</small></div></div></section>'
 '<a class="card row" href="notes.html" style="border-top:1px solid var(--line)"><div class="tx"><b>Your practice notes</b><small>Yours to keep. Northwind never sees them.</small></div>' + I['chev'] + '</a>'
 '<section class="card"><div class="ch"><h2>One question</h2><span class="meta">Goes to PM, never to Northwind</span></div><div class="cb">'
 '<p class="ink2">How fair did this interview feel?</p>'
 '<div class="seg" style="grid-template-columns:repeat(5,1fr);margin-top:10px" id="fair">' + ''.join(f'<button type="button" aria-pressed="false">{n}</button>' for n in range(1, 6)) + '</div>'
 '<div style="display:flex;justify-content:space-between;margin-top:6px" class="small muted"><span>Not fair</span><span>Very fair</span></div>'
 '<p class="small" id="fairok" hidden style="margin-top:10px;color:var(--success-text)">Thanks. That goes to PM only.</p></div></section>'
 '<p class="foot">Your recording is kept 12 months, then deleted. Only the hiring team at Northwind hears it.</p>'
 '</main>'),
 script="""document.querySelectorAll('#fair button').forEach(function(b){b.onclick=function(){document.querySelectorAll('#fair button').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});document.getElementById('fairok').hidden=false;};});""")

page('outcome.html', 'Sam hears back', ios=True, cls='ios', body=(
 '<div class="im">' + ios_nav() +
 '<div class="im-body">'
 '<div class="im-from"><span class="im-av">DW</span><div class="im-fm"><b>Dana Whitfield <span>4:40 pm</span></b><small>To: Sam Rivera</small></div></div>'
 '<div class="im-subj" data-when="adv">Next step: final round at Northwind</div>'
 '<div class="im-subj" data-when="dec">Your interview for Account Executive at Northwind</div>'
 '<div class="im-txt" data-when="adv"><p>Hi Sam,</p><p>Thanks for taking the call with Jordan. Marcus Lee, our hiring manager, listened to it and would like to meet you for the final round.</p>'
 '<p>It’s 45 minutes with Marcus and one of our account executives, in person at our Chicago office or on video. Reply with two times that work for you next week.</p>'
 '<p>Your call notes are attached. They’re the same moments Marcus listened to.</p><p>Dana</p></div>'
 '<div class="im-txt" data-when="dec"><p>Hi Sam,</p><p>Thanks for taking the call with Jordan. Marcus Lee, our hiring manager, listened to it, and we’ve decided not to move forward for this role.</p>'
 '<p>Your call notes are attached. They show the moments Marcus listened to, so you can use them in other interviews.</p>'
 '<p>If you have questions about the decision, reply to this email and I’ll answer.</p><p>Dana</p></div>'
 '<button class="im-att" type="button" data-note="The call notes PDF isn’t built yet."><span class="pdf">PDF</span><span><b>Call notes, Sam Rivera.pdf</b><small>2 pages</small></span></button>'
 '<div class="im-sig">Dana Whitfield · Recruiter, Northwind Freight · Sent with PM</div>'
 '</div>' + IOS_TB + '</div>'),
 script="""var d=M.get('dec');if(d&&!new URLSearchParams(location.search).has('s'))M.state(d);""")

# ======================================================================
# Hiring manager
# ======================================================================
MTOP = lambda back=None, title='Account Executive, Mid-Market', sub='Northwind Freight · Req 114', bell=True: (
 '<header class="abar">' + (f'<a class="back" href="{back}" aria-label="Back">' + I['back'] + '</a>' if back else '<span class="pm"><i></i>PM</span>') +
 f'<div class="who"><b>{title}</b><small>{sub}</small></div>' +
 ('<div class="end"><a class="ibtn" href="#" data-note="2 new: Sam Rivera and Ama Owusu finished their calls." aria-label="Notifications">' + I['bell'] + '<span class="badge"></span></a><span class="av dark" aria-label="Marcus Lee">ML</span></div>' if bell else '') +
 '</header>')

page('join-email.html', 'Marcus is added to the role', ios=True, cls='ios', body=(
 '<div class="im">' + ios_nav() +
 '<div class="im-body">'
 '<div class="im-from"><span class="im-av">DW</span><div class="im-fm"><b>Dana Whitfield <span>7:48 am</span></b><small>To: Marcus Lee</small></div></div>'
 '<div class="im-subj">You’re on the Account Executive interviews</div>'
 '<div class="im-txt"><p>Hi Marcus,</p><p>I’ve added you to the first-round interviews for Account Executive, Mid-Market. Calls start finishing tomorrow.</p>'
 '<p>You can listen to each call and rate it before you see PM’s score. Then you advance or decline, and I write to the candidate.</p>'
 '<p>The link works once, for 7 days.</p><p>Dana</p></div>'
 '<div class="im-cta"><dl><div><dt>Role</dt><dd>Account Executive, Mid-Market</dd></div><div><dt>Your access</dt><dd>Reviewer</dd></div><div><dt>Link works until</dt><dd>Mon, Nov 23</dd></div></dl>'
 '<a class="im-btn" href="join.html">Join the role</a></div>'
 '<div class="im-sig">Sent from PM for Northwind Freight. Reply goes to Dana.</div>'
 '</div>' + IOS_TB + '</div>'))

page('join.html', 'Join the role', body=(
 '<header class="abar"><span class="pm"><i></i>PM</span></header>'
 '<main class="pg has-bar">'
 '<div class="ph"><h1>Dana Whitfield added you to a role</h1><p>Join to listen to calls, rate them and decide.</p></div>'
 '<section class="card"><div class="kv"><span>Role</span><b>Account Executive, Mid-Market · Northwind Freight</b></div>'
 '<div class="kv"><span>Your access</span><b>Reviewer</b></div>'
 '<div class="kv"><span>You can</span><b>Listen to scored calls, rate each one, see PM’s score after you rate, and advance or decline</b></div>'
 '<div class="kv"><span>You won’t see</span><b>Practice calls, practice notes, candidates’ emails or what they asked Dana for</b></div></section>'
 '<section class="card" data-when="new"><div class="ch"><h2>Make your account</h2></div><div class="cb">'
 '<div class="field"><label class="lbl" for="em">Email</label><input class="in" id="em" value="marcus.lee@northwindfreight.com" readonly style="background:var(--bg);color:var(--ink2)"></div>'
 '<div class="field"><label class="lbl" for="nm">Your name</label><input class="in" id="nm" value="Marcus Lee" autocomplete="name"></div>'
 '<div class="field"><label class="lbl" for="pw">Password</label><input class="in" id="pw" type="password" autocomplete="new-password" placeholder="At least 10 characters"></div>'
 '</div></section>'
 '<section class="card" data-when="has"><div class="ch"><h2>Sign in to add this role</h2></div><div class="cb">'
 '<p class="small ink2" style="margin-bottom:12px">You already have a PM account with this email.</p>'
 '<div class="field"><label class="lbl" for="em2">Email</label><input class="in" id="em2" value="marcus.lee@northwindfreight.com" readonly style="background:var(--bg);color:var(--ink2)"></div>'
 '<div class="field"><label class="lbl" for="pw2">Password</label><input class="in" id="pw2" type="password" autocomplete="current-password"></div>'
 '</div></section>'
 '</main>'
 '<div class="bbar"><a class="btn pri block" href="home.html" data-when="new">Join and open the role</a><a class="btn pri block" href="home.html" data-when="has">Sign in and add this role</a><p class="hint">Only Dana and the role’s owner can change your access.</p></div>'))

page('home.html', 'Home', body=(
 MTOP() +
 '<main class="pg">'
 '<div class="ph"><h1>Good afternoon, Marcus</h1><p id="sum">3 calls to rate and 2 decisions to make.</p></div>'
 '<section class="card"><div class="ch"><h2>Calls to rate</h2><span class="meta" id="nr">3</span></div><div id="torate"></div></section>'
 '<section class="card"><div class="ch"><h2>Decisions to make</h2><span class="meta" id="nd">2</span></div><div id="todec"></div></section>'
 '<a class="card row" href="shortlist.html" style="border-top:1px solid var(--line)"><div class="tx"><b>Shortlist</b><small>9 recommended of 39 who finished</small></div>' + I['chev'] + '</a>'
 '<div class="ban info">' + I['laptop'] + '<div>Interview setup, invites and the candidates table are on a laptop. On your phone you can rate and decide.</div></div>'
 '</main>'),
 script="""var R=M.get('rate-sam'),D=M.get('dec');
var torate=[['sam','Sam Rivera','Finished today, 9:12 am'],['ama','Ama Owusu','Finished today, 8:55 am'],['priya','Priya Nair','Finished yesterday, 3:27 pm']].filter(function(x){return !(x[0]==='sam'&&R)});
var todec=[['ben','Ben Carter','You said Lean yes · Nov 12'],['theo','Theo Grant','You said Lean no · Nov 12']];if(R&&!D)todec.unshift(['sam','Sam Rivera','You said '+({no:'No',lno:'Lean no',lyes:'Lean yes',yes:'Yes'})[R]+' · today']);
function row(x,href){return '<a class="row" href="'+href+'"'+(x[0]==='sam'?'':' data-note="In this prototype, Sam Rivera’s call is the one you can open."')+'><span class="av">'+x[1].split(' ').map(function(w){return w[0]}).join('')+'</span><div class="tx"><b>'+x[1]+'</b><small>'+x[2]+'</small></div>"""+I['chev'].replace('"','\\"')+"""</a>';}
document.getElementById('torate').innerHTML=torate.length?torate.map(function(x){return row(x,x[0]==='sam'?'review.html':'#')}).join(''):'<div class="cb muted">Nothing to rate.</div>';
document.getElementById('todec').innerHTML=todec.map(function(x){return row(x,x[0]==='sam'?'review.html?s=rated':'#')}).join('');
document.getElementById('nr').textContent=torate.length;document.getElementById('nd').textContent=todec.length;
document.getElementById('sum').textContent=torate.length+' call'+(torate.length===1?'':'s')+' to rate and '+todec.length+' decision'+(todec.length===1?'':'s')+' to make.';""")

SL = [
 ('sam','Sam Rivera','Strongest at discovery',(7.0,8.0),'Nov 17'),
 ('priya','Priya Nair','Strongest at next steps',(6.5,8.0),'Nov 16'),
 ('ama','Ama Owusu','Strongest at handling doubt',(6.0,7.5),'Nov 17'),
 ('rhea','Rhea Das','Even across skills',(6.0,7.0),'Nov 16'),
 ('nia','Nia Brooks','Strongest at discovery',(5.5,7.0),'Nov 13'),
 ('ben','Ben Carter','Strongest at next steps',(5.5,7.0),'Nov 12'),
 ('theo','Theo Grant','Strongest at handling doubt',(5.5,6.5),'Nov 12'),
 ('carmen','Carmen Ruiz','Strongest at discovery',(5.0,6.5),'Nov 11'),
 ('ian','Ian Walsh','Even across skills',(5.0,6.0),'Nov 10'),
]
page('shortlist.html', 'Shortlist', body=(
 MTOP('home.html', 'Shortlist', 'Account Executive, Mid-Market') +
 '<main class="pg">'
 '<div class="ph"><h1>Shortlist</h1><p>9 recommended of 39 who finished. Rate a call to see PM’s score for it.</p></div>'
 '<div class="eyebrow" id="h1">Rate first · 3</div><section class="card" id="a"></section>'
 '<div class="eyebrow" id="h2" style="margin-top:8px">Rated · 6</div><section class="card" id="b"></section>'
 '<p class="foot">Ranked by the weighted midpoint of each skill range. Unrated calls are listed by name, so their order doesn’t hint at the score.</p>'
 '</main>'),
 script="""var SL=%s,R=M.get('rate-sam'),D=M.get('dec');
var unr=['ama','priya','sam'].filter(function(id){return !(id==='sam'&&R)});
function pos(r){return 'left:'+((r[0]-4)/6*100).toFixed(1)+'%%;width:'+((r[1]-r[0])/6*100).toFixed(1)+'%%'}
function f(n){return n.toFixed(1)}
function ini(n){return n.split(' ').map(function(w){return w[0]}).join('')}
var a=SL.filter(function(c){return unr.indexOf(c[0])>=0}).sort(function(x,y){return x[1]<y[1]?-1:1});
var b=SL.map(function(c,k){return c.concat([k+1])}).filter(function(c){return unr.indexOf(c[0])<0});
document.getElementById('a').innerHTML=a.map(function(c){return '<a class="row" href="'+(c[0]==='sam'?'review.html':'#')+'"'+(c[0]==='sam'?'':' data-note="In this prototype, Sam Rivera’s call is the one you can open."')+'><span class="av">'+ini(c[1])+'</span><div class="tx"><b>'+c[1]+'</b><small>Finished '+c[4]+'</small></div><span class="blind">Not rated</span></a>'}).join('')||'<div class="cb muted" style="padding-top:14px">You’ve rated every call.</div>';
document.getElementById('b').innerHTML=b.map(function(c){var tag=c[0]==='sam'&&D?'<span class="tag '+(D==='adv'?'green':'')+'" style="margin-left:6px;height:20px;font-size:var(--fs-sm)">'+(D==='adv'?'Final round':'Declined')+'</span>':'';
 return '<a class="row" href="'+(c[0]==='sam'?'review.html?s=rated':'#')+'"'+(c[0]==='sam'?'':' data-note="In this prototype, Sam Rivera’s call is the one you can open."')+'><span class="num">'+c[5]+'</span><div class="tx"><b>'+c[1]+tag+'</b><small>'+c[2]+'</small></div><div style="width:96px;flex:none;text-align:right"><span class="rg">'+f(c[3][0])+'–'+f(c[3][1])+'</span><span class="rbar" style="display:block;margin-top:6px"><i style="'+pos(c[3])+'"></i></span></div></a>'}).join('');
document.getElementById('h1').textContent='Rate first · '+a.length;document.getElementById('h2').textContent='Rated · '+b.length;""" % json.dumps([[a, b, c, list(d), e] for (a, b, c, d, e) in SL]))

WAVE = [55,63,38,75,86,44,36,33,27,76,95,62,32,53,91,93,71,60,47,38,58,52,28,58,59,49,46,64,62,72,36,68,74,89,56,47,56,85,60,36,95,63,25,62,98,64,90,49,77,79]
page('review.html', 'Sam Rivera’s call', body=(
 MTOP('shortlist.html', 'Sam Rivera', 'Nov 17, 9:05 am · 7 min with Jordan Ellis', bell=False) +
 '<div style="position:sticky;top:var(--stick,56px);z-index:15;background:var(--surface);border-bottom:1px solid var(--line);padding:10px 16px;display:flex;align-items:center;gap:12px" id="player">'
 '<button class="rb" id="pb" style="width:44px;height:44px;flex:none" aria-label="Play">' + I['play'] + '</button>'
 '<div style="flex:1;min-width:0"><div id="wave" style="display:flex;align-items:center;gap:2px;height:28px;position:relative;cursor:pointer"></div></div>'
 '<span class="mono small" id="pt" style="flex:none;width:44px;text-align:right">00:00</span>'
 '<button class="btn sm" id="sp" style="flex:none;min-width:48px" aria-label="Playback speed">1×</button></div>'
 '<main class="pg" style="padding-bottom:260px" id="pgm">'
 '<div data-when="blind" class="ban warn">' + I['info'] + '<div><b>Rate before you see PM’s score</b>So your rating is your own. PM’s ranges and moments show after you save.</div></div>'
 '<section class="card" data-when="rated" id="reveal"></section>'
 '<section class="card" data-when="rated"><div class="ch"><h2>Moments behind the scores</h2></div><div id="moms"></div></section>'
 '<section class="card"><div class="ch"><h2>Transcript</h2><span class="meta">Tap a line to play from there</span></div><div id="tr"></div></section>'
 '</main>'
 '<div class="bbar" data-when="blind"><div style="display:flex;justify-content:space-between;align-items:baseline"><b class="small">Your rating</b><button class="link small" data-sheet="notesh" style="font-weight:var(--fw-regular)" id="notel">Add a note</button></div>'
 '<div class="seg" id="rate">' + ''.join(f'<button type="button" data-r="{k}" aria-pressed="false">{v}</button>' for k, v in [('no','No'),('lno','Lean no'),('lyes','Lean yes'),('yes','Yes')]) + '</div>'
 '<button class="btn pri block" id="save" disabled>Save rating and see PM’s score</button></div>'
 '<div class="bbar" data-when="rated"><div class="btns"><a class="btn" href="decide.html?s=dec">Decline</a><a class="btn pri" href="decide.html">Advance to final round</a></div><p class="hint" id="dline"></p></div>'
 '<div class="sheet" id="notesh" role="dialog" aria-label="Your note"><div class="grab"></div><div class="sh"><h2>Your note</h2><button class="ibtn" data-sheet="notesh" aria-label="Close">' + I['x'] + '</button></div>'
 '<div class="sb"><p class="small muted">For the debrief. The hiring team sees it, Sam never does.</p><textarea class="ta" id="note" placeholder="What would you ask Sam in the final round?"></textarea></div>'
 '<div class="sf"><button class="btn pri block" data-sheet="notesh">Done</button></div></div><div class="scrim"></div>'),
 script=("""var TR=%s,WAVE=%s,D=420,t=0,on=false,tm=null,sp=1;
var MO=[['03:12','Discovery','Asked what happened to the last tool before pitching anything.'],['05:40','Handling doubt','Offered to let drivers flag roads, tied to Jordan’s own story.'],['06:55','Getting a next step','Booked a follow-up with the ops manager for Tuesday.']];
var SK=[['Discovery',40,[7.5,8.5]],['Handling doubt',35,[6.5,7.5]],['Getting a next step',25,[7.0,8.0]]];
var RL={no:'No',lno:'Lean no',lyes:'Lean yes',yes:'Yes'};
document.documentElement.style.setProperty('--stick',(document.body.classList.contains('m-stripped')?52:52)+'px');
function sec(s){var p=s.split(':');return +p[0]*60+ +p[1]}
function mm(n){n=Math.round(n);return (n<600?'0':'')+Math.floor(n/60)+':'+(n%%60<10?'0':'')+n%%60}
var wave=document.getElementById('wave');wave.innerHTML=WAVE.map(function(h){return '<i style="flex:1;height:'+h+'%%;border-radius:var(--r-xs);background:var(--track)"></i>'}).join('');
function rated(){return M.state()==='rated'}
function drawTr(){var r=rated();document.getElementById('tr').innerHTML=TR.map(function(l,k){var mo=r&&l[3];return '<button class="row" data-k="'+k+'" style="align-items:flex-start;min-height:0;padding:10px 16px'+(mo?';background:var(--warn-bg-soft)':'')+'"><span class="mono small muted" style="width:40px;flex:none;padding-top:1px">'+l[0]+'</span><span class="tx"><b class="small" style="font-weight:var(--fw-strong)">'+(l[1]==='Jordan'?'Jordan (AI buyer)':'Sam')+(mo?' <span class="tag warn" style="height:18px;font-size:var(--fs-xs);padding:0 6px">'+l[3]+'</span>':'')+'</b><span class="small ink2" style="display:block;margin-top:2px">'+l[2]+'</span></span></button>'}).join('');
 document.querySelectorAll('#tr .row').forEach(function(b){b.onclick=function(){t=sec(TR[+b.getAttribute('data-k')][0]);play(true)}});upd();}
function upd(){var p=Math.floor(t/D*WAVE.length);[].forEach.call(wave.children,function(x,k){x.style.background=k<p?'var(--ink)':'var(--track)'});document.getElementById('pt').textContent=mm(t);
 var cur=-1;TR.forEach(function(l,k){if(sec(l[0])<=t)cur=k});document.querySelectorAll('#tr .row').forEach(function(r,k){r.style.boxShadow=on&&k===cur?'inset 3px 0 0 var(--ink)':''});
 var pb=document.getElementById('pb');pb.innerHTML=on?%s:%s;pb.setAttribute('aria-label',on?'Pause':'Play');}
function play(force){if(on&&!force){on=false;clearInterval(tm);upd();return;}on=true;clearInterval(tm);tm=setInterval(function(){t+=1;if(t>=D){t=D;on=false;clearInterval(tm);}upd();},1000/sp);upd();}
document.getElementById('pb').onclick=function(){play()};
wave.onclick=function(e){var r=wave.getBoundingClientRect();t=Math.max(0,Math.min(D,(e.clientX-r.left)/r.width*D));upd();};
document.getElementById('sp').onclick=function(){sp=sp===1?1.5:sp===1.5?2:1;this.textContent=sp+'×';if(on)play(true);};
var pick=null,rb=[].slice.call(document.querySelectorAll('#rate button')),save=document.getElementById('save');
rb.forEach(function(b){b.onclick=function(){pick=b.getAttribute('data-r');rb.forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});save.disabled=false;}});
save.onclick=function(){M.set('rate-sam',pick);M.state('rated');window.scrollTo(0,0);M.view.scrollTop=0;M.toast('Rating saved. Here’s PM’s score.');};
var note=document.getElementById('note');note.value=M.get('note-sam','');note.oninput=function(){M.set('note-sam',note.value);document.getElementById('notel').textContent=note.value?'Edit note':'Add a note';};if(note.value)document.getElementById('notel').textContent='Edit note';
function pos(r){return 'left:'+((r[0]-4)/6*100).toFixed(1)+'%%;width:'+((r[1]-r[0])/6*100).toFixed(1)+'%%'}
function reveal(){var r=M.get('rate-sam')||'yes',agree=r==='yes'||r==='lyes';
 document.getElementById('reveal').innerHTML='<div class="cb" style="padding-top:16px"><div style="display:flex;justify-content:space-between;align-items:baseline"><span class="eyebrow">PM’s overall range</span><span class="small muted">Rank 1 of 39</span></div>'+
  '<div style="display:flex;align-items:baseline;gap:8px;margin-top:4px"><b class="mono" style="font-size:var(--fs-2xl);line-height:var(--lh-2xl);font-weight:var(--fw-regular)">7.0–8.0</b><span class="muted small">out of 10</span></div>'+
  '<div style="display:flex;gap:10px;align-items:center;margin-top:10px"><span class="rbar"><i style="'+pos([7,8])+'"></i></span></div>'+
  '<div class="ban '+(agree?'good':'warn')+'" style="margin-top:12px"><div>'+(agree?'You said <b style="display:inline">'+RL[r]+'</b>. PM agrees: Sam is in its top group.':'You said <b style="display:inline">'+RL[r]+'</b>. PM ranks Sam first. Worth a second listen before you decide.')+'</div></div></div>'+
  SK.map(function(s){return '<div class="row" style="align-items:flex-start"><div class="tx"><b>'+s[0]+'</b><small>Weight '+s[1]+'%%</small><div style="display:flex;gap:10px;align-items:center;margin-top:8px"><span class="rbar"><i style="'+pos(s[2])+'"></i></span><span class="rg">'+s[2][0].toFixed(1)+'–'+s[2][1].toFixed(1)+'</span></div></div></div>'}).join('');
 document.getElementById('moms').innerHTML=MO.map(function(m){return '<button class="row" data-t="'+sec(m[0])+'" style="align-items:flex-start"><span class="mono small" style="width:40px;flex:none;padding-top:1px">'+m[0]+'</span><span class="tx"><b>'+m[1]+'</b><small>'+m[2]+'</small></span>"""+I['play'].replace('"','\\"')+"""</button>'}).join('');
 document.querySelectorAll('#moms .row').forEach(function(b){b.onclick=function(){t=+b.getAttribute('data-t');play(true)}});
 var dec=M.get('dec');document.getElementById('dline').textContent=dec?'You '+(dec==='adv'?'advanced':'declined')+' Sam. Change it from the decision screen.':'Dana writes to Sam after you decide.';}
M.onState(function(s){if(s==='rated'){if(!M.get('rate-sam'))M.set('rate-sam','yes');reveal();}else{pick=null;rb.forEach(function(x){x.classList.remove('on')});save.disabled=true;}drawTr();});
if(M.get('rate-sam')&&!new URLSearchParams(location.search).has('s'))setTimeout(function(){M.state('rated')},0);""") % (TRJS.replace('"Discovery"', '"Discovery"'), json.dumps(WAVE), json.dumps(I['pause']), json.dumps(I['play'])))

page('decide.html', 'Decide', body=(
 MTOP('review.html?s=rated', 'Sam Rivera', 'Rated Yes · PM 7.0–8.0 · rank 1', bell=False) +
 '<main class="pg">'
 '<div class="ph"><h1 data-when="adv">Advance Sam to the final round</h1><h1 data-when="dec">Decline Sam</h1>'
 '<p>Decided by Marcus Lee · Reviewer on this role</p></div>'
 '<section class="card" data-when="dec"><div class="ch"><h2>Reason</h2><span class="meta">Only the hiring team sees this</span></div><div class="cb cks" id="why">'
 + ''.join(f'<label class="ck"><input type="radio" name="why" value="{v}"><span>{v}</span></label>' for v in ['Discovery was too thin','Didn’t handle the buyer’s doubt','No clear next step','Stronger candidates for the same slot','Something else']) +
 '<textarea class="ta" id="whyo" placeholder="Say what you heard in the call" hidden></textarea></div></section>'
 '<section class="card"><div class="ch"><h2>Message to Sam</h2><span class="meta">Dana sends it</span></div><div class="cb">'
 '<textarea class="ta" id="msg" style="min-height:168px"></textarea>'
 '<p class="small muted" style="margin-top:8px">It never includes a score or your reason. Dana can edit it before it goes out.</p></div></section>'
 '<section class="card"><div class="kv"><span>Sam’s applicant tracker stage</span><b id="ats">Moves to Final round</b></div><div class="kv"><span>Sam hears back by</span><b>Tue, Nov 24, as promised</b></div></section>'
 '<div style="height:120px"></div>'
 '</main>'
 '<div class="bbar"><button class="btn pri block" id="ok" disabled>Advance Sam</button><a class="btn ghost block" href="review.html?s=rated">Back to the call</a><p class="hint" id="hint" hidden>Pick a reason first.</p></div>'),
 script="""var msg=document.getElementById('msg'),ok=document.getElementById('ok'),hint=document.getElementById('hint'),whyo=document.getElementById('whyo');
var MSG={adv:'Hi Sam,\\n\\nThanks for taking the call with Jordan. Marcus Lee, our hiring manager, listened to it and would like to meet you for the final round.\\n\\nReply with two times that work for you next week.\\n\\nDana',
 dec:'Hi Sam,\\n\\nThanks for taking the call with Jordan. Marcus Lee, our hiring manager, listened to it, and we’ve decided not to move forward for this role.\\n\\nYour call notes are attached. If you have questions, reply to this email.\\n\\nDana'};
var rs=[].slice.call(document.querySelectorAll('input[name=why]'));
function u(){var s=M.state();if(s==='adv'){ok.disabled=false;hint.hidden=true;return;}var p=rs.filter(function(r){r.closest('.ck').classList.toggle('on',r.checked);return r.checked})[0];
 whyo.hidden=!(p&&p.value==='Something else');var good=p&&(p.value!=='Something else'||whyo.value.trim().length>3);ok.disabled=!good;hint.hidden=!!good;}
rs.forEach(function(r){r.onchange=u});whyo.oninput=u;
M.onState(function(s){msg.value=MSG[s];ok.textContent=s==='adv'?'Advance Sam':'Decline Sam';ok.className='btn block '+(s==='adv'?'pri':'danger');document.getElementById('ats').textContent=s==='adv'?'Moves to Final round':'Moves to Not moving forward';
 var h=document.querySelector('.abar .who small');var r=M.get('rate-sam')||'yes';h.textContent='Rated '+({no:'No',lno:'Lean no',lyes:'Lean yes',yes:'Yes'})[r]+' · PM 7.0–8.0 · rank 1';u();});
ok.onclick=function(){var s=M.state();M.set('dec',s);if(!M.get('rate-sam'))M.set('rate-sam','yes');M.toast(s==='adv'?'Sam advanced. Dana will send the message.':'Sam declined. Dana will send the message.');setTimeout(function(){location.href='shortlist.html'},1100);};""")

print('ok')
