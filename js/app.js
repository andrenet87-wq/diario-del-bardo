
const D=window.THRANTIR_DATA; const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function nav(id){$$('.view').forEach(x=>x.classList.remove('active')); $('#'+id).classList.add('active'); $$('.nav button').forEach(x=>x.classList.toggle('active',x.dataset.view===id)); window.scrollTo(0,0)}
$$('.nav button').forEach(b=>b.onclick=()=>nav(b.dataset.view));

// v0.19 · Riassunti cor Fischio (source-backed, no narrative fill)
const RF19=window.RIASSUNTI_FISCHIO_V019||{chapters:[]};let rfMode='fischio';
function renderFischio(){
 const grid=document.querySelector('#fischioGrid'),meta=document.querySelector('#fischioMeta');if(!grid)return;
 grid.innerHTML=RF19.chapters.map(c=>{const rows=c[rfMode]||[];return `<article class="fischioCard searchable" data-search="${(c.source_chapter+' '+c.title+' '+rows.join(' ')).toLowerCase()}"><div class="fischioCardHead"><span class="sourceChapter">${c.source_chapter}</span><h2>${c.title}</h2><small>${c.session}</small></div><ol class="fischioList">${rows.map(x=>`<li>${x}</li>`).join('')}</ol><div class="fischioFoot">Fonte: Google Drive · Riassunto · ${c.source_chapter}</div></article>`}).join('');
 if(meta)meta.textContent=`${RF19.chapters.length} capitoli · ${rfMode==='fischio'?'modalità ultra-breve':'modalità breve estesa'}`;
 document.querySelectorAll('[data-fischio-mode]').forEach(b=>b.classList.toggle('active',b.dataset.fischioMode===rfMode));
}
document.querySelectorAll('[data-fischio-mode]').forEach(b=>b.addEventListener('click',()=>{rfMode=b.dataset.fischioMode;renderFischio()}));renderFischio();

function modal(title,html){$('#modalTitle').textContent=title;$('#modalBody').innerHTML=html;$('#modal').classList.add('show')} $('.close').onclick=()=>$('#modal').classList.remove('show');
$('#charactersGrid').innerHTML=D.characters.map(c=>{let provisional=(c.tags||[]).some(t=>String(t).includes('PROVVISORIA')),locked=['lucien','xarion','marcus','dregan','vael','loox'].includes(c.id);return `<article class="card searchable" data-search="${(c.name+' '+c.text+' '+c.tags.join(' ')).toLowerCase()}"><img src="${c.image}"><div class="pad"><div class="muted">${c.type} · ${c.subtitle}</div><h3>${c.name}</h3><p>${c.text}</p>${locked?'<span class="tag locked">REFERENCE BLOCCATA</span>':''}${provisional?'<span class="tag provisional">DA VALIDARE</span>':''}${c.tags.map(t=>`<span class="tag">${t}</span>`).join('')}<p><button onclick="showChar('${c.id}')">Apri scheda</button></p></div></article>`}).join('');
window.showChar=id=>{let c=D.characters.find(x=>x.id===id);modal(c.name,`<img src="${c.image}" style="width:100%;max-height:420px;object-fit:contain;background:#080c11"><p>${c.text}</p><div class="status"><b>Stato attuale</b><br>${c.status}</div><p class="muted">${c.known}</p>`)};
$('#map').innerHTML+=D.places.map(p=>`<button class="pin searchable" data-search="${(p.name+' '+p.text).toLowerCase()}" style="left:${p.x}%;top:${p.y}%" onclick="showPlace('${p.id}')">${p.name}<small>${p.kind}</small></button>`).join('');
window.showPlace=id=>{let p=D.places.find(x=>x.id===id); const extra=id==='nostromo'?`<p><button id="openNostromo">Apri planimetria</button></p>`:''; modal(p.name,`${p.image?`<img src="${p.image}" style="width:100%;max-height:430px;object-fit:contain;background:#080c11">`:''}<p>${p.text}</p>${extra}`); if(id==='nostromo'){setTimeout(()=>{const b=document.getElementById('openNostromo');if(b)b.onclick=()=>{document.querySelector('.close')?.click();nav('nostromo')};},0)}};
$('#timelineList').innerHTML=D.timeline.map(e=>`<div class="event searchable" data-search="${(e.title+' '+e.text).toLowerCase()}"><h3>${e.title}</h3><p>${e.text}</p></div>`).join('');
$('#mysteriesGrid').innerHTML=D.mysteries.map(m=>`<div class="card searchable" data-search="${(m.name+' '+m.text).toLowerCase()}"><div class="pad"><span class="tag">${m.state}</span><h3>${m.name}</h3><p>${m.text}</p></div></div>`).join('');
$('#search').addEventListener('input',e=>{let q=e.target.value.toLowerCase().trim();$$('.searchable').forEach(x=>x.style.display=!q||x.dataset.search.includes(q)?'':'none')});
let scale=1; function zoom(d){scale=Math.max(.5,Math.min(2.5,scale+d));$('#shipPlan').style.width=(100*scale)+'%'} window.zoom=zoom;

// v0.2 World Bible + Replay
const R=window.THRANTIR_REPLAY||[], B=window.THRANTIR_BIBLE||{};
if($('#bibleGrid')) $('#bibleGrid').innerHTML=(B.places||[]).map(p=>`<article class="card"><div class="pad"><span class="tag">${p.status}</span><h3>${p.name}</h3><p class="muted">${p.source}</p><p><b>Visuale:</b> ${p.visual}</p>${p.facts.map(f=>`<div class="fact">• ${f}</div>`).join('')}</div></article>`).join('');
let ri=0, rt=null, elapsed=0, playing=false;
const cmap=Object.fromEntries(D.characters.map(c=>[c.id,c]));
function renderScene(reset=true){
 if(!R.length)return; const s=R[ri]; if(reset)elapsed=0;
 $('#replayBg').src=s.image; $('#sceneChapter').textContent=s.chapter; $('#sceneTitle').textContent=s.title; $('#sceneSummary').textContent=s.summary;
 $('#sceneSource').innerHTML=`<b>CANONE:</b> ${s.canon}<br><span class="muted">I raccordi non presenti nelle fonti sono marcati RICOSTRUZIONE.</span>`;
 $('#sceneDialogue').innerHTML=s.dialogue.length?s.dialogue.map(d=>`<div class="dialogue"><div><b>${d.speaker}</b> <span class="tag ${d.kind==='CANONICO'?'canon':'recon'}">${d.kind}</span></div><q>${d.text}</q></div>`).join(''):'<p class="muted">Nessun dialogo trascritto per questa scena.</p>';
 $('#avatarRail').innerHTML=s.cast.map(id=>{let c=cmap[id];return c?`<div class="avatar" title="${c.name}"><img src="${c.image}"><span>${c.name}</span></div>`:''}).join('');
 $('#sceneCounter').textContent=`Scena ${ri+1} / ${R.length} • ${s.place}`;
 $('#replayProgress').style.width=(elapsed/s.duration*100)+'%';
 $$('#sceneList button').forEach((b,i)=>b.classList.toggle('active',i===ri));
}
function tick(){if(!playing)return; const s=R[ri]; elapsed+=.1; $('#replayProgress').style.width=Math.min(100,elapsed/s.duration*100)+'%'; if(elapsed>=s.duration){ if(ri<R.length-1){ri++;renderScene();} else stopReplay();}}
function playReplay(){playing=true;if(!rt)rt=setInterval(tick,100)}
function pauseReplay(){playing=false}
function stopReplay(){playing=false;elapsed=0;clearInterval(rt);rt=null;ri=0;renderScene()}
window.stopReplay=stopReplay;
if($('#sceneList')) $('#sceneList').innerHTML=R.map((s,i)=>`<button onclick="ri=${i};renderScene();pauseReplay()"><span>${s.chapter}</span>${s.title}</button>`).join('');
if($('#playScene')){$('#playScene').onclick=playReplay;$('#pauseScene').onclick=pauseReplay;$('#stopScene').onclick=stopReplay;$('#prevScene').onclick=()=>{ri=Math.max(0,ri-1);renderScene()};$('#nextScene').onclick=()=>{ri=Math.min(R.length-1,ri+1);renderScene()};renderScene();}

// v0.3 production world atlas
const W3=window.THRANTIR_WORLD_V03||{npcs:[],locations:[],unknowns:[]};
if($('#wbStats')){
 const refs=W3.locations.filter(x=>x.visual.includes('DISPONIBILE')).length;
 $('#wbStats').innerHTML=`<div class="stat"><b>${W3.locations.length}</b><span>luoghi catalogati</span></div><div class="stat"><b>${W3.npcs.length}</b><span>PNG/gruppi</span></div><div class="stat"><b>${refs}</b><span>reference luogo disponibili</span></div><div class="stat warn"><b>${W3.unknowns.length}</b><span>identità da confermare</span></div>`;
 $('#locationBuild').innerHTML=W3.locations.map(x=>`<article class="card buildCard"><div class="pad"><div class="buildHead"><span class="tag">${x.status}</span><span class="visualState">${x.visual}</span></div><h3>${x.name}</h3><p class="muted">${x.parent}</p><p>${x.description}</p>${x.features.map(f=>`<div class="fact">• ${f}</div>`).join('')}</div></article>`).join('');
 $('#npcBuild').innerHTML=W3.npcs.map(x=>`<article class="card buildCard npcCard"><img class="npcPortrait" src="${x.profile||''}" alt="${x.name}"><div class="pad"><div class="buildHead"><span class="tag ${x.status==='PROFILO PROVVISORIO'?'recon':'canon'}">${x.status}</span><span class="visualState">${x.visual}</span></div><h3>${x.name}</h3><p class="muted">${x.type} · ${x.place}</p><p>${x.role}</p>${x.known.map(f=>`<div class="fact">• ${f}</div>`).join('')}</div></article>`).join('');
 $('#unknownBuild').innerHTML=W3.unknowns.map(x=>`<div class="unknownRow"><b>${x.name}</b><span>${x.role}</span></div>`).join('');
}

// v0.4 mobile navigation
const mm=document.getElementById('mobileMenu'), sb=document.querySelector('.side');
// Mobile navigation is handled by the accessible menu listener below.

