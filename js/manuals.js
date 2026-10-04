(()=>{
 const manuals=window.BARD_MANUALS;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const card=(title,text)=>`<article class="card pad manualCard"><h3>${title}</h3><p>${text}</p></article>`;
 const table=(head,rows)=>`<div class="manualTable"><table><thead><tr>${head.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 const ship=()=>`<h2>Ruoli durante il combattimento</h2><div class="manualCards">${[
  ['Pilota','Mantenimento ogni round: movimento, Pilotare Spelljammer su DES, CD 14. Successo: CA base 15. Fallimento: −3 CA nave e −2 ai tiri dal ponte. Evasione: CD 18, +2 CA e +1 Riflessi fino al turno successivo. La fonte descrive sia standard + movimento sia round completo.'],
  ['Tecnico dei sistemi di difesa','Standard, Sistemi Spelljammer CD 16; un modulo per round. Deflettori: 12 PF temporanei a nave ed equipaggio sul ponte per 1 round. Spinta: ritira un pilotaggio fallito o +6 m di velocità. Sfiato: occultamento 20% a bersaglio o settore alleato.'],
  ['Artigliere · Troika Eterica','Un operatore; standard per mirare e sparare. Attacco BAB + DES. Danni 4d6+4 energia/forza; ignora DR/durezza convenzionale di creature ed esterni. Incremento 30 m, massimo 150 m; arco 360° superiore e laterale.'],
  ['Fanteria e bolla d’aria','Bolla fino a 3 m oltre lo scafo: gravità verso il ponte. Nessuna penalità ambientale all’interno. Oltre la bolla, proiettili e magie con tiro a distanza concedono +2 CA al bersaglio; area, aggancio automatico e TS ignorano questa copertura.'],
  ['Inerzia senza controllo','Pilota incapacitato, in lotta o cloche abbandonata: CA nave 10, perdita di quota doppia; ogni round Riflessi CD 15 per non cadere proni. Mantenimento fallito: magie da 1 round richiedono Concentrazione CD 12 + livello incantesimo.'],
  ['Abbordaggio e salvataggio','Mischia contro creature su ponte, paratie e pennoni. Sul parapetto, critico o Spingere/Lotta: Riflessi CD danni/manovra; successo sul ponte prono, fallimento fuori dalla bolla. Una creatura espulsa mantiene l’inerzia per 1 round a 3–6 m; un alleato può recuperarla con standard. Dal secondo round: caduta libera o isolamento nel vuoto.']
 ].map(x=>card(...x)).join('')}</div><h2>Ophanim · Incrociatore di scorta</h2><p class="lead">Scheda del vascello descritto nel manuale. Questi valori non vengono assegnati automaticamente alla Nostromo.</p>${table(['Parametro','Valore'],[
 ['Categoria','Vascello eterico medio / incrociatore leggero'],['PS / durezza','120 / 120 · durezza 10'],['CA','15 (10 base −2 stazza + DES pilota) · sprovvista 13 · contatto 8'],['TS','Tempra +8 · Riflessi del pilota · Volontà N/A'],['Movimento','Manovrabilità media · 18 m / 12 quadretti · eterica 100 km/h su Thrantir'],['Scafo','24 × 6 × 4,5 m'],['Equipaggio / carico','Minimo 2 (pilota + cannoniere) · standard 6–8 · massimo 15 t'],['Aria','8 creature per 120 giorni prima di diventare stantia'],['Console pilota','30 PS · durezza 5'],['Terminale deflettori','25 PS · durezza 5'],['Troika centrale','40 PS · durezza 8']
 ])}`;
 const guns=()=>`<h2>Armi del party</h2><p class="lead">Attacco: 1d20 + bonus dominante di classe. Nessun BAB, competenza o crescita col livello. Per Lucien/Bardo si usa DES. Sparare sulla difensiva non concede CA.</p>${table(['Arma / personaggio','Danno','Gittata massima','Capacità / ricarica','Opzioni'],[
 ['AK-47 · Dregan','2d8 perforante','120 piedi · fasce 40 / 80 / 120','30 colpi · movimento','Raffica solo corta: 3 colpi, +2 al tiro, 3d8. Un attacco singolo o raffica per round. Naturale 1: inceppamento, azione intera per sbloccare.'],
 ['Remington 870 · Marcus','2d6 perforante','60 piedi · fasce 20 / 40 / 60','7 colpi · movimento per 1, intera per 3','Cono entro 15 piedi / 60°: 3d6, tiro separato per bersaglio. Lunga: 1d6.'],
 ['Voltek Mag-9 / Kinetix · Xarion','2d6 forza','90 piedi · fasce 30 / 60 / 90','12 celle · movimento','Ignora CA da armatura fisica. Guanti conduttivi: +1d4 e ignorano resistenza fisica.'],
 ['Coil-Pistol M-400 / Pulsefire · Lucien','1d10 elettrico','60 piedi · fasce 20 / 40 / 60','8 colpi · azione intera','Armatura metallica: Riflessi CD 13 o stordimento 1 round (−2 CA / tiri). Caricato: 2 colpi, 2d10 e stordimento automatico; 1 round di carica con movimento.']
 ])}<div class="manualCards">${[
 ['Distanza e copertura','Corta (fino a ⅓): +0 CA; media (⅓–⅔): +2 CA; lunga (oltre ⅔): +4 CA. Copertura parziale +2, totale +4 aggiuntivi; scudo +0. Il 20 naturale ignora i bonus di copertura.'],
 ['Localizzazione sul d20 puro','Dopo un colpo che supera la CA: 1–5 striscio, metà danno; 6–10 gambe, danno pieno e −2 DES; 11–15 braccia, danno pieno e −2 FOR; 16–19 torso, Tempra CD 13 o −1 PF/round; 20 testa/cuore, danno doppio e −2 COS.'],
 ['Durata e cure','−2 DES/FOR fino a fine scontro o cure ordinarie. −2 COS: cura magica di livello 3+ oppure riposo almeno 24 ore. Emorragia: azione di cura o Medicina CD 10 da un alleato.'],
 ['Zona dichiarata · opzionale','Dichiarare prima del tiro. Occorre superare la CA e avere il d20 nel range della zona, altrimenti il colpo manca. La tabella della fonte indica però che il 20 colpisce la zona dichiarata senza upgrade a critico: l’eccezione va confermata dal master.'],
 ['Bonus dominante per classe','Guerriero / Barbaro: FOR; Ladro / Ranger / Bardo: DES; Mago / Stregone: INT; Chierico / Druido: SAG; Warlock: CAR. Paladino compare sia nella riga FOR sia in quella CAR: scelta da confermare con il master.']
 ].map(x=>card(...x)).join('')}</div>`;
 let active=0;
 function render(){
  const query=document.querySelector('#manualSearch').value.trim().toLocaleLowerCase('it');
  document.querySelector('#manualQuick').innerHTML=query?'':active?guns():ship();
  document.querySelector('#manualDocuments').innerHTML=manuals.map((m,i)=>{
   if(query&&!m.text.toLocaleLowerCase('it').includes(query))return '';
   if(!query&&i!==active)return '';
   return `<article class="card pad manualDocument"><h2>${esc(m.title)}</h2><p><a href="${esc(m.url)}" target="_blank" rel="noopener">Apri il manuale originale</a> · aggiornato il 4 ottobre 2026</p><details ${query?'open':''}><summary>Testo completo del manuale</summary><div class="manualSource">${esc(m.text)}</div></details></article>`;
  }).join('')||'<p>Nessuna regola trovata nei due manuali.</p>';
 }
 document.querySelectorAll('[data-manual]').forEach(b=>b.onclick=()=>{active=Number(b.dataset.manual);document.querySelector('#manualSearch').value='';document.querySelectorAll('[data-manual]').forEach(x=>x.classList.toggle('active',x===b));render()});
 document.querySelector('#manualSearch').addEventListener('input',render);render();
 for(const id of ['session','nostromo']){
  const link=document.createElement('button');link.textContent=id==='session'?'Armi del party · Manuali':'Ruoli di bordo · Manuali';
  link.onclick=()=>{active=id==='session'?1:0;document.querySelector(`[data-manual="${active}"]`).click();nav('manuals')};
  document.querySelector('#'+id+' .lead').after(link);
 }
})();
