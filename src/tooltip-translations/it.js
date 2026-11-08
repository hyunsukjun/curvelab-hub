export default {
  "source.source-pen": "Modifica i punti di volume nella forma d’onda sorgente e i punti delle curve nel Lab. Fai di nuovo clic per tornare alla selezione audio.",
  "source.source-eraser": "Rimuovi un punto di volume o della curva. Le regioni audio restano intatte.",
  "source.zoom-out": "Mostra una porzione più ampia della forma d’onda sorgente.",
  "source.zoom-in": "Mostra in maggiore dettaglio una porzione più piccola della forma d’onda sorgente.",
  "source.zoom-fit": "Mostra l’intera forma d’onda sorgente.",
  "source.undo-edit": "Annulla l’ultima modifica alla sorgente.",
  "source.redo-edit": "Ripristina l’ultima modifica annullata alla sorgente.",
  "source.volume-reset": "Riporta a 0 dB l’inviluppo del volume della sorgente.",
  "source.delete": "Elimina l’audio selezionato e unisci le parti rimanenti.",
  "tab.audio": "Modella velocità di riproduzione, intonazione e panoramica stereo.",
  "tab.timbre": "Modella il timbro con filtri e una catena di effetti.",
  "tab.space": "Sposta il suono nello spazio e modella distanza e riverbero.",
  "tab.granular": "Crea un suono a partire da brevi grani dell’audio sorgente.",
  "tab.spectral": "Trasforma il contenuto in frequenza dell’audio sorgente.",
  "tab.oscillator": "Risintetizza un file o genera un suono con oscillatori, con risposta all’impulso facoltativa.",
  "tab.handoff": "Cambiando Lab, il risultato corrente viene salvato come passaggio.",
  "lab.clearCurrent": "Ripristina i valori predefiniti della curva selezionata.",
  "audio.resetButton": "Ripristina le curve predefinite di velocità, intonazione e panoramica.",
  "audio.stretchHelp": [
    "Velocità · da −2× a +2×",
    "Modifica la velocità di riproduzione della sorgente. I valori negativi invertono la riproduzione e zero blocca la posizione nella sorgente."
  ],
  "audio.pitchHelp": [
    "Intonazione · da −2400 a +2400 cent",
    "Abbassa o alza l’intonazione di un massimo di due ottave. 1200 cent = un’ottava."
  ],
  "audio.panHelp": [
    "Panoramica · sinistra / destra",
    "Sposta il suono nel campo stereo. Alto = sinistra · centro = centro · basso = destra."
  ],
  "timbre.resetButton": "Ripristina tutte le curve predefinite, disattiva tutti gli effetti e svuota la catena.",
  "timbre.lowpassModeHelp": [
    "Passa-basso · 40 Hz–18 kHz",
    "Imposta la frequenza di taglio. Il filtro attenua le frequenze superiori. Con frequenze di campionamento inferiori si riduce il limite superiore."
  ],
  "timbre.highpassModeHelp": [
    "Passa-alto · 40 Hz–18 kHz",
    "Imposta la frequenza di taglio. Il filtro attenua le frequenze inferiori. Con frequenze di campionamento inferiori si riduce il limite superiore."
  ],
  "timbre.bandpassModeHelp": [
    "Passa-banda",
    "Mantieni una banda intorno alla frequenza centrale. Regola separatamente frequenza centrale e larghezza."
  ],
  "timbre.combModeHelp": [
    "Filtro a pettine",
    "Combina l’originale con un segnale ritardato e ricircolato per un filtraggio a pettine risonante."
  ],
  "timbre.flangerModeHelp": [
    "Flanger",
    "Modula un breve ritardo per spostare le attenuazioni del filtro a pettine. Regola ritardo, profondità, velocità, feedback e mix."
  ],
  "timbre.chorusModeHelp": [
    "Chorus",
    "Modula voci ritardate per rendere il suono più corposo. Regola ritardo, profondità, velocità e mix."
  ],
  "timbre.delayModeHelp": [
    "Delay",
    "Crea echi ripetuti. Regola il tempo di ritardo, il feedback e il mix."
  ],
  "timbre.bandpassCenterParamHelp": [
    "Frequenza centrale · 40 Hz–18 kHz",
    "Sposta il centro del filtro passa-banda. Con frequenze di campionamento inferiori si riduce il limite superiore."
  ],
  "timbre.bandpassWidthParamHelp": [
    "Larghezza · 0–100%",
    "Allarga la banda passante. 0% è stretto (Q 12), 100% è ampio (Q 0,5). Il filtro resta attivo a ogni larghezza."
  ],
  "timbre.combDelayParamHelp": [
    "Ritardo del filtro a pettine · 0,5–100 ms",
    "Imposta il ritardo che determina la distanza tra le risonanze del filtro."
  ],
  "timbre.combFeedbackParamHelp": [
    "Feedback del filtro a pettine · 0–0,95",
    "Reinvia parte del segnale ritardato nella linea di ritardo. Valori maggiori prolungano le risonanze."
  ],
  "timbre.combMixParamHelp": [
    "Quantità del filtro a pettine · 0–100%",
    "0% corrisponde al segnale originale. 100% corrisponde al segnale filtrato, che include il suono originale e quello ritardato."
  ],
  "timbre.flangerDelayParamHelp": [
    "Ritardo del flanger · 0,5–10 ms",
    "Imposta il ritardo centrale della modulazione."
  ],
  "timbre.flangerDepthParamHelp": [
    "Profondità del flanger · 0–10 ms",
    "Profondità di modulazione richiesta. Quella effettiva è limitata al ritardo meno 0,25 ms."
  ],
  "timbre.flangerRateParamHelp": [
    "Velocità del flanger · 0,02–5 Hz",
    "Imposta il numero di cicli di modulazione al secondo."
  ],
  "timbre.flangerFeedbackParamHelp": [
    "Feedback del flanger · 0–0,85",
    "Ricircola il segnale ritardato per rafforzare le risonanze della modulazione."
  ],
  "timbre.flangerMixParamHelp": [
    "Mix del flanger · 0–100%",
    "Bilancia il suono originale e quello ritardato. 0% = originale, 100% = solo effetto."
  ],
  "timbre.chorusDelayParamHelp": [
    "Ritardo del chorus · 10–35 ms",
    "Imposta il ritardo di base delle voci del chorus."
  ],
  "timbre.chorusDepthParamHelp": [
    "Profondità del chorus · 0–20 ms",
    "Profondità di modulazione richiesta. Quella effettiva è limitata al ritardo meno 5 ms."
  ],
  "timbre.chorusRateParamHelp": [
    "Velocità del chorus · 0,02–3 Hz",
    "Imposta la velocità di modulazione del chorus in cicli al secondo."
  ],
  "timbre.chorusMixParamHelp": [
    "Mix del chorus · 0–100%",
    "Bilancia il suono originale e il chorus. 0% = originale, 100% = solo effetto."
  ],
  "timbre.delayTimeParamHelp": [
    "Tempo di ritardo · 100 ms–1,5 s",
    "Imposta l’intervallo tra gli echi."
  ],
  "timbre.delayFeedbackParamHelp": [
    "Feedback del delay · 0–0,85",
    "Imposta quanto segnale ritardato viene reinviato per generare le ripetizioni."
  ],
  "timbre.delayMixParamHelp": [
    "Mix del delay · 0–100%",
    "Bilancia il suono originale e gli echi. 0% = originale, 100% = solo effetto."
  ],
  "space.resetButton": "Ripristina tutte le curve, attiva Direzione, disattiva Distanza e Riverbero e imposta il decadimento a 1,2 s.",
  "space.reverbDecay": "Imposta il tempo di decadimento del riverbero tra 0,3 e 4 s.",
  "space.directionModeHelp": [
    "Direzione · da −1800° a +1800°",
    "Sposta il suono intorno all’ascoltatore. Positivo = senso orario, negativo = senso antiorario. 360° corrispondono a un giro completo."
  ],
  "space.distanceModeHelp": [
    "Distanza · 0–1",
    "Passa da vicino (0) a lontano (1), variando livello, filtraggio e impressione spaziale. La distanza non è calibrata in metri."
  ],
  "space.reverbModeHelp": [
    "Quantità di riverbero · 0–100%",
    "Disegna quanto suono inviare al riverbero. Il decadimento si regola a parte da 0,3 a 4 s. La coda termina alla fine del file."
  ],
  "granular.resetButton": "Ripristina tutte le curve predefinite e riporta la finestra sorgente alla lunghezza minima all’inizio.",
  "granular.positionModeHelp": [
    "Posizione di lettura · 0–100% della finestra sorgente",
    "Scegli dove iniziano i grani nella finestra sorgente selezionata. La posizione di riproduzione dell’uscita non cambia."
  ],
  "granular.spreadModeHelp": [
    "Dispersione · 0–100%",
    "Distribuisci casualmente le posizioni di lettura dei grani intorno alla posizione scelta, nella finestra sorgente selezionata."
  ],
  "granular.sizeModeHelp": [
    "Dimensione dei grani · 5–1000 ms",
    "Imposta la durata richiesta. I grani possono essere più brevi per restare nella finestra sorgente all’intonazione corrente."
  ],
  "granular.densityModeHelp": [
    "Densità · 1–80 grani/s",
    "Imposta il numero di nuovi grani al secondo. L’anteprima limita i grani attivi a 64, o a 32 con densità o dimensioni elevate, con brevi dissolvenze. Il rendering offline elabora tutti i grani programmati."
  ],
  "granular.pitchLowModeHelp": [
    "Intonazione minima · da −24 a +24 semitoni",
    "Imposta un estremo dell’intervallo di intonazione casuale. Se il limite inferiore supera quello superiore, vengono scambiati."
  ],
  "granular.pitchHighModeHelp": [
    "Intonazione massima · da −24 a +24 semitoni",
    "Imposta l’altro estremo dell’intervallo di intonazione casuale. 12 semitoni = un’ottava. L’intonazione cambia anche la velocità di lettura dei grani."
  ],
  "spectral.resetButton": "Ripristina i valori predefiniti di tutte le curve spettrali.",
  "spectral.shiftModeHelp": [
    "Traslazione spettrale · da −2000 a +2000 Hz",
    "Sposta le frequenze spettrali di un valore fisso in hertz. A 0 Hz le posizioni restano invariate."
  ],
  "spectral.stretchModeHelp": [
    "Dilatazione spettrale · 0,5–2",
    "Comprimi o dilata le distanze tra le frequenze intorno a 1 kHz. 1 è neutro. Velocità di riproduzione e durata del file restano invariate."
  ],
  "spectral.blurModeHelp": [
    "Sfocatura spettrale · 0–100%",
    "Attenua le variazioni dello spettro nel tempo. 0% è neutro. Posizioni delle frequenze e durata del file restano invariate."
  ],
  "spectral.harmonicityModeHelp": [
    "Armonicità · da −100% a +100%",
    "Modella i rapporti tra i picchi. Valori negativi li rendono più armonici, quelli positivi più inarmonici. 0% è neutro."
  ],
  "spectral.freezeModeHelp": [
    "Congelamento spettrale · 0–100%",
    "Mantieni uno stato spettrale catturato. 0% è spento, 100% lo mantiene del tutto. La durata del file non cambia."
  ],
  "oscillator.resetButton": "Ripristina tutte le curve predefinite della modalità di sintesi corrente.",
  "oscillator.resynthesisMode": "Analizza l’audio di lavoro e ricostruisci lo spettro con le parziali.",
  "oscillator.convolutionButton": "Genera un suono con oscillatori e modellalo, se vuoi, usando un file come risposta all’impulso.",
  "oscillator.sine": "Usa un’onda sinusoidale per gli oscillatori.",
  "oscillator.triangle": "Usa un’onda triangolare per gli oscillatori.",
  "oscillator.saw": "Usa un’onda a dente di sega per gli oscillatori.",
  "oscillator.square": "Usa un’onda quadra per gli oscillatori.",
  "oscillator.countSelect": "Scegli il numero di oscillatori.",
  "oscillator.stackSelect": "Scegli come disporre le frequenze degli oscillatori rispetto alla frequenza di base.",
  "oscillator.modulationSelect": "Scegli FM, AM o modulazione ad anello, oppure disattiva la modulazione.",
  "oscillator.modulationRatioInput": "Imposta la frequenza del modulatore come multiplo di quella di ciascun oscillatore.",
  "oscillator.partialCountSelect": "Scegli fino a 32 o 64 parziali per la risintesi.",
  "oscillator.convolutionWet": "Bilancia il suono diretto degli oscillatori e quello elaborato dalla risposta all’impulso.",
  "oscillator.impulseLength": "Imposta la porzione di risposta all’impulso da usare. I file di durata inferiore a 3 s sono usati per intero.",
  "oscillator.basePitchModeHelp": [
    "Frequenza di base · 20–4000 Hz",
    "Imposta la frequenza di base del gruppo di oscillatori oppure trasponi le parziali analizzate in Risintesi da file."
  ],
  "oscillator.deviationModeHelp": [
    "Deviazione · Dipende da sorgente e disposizione",
    "All’unisono le voci si scostano di un massimo di ±50 cent. Le altre disposizioni e la risintesi da file alterano i rapporti tra le parziali di un valore tra 0 e 0,38. Zero mantiene la disposizione originale."
  ],
  "oscillator.slopeModeHelp": [
    "Pendenza spettrale · da −24 a +12 dB/ott",
    "Varia i livelli delle voci o delle parziali in base alla frequenza rispetto alla base. I valori negativi favoriscono le frequenze basse, i positivi quelle alte."
  ],
  "oscillator.modulationCurveModeHelp": [
    "Intensità di modulazione · FM / AM / anello",
    "La FM usa un indice tra 0 e 4. Profondità AM e mix della modulazione ad anello vanno da 0 a 100%. La curva segue la modalità selezionata."
  ],
  "state.active": "Attivo",
  "state.bypassed": "In bypass",
  "state.on": "Attivo · Fai clic per disattivare",
  "state.off": "Disattivo · Fai clic per attivare e modificare",
  "hub.info": "Scorciatoie e formati supportati.",
  "hub.openAudio": "Apri un file audio come sorgente di lavoro.",
  "hub.export": "Scarica il passaggio salvato selezionato in formato WAV. Le modifiche non salvate sono escluse.",
  "hub.original": "Ripristina l’audio originale.",
  "hub.grainSource": "Il mix mono usa il 50% del canale sinistro e il 50% del destro. Sinistra e Destra usano un solo canale originale.",
  "hub.openIR": "Apri un file separato da usare come risposta all’impulso.",
  "hub.rewind": "Riporta la riproduzione all’inizio.",
  "hub.play": "Premi la barra spaziatrice per riprodurre o mettere in pausa il Lab attivo.",
  "hub.gain": "Regola il livello in riproduzione e nel passaggio al Lab successivo. Il picco del passaggio è limitato a −1 dBFS.",
  "hub.clip": "Indicatore di clipping in uscita. Fai clic per azzerarlo.",
  "hub.fadeIn": "Trascina per impostare la durata della dissolvenza in entrata.",
  "hub.fadeOut": "Trascina per impostare la durata della dissolvenza in uscita.",
  "granular.durationInput": "Imposta la durata di uscita tra 0 e 10 minuti.",
  "oscillator.durationInput": "Imposta la durata della sintesi tra 0 e 10 minuti. La coda della risposta all’impulso può prolungare l’uscita.",
  "state.spectralOn": "Attivo · Fai di nuovo clic sull’effetto selezionato per disattivarlo",
  "hub.exportStage": "Esporta il passaggio salvato «{stage}» in WAV. Le modifiche non confermate sono escluse.",
  "hub.selectedStage": "Passaggio salvato selezionato: {stage} · Canc elimina questo passaggio",
  "hub.savedStage": "Passaggio salvato: {stage} · Passaggio precedente: {parent}",
  "hub.source": "sorgente",
  "chain.timbre": "Trascina per riordinare. Tastiera: Alt + ← / →",
  "chain.spectral": "Fai clic per modificare {effect} e trascina per cambiare l’ordine. Tastiera: Alt + ← / →",
  "oscillator.sourceBand": "Scegli il metodo di sintesi. La risposta all’impulso del file agisce sul suono dell’oscillatore."
};