// v0.5 cinematic production database
const BP=window.BARD_PRODUCTION||{production:[],theories:[],pipeline:[]};
if($('#pipeline')){
 $('#pipeline').innerHTML=BP.pipeline.map(p=>`<div class="pipe ${p.state==='ATTIVO'||p.state==='IN CORSO'?'on':''}"><b>${p.phase}</b><div><strong>${p.name}</strong><span>${p.state}</span><p>${p.desc}</p></div></div>`).join('');
 $('#shotList').innerHTML=BP.production.map(s=>`<article class="shot"><div class="shotNo">${s.scene}</div><div class="shotBody"><div class="buildHead"><h3>${s.title}</h3><span class="tag">${s.status}</span></div><p><b>Ambiente:</b> ${s.environment}</p><p><b>Camera:</b> ${s.camera}</p><p><b>Atmosfera:</b> ${s.mood}</p><div class="assetChips">${s.assets.map(a=>`<span>${a}</span>`).join('')}</div></div></article>`).join('');
 $('#theoryGrid').innerHTML=BP.theories.map(t=>`<article class="card theory"><div class="pad"><span class="tag recon">${t.status}</span><h3>${t.title}</h3><p>${t.text}</p></div></article>`).join('');
}

// v0.6 session sheet
const LS=window.LUCIEN_SHEET||{}; let sheetLv=6;
function unknown(v){return v===null||v===undefined?'DA INSERIRE':v}
function renderSession(){
 const s=sheetLv===6?LS.bard6:LS.bard7, c=LS.combat||{};
 const used=+(localStorage.getItem('lucien_music_'+sheetLv)||0);
 const statHtml=(LS.stats||[]).map(x=>`<div class="stat"><b>${x.key}</b><strong>${unknown(x.value)}</strong></div>`).join('');
 const combat=[['PF',c.pf],['PF MAX',c.pf_max],['CA',c.ca],['INIZ.',c.iniziativa],['TEMPRA',c.tempra],['RIFLESSI',c.riflessi],['VOLONTÀ',c.volonta]].map(x=>`<div class="miniStat"><span>${x[0]}</span><b>${unknown(x[1])}</b></div>`).join('');
 $('#charSheet').innerHTML=`<div class="heroSheet card"><div><span class="eyebrow">BARDO PURO</span><h2>Lucien Vhaar</h2><p>Livello ${sheetLv} · BAB ${s.bab}</p></div><div class="stats">${statHtml}</div></div><div class="combatGrid">${combat}</div><div class="card pad"><div class="resourceHead"><h3>Musica bardica</h3><b><span id="musicUsed">${used}</span> / ${s.bardic_music_day} usi</b></div><div class="resourceBtns"><button onclick="musicDelta(1)">− 1 uso</button><button onclick="musicDelta(-1)">+ 1 uso</button><button onclick="musicReset()">Riposo / reset</button></div><div class="featureGrid">${s.features.map(f=>`<span>${f}</span>`).join('')}</div></div><div class="card pad"><h3>Progressione spell</h3><div class="spellProg">${Object.keys(s.spells_known).map(k=>`<div><b>${k}°</b><span>${s.spells_known[k]} conosciuti</span><small>${s.base_slots[k]===null?'DA VERIFICARE':s.base_slots[k]} slot base</small></div>`).join('')}</div><p class="muted">${s.note}</p></div>`;
 $('#spellbook').innerHTML=Object.keys(LS.spells).map(k=>`<div class="spellLevel card pad"><h3>Livello ${k}</h3>${LS.spells[k].length?LS.spells[k].map(x=>`<div>${x}</div>`).join(''):'<p class="muted">Scelte non disponibili: da copiare dalla scheda cartacea.</p>'}</div>`).join('');
}
window.musicDelta=d=>{let max=(sheetLv===6?LS.bard6:LS.bard7).bardic_music_day,k='lucien_music_'+sheetLv,v=+(localStorage.getItem(k)||0);v=Math.max(0,Math.min(max,v+d));localStorage.setItem(k,v);renderSession()}
window.musicReset=()=>{localStorage.setItem('lucien_music_'+sheetLv,0);renderSession()}
document.querySelectorAll('#levelSwitch button').forEach(b=>b.onclick=()=>{sheetLv=+b.dataset.lv;document.querySelectorAll('#levelSwitch button').forEach(x=>x.classList.toggle('active',x===b));renderSession()});
const sn=$('#sessionNotes'); if(sn){sn.value=localStorage.getItem('lucien_session_notes')||'';$('#saveNotes').onclick=()=>{localStorage.setItem('lucien_session_notes',sn.value);$('#savedMsg').textContent=' Salvato';setTimeout(()=>$('#savedMsg').textContent='',1200)}}
renderSession();

// v0.7 visual story
const VS=window.VISUAL_STORY||{events:[],assets:[]}; let vf='ALL';
function renderVisual(){
 let ev=VS.events.filter(e=>vf==='ALL'||e.focus===vf);
 $('#visualCount').innerHTML=`<b>${VS.events.length}</b><span>eventi mappati</span><b>${VS.assets.length}</b><span>asset censiti</span>`;
 $('#visualTimeline').innerHTML=ev.map((e,i)=>`<article class="visualEvent"><div class="vIndex">${e.id}</div><div class="vImage"><img src="${e.image}" alt=""></div><div class="vCopy"><div class="buildHead"><span class="tag">${e.focus}</span><span class="tag ${e.canon==='SITUAZIONE ATTUALE'?'current':''}">${e.canon}</span></div><h2>${e.title}</h2><small>${e.place}</small><p>${e.summary}</p></div></article>`).join('');
 $('#assetAtlas').innerHTML=VS.assets.map(a=>`<article class="assetCard"><img src="${a.path}" alt=""><div><b>${a.name}</b><small>${a.type}</small><span class="assetState ${a.state==='REFERENCE'?'ready':a.state==='TRASPARENTE'?'empty':'draft'}">${a.state}</span></div></article>`).join('');
}
document.querySelectorAll('.vf').forEach(b=>b.onclick=()=>{vf=b.dataset.filter;document.querySelectorAll('.vf').forEach(x=>x.classList.toggle('active',x===b));renderVisual()});renderVisual();

const W8=window.WORLDS_V08||{worlds:[],entities:[]};
function planetArt(id){return `<div class="planetArt ${id}"><div class="planetSphere"></div></div>`}
function renderWorlds(){let pg=document.querySelector('#planetGrid');if(!pg)return;pg.innerHTML=W8.worlds.map(w=>`<article class="planetCard" data-world="${w.id}">${planetArt(w.id)}<div><span class="tag">${w.certainty}</span><h2>${w.name}</h2><small>${w.origin}</small><p>${w.summary}</p></div></article>`).join('');document.querySelectorAll('.planetCard').forEach(x=>x.onclick=()=>showWorld(x.dataset.world));showWorld('oceano')}
function showWorld(id){let w=W8.worlds.find(x=>x.id===id),d=document.querySelector('#planetDetail');if(!w||!d)return;d.innerHTML=`<div class="worldDetail card"><div>${planetArt(w.id)}</div><div class="pad"><span class="eyebrow">PIANETA · ${w.certainty}</span><h2>${w.name}</h2><p>${w.summary}</p><h3>Canone recuperato</h3><ul>${w.facts.map(x=>`<li>${x}</li>`).join('')}</ul><h3>Direzione visuale</h3><p>${w.visual}</p></div></div>`}
renderWorlds();
const qs=document.querySelector('#quickSearch'),qi=document.querySelector('#qsInput'),qr=document.querySelector('#qsResults');let qItems=[],qSel=0;
function buildSearch(){let es=(window.VISUAL_STORY?.events||[]).map(e=>({name:e.title,type:'EVENTO · '+e.id,description:e.summary,view:'visual'})),as=(window.VISUAL_STORY?.assets||[]).map(a=>({name:a.name,type:'ASSET · '+a.type,description:a.state,view:'visual'}));qItems=[...W8.entities,...W8.worlds.map(w=>({name:w.name,type:'PIANETA',description:w.summary,view:'worlds'})),...es,...as]}
function openQS(seed=''){qs.classList.remove('hidden');qi.value=seed;qi.focus();searchNow()}function closeQS(){qs.classList.add('hidden');qi.blur()}
function searchNow(){let q=qi.value.trim().toLocaleLowerCase('it'),arr=q?qItems.filter(x=>(x.name+' '+x.type+' '+(x.description||'')).toLocaleLowerCase('it').includes(q)).slice(0,30):qItems.slice(0,12);qSel=0;qr.innerHTML=arr.map((x,i)=>`<button class="qsResult ${i===0?'sel':''}" data-view="${x.view||'visual'}"><b>${x.name}</b><span>${x.type}</span><small>${x.description||''}</small></button>`).join('')||'<p class="qsNone">Nessun risultato</p>';qr.querySelectorAll('.qsResult').forEach(b=>b.onclick=()=>goSearch(b))}
function goSearch(b){let v=b.dataset.view;closeQS();document.querySelector(`[data-view="${v}"]`)?.click()}
qi?.addEventListener('input',searchNow);
document.addEventListener('keydown',e=>{let editing=/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||'');if(qs.classList.contains('hidden')){if(e.key.length===1&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&!editing){e.preventDefault();openQS(e.key)}else if(e.key==='/'&&!editing){e.preventDefault();openQS()}}else{let rs=[...qr.querySelectorAll('.qsResult')];if(e.key==='Escape'){e.preventDefault();closeQS()}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();qSel=Math.max(0,Math.min(rs.length-1,qSel+(e.key==='ArrowDown'?1:-1)));rs.forEach((x,i)=>x.classList.toggle('sel',i===qSel));rs[qSel]?.scrollIntoView({block:'nearest'})}else if(e.key==='Enter'&&rs[qSel]){e.preventDefault();goSearch(rs[qSel])}}});buildSearch();

