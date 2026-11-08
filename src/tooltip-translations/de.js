export default {
  "source.source-pen": "Bearbeiten Sie Lautstärkepunkte in der Quellwellenform und Kurvenpunkte im Lab. Erneut klicken, um zur Audioauswahl zurückzukehren.",
  "source.source-eraser": "Entfernen Sie einen Lautstärke- oder Kurvenpunkt. Audiobereiche bleiben erhalten.",
  "source.zoom-out": "Zeigt einen größeren Ausschnitt der Quellwellenform.",
  "source.zoom-in": "Zeigt einen kleineren Ausschnitt der Quellwellenform detaillierter.",
  "source.zoom-fit": "Zeigt die gesamte Quellwellenform.",
  "source.undo-edit": "Macht die letzte Bearbeitung der Quelle rückgängig.",
  "source.redo-edit": "Stellt die zuletzt rückgängig gemachte Quellbearbeitung wieder her.",
  "source.volume-reset": "Setzt die Lautstärkehüllkurve der Quelle auf 0 dB zurück.",
  "source.delete": "Löscht den ausgewählten Audiobereich und fügt die verbleibenden Teile zusammen.",
  "tab.audio": "Gestalten Sie Wiedergabegeschwindigkeit, Tonhöhe und Stereopanorama.",
  "tab.timbre": "Formen Sie den Klang mit Filtern und einer Effektkette.",
  "tab.space": "Bewegen Sie den Klang im Raum und gestalten Sie Distanz und Hall.",
  "tab.granular": "Erzeugen Sie Klang aus kurzen Grains des Quellaudios.",
  "tab.spectral": "Verändern Sie den Frequenzinhalt des Quellaudios.",
  "tab.oscillator": "Resynthetisieren Sie eine Datei oder erzeugen Sie Oszillatorklang mit optionaler Impulsantwort aus einer Datei.",
  "tab.handoff": "Beim Wechsel des Labs wird das aktuelle Ergebnis als Stufe gespeichert.",
  "lab.clearCurrent": "Setzt die ausgewählte Kurve auf ihre Standardwerte zurück.",
  "audio.resetButton": "Stellt die Standardkurven für Geschwindigkeit, Tonhöhe und Panorama wieder her.",
  "audio.stretchHelp": [
    "Geschwindigkeit · −2× bis +2×",
    "Ändern Sie die Wiedergabegeschwindigkeit der Quelle. Negative Werte spielen rückwärts ab. Null hält die Quellposition fest."
  ],
  "audio.pitchHelp": [
    "Tonhöhe · −2400 bis +2400 Cent",
    "Verschieben Sie die Tonhöhe um bis zu zwei Oktaven nach unten oder oben. 1200 Cent = eine Oktave."
  ],
  "audio.panHelp": [
    "Panorama · links / rechts",
    "Bewegen Sie den Klang im Stereofeld. Oben = links · Mitte = mittig · unten = rechts."
  ],
  "timbre.resetButton": "Setzt alle Kurven zurück, schaltet alle Effekte aus und leert die Effektkette.",
  "timbre.lowpassModeHelp": [
    "Tiefpass · 40 Hz–18 kHz",
    "Stellen Sie die Grenzfrequenz ein. Der Filter dämpft höhere Frequenzen. Bei niedrigeren Abtastraten sinkt die Obergrenze."
  ],
  "timbre.highpassModeHelp": [
    "Hochpass · 40 Hz–18 kHz",
    "Stellen Sie die Grenzfrequenz ein. Der Filter dämpft tiefere Frequenzen. Bei niedrigeren Abtastraten sinkt die Obergrenze."
  ],
  "timbre.bandpassModeHelp": [
    "Bandpass",
    "Lässt ein Frequenzband um die Mittenfrequenz passieren. Mittenfrequenz und Breite sind separat einstellbar."
  ],
  "timbre.combModeHelp": [
    "Kammfilter",
    "Kombinieren Sie das Original mit einem verzögerten, rückgekoppelten Signal für einen resonanten Kammfiltereffekt."
  ],
  "timbre.flangerModeHelp": [
    "Flanger",
    "Modulieren Sie eine kurze Verzögerung für wandernde Kammfilterkerben. Verzögerung, Tiefe, Rate, Rückkopplung und Mischung sind einstellbar."
  ],
  "timbre.chorusModeHelp": [
    "Chorus",
    "Modulieren Sie verzögerte Stimmen für einen dichteren Klang. Verzögerung, Tiefe, Rate und Mischung sind einstellbar."
  ],
  "timbre.delayModeHelp": [
    "Delay",
    "Erzeugen Sie wiederholte Echos. Verzögerungszeit, Rückkopplung und Mischung sind einstellbar."
  ],
  "timbre.bandpassCenterParamHelp": [
    "Mittenfrequenz · 40 Hz–18 kHz",
    "Verschieben Sie die Mitte des Bandpasses. Bei niedrigeren Abtastraten sinkt die Obergrenze."
  ],
  "timbre.bandpassWidthParamHelp": [
    "Breite · 0–100 %",
    "Verbreitern Sie den Durchlassbereich. 0 % ist schmal (Q 12), 100 % breit (Q 0,5). Der Filter bleibt bei jeder Breite aktiv."
  ],
  "timbre.combDelayParamHelp": [
    "Kammfilterverzögerung · 0,5–100 ms",
    "Stellen Sie die Verzögerung ein, die den Abstand der Kammfilterresonanzen bestimmt."
  ],
  "timbre.combFeedbackParamHelp": [
    "Kammfilter-Rückkopplung · 0–0,95",
    "Führen Sie einen Teil des verzögerten Signals in die Verzögerung zurück. Höhere Werte verlängern die Resonanzen."
  ],
  "timbre.combMixParamHelp": [
    "Kammfilteranteil · 0–100 %",
    "0 % entspricht dem Original. 100 % entspricht dem gefilterten Signal, das Original und verzögerten Klang enthält."
  ],
  "timbre.flangerDelayParamHelp": [
    "Flanger-Verzögerung · 0,5–10 ms",
    "Stellen Sie die mittlere Verzögerung des Modulationsverlaufs ein."
  ],
  "timbre.flangerDepthParamHelp": [
    "Flanger-Tiefe · 0–10 ms",
    "Gewünschte Modulationstiefe. Die tatsächliche Tiefe ist auf die Verzögerung minus 0,25 ms begrenzt."
  ],
  "timbre.flangerRateParamHelp": [
    "Flanger-Rate · 0,02–5 Hz",
    "Stellen Sie die Zahl der Modulationszyklen pro Sekunde ein."
  ],
  "timbre.flangerFeedbackParamHelp": [
    "Flanger-Rückkopplung · 0–0,85",
    "Koppeln Sie das verzögerte Signal zurück, um die Resonanzen der Modulation zu verstärken."
  ],
  "timbre.flangerMixParamHelp": [
    "Flanger-Mischung · 0–100 %",
    "Mischen Sie Original und verzögerten Klang. 0 % = Original, 100 % = nur Effekt."
  ],
  "timbre.chorusDelayParamHelp": [
    "Chorus-Verzögerung · 10–35 ms",
    "Stellen Sie die Grundverzögerung der Chorus-Stimmen ein."
  ],
  "timbre.chorusDepthParamHelp": [
    "Chorus-Tiefe · 0–20 ms",
    "Gewünschte Modulationstiefe. Die tatsächliche Tiefe ist auf die Verzögerung minus 5 ms begrenzt."
  ],
  "timbre.chorusRateParamHelp": [
    "Chorus-Rate · 0,02–3 Hz",
    "Stellen Sie die Modulationsgeschwindigkeit in Zyklen pro Sekunde ein."
  ],
  "timbre.chorusMixParamHelp": [
    "Chorus-Mischung · 0–100 %",
    "Mischen Sie Original und Chorus. 0 % = Original, 100 % = nur Effekt."
  ],
  "timbre.delayTimeParamHelp": [
    "Verzögerungszeit · 100 ms–1,5 s",
    "Stellen Sie den Abstand zwischen den Echos ein."
  ],
  "timbre.delayFeedbackParamHelp": [
    "Delay-Rückkopplung · 0–0,85",
    "Stellen Sie ein, wie viel des verzögerten Klangs für weitere Echos zurückgeführt wird."
  ],
  "timbre.delayMixParamHelp": [
    "Delay-Mischung · 0–100 %",
    "Mischen Sie Original und Echos. 0 % = Original, 100 % = nur Effekt."
  ],
  "space.resetButton": "Setzt alle Kurven zurück, schaltet Richtung ein und Distanz sowie Hall aus und setzt die Abklingzeit auf 1,2 s.",
  "space.reverbDecay": "Stellen Sie die Hallabklingzeit von 0,3 bis 4 s ein.",
  "space.directionModeHelp": [
    "Richtung · −1800° bis +1800°",
    "Bewegen Sie den Klang um die hörende Person. Positiv = im Uhrzeigersinn, negativ = gegen den Uhrzeigersinn. 360° entsprechen einer vollen Drehung."
  ],
  "space.distanceModeHelp": [
    "Distanz · 0–1",
    "Verschieben Sie den Klang von nah (0) nach fern (1). Pegel, Filterung und Raumeindruck ändern sich. Der Wert ist nicht in Metern kalibriert."
  ],
  "space.reverbModeHelp": [
    "Hallanteil · 0–100 %",
    "Zeichnen Sie, wie viel Klang zum Hall gesendet wird. Die Abklingzeit wird separat auf 0,3–4 s eingestellt. Die Hallfahne endet am Dateiende."
  ],
  "granular.resetButton": "Setzt alle Kurven zurück und verschiebt das Quellfenster mit Mindestlänge an den Anfang.",
  "granular.positionModeHelp": [
    "Leseposition · 0–100 % des Quellfensters",
    "Wählen Sie den Startpunkt der Grains im ausgewählten Quellfenster. Das ändert die Ausgabeposition nicht."
  ],
  "granular.spreadModeHelp": [
    "Streuung · 0–100 %",
    "Verteilt Grain-Lesepositionen zufällig um die Leseposition im ausgewählten Quellfenster."
  ],
  "granular.sizeModeHelp": [
    "Grain-Länge · 5–1000 ms",
    "Stellen Sie die gewünschte Grain-Länge ein. Bei der aktuellen Tonhöhe können Grains kürzer sein, damit sie im Quellfenster bleiben."
  ],
  "granular.densityModeHelp": [
    "Dichte · 1–80 Grains/s",
    "Stellen Sie die Anzahl neuer Grains pro Sekunde ein. Die Vorschau erlaubt bis zu 64 aktive Grains, bei hoher Dichte oder Länge bis zu 32, jeweils mit kurzem Ausblenden. Der Offline-Export verarbeitet alle geplanten Grains."
  ],
  "granular.pitchLowModeHelp": [
    "Untere Tonhöhe · −24 bis +24 Halbtöne",
    "Stellen Sie eine Grenze des zufälligen Tonhöhenbereichs ein. Liegt die Untergrenze über der Obergrenze, werden beide getauscht."
  ],
  "granular.pitchHighModeHelp": [
    "Obere Tonhöhe · −24 bis +24 Halbtöne",
    "Stellen Sie die zweite Grenze des zufälligen Tonhöhenbereichs ein. 12 Halbtöne = eine Oktave. Die Tonhöhe ändert auch die Lesegeschwindigkeit der Grains."
  ],
  "spectral.resetButton": "Setzt alle Spektralkurven auf ihre Standardwerte zurück.",
  "spectral.shiftModeHelp": [
    "Spektralverschiebung · −2000 bis +2000 Hz",
    "Verschiebt die Spektralfrequenzen um einen festen Hz-Wert. Bei 0 Hz bleiben ihre Positionen erhalten."
  ],
  "spectral.stretchModeHelp": [
    "Spektraldehnung · 0,5–2",
    "Staucht oder dehnt die Frequenzabstände um 1 kHz. 1 ist neutral. Wiedergabegeschwindigkeit und Dateidauer bleiben unverändert."
  ],
  "spectral.blurModeHelp": [
    "Spektrale Glättung · 0–100 %",
    "Glättet zeitliche Spektraländerungen. 0 % ist neutral. Frequenzpositionen und Dateidauer bleiben unverändert."
  ],
  "spectral.harmonicityModeHelp": [
    "Harmonik · −100 % bis +100 %",
    "Verändert das Verhältnis der Spitzen. Negative Werte machen es harmonischer, positive inharmonischer. 0 % ist neutral."
  ],
  "spectral.freezeModeHelp": [
    "Spektrales Einfrieren · 0–100 %",
    "Hält einen erfassten Spektralzustand. 0 % ist aus, 100 % hält ihn vollständig fest. Die Dateidauer ändert sich nicht."
  ],
  "oscillator.resetButton": "Setzt alle Kurven des aktuellen Synthesemodus auf ihre Standardwerte zurück.",
  "oscillator.resynthesisMode": "Analysiert das Arbeitsaudio und rekonstruiert sein Spektrum aus Teiltönen.",
  "oscillator.convolutionButton": "Erzeugt einen Oszillatorklang und formt ihn optional mit einer Datei als Impulsantwort.",
  "oscillator.sine": "Verwendet eine Sinuswelle für die Oszillatoren.",
  "oscillator.triangle": "Verwendet eine Dreieckwelle für die Oszillatoren.",
  "oscillator.saw": "Verwendet eine Sägezahnwelle für die Oszillatoren.",
  "oscillator.square": "Verwendet eine Rechteckwelle für die Oszillatoren.",
  "oscillator.countSelect": "Wählen Sie die Anzahl der Oszillatoren.",
  "oscillator.stackSelect": "Wählen Sie die Anordnung der Oszillatorfrequenzen relativ zur Grundfrequenz.",
  "oscillator.modulationSelect": "Wählen Sie FM, AM oder Ringmodulation, oder schalten Sie die Modulation aus.",
  "oscillator.modulationRatioInput": "Stellen Sie die Modulatorfrequenz als Vielfaches der jeweiligen Oszillatorfrequenz ein.",
  "oscillator.partialCountSelect": "Wählen Sie bis zu 32 oder 64 Teiltöne für die Resynthese.",
  "oscillator.convolutionWet": "Mischen Sie den direkten Oszillatorklang mit dem durch die Impulsantwort bearbeiteten Klang.",
  "oscillator.impulseLength": "Legt fest, wie viel von der Impulsantwort verwendet wird. Dateien unter 3 s werden vollständig genutzt.",
  "oscillator.basePitchModeHelp": [
    "Grundfrequenz · 20–4000 Hz",
    "Stellen Sie die Grundfrequenz der Oszillatorgruppe ein oder transponieren Sie die analysierten Teiltöne in der Datei-Resynthese."
  ],
  "oscillator.deviationModeHelp": [
    "Abweichung · Abhängig von Quelle und Anordnung",
    "Im Unisono streuen die Stimmen um bis zu ±50 Cent. Andere Anordnungen und die Datei-Resynthese ändern Teiltonverhältnisse mit 0–0,38. Null lässt die ursprüngliche Anordnung unverändert."
  ],
  "oscillator.slopeModeHelp": [
    "Spektralneigung · −24 bis +12 dB/Okt.",
    "Gewichtet Stimmen- oder Teiltonpegel nach Frequenz relativ zur Grundfrequenz. Negative Werte betonen tiefe, positive hohe Frequenzen."
  ],
  "oscillator.modulationCurveModeHelp": [
    "Modulationsstärke · FM / AM / Ring",
    "FM verwendet einen Index von 0 bis 4. AM-Tiefe und Ringmodulationsanteil liegen zwischen 0 und 100 %. Die Kurve folgt dem gewählten Modus."
  ],
  "state.active": "Aktiv",
  "state.bypassed": "Umgangen",
  "state.on": "Ein · Zum Ausschalten klicken",
  "state.off": "Aus · Zum Aktivieren und Bearbeiten klicken",
  "hub.info": "Tastenkürzel und Dateiformate.",
  "hub.openAudio": "Öffnet eine Audiodatei als Arbeitsquelle.",
  "hub.export": "Lädt die gewählte gespeicherte Stufe als WAV herunter. Nicht gespeicherte Änderungen bleiben außen vor.",
  "hub.original": "Stellt das ursprüngliche Audio wieder her.",
  "hub.grainSource": "Der Mono-Mix besteht zu 50 % aus links und zu 50 % aus rechts. Links und Rechts verwenden jeweils einen Originalkanal.",
  "hub.openIR": "Öffnet eine separate Datei als Impulsantwort.",
  "hub.rewind": "Setzt die Wiedergabeposition an den Anfang.",
  "hub.play": "Mit der Leertaste die Wiedergabe im aktiven Lab starten oder anhalten.",
  "hub.gain": "Passt den Pegel bei der Wiedergabe und beim Wechsel zum nächsten Lab an. Spitzenpegel beim Wechsel: höchstens −1 dBFS.",
  "hub.clip": "Zeigt Übersteuerung am Ausgang an. Zum Zurücksetzen klicken.",
  "hub.fadeIn": "Durch Ziehen die Einblenddauer einstellen.",
  "hub.fadeOut": "Durch Ziehen die Ausblenddauer einstellen.",
  "granular.durationInput": "Stellen Sie die Ausgabedauer von 0 bis 10 Minuten ein.",
  "oscillator.durationInput": "Stellen Sie die Synthesedauer von 0 bis 10 Minuten ein. Die Impulsantwort kann die Ausgabe verlängern.",
  "state.spectralOn": "An · Zum Ausschalten den ausgewählten Effekt erneut anklicken",
  "hub.exportStage": "Gespeicherte Stufe „{stage}“ als WAV exportieren. Nicht übernommene Änderungen bleiben unberücksichtigt.",
  "hub.selectedStage": "Ausgewählte gespeicherte Stufe: {stage} · Entf löscht diese Stufe",
  "hub.savedStage": "Gespeicherte Stufe: {stage} · Vorherige Stufe: {parent}",
  "hub.source": "Quelle",
  "chain.timbre": "Zum Umordnen ziehen. Tastatur: Alt + ← / →",
  "chain.spectral": "Zum Bearbeiten von {effect} klicken. Zum Umordnen ziehen. Tastatur: Alt + ← / →",
  "oscillator.sourceBand": "Syntheseweg wählen. Die Impulsantwort aus der Datei wirkt auf den Oszillatorklang."
};
