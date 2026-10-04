# Diario del Bardo v0.19.0


Milestone **Scene Engine** del companion offline di *L'Eschaton di Thrantir*.

## Principio della versione

Il progetto separa in modo esplicito:

- **CANONICO** — eventi, fatti e dialoghi derivati dai documenti della campagna o da correzioni esplicite del giocatore;
- **REGIA / PREVIS** — camera, luce, audio e rappresentazione cinematografica; non aggiungono fatti;
- **SCONOSCIUTO / MANCANTE** — dato o asset non disponibile, non riempito automaticamente;
- **NOTE UTENTE** — annotazioni personali e hotspot creati localmente.

## Novità v0.18

### Strati / Copertine

La sezione `Storia` è stata suddivisa in **4 strati visivi** con copertine dedicate:

- **Strato 01 · Oceano**
- **Strato 02 · Thrantir**
- **Strato 03 · Itoigawa e il Ramo Discendente**
- **Strato 04 · Nostromo e rotta per Kethara**

Ogni copertina apre il relativo blocco nello Scene Engine e mostra anche i punti chiave del capitolo.

## Novità v0.17

### Scene Engine v1

La sezione `Storia → Scene Engine` usa `data/scene_engine_v017.json` e la copia offline in `js/data.js`.

- 42 eventi ordinati dal background di Oceano alla situazione corrente;
- ID scena stabili tra storyboard, Director, futuro 3D e film export;
- fonte e stato canonico per scena;
- cast risolto quando documentato;
- dialoghi disponibili senza generare battute sostitutive;
- asset richiesti collegati alla Asset Bible;
- beat timeline;
- camera / luce / audio separati e marcati come regia;
- ricerca e filtro per capitolo;
- lettura TTS browser;
- export `director-scene-handoff-v1` per singola scena;
- prompt di produzione generato e chiaramente NON CANONICO.

### Voice Contract

Il Scene Engine permette di associare una voce Web Speech a ogni personaggio. Le associazioni vengono salvate in locale e possono essere migrate. In futuro gli stessi personaggi potranno usare un TTS locale senza modificare i dialoghi.

### Nostromo

La Nostromo è trattata come megastruttura lunga circa **24–27 km**. La sezione mostra le aree già note senza inventarne la posizione sulla planimetria.

È possibile creare hotspot personali sulla planimetria: sono sempre marcati come **NOTE UTENTE** e vengono salvati in `localStorage`.

### Thrantir Visual Contract

La sezione Mondi contiene un contratto visuale condiviso dalle future scene:

- superficie principalmente di sabbia e roccia;
- Occhio del Creatore sempre visibile, con disco/anelli di accrescimento molto evidenti;
- quattro direzioni principali d'ombra;
- Linea Termica netta;
- tecnologia dell'Era Atomica recuperata e riutilizzata.

### Project Data

In `Produzione → Project Data` è possibile esportare/importare un JSON con:

- note di sessione;
- contatori di musica bardica;
- mappa voci;
- hotspot Nostromo;
- preferenze Scene Engine.

Le immagini e i file canonici non vengono duplicati nel backup: la funzione serve a migrare i dati personali tra versioni del Diario.

## 3D

Il runtime WebGL della v0.16 rimane disponibile. Il vecchio falso attore 2.5D non è considerato una soluzione finale. Lo slot 3D di Lucien richiede ancora un vero GLB con mesh skinned, skeleton e clip di animazione.

Contratto previsto:

- `Idle`
- `Walk`
- `Turn/Look`
- `Talk/Gesture`
- root motion controllabile
- morph facciali / visemi opzionali

## File principali aggiunti

- `data/scene_engine_v017.json`
- `data/project_v017.json`

Il progetto resta completamente offline e apribile direttamente tramite `index.html` su Windows e browser Android compatibili con file locali.


## Reference Lock (v0.19 staging)

Gli asset principali approvati (Lucien, Marcus, Dregan, Xarion, Vael, Loox v01/v02 e le quattro copertine Capitolo 0–3) sono **immutabili**: il progetto li riusa direttamente e non li rigenera. Itoigawa è vincolata come piccola baraccopoli secca su una mesa, senza acqua libera visibile; Kethara non viene trasformata in una città canonica finché non viene osservata in gioco. Il manifest tecnico è `data/reference_lock_v019.json`.


## v0.19 · Riassunti cor Fischio / NPC Registry

- Nuova pagina `⚡ Riassunti cor Fischio`, ricavata dai cinque tab del documento Drive `Riassunto`.
- Due livelli: `Fischio` (ultra breve) e `Un filo più completo`, entrambi senza raccordi inventati.
- Il Codex mostra ora anche NPC già presenti nel progetto senza modificarne gli asset.
- Nuove identità vettoriali **provvisorie da validare dal master**: Otto von Sieg Hail, Capitano dei Figli, Estrella, Dott.ssa Elena Ripli.
- `reference_lock_v019.json` continua a essere vincolante: main character e copertine approvate non vengono sostituiti.
- Nuovi file sorgente: `data/riassunti_cor_fischio_v019.json` e `data/npc_registry_v019.json`.