const SP=window.SCENE_PLAYER_V09||{scenes:[]};let spi=0,dlg=0,timer=null;
function renderScene09(){let sc=SP.scenes[spi];if(!sc)return;$('#sceneSelect').innerHTML=SP.scenes.map((x,i)=>`<option value="${i}" ${i===spi?'selected':''}>${x.id} · ${x.title}</option>`).join('');$('#stageBg').style.backgroundImage=`linear-gradient(#02060a44,#02060a88),url("${sc.bg}")`;$('#actors').innerHTML=sc.cast.map(a=>`<div class="actor" data-name="${a.name}" style="left:${a.x}%"><div class="actorBody"><img src="${a.img}"></div><span>${a.name}</span></div>`).join('');$('#sceneMeta').innerHTML=`<b>${sc.id} · ${sc.title}</b><span>${sc.place}</span><small>${sc.dialogue.length} battute</small>`;dlg=0;$('#speaker').textContent='';$('#line').textContent='';requestAnimationFrame(()=>document.querySelectorAll('.actor').forEach((a,i)=>setTimeout(()=>a.classList.add('in'),i*170)))}
function say09(){let sc=SP.scenes[spi];if(dlg>=sc.dialogue.length){clearTimeout(timer);document.querySelectorAll('.actor').forEach(a=>a.classList.remove('talking'));return}let d=sc.dialogue[dlg++];$('#speaker').textContent=d.speaker;$('#line').textContent=d.text;document.querySelectorAll('.actor').forEach(a=>a.classList.toggle('talking',a.dataset.name===d.speaker));timer=setTimeout(say09,Math.max(1800,Math.min(8000,d.text.length*58)))}
$('#playScene')?.addEventListener('click',()=>{clearTimeout(timer);dlg=0;say09()});$('#prevScene')?.addEventListener('click',()=>{spi=(spi-1+SP.scenes.length)%SP.scenes.length;renderScene09()});$('#nextScene')?.addEventListener('click',()=>{spi=(spi+1)%SP.scenes.length;renderScene09()});$('#sceneSelect')?.addEventListener('change',e=>{spi=+e.target.value;renderScene09()});document.querySelectorAll('[data-openworld]').forEach(b=>b.onclick=()=>{showWorld(b.dataset.openworld);document.querySelector('#planetDetail')?.scrollIntoView({behavior:'smooth'})});renderScene09();

// v0.9.1 consolidated Story UI
const S91=window.STORY_PLAYER_V092||{scenes:[]};let s91i=0,s91d=0,s91timer=null,s91paused=false;
function story91Render(){let s=S91.scenes[s91i];if(!s)return;document.querySelector('#storySceneSelect').innerHTML=S91.scenes.map((x,i)=>`<option value="${i}" ${i===s91i?'selected':''}>${x.id} · ${x.title}</option>`).join('');document.querySelector('#storyStageBg').style.backgroundImage=`linear-gradient(#02060a44,#02060a88),url("${s.bg}")`;document.querySelector('#storyActors').innerHTML=s.cast.map(a=>`<div class="actor in" data-name="${a.name}" style="left:${a.x}%"><div class="actorBody"><img src="${a.img}"></div><span>${a.name}</span></div>`).join('');document.querySelector('#storySceneMeta').innerHTML=`<b>${s.id} · ${s.title}</b><span>${s.place}</span><small>Fonte: ${s.source}</small>`;document.querySelector('#storySpeaker').textContent='';document.querySelector('#storyLine').textContent='Premi PLAY per iniziare.';s91d=0}
function story91StopVoice(){clearTimeout(s91timer);document.querySelectorAll('#storyActors .actor').forEach(a=>a.classList.remove('talking'))}
function story91Say(){if(s91paused)return;let s=S91.scenes[s91i];if(s91d>=s.dialogue.length){story91StopVoice();return}let d=s.dialogue[s91d++];document.querySelector('#storySpeaker').textContent=d.speaker;document.querySelector('#storyLine').textContent=d.text;document.querySelectorAll('#storyActors .actor').forEach(a=>a.classList.toggle('talking',a.dataset.name===d.speaker));let delay=Math.max(1800,Math.min(11000,d.text.length*58));s91timer=setTimeout(story91Say,delay)}
document.querySelector('#storyPlay')?.addEventListener('click',()=>{story91StopVoice();s91paused=false;s91d=0;story91Say()});document.querySelector('#storyPause')?.addEventListener('click',()=>{s91paused=!s91paused;if(s91paused)story91StopVoice();else story91Say()});document.querySelector('#storyPrev')?.addEventListener('click',()=>{story91StopVoice();s91i=(s91i-1+S91.scenes.length)%S91.scenes.length;story91Render()});document.querySelector('#storyNext')?.addEventListener('click',()=>{story91StopVoice();s91i=(s91i+1)%S91.scenes.length;story91Render()});document.querySelector('#storySceneSelect')?.addEventListener('change',e=>{story91StopVoice();s91i=+e.target.value;story91Render()});
document.querySelectorAll('[data-storymode]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-storymode]').forEach(x=>x.classList.toggle('active',x===b));document.querySelector('#storyTimelineMode').classList.toggle('hiddenMode',b.dataset.storymode!=='timeline');document.querySelector('#storyPlayerMode').classList.toggle('hiddenMode',b.dataset.storymode!=='player');document.querySelector('#storyLabMode')?.classList.toggle('hiddenMode',b.dataset.storymode!=='lab')}));
if(document.querySelector('#theoryGridMerged')&&window.BARD_PRODUCTION)document.querySelector('#theoryGridMerged').innerHTML=(window.BARD_PRODUCTION.theories||[]).map(t=>`<article class="card theory"><div class="pad"><span class="tag recon">${t.status}</span><h3>${t.title}</h3><p>${t.text}</p></div></article>`).join('');story91Render();

// v0.10 2.5D Scene Lab — independent actors, layers, camera and timed actions
const LAB_SCENES={
 cupola:{title:'Cupola 5 · vita quotidiana',bg:'assets/scenes/oceano/cupola5_stage.jpg',actor:'assets/characters/lucien_oceano_cutout.png',steps:[
  [0,'Lucien attraversa il distretto dei manutentori.'],[900,'walk',25],[3300,'walk',48],[5700,'look'],[6900,'Le strutture dell’Era Atomica continuano a funzionare sopra un villaggio ormai quasi medievale.'] ]},
 lv:{title:'LV-426 · il crollo',bg:'assets/scenes/oceano/lv426_stage.jpg',actor:'assets/characters/lucien_oceano_cutout.png',steps:[[0,'Lucien percorre LV-426 con i genitori.'],[700,'walk',30],[2700,'walk',48],[4700,'Le luci tremano. Qualcosa cede nella struttura.'],[5400,'collapse'],[6900,'hit'],[8200,'Il tunnel crolla. Lucien sarà l’unico superstite.']]},
 thrantir:{title:'Thrantir · Resheph benchmark',bg:'assets/worlds/thrantir_eye.svg',actor:'assets/characters/lucien_thrantir.png',steps:[[0,'Benchmark visuale: deserto, Occhio e Resheph.'],[800,'resheph'],[3300,'Il drone mantiene quota: nucleo e appendici sono animati internamente nell’SVG.'],[5700,'shadows'],[7600,'Le quattro ombre sono una firma visiva di Thrantir.']]}
};
let labKey='cupola',labTimers=[];
function labParticles(){const p=$('#labParticles');if(!p)return;p.innerHTML='';for(let i=0;i<34;i++){let e=document.createElement('i');e.className='labParticle';e.style.left=(Math.random()*100)+'%';e.style.top=(20+Math.random()*80)+'%';e.style.animationDuration=(5+Math.random()*9)+'s';e.style.animationDelay=(-Math.random()*8)+'s';p.appendChild(e)}}
function labTelemetry(){const s=LAB_SCENES[labKey];$('#labTelemetry').innerHTML=`<div><b>SCENA</b><span>${s.title}</span></div><div><b>RENDER</b><span>layer 2.5D + actor rig CSS</span></div><div><b>ATTORI</b><span>Lucien scontornato + NPC separati</span></div><div><b>STATO ASSET</b><span>rig prototipo · non 3D</span></div>`}
function labActors(k,s){if(k==='thrantir'){$('#labActors').innerHTML=`<div class="thrRef"><img src="assets/characters/lucien_thrantir.png"><span>LUCIEN · REFERENCE</span></div><div class="reshephRig" id="labResheph"><img src="assets/objects/resheph_animated.svg"></div><div class="fourShadows" id="fourShadows"><i></i><i></i><i></i><i></i></div>`;return}let parents=k==='lv'||k==='cupola';$('#labActors').innerHTML=`<div class="labPuppet" id="labLucien" style="left:18%"><div class="body" style="background-image:url('${s.actor}')"></div></div>${parents?'<div class="labNpc father" id="labFather" style="left:10%"></div><div class="labNpc mother" id="labMother" style="left:5%"></div>':''}`}
function labLoad(k){labTimers.forEach(clearTimeout);labTimers=[];labKey=k;let s=LAB_SCENES[k],st=$('#labStage');if(!st)return;st.className='labStage';$('#labFar').style.backgroundImage=`url("${s.bg}")`;$('#labMid').style.backgroundImage=`url("${s.bg}")`;labActors(k,s);$('#labTitle').textContent=s.title;$('#labCaption').textContent='Premi AVVIA SCENA.';labParticles();labTelemetry();labCamera(50)}
function labCamera(v){let n=(+v-50)/50,far=$('#labFar'),mid=$('#labMid');if(!far)return;far.style.transform=`scale(1.08) translateX(${n*-2.5}%)`;mid.style.transform=`scale(1.18) translateX(${n*-7}%)`;$('#labActors').style.transform=`translateX(${n*12}px)`}
function labDebris(){let p=$('#labParticles');for(let i=0;i<26;i++){let e=document.createElement('i');e.className='labDebris';e.style.left=(15+Math.random()*70)+'%';e.style.top=(-5+Math.random()*28)+'%';e.style.width=(4+Math.random()*18)+'px';e.style.height=(3+Math.random()*11)+'px';e.style.setProperty('--dx',(-100+Math.random()*200)+'px');e.style.animationDelay=(Math.random()*.35)+'s';p.appendChild(e)}}
function walkActor(actor,to,delay=0){if(!actor)return;setTimeout(()=>{actor.classList.add('walk');actor.style.left=to+'%';setTimeout(()=>actor.classList.remove('walk'),2250)},delay)}
function labAction(step){let [t,a,v]=step,actor=$('#labLucien'),st=$('#labStage');if(typeof a==='string'&&!['walk','look','collapse','hit','resheph','shadows'].includes(a)){$('#labCaption').textContent=a;return}if(a==='walk'){st.classList.add('actorWalk');walkActor(actor,v);walkActor($('#labFather'),Math.max(4,v-9),110);walkActor($('#labMother'),Math.max(2,v-17),220);setTimeout(()=>st.classList.remove('actorWalk'),2450)}if(a==='look'){actor.classList.add('look');$('#labCaption').textContent='Lucien osserva la cupola e l’oceano oltre la vetroceramica.'}if(a==='collapse'){st.classList.add('collapse');labDebris();$('#labCaption').textContent='LV-426 cede.'}if(a==='resheph'){let r=$('#labResheph');if(r)r.classList.add('active');$('#labCaption').textContent='Resheph: concept animato basato sui dati canonici.'}if(a==='shadows'){let q=$('#fourShadows');if(q)q.classList.add('active');$('#labCaption').textContent='Illuminazione multipla: quattro ombre divergenti.'}if(a==='hit'){actor.classList.add('hit');actor.style.left='61%';let f=$('#labFather'),m=$('#labMother');if(f)f.style.transform='rotate(18deg) translateY(20px)';if(m)m.style.transform='rotate(-14deg) translateY(24px)'}}
function labRun(){labLoad(labKey);let s=LAB_SCENES[labKey];s.steps.forEach(x=>labTimers.push(setTimeout(()=>labAction(x),x[0])))}
$('#labCupola')&&($('#labCupola').onclick=()=>labLoad('cupola'));$('#labLv')&&($('#labLv').onclick=()=>labLoad('lv'));$('#labThrantir')&&($('#labThrantir').onclick=()=>labLoad('thrantir'));$('#labRun')&&($('#labRun').onclick=labRun);$('#labReset')&&($('#labReset').onclick=()=>labLoad(labKey));$('#labCamera')&&($('#labCamera').oninput=e=>labCamera(e.target.value));labLoad('cupola');


// v0.16 Asset Bible — categorie, gallery e reference correnti
const AB12=window.ASSET_BIBLE_V012||{assets:[],scenes:[],priorities:[]};
let abFilter='ALL',abType='ALL',abQuery='';
function abAsset(id){return AB12.assets.find(a=>a.id===id)}
function abCategory(a){let t=(a.type||'').toUpperCase();if(t.startsWith('CREATURA'))return 'CREATURA';return t}
function esc16(v){return String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]))}
function abThumb(path,label,kind=''){return `<button class="abThumb ${kind}" type="button" data-zoom-src="${esc16(path)}" data-zoom-title="${esc16(label)}"><img src="${esc16(path)}" alt="${esc16(label)}"><span>${esc16(label)}</span></button>`}
function abMedia(a){
 if(a.id==='loox'&&a.timeline_states){let states=Object.values(a.timeline_states);return `<div class="looxStates">${states.map((st,i)=>`<section class="looxState"><header><b>${esc16(st.label)}</b><span>${i===0?'STATO INIZIALE':'STATO ATTUALE'}</span></header><div class="abMediaPair">${abThumb(st.original,'Originale · '+st.label,'source')}${abThumb(st.director,'Director · '+st.label,'director')}</div></section>`).join('')}</div>`}
 let primary=a.display_path||a.director_sheet||a.path;
 let thumbs=[];
 thumbs.push(abThumb(primary,a.director_sheet?'Director · corrente':'Reference · corrente',a.director_sheet?'director':'source'));
 if(a.path&&a.path!==primary)thumbs.push(abThumb(a.path,'Originale / sorgente','source'));
 if(a.archive_path)thumbs.push(abThumb(a.archive_path,'Archivio superato · NON corrente','archive'));
 (a.variants||[]).filter(v=>v!==primary&&v!==a.path&&v!==a.archive_path).forEach((v,i)=>thumbs.push(abThumb(v,'Variante '+(i+1),'source')));
 return `<div class="abMedia ${thumbs.length>1?'multi':''}">${thumbs.join('')}</div>`
}
function renderAssetBible(){
 const grid=document.getElementById('assetBibleGrid'); if(!grid)return;
 const filtered=AB12.assets.filter(a=>(abFilter==='ALL'||a.state===abFilter)&&(abType==='ALL'||abCategory(a)===abType)&&(!abQuery||(a.name+' '+a.type+' '+a.group+' '+a.note).toLowerCase().includes(abQuery)));
 grid.innerHTML=filtered.map(a=>`<article class="abCard ${a.id==='loox'?'looxCard':''}">${abMedia(a)}<div class="pad"><div class="abTop"><span class="tag">${esc16(a.type)}</span><span class="abState ${a.state}">${a.state}</span></div><h3>${esc16(a.name)}</h3><small>${esc16(a.group)}</small><p>${esc16(a.note)}</p>${a.director_status?`<div class="abDirectorStatus">DIRECTOR · ${esc16(a.director_status)}</div>`:''}</div></article>`).join('')||'<div class="card pad">Nessun asset corrisponde ai filtri.</div>';
 const ref=AB12.assets.filter(a=>a.state==='REFERENCE').length,con=AB12.assets.filter(a=>a.state==='CONCEPT').length,miss=AB12.assets.filter(a=>a.state==='MANCANTE').length;
 document.getElementById('assetBibleStats').innerHTML=`<div class="abStats"><div><b>${AB12.assets.length}</b><span>ASSET</span></div><div><b>${ref}</b><span>REFERENCE</span></div><div><b>${con}</b><span>CONCEPT</span></div><div><b>${miss}</b><span>MANCANTI</span></div></div>`;
 document.getElementById('sceneAudit').innerHTML=AB12.scenes.filter(s=>!abQuery||(s.title+' '+s.place+' '+s.summary).toLowerCase().includes(abQuery)||s.requirements.some(id=>(abAsset(id)?.name||'').toLowerCase().includes(abQuery))).map(s=>`<article class="auditRow"><div class="auditHead"><div><span class="tag">${s.id}</span><h3>${esc16(s.title)}</h3><small>${esc16(s.place)} · ${esc16(s.canon)}</small></div><div class="auditCounts">✓ ${s.ready} &nbsp; ◐ ${s.concept} &nbsp; ✕ ${s.missing}</div></div><p>${esc16(s.summary)}</p><div class="reqChips">${s.requirements.map(id=>{const a=abAsset(id);return `<span class="reqChip ${a?.state||'MANCANTE'}">${esc16(a?.name||id)}</span>`}).join('')}</div></article>`).join('');
 document.getElementById('assetPriorities').innerHTML=AB12.priorities.map((p,i)=>`<div class="priorityLine"><b>${i+1}.</b> ${esc16(p)}</div>`).join('');
}
const abs=document.getElementById('assetBibleSearch'),abst=document.getElementById('assetBibleState'),abty=document.getElementById('assetBibleType');
if(abs){abs.oninput=e=>{abQuery=e.target.value.trim().toLowerCase();renderAssetBible()};abst.onchange=e=>{abFilter=e.target.value;renderAssetBible()};abty.onchange=e=>{abType=e.target.value;renderAssetBible()};renderAssetBible()}

// v0.12.2 Director Reference Studio + Actor Engine contract
const REF_STUDIO={
 lucien_thrantir:{name:'Lucien Vhaar · Thrantir',src:'assets/characters/lucien_thrantir.png',sheet:'assets/references/director/lucien_thrantir_sheet.png',status:'APPROVATA',sourceLabel:'REFERENCE ORIGINALE'},
 xarion:{name:'Xarion Reed',src:'assets/characters/xarion_01.jpg',sheet:'assets/references/director/xarion_reed_sheet.png',status:'APPROVATA',sourceLabel:'REFERENCE ORIGINALE'},
 marcus:{name:'Marcus Shamrock',src:'assets/characters/marcus.jpg',sheet:'assets/references/director/marcus_sheet.png',status:'APPROVATA',sourceLabel:'REFERENCE ORIGINALE'},
 dregan:{name:'Dregan',src:'assets/characters/dregan.jpg',sheet:'assets/references/director/dregan_sheet.png',status:'APPROVATA',sourceLabel:'REFERENCE ORIGINALE'},
 vael:{name:'Fratello Vael',src:'assets/references/director/vael_sheet.png',sheet:'assets/references/director/vael_sheet.png',status:'APPROVATA · STELLA A 6 PUNTE',sourceLabel:'REFERENCE CORRENTE',archive:'assets/characters/vael.jpg'},
 loox_v01:{name:'Loox · v01 / Prime',src:'assets/characters/loox_prime.png',sheet:'assets/references/director/loox_v01_sheet.png',status:'APPROVATA · STATO INIZIALE',sourceLabel:'REFERENCE v01 / PRIME'},
 loox_v02:{name:'Loox · v02 / Overloaded',src:'assets/characters/loox_overloaded.png',sheet:'assets/references/director/loox_v02_sheet.png',status:'APPROVATA · STATO ATTUALE',sourceLabel:'REFERENCE v02 / OVERLOADED'}
};
let refPose='idle';
function renderRefStudio(){let sel=document.querySelector('#refCharacter');if(!sel)return;let r=REF_STUDIO[sel.value]||REF_STUDIO.lucien_thrantir;let oi=document.querySelector('#refOriginalImg'),ai=document.querySelector('#refApprovedImg'),ol=document.querySelector('#refOriginalLabel');oi.src=r.src;ai.src=r.sheet;oi.dataset.zoomSrc=r.src;oi.dataset.zoomTitle=r.name+' · '+r.sourceLabel;ai.dataset.zoomSrc=r.sheet;ai.dataset.zoomTitle=r.name+' · Tavola Director';if(ol)ol.textContent=r.sourceLabel;let idle=refPose==='idle';document.querySelector('#refSpecText').innerHTML=`<div class="refRule"><b>SOGGETTO</b><span>${r.name}</span></div><div class="refRule"><b>STATO</b><span>${r.status}</span></div><div class="refRule"><b>POSE</b><span>${idle?'Frontale neutra/idle = reference primaria Director':'T-pose = riferimento tecnico per rig/3D'}</span></div><div class="refRule"><b>CONTENUTO</b><span>Frontale, posteriore, profili, T-pose, ritratto, espressioni e dettagli visuali.</span></div><div class="refRule"><b>IDENTITÀ</b><span>${sel.value==='vael'?'La correzione del giocatore (stella a 6 punte) sostituisce la vecchia reference con occhio.':'La sorgente originale rimane l’autorità visiva; la tavola normalizzata è una derivazione approvata.'}</span></div>${r.archive?`<div class="refRule archiveRule"><b>ARCHIVIO</b><span>Vecchia reference con occhio conservata solo come storico; non usarla come visuale corrente.</span></div>`:''}<div class="refRule"><b>USO</b><span>${idle?'Director / FLUX / IPAdapter / identity reference':'Rigging, ricostruzione 3D e controllo proporzioni'}</span></div>`}
document.querySelector('#refCharacter')?.addEventListener('change',renderRefStudio);document.querySelectorAll('[data-refpose]').forEach(b=>b.addEventListener('click',()=>{refPose=b.dataset.refpose;document.querySelectorAll('[data-refpose]').forEach(x=>x.classList.toggle('active',x===b));renderRefStudio()}));renderRefStudio();

LAB_SCENES.actorengine={title:'Lucien · Actor Engine contract',bg:'assets/worlds/thrantir_eye.svg',actor:'assets/characters/lucien_thrantir.png',steps:[[0,'ACTOR ENGINE: idle.'],[900,'engineWalk',58],[4500,'engineStop'],[5600,'engineLook'],[6600,'engineTalk'],[9200,'engineWalk',78],[12600,'engineStop']]};
const _labActors122=labActors;labActors=function(k,s){if(k!=='actorengine')return _labActors122(k,s);document.querySelector('#labActors').innerHTML=`<div class="actorPath"></div><div class="actorEngineRig idle" id="actorEngineLucien" style="left:12%"><img src="${s.actor}"></div><div class="fourShadows active"><i></i><i></i><i></i><i></i></div><div class="actorContract"><b>ACTOR CONTRACT v1</b><span>idle → walk → stop → look/talk → walk</span><span>Lo spostamento è separato dallo stato dell'attore.</span><span>Questa reference NON possiede ancora un vero walk-cycle articolato.</span></div>`};
const _labAction122=labAction;labAction=function(step){let [t,a,v]=step;if(!String(a).startsWith('engine'))return _labAction122(step);let e=document.querySelector('#actorEngineLucien');if(!e)return;if(a==='engineWalk'){e.className='actorEngineRig walking';requestAnimationFrame(()=>e.style.left=v+'%');document.querySelector('#labCaption').textContent='WALK: locomozione e traslazione sono comandate separatamente.'}if(a==='engineStop'){e.className='actorEngineRig idle';document.querySelector('#labCaption').textContent='STOP → IDLE.'}if(a==='engineLook'){e.className='actorEngineRig idle look';document.querySelector('#labCaption').textContent='LOOK: orientamento/attenzione verso un punto scena.'}if(a==='engineTalk'){e.className='actorEngineRig idle talk';document.querySelector('#labCaption').textContent='TALK: contratto pronto; per volto/lip-sync reale serve un asset riggato.'}};
document.querySelector('#labActorEngine')?.addEventListener('click',()=>labLoad('actorengine'));

// v0.13 Actor Registry: identity is independent from render backend.
const ACTOR_REGISTRY={lucien:{label:'Lucien Vhaar',reference:'assets/references/director/lucien_thrantir_sheet.png',backend:'2D_REFERENCE',rig:null},xarion:{label:'Xarion Reed',reference:'assets/references/director/xarion_reed_sheet.png',backend:'REFERENCE_READY',rig:null},marcus:{label:'Marcus Shamrock',reference:'assets/references/director/marcus_sheet.png',backend:'REFERENCE_READY',rig:null},dregan:{label:'Dregan',reference:'assets/references/director/dregan_sheet.png',backend:'REFERENCE_READY',rig:null},vael:{label:'Fratello Vael',reference:'assets/references/director/vael_sheet.png',backend:'REFERENCE_READY',rig:null},loox:{label:'Loox',states:{v01:'assets/references/director/loox_v01_sheet.png',v02:'assets/references/director/loox_v02_sheet.png'},backend:'REFERENCE_READY',rig:null}};

// v0.14 Lucien Actor v1 — state machine + procedural gait benchmark.
LAB_SCENES.actorengine={title:'Lucien Actor v1 · locomotion benchmark',bg:'assets/worlds/thrantir_eye.svg',actor:'assets/characters/lucien_thrantir.png',steps:[[0,'v14Idle'],[1100,'v14Walk',54],[5000,'v14Stop'],[5900,'v14Look'],[7100,'v14Talk'],[9400,'v14Walk',78],[12800,'v14Stop']]};
const _labActors14=labActors;labActors=function(k,s){if(k!=='actorengine')return _labActors14(k,s);document.querySelector('#labActors').innerHTML=`<div class="actorV1Ground"><i></i><i></i><i></i></div><div class="actorV1Hud"><b>LUCIEN ACTOR v1</b><div class="meter"><i id="v14Meter"></i></div><span id="v14State">IDLE</span><small>Scheletro procedurale = movimento reale degli arti.</small><small>Ghost reference = identità/proporzioni, NON rig finale.</small><small>Backend futuro: GLB/3D quando il modello riggato sarà disponibile.</small></div><div class="actorV1 idle" id="actorV1" style="left:12%"><div class="identityGhost" style="background-image:url('${s.actor}')"></div><div class="skeleton"><i class="head"></i><i class="neck"></i><i class="torso"></i><i class="arm upperArm armL"></i><i class="arm upperArm armR"></i><i class="arm foreArm foreL"></i><i class="arm foreArm foreR"></i><i class="leg upperLeg legL"></i><i class="leg upperLeg legR"></i><i class="leg lowerLeg shinL"></i><i class="leg lowerLeg shinR"></i><i class="foot footL"></i><i class="foot footR"></i></div><span class="stateBadge">IDLE</span></div><div class="fourShadows active"><i></i><i></i><i></i><i></i></div>`};
const _labAction14=labAction;labAction=function(step){let [t,a,v]=step;if(!String(a).startsWith('v14'))return _labAction14(step);const e=document.querySelector('#actorV1'),cap=document.querySelector('#labCaption'),state=document.querySelector('#v14State'),badge=e?.querySelector('.stateBadge'),meter=document.querySelector('#v14Meter');if(!e)return;const set=(cls,label,txt)=>{e.className='actorV1 '+cls;state.textContent=label;badge.textContent=label;cap.textContent=txt};if(a==='v14Idle'){set('idle','IDLE','Actor v1: idle procedurale.');if(meter)meter.style.width='8%'}if(a==='v14Walk'){set('walk','WALK','WALK: braccia e gambe hanno un ciclo di passo indipendente dalla traslazione.');e.style.setProperty('--travel','3.4s');requestAnimationFrame(()=>e.style.left=v+'%');if(meter)meter.style.width=(v-5)+'%'}if(a==='v14Stop'){set('idle','STOP → IDLE','STOP: il ciclo di passo termina e l’attore torna in idle.')}if(a==='v14Look'){set('idle look','LOOK','LOOK: testa/orientamento cambiano senza muovere la posizione.')}if(a==='v14Talk'){set('idle talk','TALK','TALK: gesto e movimento testa; il lip-sync facciale richiederà il rig definitivo.')}};

// v0.14 mobile hotfix + debug rig visibility
(function(){
 const menu=document.getElementById('mobileMenu'), side=document.querySelector('.side');
 if(menu&&side){
   menu.setAttribute('aria-expanded','false');
   menu.setAttribute('aria-label','Apri menu delle sezioni');
   side.id='sectionMenu';menu.setAttribute('aria-controls','sectionMenu');
   document.addEventListener('click',ev=>{if(window.innerWidth<=760&&!side.contains(ev.target)&&!menu.contains(ev.target)){side.classList.remove('mobileOpen');menu.setAttribute('aria-expanded','false');}});
   menu.addEventListener('click',function(ev){ev.preventDefault(); const on=side.classList.toggle('mobileOpen'); menu.setAttribute('aria-expanded',String(on));});
   side.addEventListener('click',function(ev){if(ev.target.closest('.nav button') && window.innerWidth<=760){side.classList.remove('mobileOpen');menu.setAttribute('aria-expanded','false');}});
   document.addEventListener('keydown',function(ev){if(ev.key==='Escape'){side.classList.remove('mobileOpen');menu.setAttribute('aria-expanded','false');}});
 }
 const dbg=document.getElementById('labRigDebug'), stage=document.getElementById('labStage');
 if(dbg&&stage){dbg.addEventListener('click',function(){const on=stage.classList.toggle('debugRig');dbg.textContent='RIG DEBUG: '+(on?'ON':'OFF');dbg.setAttribute('aria-pressed',String(on));});}
})();

// v0.15 Lucien Actor v2 — articulated image rig from approved Director sheet.
LAB_SCENES.actorengine={title:'Lucien Actor v2 · articulated reference rig',bg:'assets/worlds/thrantir_eye.svg',actor:'assets/actors/lucien_v2/lucien_full.png',steps:[[0,'v15Idle'],[1200,'v15Walk',52],[5200,'v15Stop'],[6100,'v15Look'],[7300,'v15Talk'],[9800,'v15Walk',76],[13400,'v15Stop']]};
const _labActors15=labActors;labActors=function(k,s){if(k!=='actorengine')return _labActors15(k,s);document.querySelector('#labActors').innerHTML=`<div class="actorV2Hud"><b>LUCIEN ACTOR v2</b><span id="v15State">IDLE</span><small>Rig 2.5D derivato dalla tavola Director approvata.</small><small>Testa, torso, braccia e gambe sono layer articolati indipendenti.</small><small>RIG DEBUG mostra le articolazioni solo per diagnostica.</small></div><div class="lucienV2 idle" id="lucienV2" style="left:10%"><div class="v2part cape"></div><div class="v2part legBack"></div><div class="v2part armBack"></div><div class="v2part torso"></div><div class="v2part legFront"></div><div class="v2part armFront"></div><div class="v2part head"></div><div class="v2RigDebug"><i class="j headJ"></i><i class="j shoulderL"></i><i class="j shoulderR"></i><i class="j hipL"></i><i class="j hipR"></i></div></div><div class="fourShadows active v2shadows"><i></i><i></i><i></i><i></i></div>`;};
const _labAction15=labAction;labAction=function(step){let [t,a,v]=step;if(!String(a).startsWith('v15'))return _labAction15(step);const e=document.querySelector('#lucienV2'),cap=document.querySelector('#labCaption'),state=document.querySelector('#v15State');if(!e)return;const set=(cls,label,txt)=>{e.className='lucienV2 '+cls;state.textContent=label;cap.textContent=txt};if(a==='v15Idle')set('idle','IDLE','Lucien Actor v2: idle articolato sulla reference approvata.');if(a==='v15Walk'){set('walk','WALK','WALK: arti, torso e mantello hanno cicli separati; la traslazione resta indipendente.');e.style.setProperty('--travel','3.6s');requestAnimationFrame(()=>e.style.left=v+'%')}if(a==='v15Stop')set('idle','STOP → IDLE','STOP: arresto del passo e ritorno all’idle.');if(a==='v15Look')set('idle look','LOOK','LOOK: testa e busto orientano l’attenzione.');if(a==='v15Talk')set('idle talk','TALK','TALK: gesto del braccio e movimento testa; lip-sync fine rimandato al volto riggato/3D.');};

// v0.16 — WebGL runtime contract. No 2.5D actor fallback.
LAB_SCENES.actorengine={title:'Lucien · 3D Runtime / GLB contract',bg:'',actor:'assets/references/director/lucien_thrantir_sheet.png',steps:[[0,'v16Idle'],[1300,'v16Walk'],[4200,'v16Stop'],[5200,'v16Look'],[6500,'v16Talk'],[9000,'v16End']]};
let v16gl=null,v16raf=0;
function v16Shader(gl,type,src){let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s}
function v16InitCanvas(){
 const c=document.querySelector('#v16Canvas'); if(!c)return; const gl=c.getContext('webgl',{antialias:true,alpha:false}); if(!gl){document.querySelector('#v16Missing span').textContent='WebGL non disponibile su questo browser/dispositivo.';return}
 const vs=v16Shader(gl,gl.VERTEX_SHADER,'attribute vec2 p; varying vec2 uv; void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}');
 const fs=v16Shader(gl,gl.FRAGMENT_SHADER,'precision mediump float; varying vec2 uv; uniform float t; void main(){vec2 q=uv-.5; float d=length(q-vec2(.18,.23)); float ring=smoothstep(.125,.105,abs(d-.14)); float hole=1.-smoothstep(.12,.125,d); vec3 sky=mix(vec3(.015,.025,.045),vec3(.20,.105,.055),pow(1.-uv.y,2.)); float horizon=smoothstep(.46,.42,uv.y); sky=mix(sky,vec3(.16,.09,.045),horizon*.55); vec3 col=sky+ring*vec3(.65,.46,.20); col*=1.-hole*.94; float stars=step(.997,fract(sin(dot(floor(uv*vec2(190.,110.)),vec2(12.9898,78.233)))*43758.5453)); col+=stars*.22*(1.-horizon); gl_FragColor=vec4(col,1.);}');
 const pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.linkProgram(pr);gl.useProgram(pr);let b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);let a=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);let ut=gl.getUniformLocation(pr,'t');
 function draw(ms){let r=c.getBoundingClientRect(),w=Math.max(1,Math.floor(r.width*devicePixelRatio)),h=Math.max(1,Math.floor(r.height*devicePixelRatio));if(c.width!==w||c.height!==h){c.width=w;c.height=h;gl.viewport(0,0,w,h)}gl.uniform1f(ut,ms*.001);gl.drawArrays(gl.TRIANGLES,0,6);v16raf=requestAnimationFrame(draw)} cancelAnimationFrame(v16raf);v16gl=gl;v16raf=requestAnimationFrame(draw)
}
const _labActors16=labActors;labActors=function(k,s){if(k!=='actorengine')return _labActors16(k,s);document.querySelector('#labStage').classList.add('v16runtime');document.querySelector('#labActors').innerHTML=`<canvas id="v16Canvas" class="webgl16"></canvas><div class="v16Overlay"><div class="v16ModelStatus"><b>LUCIEN ACTOR v3</b><strong id="v16State">MODEL SLOT: EMPTY</strong><small>Runtime WebGL attivo. Il 2.5D è stato rimosso dalla scena normale.</small><small>Nessun attore sostitutivo: serve una vera mesh riggata.</small></div><div class="v16Missing" id="v16Missing"><b>GLB DI LUCIEN NON ANCORA DISPONIBILE</b><span>Reference pronta → mesh 3D → skeleton/skinning → animazioni → GLB.</span></div><div class="v16Contract"><b>CONTRATTO GLB</b><span>Humanoid skeleton + skinned mesh</span><span>Clip: Idle · Walk · Turn/Look · Talk/Gesture</span><span>Root motion disattivabile; piedi coerenti col terreno</span><span>Opzionale: morph blink / visemi</span><span>Scala: metri · Y-up · front: -Z</span></div><div class="v16Ref"><img src="${s.actor}"><em>REFERENCE · non renderizzata come attore</em></div></div>`;requestAnimationFrame(v16InitCanvas)};
const _labLoad16=labLoad;labLoad=function(k){let st=document.querySelector('#labStage');if(st)st.classList.remove('v16runtime');_labLoad16(k)};
const _labAction16=labAction;labAction=function(step){let [t,a]=step;if(!String(a).startsWith('v16'))return _labAction16(step);let state=document.querySelector('#v16State'),cap=document.querySelector('#labCaption');if(!state)return;const map={v16Idle:['IDLE REQUEST','State machine richiede clip Idle.'],v16Walk:['WALK REQUEST','State machine richiede Walk; nessuna PNG viene traslata.'],v16Stop:['STOP → IDLE','Blend Walk → Idle previsto dal runtime 3D.'],v16Look:['LOOK REQUEST','Turn/Look sarà applicato a skeleton/head target.'],v16Talk:['TALK REQUEST','Gesture + eventuali morph facciali/visemi.'],v16End:['RUNTIME READY','Contratto completato: manca soltanto il modello GLB riggato.']};let m=map[a];state.textContent=m[0];cap.textContent=m[1]};

const _labTelemetry16=labTelemetry; labTelemetry=function(){if(labKey!=='actorengine')return _labTelemetry16(); const e=document.querySelector('#labTelemetry'); if(e)e.innerHTML='<div><b>SCENA</b><span>Lucien Actor v3</span></div><div><b>RENDER</b><span>WebGL 3D runtime</span></div><div><b>MODELLO</b><span>GLB slot · vuoto</span></div><div><b>STATO</b><span>runtime pronto · mesh da produrre</span></div>';};


// v0.16 Bible image viewer — zoom/pan/pinch/fullscreen
(function(){
 const viewer=document.getElementById('imageViewer'),vp=document.getElementById('ivViewport'),img=document.getElementById('ivImage'),title=document.getElementById('ivTitle');if(!viewer||!vp||!img)return;
 let scale=1,minScale=.1,maxScale=8,x=0,y=0,pointers=new Map(),startDist=0,startScale=1,lastTap=0;
 function apply(){img.style.transform=`translate(-50%,-50%) translate(${x}px,${y}px) scale(${scale})`}
 function fit(){const vw=vp.clientWidth-30,vh=vp.clientHeight-30,iw=img.naturalWidth||1,ih=img.naturalHeight||1;scale=Math.min(vw/iw,vh/ih,1);x=0;y=0;apply()}
 function one(){scale=1;x=0;y=0;apply()}
 function setScale(ns,cx=vp.clientWidth/2,cy=vp.clientHeight/2){ns=Math.max(minScale,Math.min(maxScale,ns));const r=vp.getBoundingClientRect(),px=cx-r.left-vp.clientWidth/2,py=cy-r.top-vp.clientHeight/2,ratio=ns/scale;x=px-(px-x)*ratio;y=py-(py-y)*ratio;scale=ns;apply()}
 function open(src,label){if(!src)return;viewer.classList.add('show');viewer.setAttribute('aria-hidden','false');document.body.classList.add('viewerOpen');title.textContent=label||'Immagine';img.onload=fit;img.src=src}
 function close(){viewer.classList.remove('show');viewer.setAttribute('aria-hidden','true');document.body.classList.remove('viewerOpen');pointers.clear()}
 document.addEventListener('click',e=>{const t=e.target.closest('[data-zoom-src],.zoomableImage');if(!t)return;let src=t.dataset.zoomSrc||t.currentSrc||t.src,label=t.dataset.zoomTitle||t.alt||'Immagine';open(src,label)});
 document.getElementById('ivClose').onclick=close;document.getElementById('ivPlus').onclick=()=>setScale(scale*1.25);document.getElementById('ivMinus').onclick=()=>setScale(scale/1.25);document.getElementById('ivFit').onclick=fit;document.getElementById('iv100').onclick=one;
 document.getElementById('ivFull').onclick=()=>{if(!document.fullscreenElement)viewer.requestFullscreen?.();else document.exitFullscreen?.()};
 vp.addEventListener('wheel',e=>{e.preventDefault();setScale(scale*(e.deltaY<0?1.12:.89),e.clientX,e.clientY)},{passive:false});
 vp.addEventListener('pointerdown',e=>{vp.setPointerCapture?.(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,px:e.clientX,py:e.clientY});if(pointers.size===2){let q=[...pointers.values()];startDist=Math.hypot(q[0].x-q[1].x,q[0].y-q[1].y);startScale=scale}});
 vp.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;let p=pointers.get(e.pointerId);p.x=e.clientX;p.y=e.clientY;if(pointers.size===1){x+=p.x-p.px;y+=p.y-p.py;p.px=p.x;p.py=p.y;apply()}else if(pointers.size===2){let q=[...pointers.values()],d=Math.hypot(q[0].x-q[1].x,q[0].y-q[1].y);if(startDist)setScale(startScale*d/startDist,(q[0].x+q[1].x)/2,(q[0].y+q[1].y)/2);q.forEach(z=>{z.px=z.x;z.py=z.y})}});
 function up(e){pointers.delete(e.pointerId);if(pointers.size<2)startDist=0}vp.addEventListener('pointerup',up);vp.addEventListener('pointercancel',up);
 vp.addEventListener('dblclick',()=>scale>.98?fit():one());vp.addEventListener('touchend',e=>{let now=Date.now();if(now-lastTap<280){e.preventDefault();scale>.98?fit():one()}lastTap=now},{passive:false});
 viewer.addEventListener('click',e=>{if(e.target===viewer)close()});document.addEventListener('keydown',e=>{if(!viewer.classList.contains('show'))return;if(e.key==='Escape')close();if(e.key==='+')setScale(scale*1.25);if(e.key==='-')setScale(scale/1.25);if(e.key==='0')fit()});
 window.addEventListener('resize',()=>{if(viewer.classList.contains('show'))fit()});
})();

// v0.17 — Scene Engine, voice contract, Director bridge, Nostromo notes, project portability
(function(){
 const SE=window.SCENE_ENGINE_V017||{scenes:[],voice_characters:[]};
 const P17=window.PROJECT_V017||{};
 const $q=s=>document.querySelector(s);
 const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const jsonDownload=(name,obj)=>{const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)};
 const sceneImage=s=>s?.image||'assets/placeholders/place.svg';
 let seIndex=0,seQuery='',seChapter='ALL',seStratum='ALL',atlasFocus='strato01';
const STRATA=[
 {id:'strato01',code:'STRATO 01',title:'Oceano',subtitle:'Origini di Lucien Var',cover:'assets/covers/strato01_oceano.png',sceneIds:['BG01','BG02','BG03','BG04','BG05','BG06','BG07','BG08','BG09','BG10','BG11'],points:['Cupola 5, opere naniche e città sotto cupole di vetroceramica.','DAM, musica, vita di Lucien e perdita dei genitori dopo il crollo del tunnel LV-426.','Anni da Veleggiante tra moli abbandonati, surface world e improvvisazione tecnica.','Attacco dell’Orda e partenza d’emergenza da Oceano verso Thrantir.']},
 {id:'strato02',code:'STRATO 02',title:'Thrantir',subtitle:'Arrivo nel mondo dell’Occhio',cover:'assets/covers/strato02_thrantir.png',sceneIds:['S001','S002','S003','S004','S005','S006'],points:['Caduta su Thrantir e risveglio sui travois dei pellegrini.','Scoperta dell’Occhio del Creatore come buco nero visibile e dominante.','Linea Termica, sabbia, roccia e luci multiple che proiettano ombre diverse.','Ingresso a Itoigawa come primo contatto con il mondo desertico.']},
 {id:'strato03',code:'STRATO 03',title:'Itoigawa e il Ramo Discendente',subtitle:'Incontri, bevute e alleanze',cover:'assets/covers/strato03_itoigawa.png',sceneIds:['S007','S008','S009','S010','S011','S012','S013'],points:['Fagus, acqua razionata e primi nomi del nuovo contesto.','Il ginepro, il Ramo Discendente e la vita interna di Itoigawa.','Ingresso di Sable, Ivona, Orren e Dregan.','Formazione del gruppo e definizione del party principale.']},
 {id:'strato04',code:'STRATO 04',title:'Nostromo e rotta per Kethara',subtitle:'Vael, Resheph e il grande relitto',cover:'assets/covers/strato04_kethara.png',sceneIds:['N001','N002','C401','C402','C403','C404','C405','C406','C407','C408','C409','C410','C411','C412','C413','C414','C415','C416'],points:['Scoperta della Nostromo e di Loox, con nuovi sistemi e tecnologie.','Promiscuous Mode, falso messaggio religioso e reazione di Vael.','Resheph, segnali, minacce in arrivo e decisione di restare a bordo.','Abbording, resa dei superstiti e spoof finale per ingannare Kethara.']}
];
const STRATA_BY_SCENE=Object.fromEntries(STRATA.flatMap(st=>st.sceneIds.map(id=>[id,st.id])));
function stratumOfScene(id){const sid=STRATA_BY_SCENE[id];return STRATA.find(st=>st.id===sid)||null}
function renderSceneButton(s){const st=stratumOfScene(s.id);return `<button data-se-id="${esc(s.id)}" class="${SE.scenes[seIndex]?.id===s.id?'active':''}"><span>${esc(s.id)}</span><b>${esc(s.title)}</b><small>${esc(s.place)}${st?` · ${esc(st.code)}`:''}</small></button>`}
function bindSceneButtons(root){root.querySelectorAll('button[data-se-id]').forEach(b=>b.onclick=()=>{const i=SE.scenes.findIndex(s=>s.id===b.dataset.seId);if(i>=0){seIndex=i;const st=stratumOfScene(b.dataset.seId);if(st)atlasFocus=st.id;renderSceneEngine()}})}
 const chapters=[...new Set(SE.scenes.map(s=>s.chapter))];
 function productionPrompt(s){
  const cast=s.cast.length?s.cast.join(', '):'no cast explicitly resolved';
  return `Scene ${s.id}: ${s.title}. Location: ${s.place}. Canonical event: ${s.summary}. Cast: ${cast}. Camera direction: ${s.direction.camera}. Lighting direction: ${s.direction.lighting}. Preserve established character references and world bible. Do not add story events, dialogue, objects or locations not present in the canonical scene data. Cinematic previs for Director; visual direction is production metadata, not canon.`;
 }
 function filteredScenes(){const active=seStratum==='ALL'?null:STRATA.find(st=>st.id===seStratum);return SE.scenes.filter(s=>(seChapter==='ALL'||s.chapter===seChapter)&&(!seQuery||(s.id+' '+s.title+' '+s.place+' '+s.summary+' '+s.cast.join(' ')).toLowerCase().includes(seQuery))&&(!active||active.sceneIds.includes(s.id)))}
 function renderSceneList(){
 const el=$q('#seSceneList');if(!el)return;const list=filteredScenes();
 if(!list.length){el.innerHTML='<div class="seEmpty">Nessuna scena.</div>';return}
 if(seStratum==='ALL'&&!seQuery&&seChapter==='ALL'){
  el.innerHTML=STRATA.map(st=>{const group=list.filter(s=>st.sceneIds.includes(s.id));if(!group.length)return '';return `<div class="seGroupLabel"><b>${esc(st.code)}</b><span>${group.length} scene · ${esc(st.title)}</span></div>`+group.map(renderSceneButton).join('')}).join('');
 }else{
  const active=STRATA.find(st=>st.id===seStratum);
  const head=active?`<div class="seGroupLabel current"><b>${esc(active.code)}</b><span>${list.length} scene · ${esc(active.title)}</span></div>`:'';
  el.innerHTML=head+list.map(renderSceneButton).join('');
 }
 bindSceneButtons(el)
}
 function renderSceneEngine(){
  if(!SE.scenes.length||!$q('#storyEngineMode'))return;const s=SE.scenes[seIndex];
  $q('#seId').textContent=s.id+' · '+s.chapter;$q('#seTitle').textContent=s.title;$q('#seSummary').textContent=s.summary;
  const im=$q('#seImage');im.src=sceneImage(s);im.dataset.zoomSrc=sceneImage(s);im.dataset.zoomTitle=s.id+' · '+s.title;
  $q('#seFacts').innerHTML=`<div><b>LUOGO</b><span>${esc(s.place)}</span></div><div><b>FONTE</b><span>${esc(s.source)}</span></div><div><b>STATO</b><span>${esc(s.canon)}</span></div><div><b>FOCUS</b><span>${esc(s.focus||'—')}</span></div>`;
  $q('#seCamera').textContent=s.direction.camera;$q('#seLight').textContent=s.direction.lighting;$q('#seSound').textContent=s.direction.sound;
  $q('#seCast').innerHTML=s.cast.length?s.cast.map(x=>`<span>${esc(x)}</span>`).join(''):'<em>Cast non risolto / non necessario.</em>';
  $q('#seAssets').innerHTML=s.requirements.length?s.requirements.map(id=>{const a=(window.ASSET_BIBLE_V012?.assets||[]).find(x=>x.id===id);return `<span class="${a?.state||'MANCANTE'}">${esc(a?.name||id)} · ${esc(a?.state||'MANCANTE')}</span>`}).join(''):'<em>Nessun asset dedicato associato.</em>';
  $q('#seBeats').innerHTML=s.beats.map((b,i)=>`<div><i>${String(i+1).padStart(2,'0')}</i><span><b>${esc(b.type)}</b>${esc(b.label)}</span><small>${esc(b.canon)}</small></div>`).join('');
  $q('#seDialogue').innerHTML=s.dialogue.length?s.dialogue.map((d,i)=>`<div class="seLine"><span>${i+1}</span><div><b>${esc(d.speaker)}</b><p>${esc(d.text)}</p></div><small>${esc(d.kind)}</small></div>`).join(''):'<p class="muted">Nessun dialogo trascritto per questa scena. Non viene inventato.</p>';
  $q('#sePrompt').textContent=productionPrompt(s);
  renderStrataUI();
  $q('#seStats').innerHTML=`<div><b>${SE.scenes.length}</b><span>SCENE</span></div><div><b>${SE.scenes.reduce((n,x)=>n+x.dialogue.length,0)}</b><span>BATTUTE</span></div><div><b>${new Set(SE.scenes.flatMap(x=>x.cast)).size}</b><span>ATTORI</span></div>`;
  renderSceneList();localStorage.setItem('scene_engine_prefs_v017',JSON.stringify({scene:s.id,chapter:seChapter}));
 }
 function sceneDirectorPayload(s){return {schema:'director-scene-handoff-v1',project:'L\'Eschaton di Thrantir',scene_id:s.id,title:s.title,canonical:{place:s.place,summary:s.summary,source:s.source,dialogue:s.dialogue,cast:s.cast},production:{camera:s.direction.camera,lighting:s.direction.lighting,sound:s.direction.sound,beats:s.beats,prompt:productionPrompt(s)},assets:s.requirements,rule:'Production metadata may visualize canon but must not create new canonical events.'}}function renderChapterPointPanel(){
 const panel=$q('#chapterPointPanel');if(!panel)return;const st=STRATA.find(x=>x.id===atlasFocus)||STRATA[0];
 panel.innerHTML=`<div class="chapterPointHead"><div><span class="eyebrow">${esc(st.code)}</span><h3>${esc(st.title)}</h3><p>${esc(st.subtitle)} · ${st.sceneIds.length} scene collegate nello Scene Engine.</p></div><div class="chapterPointMeta"><span>Copertina pronta</span><span>${st.sceneIds[0]} → ${st.sceneIds[st.sceneIds.length-1]}</span></div></div><div class="pointGrid">${st.points.map((p,i)=>`<div class="pointItem"><b>PUNTO ${String(i+1).padStart(2,'0')}</b><p>${esc(p)}</p></div>`).join('')}</div><div class="chapterPointActions"><button id="atlasOpenEngine">Apri nello Scene Engine</button><button id="atlasShowAll">Mostra tutti gli strati</button></div>`;
 $q('#atlasOpenEngine')?.addEventListener('click',()=>{seStratum=st.id;document.querySelector('[data-storymode="engine"]')?.click();const i=SE.scenes.findIndex(s=>s.id===st.sceneIds[0]);if(i>=0)seIndex=i;renderSceneEngine()});
 $q('#atlasShowAll')?.addEventListener('click',()=>{seStratum='ALL';document.querySelector('[data-storymode="engine"]')?.click();renderSceneEngine()});
}
function renderChapterCovers(){
 const grid=$q('#chapterCoverGrid');if(!grid)return;
 grid.innerHTML=STRATA.map(st=>`<button class="chapterCover ${atlasFocus===st.id?'active':''}" data-stratum="${esc(st.id)}" type="button"><img src="${esc(st.cover)}" alt="${esc(st.code+' · '+st.title)}"><div class="overlay"><span class="eyebrow">${esc(st.code)}</span><b>${esc(st.title)}</b><small>${esc(st.subtitle)}</small><i>${st.sceneIds.length} scene</i></div></button>`).join('');
 grid.querySelectorAll('.chapterCover').forEach(btn=>btn.addEventListener('click',()=>{atlasFocus=btn.dataset.stratum;seStratum=btn.dataset.stratum;const st=STRATA.find(x=>x.id===btn.dataset.stratum);const i=SE.scenes.findIndex(s=>s.id===st.sceneIds[0]);if(i>=0)seIndex=i;renderChapterCovers();renderChapterPointPanel();document.querySelector('[data-storymode="engine"]')?.click();renderSceneEngine()}));
}
function renderStrataToolbar(){
 const el=$q('#strataToolbar');if(!el)return;
 el.innerHTML=`<button data-stratum="ALL" class="${seStratum==='ALL'?'active':''}">TUTTI GLI STRATI</button>`+STRATA.map(st=>`<button data-stratum="${esc(st.id)}" class="${seStratum===st.id?'active':''}">${esc(st.code)} · ${esc(st.title)}</button>`).join('');
 el.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{seStratum=btn.dataset.stratum;if(seStratum!=='ALL')atlasFocus=seStratum;if(seStratum!=='ALL'){const st=STRATA.find(x=>x.id===seStratum);const i=SE.scenes.findIndex(s=>s.id===st.sceneIds[0]);if(i>=0)seIndex=i;}renderChapterCovers();renderChapterPointPanel();renderSceneEngine()}));
}
function renderStrataUI(){renderChapterCovers();renderChapterPointPanel();renderStrataToolbar()}
 // Extend Story modes with Scene Engine.
 document.querySelectorAll('[data-storymode]').forEach(b=>b.addEventListener('click',()=>{const engine=b.dataset.storymode==='engine';$q('#storyEngineMode')?.classList.toggle('hiddenMode',!engine);if(!engine&&$q('#storyEngineMode'))$q('#storyEngineMode').classList.add('hiddenMode');if(engine)renderSceneEngine()}));
 const ch=$q('#seChapter');if(ch){ch.innerHTML='<option value="ALL">Tutti i capitoli</option>'+chapters.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');try{const pr=JSON.parse(localStorage.getItem('scene_engine_prefs_v017')||'{}');if(pr.chapter&&chapters.includes(pr.chapter)){seChapter=pr.chapter;ch.value=pr.chapter}if(pr.scene){const i=SE.scenes.findIndex(s=>s.id===pr.scene);if(i>=0)seIndex=i}}catch(e){}ch.onchange=e=>{seChapter=e.target.value;renderSceneList()}}
 $q('#seSearch')?.addEventListener('input',e=>{seQuery=e.target.value.trim().toLowerCase();renderSceneList()});
 $q('#sePrev')?.addEventListener('click',()=>{seIndex=(seIndex-1+SE.scenes.length)%SE.scenes.length;renderSceneEngine()});
 $q('#seNext')?.addEventListener('click',()=>{seIndex=(seIndex+1)%SE.scenes.length;renderSceneEngine()});
 $q('#seDirectorExport')?.addEventListener('click',()=>{const s=SE.scenes[seIndex];jsonDownload(`director_${s.id}_${s.title.replace(/[^a-z0-9]+/gi,'_')}.json`,sceneDirectorPayload(s))});
 $q('#seCopyPrompt')?.addEventListener('click',async()=>{const txt=productionPrompt(SE.scenes[seIndex]);try{await navigator.clipboard.writeText(txt);$q('#seCopyPrompt').textContent='Copiato ✓';setTimeout(()=>$q('#seCopyPrompt').textContent='Copia prompt produzione',1500)}catch(e){prompt('Copia il prompt:',txt)}});
 renderStrataUI();renderSceneEngine();

 // Thrantir visual contract card — authoritative project notes, not astrophysical explanation.
 const worlds=$q('#worlds');if(worlds&&!$q('#visualContract17')){const v=P17.thrantir_visual||{};const card=document.createElement('div');card.id='visualContract17';card.className='card pad visualContract17';card.innerHTML=`<span class="eyebrow">THRANTIR · CONTRATTO VISIVO</span><h2>Regole che ogni scena deve rispettare</h2><div class="contractGrid"><div><b>SUPERFICIE</b><span>${esc(v.surface)}</span></div><div><b>OCCHIO</b><span>${esc(v.eye)}</span></div><div><b>OMBRE</b><span>${esc(v.shadows)} ombre principali</span></div><div><b>LINEA TERMICA</b><span>${esc(v.thermal_line)}</span></div><div><b>TECNOLOGIA</b><span>${esc(v.technology)}</span></div></div>`;worlds.appendChild(card)}

 // Nostromo — scale, known areas and user-authored map notes.
 let shipScale=1,markerMode=false;const markerKey='nostromo_user_markers_v017';let markers=[];try{markers=JSON.parse(localStorage.getItem(markerKey)||'[]')}catch(e){markers=[]}
 function saveMarkers(){localStorage.setItem(markerKey,JSON.stringify(markers))}
 function renderMarkers(){const o=$q('#nostromoMarkers');if(!o)return;o.innerHTML=markers.map((m,i)=>`<button class="nostromoMarker" data-mi="${i}" style="left:${m.x}%;top:${m.y}%" title="${esc(m.text)}"><i>${i+1}</i><span>${esc(m.text)}</span></button>`).join('');o.querySelectorAll('.nostromoMarker').forEach(b=>b.onclick=e=>{e.stopPropagation();if(confirm('Eliminare questa nota dalla planimetria?')){markers.splice(+b.dataset.mi,1);saveMarkers();renderMarkers()}})}
 function setShipScale(v){shipScale=Math.max(.5,Math.min(3,v));const c=$q('#nostromoCanvas');if(c)c.style.width=(100*shipScale)+'%'}
 window.zoom=d=>setShipScale(shipScale+d);
 const ni=$q('#nostromoInfo');if(ni){const n=P17.nostromo||{};ni.innerHTML=`<div class="nostromoScale"><b>24–27 km</b><span>lunghezza della Nostromo</span></div><div><b>Aree conosciute</b><div class="engineChips">${(n.known_areas||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div><small>${esc(n.map_rule||'')}</small></div>`}
 $q('#nostromoFit')?.addEventListener('click',()=>setShipScale(1));
 $q('#nostromoAddMarker')?.addEventListener('click',e=>{markerMode=!markerMode;e.currentTarget.setAttribute('aria-pressed',String(markerMode));e.currentTarget.classList.toggle('active',markerMode);e.currentTarget.textContent=markerMode?'Tocca la mappa…':'＋ Nota sulla mappa'});
 $q('#nostromoCanvas')?.addEventListener('click',e=>{if(!markerMode||e.target.closest('.nostromoMarker'))return;const r=e.currentTarget.getBoundingClientRect();const text=prompt('Nota utente per questo punto della Nostromo:');if(!text)return;markers.push({x:+(((e.clientX-r.left)/r.width)*100).toFixed(2),y:+(((e.clientY-r.top)/r.height)*100).toFixed(2),text:text.trim()});saveMarkers();renderMarkers();markerMode=false;$q('#nostromoAddMarker').classList.remove('active');$q('#nostromoAddMarker').setAttribute('aria-pressed','false');$q('#nostromoAddMarker').textContent='＋ Nota sulla mappa'});
 $q('#nostromoClearMarkers')?.addEventListener('click',()=>{if(markers.length&&confirm('Eliminare tutte le note utente sulla Nostromo?')){markers=[];saveMarkers();renderMarkers()}});renderMarkers();setShipScale(1);

 // Project data portability.
 const storageKeys=P17.storage_keys||[];
 function projectSnapshot(){const values={};storageKeys.forEach(k=>values[k]=localStorage.getItem(k));return {schema:'diario-del-bardo-user-data-v1',app_version:'0.18.0',exported_at:new Date().toISOString(),values}}
 function status(msg){const e=$q('#projectDataStatus');if(e){e.textContent=msg;setTimeout(()=>{if(e.textContent===msg)e.textContent=''},3500)}}
 $q('#projectExport')?.addEventListener('click',()=>{jsonDownload('Diario_del_Bardo_user_data_v0.18.json',projectSnapshot());status('Backup esportato.')});
 $q('#projectImportBtn')?.addEventListener('click',()=>$q('#projectImportFile')?.click());
 $q('#projectImportFile')?.addEventListener('change',e=>{const file=e.target.files?.[0];if(!file)return;const fr=new FileReader();fr.onload=()=>{try{const obj=JSON.parse(fr.result);if(obj.schema!=='diario-del-bardo-user-data-v1'||!obj.values)throw new Error('schema');Object.entries(obj.values).forEach(([k,v])=>{if(storageKeys.includes(k)){if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}});status('Dati importati. Ricarico…');setTimeout(()=>location.reload(),700)}catch(err){alert('File dati non riconosciuto.')}};fr.readAsText(file)});
 $q('#projectResetLocal')?.addEventListener('click',()=>{if(!confirm('Azzerare note, contatori, voci, hotspot e preferenze locali del Diario?'))return;storageKeys.forEach(k=>localStorage.removeItem(k));status('Dati locali azzerati.');setTimeout(()=>location.reload(),700)});

 // Add active pipeline milestone without altering legacy data source.
 const pipe=$q('#pipeline');if(pipe&&!$q('#pipe17')){const d=document.createElement('div');d.id='pipe17';d.className='pipe on';d.innerHTML='<b>3.5</b><div><strong>Scene Engine</strong><span>ATTIVO · V0.17</span><p>42 scene con ID stabili, separazione canone/regia, voice contract, Director handoff ed export dati.</p></div>';pipe.appendChild(d)}
})();
